import { useState, useEffect } from "react";
import {
    Plus,
    Calendar,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import { tasks as tasksAPI } from "../services/api";

export default function TasksPage() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deadline: "",
        assignee: "",
        priority: "medium",
    });
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const response = await tasksAPI.getAll();

            const mappedTasks = (response || []).map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                deadline: task.dueDate,
                assignee:
                    task.assignedToUser?.name ||
                    task.assigneeName ||
                    "Unassigned",
                priority: (task.priority || "medium").toLowerCase(),
                status: (task.status || "pending")
                    .toLowerCase()
                    .replace(" ", "-"),
            }));

            setTasks(mappedTasks);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const mockTasks = [
        {
            id: 1,
            title: "Design UI mockups for dashboard",
            description: "Create modern, clean interface designs",
            deadline: "2026-02-22",
            assignee: "Alex Morgan",
            status: "completed",
            priority: "high",
        },
        {
            id: 2,
            title: "Implement user authentication",
            description: "Add login and signup functionality",
            deadline: "2026-02-25",
            assignee: "Sarah Chen",
            status: "in-progress",
            priority: "high",
        },
        {
            id: 3,
            title: "Write API documentation",
            description: "Document all endpoints and usage",
            deadline: "2026-02-28",
            assignee: "Mike Johnson",
            status: "in-progress",
            priority: "medium",
        },
        {
            id: 4,
            title: "Set up database schema",
            description: "Design and implement database structure",
            deadline: "2026-03-02",
            assignee: "Emma Davis",
            status: "pending",
            priority: "high",
        },
        {
            id: 5,
            title: "Create landing page",
            description: "Build marketing landing page",
            deadline: "2026-03-05",
            assignee: "James Wilson",
            status: "pending",
            priority: "low",
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-primary/10 text-primary border-primary/30",
            "in-progress": "bg-synergy-blue/10 text-synergy-blue border-synergy-blue/30",
            pending: "bg-synergy-gray/20 text-synergy-light-gray border-synergy-gray/40",
        };

        return styles[status] || styles.pending;
    };

    const getPriorityIcon = (priority) => {
        if (priority === "high") {
            return <AlertCircle className="text-synergy-red" size={16} />;
        }
        if (priority === "medium") {
            return <Clock className="text-synergy-yellow" size={16} />;
        }
        return <CheckCircle2 className="text-synergy-light-gray" size={16} />;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            description: formData.description,
            dueDate: formData.deadline
                ? new Date(formData.deadline).toISOString()
                : null,
            priority:
                formData.priority.charAt(0).toUpperCase() +
                formData.priority.slice(1),
            status: "Pending",
            assignedToUserId: null,
            assigneeName: formData.assignee,
            teamId: null,
        };

        try {
            await tasksAPI.create(payload);

            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                deadline: "",
                assignee: "",
                priority: "medium",
            });

            await loadTasks();
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Failed to create task. Please try again.");
        }
    };

    const displayTasks = tasks;

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl text-white mb-2 font-bold">
                        Task Management
                    </h1>
                    <p className="text-synergy-light-gray">
                        Organize and track your team's tasks
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                >
                    <Plus size={20} />
                    Create Task
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/30 transition-all">
                    <div className="text-synergy-light-gray mb-2">Total Tasks</div>
                    <div className="text-3xl text-white font-bold">
                        {displayTasks.length}
                    </div>
                </div>

                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/30 transition-all">
                    <div className="text-synergy-light-gray mb-2">In Progress</div>
                    <div className="text-3xl text-synergy-blue font-bold">
                        {displayTasks.filter((t) => t.status === "in-progress").length}
                    </div>
                </div>

                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/30 transition-all">
                    <div className="text-synergy-light-gray mb-2">Completed</div>
                    <div className="text-3xl text-primary font-bold">
                        {displayTasks.filter((t) => t.status === "completed").length}
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl overflow-hidden shadow-lg shadow-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-synergy-dark-gray/60 border-b border-synergy-dark-gray backdrop-blur-sm">
                            <tr>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Task
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Assignee
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Deadline
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Priority
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-synergy-light-gray"
                                    >
                                        Loading tasks...
                                    </td>
                                </tr>
                            ) : displayTasks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-synergy-light-gray"
                                    >
                                        No tasks yet. Create your first task to get started!
                                    </td>
                                </tr>
                            ) : (
                                displayTasks.map((task, index) => (
                                    <tr
                                        key={task.id}
                                        className={`border-b border-synergy-dark-gray hover:bg-synergy-dark-gray/60 hover:border-primary/20 transition-all ${index === displayTasks.length - 1 ? "border-b-0" : ""
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-white mb-1 font-medium">
                                                {task.title}
                                            </div>
                                            <div className="text-sm text-synergy-light-gray">
                                                {task.description}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-primary/20 shadow-md shadow-primary/10 rounded-full flex items-center justify-center">
                                                    <User size={16} className="text-primary" />
                                                </div>
                                                <span className="text-white">{task.assignee}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-synergy-light-gray">
                                                <Calendar size={16} />
                                                {new Date(task.deadline).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getPriorityIcon(task.priority)}
                                                <span className="text-white capitalize">
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-lg border text-sm capitalize ${getStatusBadge(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status.replace("-", " ")}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-black/50">
                        <h2 className="text-2xl text-white mb-6 font-bold">
                            Create New Task
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all resize-none"
                                    placeholder="Task description"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white mb-2 text-sm">
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                deadline: e.target.value,
                                            })
                                        }
                                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2 text-sm">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                priority: e.target.value,
                                            })
                                        }
                                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Assign To
                                </label>
                                <input
                                    type="text"
                                    value={formData.assignee}
                                    onChange={(e) =>
                                        setFormData({ ...formData, assignee: e.target.value })
                                    }
                                    className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                    placeholder="Team member name"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-synergy-dark-gray hover:bg-synergy-gray text-white py-3 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}