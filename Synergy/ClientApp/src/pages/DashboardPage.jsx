import { useState, useEffect, useMemo } from "react";
import {
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Users,
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
} from "recharts";
import {
    tasks as tasksAPI,
    workLogs as workLogsAPI,
    teams as teamsAPI,
} from "../services/api";

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [workLogs, setWorkLogs] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [tasksRes, workLogsRes, teamsRes] = await Promise.all([
                tasksAPI.getAll(),
                workLogsAPI.getAll(),
                teamsAPI.getAll(),
            ]);

            const loadedTeams = teamsRes || [];

            setTasks(tasksRes || []);
            setWorkLogs(workLogsRes || []);
            setTeams(loadedTeams);

            if (loadedTeams.length > 0) {
                setSelectedTeamId((prev) =>
                    prev ? prev : String(loadedTeams[0].id)
                );
            }
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            setTasks([]);
            setWorkLogs([]);
            setTeams([]);
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyData = useMemo(() => {
        return weekDays.map((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (today.getDay() - index));
            const dateStr = date.toISOString().split("T")[0];

            const dayLogs = workLogs.filter((log) => {
                const logDate = log.logDate
                    ? new Date(log.logDate).toISOString().split("T")[0]
                    : "";
                return logDate === dateStr;
            });

            const hours = dayLogs.reduce(
                (sum, log) => sum + Number(log.hoursWorked || 0),
                0
            );

            return { day, hours };
        });
    }, [workLogs]);

    const totalWeeklyHours = Math.round(
        weeklyData.reduce((sum, d) => sum + d.hours, 0)
    );

    const completedTasks = tasks.filter(
        (t) => (t.status || "").toLowerCase() === "completed"
    ).length;

    const inProgressTasks = tasks.filter(
        (t) => (t.status || "").toLowerCase() === "in progress"
    ).length;

    const pendingTasks = tasks.filter(
        (t) => (t.status || "").toLowerCase() === "pending"
    ).length;

    const totalTasks = tasks.length;

    const progressPercent =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const recentTasks = [...tasks]
        .sort((a, b) => {
            const aDate = a.dueDate ? new Date(a.dueDate) : new Date(0);
            const bDate = b.dueDate ? new Date(b.dueDate) : new Date(0);
            return bDate - aDate;
        })
        .slice(0, 5)
        .map((task) => ({
            id: task.id,
            title: task.title,
            status: (task.status || "Pending").toLowerCase().replace(" ", "-"),
            assignee:
                task.assignedToUser?.name ||
                task.assigneeName ||
                "Unassigned",
            deadline: task.dueDate,
        }));

    const recentWorkLogs = [...workLogs]
        .sort((a, b) => new Date(b.logDate) - new Date(a.logDate))
        .slice(0, 5)
        .map((log) => ({
            id: log.id,
            task: log.task?.title || "Untitled Task",
            member: log.user?.name || log.userName || "Unknown User",
            hours: Number(log.hoursWorked || 0),
            date: log.logDate,
        }));

    const teamStats = teams.map((team) => {
        const teamTasks = tasks.filter((task) => task.teamId === team.id);

        const completed = teamTasks.filter(
            (t) => (t.status || "").toLowerCase() === "completed"
        ).length;

        const inProgress = teamTasks.filter(
            (t) => (t.status || "").toLowerCase() === "in progress"
        ).length;

        const pending = teamTasks.filter(
            (t) => (t.status || "").toLowerCase() === "pending"
        ).length;

        const completionPercent =
            teamTasks.length > 0
                ? Math.round((completed / teamTasks.length) * 100)
                : 0;

        return {
            id: team.id,
            name: team.name,
            total: teamTasks.length,
            completed,
            inProgress,
            pending,
            completionPercent,
        };
    });

    const selectedTeam =
        teamStats.find((team) => String(team.id) === String(selectedTeamId)) ||
        null;

    const getBurnoutRisk = () => {
        if (totalWeeklyHours > 45) {
            return {
                level: "High",
                color: "text-red-500",
                bg: "bg-red-500/10",
                border: "border-[#3a2323]",
                iconBg: "bg-red-500/10",
                iconColor: "text-red-500",
                message: "Requires immediate attention",
            };
        }

        if (totalWeeklyHours > 35) {
            return {
                level: "Medium",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
                border: "border-[#3f3a24]",
                iconBg: "bg-yellow-400/10",
                iconColor: "text-yellow-400",
                message: "Monitor workload",
            };
        }

        return {
            level: "Low",
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-[#18453b]",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            message: "Workload is within normal range",
        };
    };

    const burnoutRisk = getBurnoutRisk();

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="text-synergy-light-gray">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-4xl text-white mb-2 font-bold">
                    Welcome back! 👋
                </h1>
                <p className="text-synergy-light-gray">
                    Here's what's happening with your team today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Weekly Hours"
                    value={totalWeeklyHours}
                    subtitle="hours this week"
                    icon={Clock}
                />

                <StatCard
                    title="Tasks Completed"
                    value={completedTasks}
                    subtitle={`out of ${totalTasks} tasks`}
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Team Productivity"
                    value={`${progressPercent}%`}
                    subtitle={`${completedTasks} of ${totalTasks} tasks completed`}
                    icon={TrendingUp}
                />

                <div
                    className={`bg-[#151515] border ${burnoutRisk.border} rounded-xl p-6
                    shadow-[0_0_8px_rgba(16,185,129,0.04)]
                    hover:border-primary/35 transition-all duration-300`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-synergy-light-gray">Burnout Risk</div>
                        <div className={`p-2 rounded-lg ${burnoutRisk.iconBg}`}>
                            <AlertTriangle size={20} className={burnoutRisk.iconColor} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-3xl text-white font-bold">
                            {burnoutRisk.level}
                        </div>

                        <div
                            className={`inline-block px-3 py-1.5 rounded-lg ${burnoutRisk.bg} ${burnoutRisk.color} text-sm font-semibold`}
                        >
                            {totalWeeklyHours} hrs/week
                        </div>

                        <div className={`text-sm ${burnoutRisk.color}`}>
                            {burnoutRisk.message}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-[#151515] border border-[#18453b] rounded-xl p-6
                    shadow-[0_0_8px_rgba(16,185,129,0.04)]"
                >
                    <h3 className="text-white mb-6 font-semibold">Weekly Workload</h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="day" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #2a2a2a",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div
                    className="bg-[#151515] border border-[#18453b] rounded-xl p-6
                    shadow-[0_0_8px_rgba(16,185,129,0.04)]"
                >
                    <h3 className="text-white mb-6 font-semibold">
                        Task Completion Progress
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-synergy-light-gray">Overall Progress</span>
                                <span className="text-white font-semibold">
                                    {progressPercent}%
                                </span>
                            </div>

                            <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden flex">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${totalTasks > 0
                                                ? (completedTasks / totalTasks) * 100
                                                : 0
                                            }%`,
                                    }}
                                />

                                <div
                                    className="h-full bg-blue-500 transition-all duration-500"
                                    style={{
                                        width: `${totalTasks > 0
                                                ? (inProgressTasks / totalTasks) * 100
                                                : 0
                                            }%`,
                                    }}
                                />

                                <div
                                    className="h-full bg-gray-500 transition-all duration-500"
                                    style={{
                                        width: `${totalTasks > 0
                                                ? (pendingTasks / totalTasks) * 100
                                                : 0
                                            }%`,
                                    }}
                                />
                            </div>

                            <div className="flex gap-4 text-xs mt-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-synergy-light-gray">
                                        Completed
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span className="text-synergy-light-gray">
                                        In Progress
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                    <span className="text-synergy-light-gray">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full" />
                                    <span className="text-white">Completed</span>
                                </div>
                                <span className="text-synergy-light-gray">
                                    {completedTasks} tasks
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <span className="text-white">In Progress</span>
                                </div>
                                <span className="text-synergy-light-gray">
                                    {inProgressTasks} tasks
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                    <span className="text-white">Pending</span>
                                </div>
                                <span className="text-synergy-light-gray">
                                    {pendingTasks} tasks
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bg-[#151515] border border-[#18453b] rounded-xl p-6
                shadow-[0_0_8px_rgba(16,185,129,0.04)]"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="text-primary" size={20} />
                        <h3 className="text-white font-semibold">Team Overview</h3>
                    </div>

                    <div className="w-full md:w-72">
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                        >
                            {teams.length === 0 ? (
                                <option value="">No teams available</option>
                            ) : (
                                teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {!selectedTeam ? (
                    <div className="text-synergy-light-gray">No teams available yet.</div>
                ) : (
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-white text-xl font-semibold mb-1">
                                    {selectedTeam.name}
                                </div>
                                <div className="text-synergy-light-gray text-sm">
                                    {selectedTeam.total} total tasks
                                </div>
                            </div>

                            <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                                {selectedTeam.completionPercent}% complete
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-synergy-light-gray">
                                    Team Progress
                                </span>
                                <span className="text-white font-semibold">
                                    {selectedTeam.completionPercent}%
                                </span>
                            </div>

                            <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden flex">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${selectedTeam.total > 0
                                                ? (selectedTeam.completed /
                                                    selectedTeam.total) *
                                                100
                                                : 0
                                            }%`,
                                    }}
                                />

                                <div
                                    className="h-full bg-blue-500 transition-all duration-500"
                                    style={{
                                        width: `${selectedTeam.total > 0
                                                ? (selectedTeam.inProgress /
                                                    selectedTeam.total) *
                                                100
                                                : 0
                                            }%`,
                                    }}
                                />

                                <div
                                    className="h-full bg-gray-500 transition-all duration-500"
                                    style={{
                                        width: `${selectedTeam.total > 0
                                                ? (selectedTeam.pending /
                                                    selectedTeam.total) *
                                                100
                                                : 0
                                            }%`,
                                    }}
                                />
                            </div>

                            <div className="flex gap-4 text-xs mt-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-synergy-light-gray">
                                        Completed
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span className="text-synergy-light-gray">
                                        In Progress
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                    <span className="text-synergy-light-gray">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4">
                                <div className="text-synergy-light-gray text-sm mb-1">
                                    Total
                                </div>
                                <div className="text-white text-2xl font-bold">
                                    {selectedTeam.total}
                                </div>
                            </div>

                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4">
                                <div className="text-synergy-light-gray text-sm mb-1">
                                    Completed
                                </div>
                                <div className="text-primary text-2xl font-bold">
                                    {selectedTeam.completed}
                                </div>
                            </div>

                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4">
                                <div className="text-synergy-light-gray text-sm mb-1">
                                    In Progress
                                </div>
                                <div className="text-blue-400 text-2xl font-bold">
                                    {selectedTeam.inProgress}
                                </div>
                            </div>

                            <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4">
                                <div className="text-synergy-light-gray text-sm mb-1">
                                    Pending
                                </div>
                                <div className="text-gray-400 text-2xl font-bold">
                                    {selectedTeam.pending}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-[#151515] border border-[#18453b] rounded-xl p-6
                    shadow-[0_0_8px_rgba(16,185,129,0.04)]"
                >
                    <h3 className="text-white mb-6 font-semibold">Recent Tasks</h3>

                    <div className="space-y-3">
                        {recentTasks.length === 0 ? (
                            <div className="text-synergy-light-gray">
                                No tasks available yet.
                            </div>
                        ) : (
                            recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4
                                    hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div
                                                className={`w-2 h-2 rounded-full ${task.status === "completed"
                                                        ? "bg-primary"
                                                        : task.status === "in-progress"
                                                            ? "bg-blue-500"
                                                            : "bg-gray-500"
                                                    }`}
                                            />

                                            <div className="flex-1">
                                                <div className="text-white mb-1">{task.title}</div>
                                                <div className="text-sm text-synergy-light-gray">
                                                    Assigned to {task.assignee}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm text-synergy-light-gray">
                                            {task.deadline
                                                ? `Due ${new Date(task.deadline).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )}`
                                                : "No due date"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div
                    className="bg-[#151515] border border-[#18453b] rounded-xl p-6
                    shadow-[0_0_8px_rgba(16,185,129,0.04)]"
                >
                    <h3 className="text-white mb-6 font-semibold">Recent Work Logs</h3>

                    <div className="space-y-3">
                        {recentWorkLogs.length === 0 ? (
                            <div className="text-synergy-light-gray">
                                No work logs available yet.
                            </div>
                        ) : (
                            recentWorkLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4
                                    hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-white mb-1">{log.task}</div>
                                            <div className="text-sm text-synergy-light-gray">
                                                {log.member}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-primary font-semibold">
                                                {log.hours}h
                                            </div>
                                            <div className="text-sm text-synergy-light-gray">
                                                {new Date(log.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}