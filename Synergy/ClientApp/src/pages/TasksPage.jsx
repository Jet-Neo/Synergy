import { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Calendar,
    User,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2,
    Pencil,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import {
    tasks as tasksAPI,
    users as usersAPI,
    teams as teamsAPI,
    teamMembers as teamMembersAPI,
} from "../services/api";

export default function TasksPage() {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        deadline: "",
        assigneeId: "",
        teamId: "",
        priority: "medium",
        status: "pending",
    });
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [tasksResponse, usersResponse, teamsResponse, teamMembersResponse] =
                await Promise.all([
                    tasksAPI.getAll(),
                    usersAPI.getAll(),
                    teamsAPI.getAll(),
                    teamMembersAPI.getAll(),
                ]);

            const mappedTasks = (tasksResponse || []).map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description || "",
                deadline: task.dueDate,
                assignee:
                    task.assignedToUser?.name ||
                    task.assigneeName ||
                    "Unassigned",
                assigneeId: task.assignedToUserId || "",
                team: task.team?.name || "No Team",
                teamId: task.teamId || "",
                priority: (task.priority || "medium").toLowerCase(),
                status: (task.status || "pending").toLowerCase().replace(" ", "-"),
            }));

            setTasks(mappedTasks);
            setUsers(usersResponse || []);
            setTeams(teamsResponse || []);
            setTeamMembers(teamMembersResponse || []);
        } catch (error) {
            console.error("Failed to load tasks/users/teams:", error);
            setTasks([]);
            setUsers([]);
            setTeams([]);
            setTeamMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const teamUserIds = useMemo(() => {
        if (!formData.teamId) return [];
        return teamMembers
            .filter((tm) => String(tm.teamId) === String(formData.teamId))
            .map((tm) => tm.userId);
    }, [teamMembers, formData.teamId]);

    const filteredAssignableUsers = useMemo(() => {
        if (!formData.teamId) return [];
        return users.filter((user) => teamUserIds.includes(user.id));
    }, [users, teamUserIds, formData.teamId]);

    const getStatusBadge = (status) => {
        const normalized = status?.toLowerCase();

        const styles = {
            completed: "bg-primary/10 text-primary border-primary/30",
            "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/30",
            pending:
                "bg-synergy-gray/20 text-synergy-light-gray border-synergy-gray/40",
        };

        return styles[normalized] || styles.pending;
    };

    const getPriorityIcon = (priority) => {
        if (priority === "high") {
            return <AlertCircle className="text-red-500" size={16} />;
        }
        if (priority === "medium") {
            return <Clock className="text-orange-400" size={16} />;
        }
        return <CheckCircle2 className="text-synergy-light-gray" size={16} />;
    };

    const priorityRank = {
        high: 3,
        medium: 2,
        low: 1,
    };

    const statusRank = {
        completed: 3,
        "in-progress": 2,
        pending: 1,
    };

    const sortedTasks = useMemo(() => {
        const sorted = [...tasks];

        if (!sortConfig.key) return sorted;

        sorted.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === "priority") {
                aValue = priorityRank[a.priority] || 0;
                bValue = priorityRank[b.priority] || 0;
            }

            if (sortConfig.key === "deadline") {
                aValue = a.deadline ? new Date(a.deadline).getTime() : 0;
                bValue = b.deadline ? new Date(b.deadline).getTime() : 0;
            }

            if (sortConfig.key === "status") {
                aValue = statusRank[a.status] || 0;
                bValue = statusRank[b.status] || 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [tasks, sortConfig]);

    const requestSort = (key) => {
        setSortConfig((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === "asc" ? "desc" : "asc",
                };
            }

            return {
                key,
                direction: "asc",
            };
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? (
            <ArrowUp size={14} className="text-primary" />
        ) : (
            <ArrowDown size={14} className="text-primary" />
        );
    };

    const resetForm = () => {
        setFormData({
            id: "",
            title: "",
            description: "",
            deadline: "",
            assigneeId: "",
            teamId: "",
            priority: "medium",
            status: "pending",
        });
        setIsEditing(false);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedUser = users.find(
            (user) => user.id === Number(formData.assigneeId)
        );

        const payload = {
            id: formData.id ? Number(formData.id) : 0,
            title: formData.title,
            description: formData.description,
            dueDate: formData.deadline
                ? new Date(formData.deadline).toISOString()
                : null,
            priority:
                formData.priority.charAt(0).toUpperCase() +
                formData.priority.slice(1),
            status:
                formData.status === "in-progress"
                    ? "In Progress"
                    : formData.status.charAt(0).toUpperCase() +
                    formData.status.slice(1),
            assignedToUserId: formData.assigneeId
                ? Number(formData.assigneeId)
                : null,
            assigneeName: selectedUser?.name || "",
            teamId: formData.teamId ? Number(formData.teamId) : null,
        };

        try {
            if (isEditing) {
                await tasksAPI.update(formData.id, payload);
            } else {
                await tasksAPI.create(payload);
            }

            resetForm();
            await loadData();
        } catch (error) {
            console.error("Failed to save task:", error);
            alert("Failed to save task. Please try again.");
        }
    };

    const handleEditTask = (task) => {
        setFormData({
            id: task.id,
            title: task.title,
            description: task.description,
            deadline: task.deadline
                ? new Date(task.deadline).toISOString().split("T")[0]
                : "",
            assigneeId: task.assigneeId ? String(task.assigneeId) : "",
            teamId: task.teamId ? String(task.teamId) : "",
            priority: task.priority,
            status: task.status,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteTask = async (taskId, taskTitle) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${taskTitle}"?`
        );
        if (!confirmed) return;

        try {
            await tasksAPI.remove(taskId);
            await loadData();
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Failed to delete task.");
        }
    };

    return (
        <div className="p-8 space-y-6">
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
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                >
                    <Plus size={20} />
                    Create Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/40 transition-all">
                    <div className="text-synergy-light-gray mb-2">Total Tasks</div>
                    <div className="text-3xl text-white font-bold">
                        {tasks.length}
                    </div>
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/40 transition-all">
                    <div className="text-synergy-light-gray mb-2">In Progress</div>
                    <div className="text-3xl text-blue-400 font-bold">
                        {tasks.filter((t) => t.status === "in-progress").length}
                    </div>
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-lg shadow-black/30 hover:border-primary/40 transition-all">
                    <div className="text-synergy-light-gray mb-2">Completed</div>
                    <div className="text-3xl text-primary font-bold">
                        {tasks.filter((t) => t.status === "completed").length}
                    </div>
                </div>
            </div>

            <div className="bg-synergy-charcoal border border-primary/20 rounded-xl overflow-hidden shadow-lg shadow-black/30">
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
                                    Team
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => requestSort("deadline")}
                                        className="flex items-center gap-2 hover:text-white transition-all"
                                    >
                                        Deadline
                                        {getSortIcon("deadline")}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => requestSort("priority")}
                                        className="flex items-center gap-2 hover:text-white transition-all"
                                    >
                                        Priority
                                        {getSortIcon("priority")}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => requestSort("status")}
                                        className="flex items-center gap-2 hover:text-white transition-all"
                                    >
                                        Status
                                        {getSortIcon("status")}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-synergy-light-gray font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-synergy-light-gray"
                                    >
                                        Loading tasks...
                                    </td>
                                </tr>
                            ) : sortedTasks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-synergy-light-gray"
                                    >
                                        No tasks yet. Create your first task to get started!
                                    </td>
                                </tr>
                            ) : (
                                sortedTasks.map((task, index) => (
                                    <tr
                                        key={task.id}
                                        className={`border-b border-synergy-dark-gray hover:bg-synergy-dark-gray/40 hover:border-primary/20 transition-all ${index === sortedTasks.length - 1 ? "border-b-0" : ""
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
                                                <Users size={16} />
                                                {task.team}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-synergy-light-gray">
                                                <Calendar size={16} />
                                                {task.deadline
                                                    ? new Date(task.deadline).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "-"}
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

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditTask(task)}
                                                    className="p-2 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                                    title="Edit task"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteTask(task.id, task.title)
                                                    }
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="bg-synergy-charcoal border border-primary/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-black/50">
                        <h2 className="text-2xl text-white mb-6 font-bold">
                            {isEditing ? "Edit Task" : "Create New Task"}
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
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Team
                                </label>
                                <select
                                    value={formData.teamId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            teamId: e.target.value,
                                            assigneeId: "",
                                        })
                                    }
                                    className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                    required
                                >
                                    <option value="">Choose a team...</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Assign To
                                </label>
                                <select
                                    value={formData.assigneeId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            assigneeId: e.target.value,
                                        })
                                    }
                                    className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                                    required
                                    disabled={!formData.teamId}
                                >
                                    <option value="">
                                        {formData.teamId
                                            ? "Choose a user..."
                                            : "Select a team first"}
                                    </option>
                                    {filteredAssignableUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-synergy-dark-gray hover:bg-synergy-gray text-white py-3 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                                >
                                    {isEditing ? "Save Changes" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}