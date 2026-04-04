import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Calendar, Plus, TrendingUp } from "lucide-react";
import {
    workLogs as workLogsAPI,
    tasks as tasksAPI,
    users as usersAPI,
    teamMembers as teamMembersAPI,
} from "../services/api";

export default function WorkLogsPage() {
    const [formData, setFormData] = useState({
        taskId: "",
        userId: "",
        description: "",
        logDate: new Date().toISOString().split("T")[0],
        hoursWorked: "",
        status: "",
    });

    const [workLogs, setWorkLogs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");

    const filterDateInputRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [workLogsRes, tasksRes, usersRes, teamMembersRes] = await Promise.all([
                workLogsAPI.getAll(),
                tasksAPI.getAll(),
                usersAPI.getAll(),
                teamMembersAPI.getAll(),
            ]);

            const mappedLogs = (workLogsRes || [])
                .map((log) => ({
                    id: log.id,
                    taskId: log.taskId,
                    task: log.task?.title || "Untitled Task",
                    date: log.logDate,
                    hours: Number(log.hoursWorked || 0),
                    member: log.user?.name || log.userName || "Unknown User",
                    description: log.description || "",
                }))
                .sort((a, b) => {
                    const dateDiff = new Date(b.date) - new Date(a.date);
                    if (dateDiff !== 0) return dateDiff;
                    return b.id - a.id;
                });

            const mappedTasks = (tasksRes || []).map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: (task.status || "").toLowerCase(),
                priority: task.priority,
                dueDate: task.dueDate,
                assigneeName: task.assigneeName,
                assignedToUserId: task.assignedToUserId,
                teamId: task.teamId,
            }));

            setWorkLogs(mappedLogs);
            setTasks(mappedTasks);
            setUsers(usersRes || []);
            setTeamMembers(teamMembersRes || []);
        } catch (error) {
            console.error("Failed to load data:", error);
            setWorkLogs([]);
            setTasks([]);
            setUsers([]);
            setTeamMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const availableTasks = useMemo(() => {
        return tasks.filter((task) => task.status !== "completed");
    }, [tasks]);

    const selectedTask = useMemo(() => {
        return tasks.find((task) => String(task.id) === String(formData.taskId)) || null;
    }, [tasks, formData.taskId]);

    const allowedUserIdsForSelectedTask = useMemo(() => {
        if (!selectedTask?.teamId) return [];
        return teamMembers
            .filter((tm) => tm.teamId === selectedTask.teamId)
            .map((tm) => tm.userId);
    }, [teamMembers, selectedTask]);

    const availableUsersForSelectedTask = useMemo(() => {
        if (!selectedTask?.teamId) return [];
        return users.filter((user) => allowedUserIdsForSelectedTask.includes(user.id));
    }, [users, allowedUserIdsForSelectedTask, selectedTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedTaskData = tasks.find(
            (task) => task.id === Number(formData.taskId)
        );

        const selectedUser = users.find(
            (user) => user.id === Number(formData.userId)
        );

        if (!selectedTaskData) {
            alert("Please select a valid task.");
            return;
        }

        if ((selectedTaskData.status || "").toLowerCase() === "completed") {
            alert("Completed tasks cannot be selected for new work logs.");
            return;
        }

        if (!selectedUser) {
            alert("Please select a valid user.");
            return;
        }

        const userAllowed = allowedUserIdsForSelectedTask.includes(selectedUser.id);
        if (!userAllowed) {
            alert("Only members of the task's team can log work for this task.");
            return;
        }

        try {
            await workLogsAPI.create({
                taskId: Number(formData.taskId),
                userId: Number(formData.userId),
                userName: selectedUser.name,
                description: formData.description,
                logDate: formData.logDate
                    ? new Date(formData.logDate).toISOString()
                    : new Date().toISOString(),
                hoursWorked: Number(formData.hoursWorked),
            });

            if (formData.status) {
                await tasksAPI.update(selectedTaskData.id, {
                    id: selectedTaskData.id,
                    title: selectedTaskData.title,
                    description: selectedTaskData.description || "",
                    status: formData.status,
                    priority: selectedTaskData.priority || "Medium",
                    dueDate: selectedTaskData.dueDate,
                    assignedToUserId: selectedTaskData.assignedToUserId,
                    assigneeName: selectedTaskData.assigneeName,
                    teamId: selectedTaskData.teamId,
                });
            }

            setFormData({
                taskId: "",
                userId: "",
                description: "",
                logDate: new Date().toISOString().split("T")[0],
                hoursWorked: "",
                status: "",
            });

            await loadData();
        } catch (error) {
            console.error("Failed to log work:", error);
            alert("Failed to log work. Please try again.");
        }
    };

    const filteredWorkLogs = useMemo(() => {
        let logs = [...workLogs];

        if (selectedDate) {
            logs = logs.filter((log) => {
                const logDate = new Date(log.date).toISOString().split("T")[0];
                return logDate === selectedDate;
            });
        }

        return logs.sort((a, b) => {
            const dateDiff = new Date(b.date) - new Date(a.date);
            if (dateDiff !== 0) return dateDiff;
            return b.id - a.id;
        });
    }, [workLogs, selectedDate]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const last7DaysLogs = workLogs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= sevenDaysAgo;
    });

    const totalHours = last7DaysLogs.reduce(
        (sum, log) => sum + Number(log.hours || 0),
        0
    );

    const workDays = new Set(
        last7DaysLogs.map((log) =>
            new Date(log.date).toISOString().split("T")[0]
        )
    ).size;

    const avgHoursPerDay =
        workDays > 0 ? (totalHours / workDays).toFixed(1) : "0.0";

    const inputClass =
        "w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white placeholder:text-synergy-light-gray/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

    const openDateFilter = () => {
        const input = filterDateInputRef.current;
        if (!input) return;

        if (typeof input.showPicker === "function") {
            input.showPicker();
        } else {
            input.click();
            input.focus();
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-4xl text-white mb-2 font-bold">Work Logs</h1>
                <p className="text-synergy-light-gray">
                    Track your time and monitor workload
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-md shadow-primary/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Clock className="text-primary" size={20} />
                        </div>
                        <div className="text-synergy-light-gray">Total Hours</div>
                    </div>
                    <div className="text-3xl text-white font-bold">{totalHours}h</div>
                    <div className="text-sm text-synergy-light-gray mt-1">
                        Last 7 days
                    </div>
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-md shadow-primary/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="text-blue-400" size={20} />
                        </div>
                        <div className="text-synergy-light-gray">Daily Average</div>
                    </div>
                    <div className="text-3xl text-white font-bold">
                        {avgHoursPerDay}h
                    </div>
                    <div className="text-sm text-synergy-light-gray mt-1">Per day</div>
                </div>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-md shadow-primary/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Calendar className="text-orange-400" size={20} />
                        </div>
                        <div className="text-synergy-light-gray">Work Days</div>
                    </div>
                    <div className="text-3xl text-white font-bold">{workDays}</div>
                    <div className="text-sm text-synergy-light-gray mt-1">This week</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-md shadow-primary/5 sticky top-8 hover:border-primary/30 transition-all">
                        <h3 className="text-white mb-6 flex items-center gap-2 font-semibold text-2xl">
                            <Plus size={20} className="text-primary" />
                            Log Work Hours
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Select Task
                                </label>
                                <select
                                    value={formData.taskId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            taskId: e.target.value,
                                            userId: "",
                                        })
                                    }
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Choose a task...</option>
                                    {availableTasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Team Member
                                </label>
                                <select
                                    value={formData.userId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, userId: e.target.value })
                                    }
                                    className={inputClass}
                                    required
                                    disabled={!formData.taskId}
                                >
                                    <option value="">
                                        {formData.taskId
                                            ? "Choose a user..."
                                            : "Select a task first"}
                                    </option>
                                    {availableUsersForSelectedTask.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
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
                                    className={`${inputClass} resize-none`}
                                    placeholder="What work was completed?"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">Date</label>
                                <input
                                    type="date"
                                    value={formData.logDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, logDate: e.target.value })
                                    }
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 text-sm">
                                    Hours Worked
                                </label>
                                <input
                                    type="number"
                                    value={formData.hoursWorked}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            hoursWorked: e.target.value,
                                        })
                                    }
                                    className={inputClass}
                                    placeholder="0.0"
                                    step="0.5"
                                    min="0"
                                    max="24"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-white mb-2 text-sm">
                                    Task Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                    className={inputClass}
                                >
                                    <option value="">No change</option>
                                    <option value="In Progress">Mark as In Progress</option>
                                    <option value="Completed">Mark as Completed</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all font-semibold text-lg"
                            >
                                Log Hours
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-synergy-charcoal border border-primary/20 rounded-xl p-6 shadow-md shadow-primary/5 hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-semibold text-2xl">
                                Recent Work Logs
                            </h3>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={openDateFilter}
                                    className="text-synergy-light-gray hover:text-primary text-sm transition-all"
                                >
                                    Filter by date
                                </button>

                                {selectedDate && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDate("")}
                                        className="text-sm text-synergy-light-gray hover:text-primary transition-all"
                                    >
                                        Clear filter
                                    </button>
                                )}

                                <input
                                    ref={filterDateInputRef}
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-8 text-synergy-light-gray">
                                    Loading work logs...
                                </div>
                            ) : filteredWorkLogs.length === 0 ? (
                                <div className="text-center py-8 text-synergy-light-gray">
                                    No work logs yet. Start tracking your time!
                                </div>
                            ) : (
                                filteredWorkLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-5 hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="text-white mb-2 font-semibold text-2xl">
                                                    {log.task}
                                                </div>

                                                <div className="text-base text-synergy-light-gray mb-3">
                                                    {log.description}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-synergy-light-gray">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} />
                                                        {new Date(log.date).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </div>
                                                    <div>by {log.member}</div>
                                                </div>
                                            </div>

                                            <div className="bg-primary/10 px-4 py-3 rounded-lg flex items-center gap-2 shrink-0">
                                                <Clock size={16} className="text-primary" />
                                                <span className="text-primary font-semibold text-xl">
                                                    {log.hours}h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}