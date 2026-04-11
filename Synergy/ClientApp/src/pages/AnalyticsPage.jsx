import { useEffect, useMemo, useState } from "react";
import {
    TrendingUp,
    Users,
    AlertTriangle,
    Activity,
    Flame,
    Filter,
    CalendarRange,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    tasks as tasksAPI,
    workLogs as workLogsAPI,
    users as usersAPI,
    teams as teamsAPI,
    teamMembers as teamMembersAPI,
} from "../services/api";

export default function AnalyticsPage() {
    const [tasks, setTasks] = useState([]);
    const [workLogs, setWorkLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("all");
    const [timeRange, setTimeRange] = useState("30");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [tasksRes, workLogsRes, usersRes, teamsRes, teamMembersRes] =
                await Promise.all([
                    tasksAPI.getAll(),
                    workLogsAPI.getAll(),
                    usersAPI.getAll(),
                    teamsAPI.getAll(),
                    teamMembersAPI.getAll(),
                ]);

            setTasks(tasksRes || []);
            setWorkLogs(workLogsRes || []);
            setUsers(usersRes || []);
            setTeams(teamsRes || []);
            setTeamMembers(teamMembersRes || []);
        } catch (error) {
            console.error("Failed to load analytics data:", error);
            setTasks([]);
            setWorkLogs([]);
            setUsers([]);
            setTeams([]);
            setTeamMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedTeam = useMemo(() => {
        if (selectedTeamId === "all") return null;
        return teams.find((team) => String(team.id) === String(selectedTeamId)) || null;
    }, [teams, selectedTeamId]);

    const filteredUserIds = useMemo(() => {
        if (selectedTeamId === "all") {
            return users.map((user) => user.id);
        }

        return teamMembers
            .filter((tm) => String(tm.teamId) === String(selectedTeamId))
            .map((tm) => tm.userId);
    }, [selectedTeamId, teamMembers, users]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => filteredUserIds.includes(user.id));
    }, [users, filteredUserIds]);

    const filteredTasksByTeam = useMemo(() => {
        if (selectedTeamId === "all") return tasks;
        return tasks.filter((task) => String(task.teamId) === String(selectedTeamId));
    }, [tasks, selectedTeamId]);

    const filteredTaskIds = useMemo(() => {
        return filteredTasksByTeam.map((task) => task.id);
    }, [filteredTasksByTeam]);

    const rangeStartDate = useMemo(() => {
        if (timeRange === "all") return null;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const start = new Date(now);
        start.setDate(now.getDate() - (Number(timeRange) - 1));
        return start;
    }, [timeRange]);

    const workLogsInScope = useMemo(() => {
        let logs = workLogs;

        if (selectedTeamId !== "all") {
            logs = logs.filter((log) => {
                const matchesTask = filteredTaskIds.includes(log.taskId);
                const matchesUser = filteredUserIds.includes(log.userId);
                return matchesTask || matchesUser;
            });
        }

        if (rangeStartDate) {
            logs = logs.filter((log) => {
                if (!log.logDate) return false;
                const logDate = new Date(log.logDate);
                return logDate >= rangeStartDate;
            });
        }

        return logs;
    }, [workLogs, selectedTeamId, filteredTaskIds, filteredUserIds, rangeStartDate]);

    const tasksInScope = useMemo(() => {
        if (!rangeStartDate) return filteredTasksByTeam;

        return filteredTasksByTeam.filter((task) => {
            if (!task.dueDate) return true;
            const dueDate = new Date(task.dueDate);
            return dueDate >= rangeStartDate;
        });
    }, [filteredTasksByTeam, rangeStartDate]);

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const start = new Date(d);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const weeklyWorkload = useMemo(() => {
        const now = new Date();
        const currentWeekStart = getStartOfWeek(now);

        return Array.from({ length: 6 }, (_, index) => {
            const start = new Date(currentWeekStart);
            start.setDate(currentWeekStart.getDate() - (5 - index) * 7);

            const end = new Date(start);
            end.setDate(start.getDate() + 7);

            const hours = workLogsInScope
                .filter((log) => {
                    if (!log.logDate) return false;
                    const logDate = new Date(log.logDate);
                    return logDate >= start && logDate < end;
                })
                .reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0);

            return {
                week: `Week ${index + 1}`,
                hours: Math.round(hours * 10) / 10,
            };
        });
    }, [workLogsInScope]);

    const taskDistribution = useMemo(() => {
        const completed = tasksInScope.filter(
            (task) => (task.status || "").toLowerCase() === "completed"
        ).length;

        const inProgress = tasksInScope.filter(
            (task) => (task.status || "").toLowerCase() === "in progress"
        ).length;

        const pending = tasksInScope.filter(
            (task) => (task.status || "").toLowerCase() === "pending"
        ).length;

        return [
            { name: "Completed", value: completed, color: "#10b981" },
            { name: "In Progress", value: inProgress, color: "#3b82f6" },
            { name: "Pending", value: pending, color: "#6b7280" },
        ];
    }, [tasksInScope]);

    const teamComparison = useMemo(() => {
        return filteredUsers
            .map((user) => {
                const userHours = workLogsInScope
                    .filter((log) => log.userId === user.id)
                    .reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0);

                let burnoutRisk = "low";
                if (userHours > 45) burnoutRisk = "high";
                else if (userHours > 35) burnoutRisk = "medium";

                return {
                    id: user.id,
                    name: user.name,
                    hours: Math.round(userHours * 10) / 10,
                    burnoutRisk,
                };
            })
            .sort((a, b) => b.hours - a.hours);
    }, [filteredUsers, workLogsInScope]);

    const productivityTrend = useMemo(() => {
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayTasksCompleted = tasksInScope.filter((task) => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return (
                    (task.status || "").toLowerCase() === "completed" &&
                    dueDate >= date &&
                    dueDate < nextDate
                );
            }).length;

            const dayLogsHours = workLogsInScope
                .filter((log) => {
                    if (!log.logDate) return false;
                    const logDate = new Date(log.logDate);
                    return logDate >= date && logDate < nextDate;
                })
                .reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0);

            const productivity = Math.min(
                100,
                Math.round(dayTasksCompleted * 20 + dayLogsHours * 5)
            );

            return {
                day: date.toLocaleDateString("en-US", { weekday: "short" }),
                productivity,
            };
        });
    }, [tasksInScope, workLogsInScope]);

    const totalCompletedTasks =
        taskDistribution.find((item) => item.name === "Completed")?.value || 0;

    const totalTasks = tasksInScope.length;

    const teamProductivity =
        totalTasks > 0
            ? Math.round((totalCompletedTasks / totalTasks) * 100)
            : 0;

    const totalWeeklyHours =
        weeklyWorkload.length > 0
            ? weeklyWorkload[weeklyWorkload.length - 1].hours
            : 0;

    const averageWeeklyHours =
        filteredUsers.length > 0
            ? Math.round(totalWeeklyHours / filteredUsers.length)
            : 0;

    const highRiskMembers = teamComparison.filter(
        (member) => member.burnoutRisk === "high"
    ).length;

    const teamTaskBreakdown = useMemo(() => {
        const teamsToShow =
            selectedTeamId === "all"
                ? teams
                : teams.filter((team) => String(team.id) === String(selectedTeamId));

        return teamsToShow.map((team) => {
            const teamTasks = tasksInScope.filter((task) => task.teamId === team.id);
            const memberCount = teamMembers.filter(
                (tm) => tm.teamId === team.id
            ).length;

            const completed = teamTasks.filter(
                (task) => (task.status || "").toLowerCase() === "completed"
            ).length;

            const inProgress = teamTasks.filter(
                (task) => (task.status || "").toLowerCase() === "in progress"
            ).length;

            const pending = teamTasks.filter(
                (task) => (task.status || "").toLowerCase() === "pending"
            ).length;

            return {
                id: team.id,
                name: team.name,
                members: memberCount,
                totalTasks: teamTasks.length,
                completed,
                inProgress,
                pending,
            };
        });
    }, [teams, tasksInScope, teamMembers, selectedTeamId]);

    const getBurnoutColor = (hours) => {
        if (hours > 45) return "#ef4444";
        if (hours > 35) return "#fbbf24";
        return "#10b981";
    };

    const getRiskStyles = (risk) => {
        const styles = {
            low: "bg-green-500/10 text-green-500 border-green-500/30",
            medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
            high: "bg-red-500/10 text-red-500 border-red-500/30",
        };
        return styles[risk] || styles.low;
    };

    const chartTooltipStyle = {
        backgroundColor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        color: "#ffffff",
    };

    const scopeLabel = selectedTeam ? selectedTeam.name : "All Teams";

    const rangeLabel =
        timeRange === "7"
            ? "Last 7 Days"
            : timeRange === "30"
                ? "Last 30 Days"
                : "All Time";

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="text-synergy-light-gray">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-4xl text-white font-bold mb-2">
                    Analytics & Insights
                </h1>
                <p className="text-gray-400">
                    Monitor team performance and identify potential issues
                </p>
            </div>

            <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-5 shadow-lg shadow-black/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="text-primary" size={18} />
                            <h3 className="text-white font-semibold">Team Scope</h3>
                        </div>

                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full bg-synergy-dark-gray border border-synergy-dark-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                        >
                            <option value="all">All Teams</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarRange className="text-primary" size={18} />
                            <h3 className="text-white font-semibold">Time Range</h3>
                        </div>

                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full bg-synergy-dark-gray border border-synergy-dark-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 text-sm text-synergy-light-gray">
                    Showing analytics for{" "}
                    <span className="text-white font-medium">{scopeLabel}</span>{" "}
                    during{" "}
                    <span className="text-white font-medium">{rangeLabel}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Team Productivity"
                    value={`${teamProductivity}%`}
                    subtitle="average completion rate"
                    icon={TrendingUp}
                />

                <StatCard
                    title="Active Members"
                    value={filteredUsers.length}
                    subtitle="members in scope"
                    icon={Users}
                />

                <StatCard
                    title="Avg. Weekly Hours"
                    value={`${averageWeeklyHours}h`}
                    subtitle="per member"
                    icon={Activity}
                />

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20">
                    <div className="flex justify-between mb-4">
                        <div className="text-synergy-light-gray">
                            High Risk Members
                        </div>
                        <AlertTriangle
                            className={
                                highRiskMembers > 0
                                    ? "text-red-500"
                                    : "text-synergy-light-gray"
                            }
                        />
                    </div>

                    <div className="text-3xl text-white font-bold">
                        {highRiskMembers}
                    </div>

                    <div
                        className={`text-sm ${highRiskMembers > 0
                                ? "text-red-500"
                                : "text-synergy-light-gray"
                            }`}
                    >
                        {highRiskMembers > 0
                            ? "Requires attention"
                            : "No high-risk members"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20">
                    <h3 className="text-white mb-4 font-semibold">
                        Weekly Workload Trend
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyWorkload}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="week" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Line
                                type="monotone"
                                dataKey="hours"
                                stroke="#10b981"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20">
                    <h3 className="text-white mb-4 font-semibold">
                        Task Distribution
                    </h3>

                    {totalTasks === 0 ? (
                        <div className="text-synergy-light-gray py-16 text-center">
                            No task data available yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={taskDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={90}
                                        innerRadius={45}
                                        paddingAngle={3}
                                        labelLine={false}
                                    >
                                        {taskDistribution.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        formatter={(value, name) => [
                                            `${value} tasks`,
                                            name,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {taskDistribution.map((item) => (
                                    <div
                                        key={item.name}
                                        className="bg-synergy-dark-gray/40 border border-synergy-dark-gray rounded-lg px-4 py-3"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-synergy-light-gray text-sm">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="text-white font-semibold">
                                            {item.value} tasks
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20 lg:col-span-2">
                    <h3 className="text-white mb-4 font-semibold">
                        Team Workload
                    </h3>

                    {teamComparison.length === 0 ? (
                        <div className="text-synergy-light-gray py-16 text-center">
                            No member data available yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={teamComparison}
                                layout="vertical"
                                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                            >
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#6b7280"
                                    width={110}
                                />
                                <Tooltip
                                    contentStyle={chartTooltipStyle}
                                    formatter={(value) => [`${value} hours`, "Hours"]}
                                    labelStyle={{ color: "#ffffff" }}
                                    itemStyle={{ color: "#ffffff" }}
                                />
                                <Bar dataKey="hours" radius={[0, 8, 8, 0]}>
                                    {teamComparison.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={getBurnoutColor(entry.hours)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div
                className={`grid gap-6 items-start ${selectedTeamId === "all"
                        ? "grid-cols-1"
                        : "grid-cols-1 xl:grid-cols-2"
                    }`}
            >
                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20">
                    <h3 className="text-white mb-4 font-semibold">
                        Productivity Trend
                    </h3>

                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart
                            data={productivityTrend}
                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="day" stroke="#6b7280" />
                            <YAxis
                                stroke="#6b7280"
                                domain={[0, "dataMax + 10"]}
                                allowDecimals={false}
                            />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Line
                                type="monotone"
                                dataKey="productivity"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20">
                    <h3 className="text-white mb-4 font-semibold">
                        Team Task Breakdown
                    </h3>

                    <div className="space-y-4">
                        {teamTaskBreakdown.length === 0 ? (
                            <div className="text-synergy-light-gray py-16 text-center">
                                No team data available yet.
                            </div>
                        ) : (
                            teamTaskBreakdown.map((team) => {
                                const total = team.totalTasks || 1;
                                const completedWidth = (team.completed / total) * 100;
                                const inProgressWidth = (team.inProgress / total) * 100;
                                const pendingWidth = (team.pending / total) * 100;

                                return (
                                    <div
                                        key={team.id}
                                        className="bg-synergy-dark-gray/40 border border-synergy-dark-gray rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3 gap-4">
                                            <div>
                                                <div className="text-white font-medium">
                                                    {team.name}
                                                </div>
                                                <div className="text-sm text-synergy-light-gray">
                                                    {team.members} members | {team.totalTasks} tasks
                                                </div>
                                            </div>

                                            <div className="text-sm text-white font-medium">
                                                {team.totalTasks > 0
                                                    ? `${Math.round(
                                                        (team.completed / team.totalTasks) * 100
                                                    )}% done`
                                                    : "0% done"}
                                            </div>
                                        </div>

                                        <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden flex mb-3">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${completedWidth}%` }}
                                            />
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${inProgressWidth}%` }}
                                            />
                                            <div
                                                className="h-full bg-gray-500"
                                                style={{ width: `${pendingWidth}%` }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 text-xs">
                                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-md px-3 py-2">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                                    <span className="text-synergy-light-gray">
                                                        Completed
                                                    </span>
                                                </div>
                                                <div className="text-white font-semibold">
                                                    {team.completed}
                                                </div>
                                            </div>

                                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-md px-3 py-2">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                    <span className="text-synergy-light-gray">
                                                        In Progress
                                                    </span>
                                                </div>
                                                <div className="text-white font-semibold">
                                                    {team.inProgress}
                                                </div>
                                            </div>

                                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-md px-3 py-2">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                                    <span className="text-synergy-light-gray">
                                                        Pending
                                                    </span>
                                                </div>
                                                <div className="text-white font-semibold">
                                                    {team.pending}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/20">
                <div className="flex items-center gap-2 mb-6">
                    <Flame className="text-red-400" size={20} />
                    <h3 className="text-white font-semibold">
                        Burnout Risk Analysis
                    </h3>
                </div>

                <div className="space-y-4">
                    {teamComparison.length === 0 ? (
                        <div className="text-synergy-light-gray">
                            No member workload data available yet.
                        </div>
                    ) : (
                        teamComparison.map((member) => {
                            const workloadPercent = Math.min(
                                100,
                                Math.round((member.hours / 50) * 100)
                            );

                            return (
                                <div
                                    key={member.id}
                                    className="bg-synergy-dark-gray/40 border border-synergy-dark-gray rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <div>
                                            <div className="text-white font-medium">
                                                {member.name}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {member.hours} hours logged this period
                                            </div>
                                        </div>

                                        <div
                                            className={`px-4 py-2 rounded-lg border capitalize ${getRiskStyles(
                                                member.burnoutRisk
                                            )}`}
                                        >
                                            {member.burnoutRisk} risk
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-synergy-light-gray">
                                                Workload level
                                            </span>
                                            <span className="text-white">
                                                {workloadPercent}%
                                            </span>
                                        </div>

                                        <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${workloadPercent}%`,
                                                    backgroundColor: getBurnoutColor(
                                                        member.hours
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}