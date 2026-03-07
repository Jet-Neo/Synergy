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
    ResponsiveContainer
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
                workLogsAPI.getAll()
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
                {
                    id: 1,
                    title: "Design UI mockups",
                    status: "completed",
                    assignee: "You",
                    deadline: "2026-02-18"
                },
                {
                    id: 2,
                    title: "Backend API integration",
                    status: "in-progress",
                    assignee: "Sarah Chen",
                    deadline: "2026-02-21"
                },
                {
                    id: 3,
                    title: "Write documentation",
                    status: "pending",
                    assignee: "Mike Johnson",
                    deadline: "2026-02-25"
                },
                {
                    id: 4,
                    title: "User testing",
                    status: "in-progress",
                    assignee: "You",
                    deadline: "2026-02-22"
                }
            ];

    const getBurnoutRisk = () => {
        const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);

        if (totalHours > 45)
            return { level: "High", color: "text-red-500", bg: "bg-red-500/10" };

        if (totalHours > 35)
            return { level: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/10" };

        return { level: "Low", color: "text-green-500", bg: "bg-green-500/10" };
    };

    const burnoutRisk = getBurnoutRisk();

    const totalWeeklyHours = Math.round(
        weeklyData.reduce((sum, d) => sum + d.hours, 0)
    );

    const completedTasks =
        tasks.filter((t) => t.status === "completed").length ||
        recentTasks.filter((t) => t.status === "completed").length;

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-4xl text-white font-bold mb-2">
                    Welcome back ??
                </h1>
                <p className="text-gray-400">
                    Here's what's happening with your team today.
                </p>
            </div>

            {/* Stats */}
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
                    subtitle="tasks done"
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Team Productivity"
                    value="87%"
                    subtitle="team average"
                    icon={TrendingUp}
                />

                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-400">Burnout Risk</div>
                        <AlertTriangle className="text-red-500" />
                    </div>

                    <div className="text-3xl text-white font-bold">
                        {burnoutRisk.level}
                    </div>

                    <div className={`mt-2 px-3 py-1 rounded ${burnoutRisk.bg} ${burnoutRisk.color}`}>
                        {totalWeeklyHours} hrs/week
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-white mb-4 font-semibold">Weekly Workload</h3>

                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1a1a1a",
                                border: "1px solid #2a2a2a"
                            }}
                        />

                        <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Tasks */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-white mb-6 font-semibold">Recent Tasks</h3>

                <div className="space-y-3">
                    {recentTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-4"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-white">{task.title}</div>
                                    <div className="text-sm text-gray-400">
                                        Assigned to {task.assignee}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-400">
                                    Due{" "}
                                    {new Date(task.deadline).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric"
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