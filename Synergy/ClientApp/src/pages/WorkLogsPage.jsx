import React from "react";
import { Plus, Calendar, Clock } from "lucide-react";

export default function WorkLogsPage({ onTabChange }) { 
    const workLogs = [
        {
            id: 1,
            title: "API Integration",
            user: "Sarah Chen",
            description: "Completed payment gateway integration and testing",
            date: "2026-02-03",
            hours: 4.5,
        },
        {
            id: 2,
            title: "Database Design",
            user: "Mike Johnson",
            description: "Designed schema for user and transaction tables",
            date: "2026-02-03",
            hours: 3,
        },
        {
            id: 3,
            title: "User Interface Mockups",
            user: "Emma Williams",
            description: "Created mockups for dashboard and analytics screens",
            date: "2026-02-02",
            hours: 5.5,
        },
    ];

    const totalToday = 7.5;
    const totalWeek = 142.5;

    return (
        <div className="p-8 space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl text-white mb-2 font-bold">
                        Work Log
                    </h1>

                    <p className="text-synergy-light-gray">
                        Track time spent on tasks
                    </p>
                </div>

                <button
                    onClick={() => onTabChange("log-time")} 
                    className="
                        flex items-center gap-2
                        bg-primary hover:bg-primary/90
                        text-white
                        px-6 py-3
                        rounded-lg
                        shadow-lg shadow-primary/20
                        hover:shadow-primary/40
                        transition-all
                        font-semibold
                    "
                >
                    <Plus size={20} />
                    Log Time
                </button>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Select Date */}

                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/30 transition-all">

                    <div className="flex items-center gap-3 mb-2">

                        <div
                            className="
                                w-10 h-10
                                bg-primary/10
                                rounded-lg
                                flex items-center justify-center
                            "
                        >
                            <Calendar
                                size={18}
                                className="text-primary"
                            />
                        </div>

                        <span className="text-synergy-light-gray font-medium">
                            Select Date
                        </span>

                    </div>

                    <input
                        type="date"
                        className="
                            w-full
                            bg-synergy-dark-gray
                            border border-synergy-gray
                            rounded-lg
                            px-4 py-3
                            text-white
                            focus:outline-none
                            focus:border-primary
                            focus:ring-1
                            focus:ring-primary/40
                            transition-all
                        "
                    />

                </div>

                {/* Today's Total */}

                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/30 transition-all">

                    <div className="flex items-center gap-3 mb-2">

                        <div
                            className="
                                w-10 h-10
                                bg-synergy-green/10
                                rounded-lg
                                flex items-center justify-center
                            "
                        >
                            <Clock
                                size={18}
                                className="text-synergy-green"
                            />
                        </div>

                        <span className="text-synergy-light-gray font-medium">
                            Today's Total
                        </span>

                    </div>

                    <div className="text-3xl text-white font-bold">
                        {totalToday}h
                    </div>

                </div>

                {/* This Week */}

                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/30 transition-all">

                    <div className="flex items-center gap-3 mb-2">

                        <div
                            className="
                                w-10 h-10
                                bg-primary/10
                                rounded-lg
                                flex items-center justify-center
                            "
                        >
                            <Clock
                                size={18}
                                className="text-primary"
                            />
                        </div>

                        <span className="text-synergy-light-gray font-medium">
                            This Week
                        </span>

                    </div>

                    <div className="text-3xl text-primary font-bold">
                        {totalWeek}h
                    </div>

                </div>

            </div>

            {/* Work Logs Table */}

            <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl overflow-hidden shadow-lg shadow-black/30">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-synergy-dark-gray/60 border-b border-synergy-dark-gray">

                            <tr>

                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Task
                                </th>

                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    User
                                </th>

                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Date
                                </th>

                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Hours
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {workLogs.map((log, index) => (

                                <tr
                                    key={log.id}
                                    className={`
                                        border-b border-synergy-dark-gray
                                        hover:bg-synergy-dark-gray/60
                                        hover:border-primary/20
                                        transition-all
                                        ${index === workLogs.length - 1 ? "border-b-0" : ""}
                                    `}
                                >

                                    <td className="px-6 py-4">

                                        <div className="text-white mb-1 font-medium">
                                            {log.title}
                                        </div>

                                        <div className="text-sm text-synergy-light-gray">
                                            {log.description}
                                        </div>

                                    </td>

                                    <td className="px-6 py-4 text-white">
                                        {log.user}
                                    </td>

                                    <td className="px-6 py-4 text-synergy-light-gray">
                                        {new Date(log.date).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 text-white font-semibold">
                                        {log.hours}h
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}