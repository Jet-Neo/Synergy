import { TrendingUp, Users, AlertTriangle, Activity } from "lucide-react";
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
    Cell
} from "recharts";

export default function AnalyticsPage() {
    const weeklyWorkload = [
        { week: "Week 1", hours: 32 },
        { week: "Week 2", hours: 38 },
        { week: "Week 3", hours: 42 },
        { week: "Week 4", hours: 40 },
        { week: "Week 5", hours: 36 },
        { week: "Week 6", hours: 45 }
    ];

    const teamComparison = [
        { name: "Alex Morgan", hours: 40, burnoutRisk: "low" },
        { name: "Sarah Chen", hours: 48, burnoutRisk: "high" },
        { name: "Mike Johnson", hours: 35, burnoutRisk: "low" },
        { name: "Emma Davis", hours: 42, burnoutRisk: "medium" },
        { name: "James Wilson", hours: 30, burnoutRisk: "low" }
    ];

    const taskDistribution = [
        { name: "Completed", value: 45, color: "#10b981" },
        { name: "In Progress", value: 30, color: "#3b82f6" },
        { name: "Pending", value: 25, color: "#6b7280" }
    ];

    const productivityTrend = [
        { day: "Mon", productivity: 78 },
        { day: "Tue", productivity: 85 },
        { day: "Wed", productivity: 82 },
        { day: "Thu", productivity: 88 },
        { day: "Fri", productivity: 92 },
        { day: "Sat", productivity: 70 },
        { day: "Sun", productivity: 65 }
    ];

    const getBurnoutColor = (hours) => {
        if (hours > 45) return "#ef4444";
        if (hours > 40) return "#fbbf24";
        return "#10b981";
    };

    const getRiskStyles = (risk) => {
        const styles = {
            low: "bg-green-500/10 text-green-500 border-green-500/30",
            medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
            high: "bg-red-500/10 text-red-500 border-red-500/30"
        };
        return styles[risk] || styles.low;
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl text-white font-bold mb-2">
                    Analytics & Insights
                </h1>
                <p className="text-gray-400">
                    Monitor team performance and identify potential issues
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Team Productivity"
                    value="87%"
                    subtitle="average score"
                    icon={TrendingUp}
                />

                <StatCard
                    title="Active Members"
                    value={teamComparison.length}
                    subtitle="team members"
                    icon={Users}
                />

                <StatCard
                    title="Avg. Weekly Hours"
                    value="39h"
                    subtitle="per member"
                    icon={Activity}
                />

                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex justify-between mb-4">
                        <div className="text-gray-400">High Risk Members</div>
                        <AlertTriangle className="text-red-500" />
                    </div>

                    <div className="text-3xl text-white font-bold">
                        {teamComparison.filter((m) => m.burnoutRisk === "high").length}
                    </div>

                    <div className="text-sm text-red-500">
                        Requires attention
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-white mb-4 font-semibold">
                        Weekly Workload Trend
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyWorkload}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="week" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #2a2a2a"
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="hours"
                                stroke="#10b981"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-white mb-4 font-semibold">
                        Task Distribution
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={taskDistribution}
                                dataKey="value"
                                outerRadius={100}
                                label
                            >
                                {taskDistribution.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white mb-4 font-semibold">
                        Team Workload
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teamComparison} layout="vertical">
                            <XAxis type="number" stroke="#6b7280" />
                            <YAxis dataKey="name" type="category" stroke="#6b7280" />

                            <Tooltip />

                            <Bar dataKey="hours">
                                {teamComparison.map((entry, index) => (
                                    <Cell key={index} fill={getBurnoutColor(entry.hours)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Burnout List */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-white mb-6 font-semibold">
                    Burnout Risk Analysis
                </h3>

                <div className="space-y-4">
                    {teamComparison.map((member, index) => (
                        <div
                            key={index}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 flex justify-between"
                        >
                            <div>
                                <div className="text-white font-medium">
                                    {member.name}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {member.hours} hours this week
                                </div>
                            </div>

                            <div
                                className={`px-4 py-2 rounded-lg border ${getRiskStyles(
                                    member.burnoutRisk
                                )}`}
                            >
                                {member.burnoutRisk} risk
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}