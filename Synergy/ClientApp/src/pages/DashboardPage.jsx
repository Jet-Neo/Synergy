import { useState, useEffect } from "react";
import { Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
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
import { tasks as tasksAPI, workLogs as workLogsAPI } from "../services/api";

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [workLogs, setWorkLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [tasksRes, workLogsRes] = await Promise.all([
                tasksAPI.getAll(),
                workLogsAPI.getAll(),
            ]);

            setTasks(tasksRes || []);
            setWorkLogs(workLogsRes || []);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            setTasks([]);
            setWorkLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyData = weekDays.map((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (today.getDay() - index));

        const dateStr = date.toISOString().split("T")[0];
        const dayLogs = workLogs.filter((log) => log.date === dateStr);
        const hours = dayLogs.reduce((sum, log) => sum + (log.hours || 0), 0);

        return { day, hours };
    });

    const recentTasks =
        tasks.length > 0
            ? tasks.slice(0, 4)
            : [
                { id: 1, title: "Design UI mockups", status: "completed", assignee: "You", deadline: "2026-02-18" },
                { id: 2, title: "Backend API integration", status: "in-progress", assignee: "Sarah Chen", deadline: "2026-02-21" },
                { id: 3, title: "Write documentation", status: "pending", assignee: "Mike Johnson", deadline: "2026-02-25" },
                { id: 4, title: "User testing", status: "in-progress", assignee: "You", deadline: "2026-02-22" },
            ];

    const getBurnoutRisk = () => {
        const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);

        if (totalHours > 45) {
            return { level: "High", color: "text-synergy-red", bg: "bg-synergy-red/10" };
        }
        if (totalHours > 35) {
            return { level: "Medium", color: "text-synergy-yellow", bg: "bg-synergy-yellow/10" };
        }
        return { level: "Low", color: "text-primary", bg: "bg-primary/10" };
    };

    const burnoutRisk = getBurnoutRisk();
    const totalWeeklyHours = Math.round(weeklyData.reduce((sum, d) => sum + d.hours, 0));
    const completedTasks =
        tasks.filter((t) => t.status === "completed").length ||
        recentTasks.filter((t) => t.status === "completed").length;

    const overallProgress =
        recentTasks.length > 0 ? Math.round((completedTasks / recentTasks.length) * 100) : 0;

    return (
        <div className="relative p-8 space-y-8">
            {/* soft background glow */}
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />

            {/* Header */}
            <div className="relative z-10">
                <h1 className="text-4xl text-white font-bold mb-2">
                    Welcome back! 👋
                </h1>
                <p className="text-synergy-light-gray">
                    Here's what's happening with your team today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Weekly Hours"
                    value={totalWeeklyHours}
                    subtitle="hours this week"
                    icon={Clock}
                    trend={{ value: "+12% from last week", isPositive: true }}
                />

                <StatCard
                    title="Tasks Completed"
                    value={completedTasks}
                    subtitle="out of 12 tasks"
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Team Productivity"
                    value="87%"
                    subtitle="team average"
                    icon={TrendingUp}
                    trend={{ value: "+5% from last week", isPositive: true }}
                />

                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-synergy-light-gray">Burnout Risk</div>
                        <div className="p-2 bg-synergy-red/10 rounded-lg border border-synergy-red/20">
                            <AlertTriangle className="text-synergy-red" size={20} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-3xl text-white font-bold">
                            {burnoutRisk.level}
                        </div>

                        <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${burnoutRisk.bg} ${burnoutRisk.color}`}>
                            {totalWeeklyHours} hrs/week
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
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

                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                    <h3 className="text-white mb-6 font-semibold">Task Completion Progress</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-synergy-light-gray">Overall Progress</span>
                                <span className="text-white font-semibold">{overallProgress}%</span>
                            </div>

                            <div className="h-3 bg-synergy-dark-gray rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-synergy-green-light rounded-full transition-all duration-500"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full" />
                                    <span className="text-white">Completed</span>
                                </div>
                                <span className="text-synergy-light-gray">{completedTasks} tasks</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-synergy-blue rounded-full" />
                                    <span className="text-white">In Progress</span>
                                </div>
                                <span className="text-synergy-light-gray">
                                    {recentTasks.filter((t) => t.status === "in-progress").length} tasks
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-synergy-gray rounded-full" />
                                    <span className="text-white">Pending</span>
                                </div>
                                <span className="text-synergy-light-gray">
                                    {recentTasks.filter((t) => t.status === "pending").length} tasks
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="relative z-10 bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                <h3 className="text-white mb-6 font-semibold">Recent Tasks</h3>

                <div className="space-y-3">
                    {recentTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-synergy-charcoal/80 border border-synergy-dark-gray rounded-lg p-4 hover:border-primary/40 hover:bg-synergy-charcoal transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div
                                        className={`w-2 h-2 rounded-full ${task.status === "completed"
                                                ? "bg-primary"
                                                : task.status === "in-progress"
                                                    ? "bg-synergy-blue"
                                                    : "bg-synergy-gray"
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
                                    Due{" "}
                                    {new Date(task.deadline).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}