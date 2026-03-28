import React, { useState } from "react";

export default function LogTimePage({ onTabChange }) {
    const [formData, setFormData] = useState({
        date: "",
        hours: "",
        task: "",
        member: "Sarah Chen",
        timePeriod: "",
        description: "",
    });

    const tasks = [
        "API Integration",
        "Database Design",
        "User Interface Mockups",
        "Authentication Module",
        "Unit Testing",
        "Documentation",
        "Code Review",
        "User Testing"
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Submitted:", formData);

        // later you will send this to backend
        // fetch("/api/worklogs", { method: "POST", body: JSON.stringify(formData) })
        
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">

            <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 w-full max-w-xl">

                <h1 className="text-2xl font-semibold mb-6">
                    Log Work Time
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Date + Hours */}

                    <div className="flex gap-4">

                        <div className="flex-1">
                            <label className="block text-sm mb-1 text-gray-700">
                                Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm mb-1">
                                Hours Spent
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                    </div>

                    {/* Task */}

                    <div>
                        <label className="block text-sm mb-1">
                            Task
                        </label>

                        <select
                            name="task"
                            value={formData.task}
                            onChange={handleChange}
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                            required
                        >
                            <option value="">
                                Select a task...
                            </option>

                            {tasks.map((task) => (
                                <option key={task} value={task}>
                                    {task}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Team Member */}

                    <div>
                        <label className="block text-sm mb-1">
                            Team Member
                        </label>

                        <select
                            name="member"
                            value={formData.member}
                            onChange={handleChange}
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                        >
                            <option>Sarah Chen</option>
                            <option>Mike Johnson</option>
                            <option>Emma Williams</option>
                        </select>
                    </div>

                    {/* Time Period */}

                    <div>
                        <label className="block text-sm mb-1">
                            Time Period
                        </label>

                        <input
                            type="text"
                            name="timePeriod"
                            placeholder="e.g., 9:00 AM - 1:30 PM"
                            value={formData.timePeriod}
                            onChange={handleChange}
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Description */}

                    <div>
                        <label className="block text-sm mb-1">
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="What did you work on?"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2"
                            rows="3"
                        />
                    </div>

                    {/* Buttons */}

                    <div className="flex gap-4 pt-4">

                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            Log Time
                        </button>

                        <button
                            type="button"
                            onClick={() => onTabChange("worklogs")}
                            className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}