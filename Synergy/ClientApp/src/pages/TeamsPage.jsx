import { useEffect, useMemo, useState } from "react";
import {
    Users,
    Mail,
    UserPlus,
    FolderPlus,
    X,
    UserMinus,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    teams as teamsAPI,
    users as usersAPI,
    teamMembers as teamMembersAPI,
} from "../services/api";

export default function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePanel, setActivePanel] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [isEditingTeam, setIsEditingTeam] = useState(false);
    const [editTeamForm, setEditTeamForm] = useState({
        id: "",
        name: "",
        description: "",
    });

    const [editingUserId, setEditingUserId] = useState(null);
    const [editUserForm, setEditUserForm] = useState({
        id: "",
        name: "",
        email: "",
        role: "Member",
        passwordHash: "TEMP_PLACEHOLDER",
    });

    const [teamForm, setTeamForm] = useState({
        name: "",
        description: "",
    });

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        role: "Member",
    });

    const [assignmentForm, setAssignmentForm] = useState({
        userId: "",
        teamId: "",
    });

    const inputClass =
        "w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white placeholder:text-synergy-light-gray/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const [teamsRes, usersRes, teamMembersRes] = await Promise.all([
                teamsAPI.getAll(),
                usersAPI.getAll(),
                teamMembersAPI.getAll(),
            ]);

            setTeams(teamsRes || []);
            setUsers(usersRes || []);
            setTeamMembers(teamMembersRes || []);
        } catch (error) {
            console.error("Failed to load teams data:", error);
            setTeams([]);
            setUsers([]);
            setTeamMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePanel = (panelName) => {
        setActivePanel((current) => (current === panelName ? "" : panelName));
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();

        try {
            await teamsAPI.create({
                name: teamForm.name,
                description: teamForm.description,
            });

            setTeamForm({
                name: "",
                description: "",
            });

            setActivePanel("");
            await loadData();
        } catch (error) {
            console.error("Failed to create team:", error);
            alert("Failed to create team. Please try again.");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            await usersAPI.create({
                name: userForm.name,
                email: userForm.email,
                role: userForm.role,
                passwordHash: "TEMP_PLACEHOLDER",
            });

            setUserForm({
                name: "",
                email: "",
                role: "Member",
            });

            setActivePanel("");
            await loadData();
        } catch (error) {
            console.error("Failed to create user:", error);
            alert("Failed to create member. Please try again.");
        }
    };

    const handleAssignMember = async (e) => {
        e.preventDefault();

        try {
            await teamMembersAPI.create({
                userId: Number(assignmentForm.userId),
                teamId: Number(assignmentForm.teamId),
            });

            setAssignmentForm({
                userId: "",
                teamId: "",
            });

            setActivePanel("");
            await loadData();
        } catch (error) {
            console.error("Failed to assign member:", error);
            alert("Failed to add member to team. They may already be assigned.");
        }
    };

    const startEditingTeam = () => {
        if (!selectedTeam) return;

        setEditTeamForm({
            id: selectedTeam.id,
            name: selectedTeam.name,
            description: selectedTeam.description || "",
        });

        setIsEditingTeam(true);
    };

    const handleUpdateTeam = async (e) => {
        e.preventDefault();

        try {
            await teamsAPI.update(editTeamForm.id, {
                id: editTeamForm.id,
                name: editTeamForm.name,
                description: editTeamForm.description,
            });

            await loadData();

            setSelectedTeam((prev) =>
                prev
                    ? {
                        ...prev,
                        name: editTeamForm.name,
                        description: editTeamForm.description,
                    }
                    : null
            );

            setIsEditingTeam(false);
        } catch (error) {
            console.error("Failed to update team:", error);
            alert("Failed to update team. Please try again.");
        }
    };

    const handleDeleteTeam = async () => {
        if (!selectedTeam) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${selectedTeam.name}"?`
        );
        if (!confirmed) return;

        try {
            await teamsAPI.remove(selectedTeam.id);
            setSelectedTeam(null);
            setIsEditingTeam(false);
            await loadData();
        } catch (error) {
            console.error("Failed to delete team:", error);
            alert("Failed to delete team.");
        }
    };

    const handleRemoveMember = async (teamMemberId) => {
        try {
            await teamMembersAPI.remove(teamMemberId);
            await loadData();

            setSelectedTeam((prev) => {
                if (!prev) return null;

                const refreshed = teamsWithMembers.find((t) => t.id === prev.id);
                return refreshed || null;
            });
        } catch (error) {
            console.error("Failed to remove member:", error);
            alert("Failed to remove member from team.");
        }
    };

    const startEditingUser = (member) => {
        setEditingUserId(member.id);
        setEditUserForm({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            passwordHash: "TEMP_PLACEHOLDER",
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        try {
            await usersAPI.update(editUserForm.id, editUserForm);
            setEditingUserId(null);
            await loadData();
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user. Please try again.");
        }
    };

    const teamsWithMembers = useMemo(() => {
        return teams.map((team) => {
            const members = teamMembers
                .filter((tm) => tm.teamId === team.id)
                .map((tm) => ({
                    id: tm.id,
                    userId: tm.userId,
                    name: tm.user?.name || "Unknown User",
                    email: tm.user?.email || "",
                    role: tm.user?.role || "Member",
                }));

            return {
                ...team,
                members,
            };
        });
    }, [teams, teamMembers]);

    const allMembers = useMemo(() => {
        return users.map((user) => {
            const teamCount = teamMembers.filter((tm) => tm.userId === user.id).length;

            return {
                ...user,
                teams: teamCount,
                status: "active",
            };
        });
    }, [users, teamMembers]);

    return (
        <div className="p-8 space-y-10">
            <div>
                <h1 className="text-4xl text-white mb-2 font-bold">Teams</h1>
                <p className="text-synergy-light-gray">
                    Manage your teams and collaborate effectively
                </p>
            </div>

            <div className="flex justify-center flex-wrap gap-4">
                <button
                    type="button"
                    onClick={() => togglePanel("team")}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                >
                    <FolderPlus size={18} />
                    Create Team
                </button>

                <button
                    type="button"
                    onClick={() => togglePanel("user")}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                >
                    <Users size={18} />
                    Create Member
                </button>

                <button
                    type="button"
                    onClick={() => togglePanel("assign")}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                >
                    <UserPlus size={18} />
                    Assign Member
                </button>
            </div>

            {activePanel && (
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl bg-synergy-charcoal border border-primary/20 rounded-2xl p-6 shadow-lg shadow-black/20">
                        {activePanel === "team" && (
                            <div>
                                <h3 className="text-white mb-5 flex items-center gap-2 font-semibold text-xl">
                                    <FolderPlus size={20} className="text-primary" />
                                    Create Team
                                </h3>

                                <form onSubmit={handleCreateTeam} className="space-y-4">
                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Team Name
                                        </label>
                                        <input
                                            type="text"
                                            value={teamForm.name}
                                            onChange={(e) =>
                                                setTeamForm({
                                                    ...teamForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Enter team name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Description
                                        </label>
                                        <textarea
                                            value={teamForm.description}
                                            onChange={(e) =>
                                                setTeamForm({
                                                    ...teamForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            className={`${inputClass} resize-none`}
                                            rows={4}
                                            placeholder="What is this team for?"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setActivePanel("")}
                                            className="px-5 py-3 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-5 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                                        >
                                            Create Team
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activePanel === "user" && (
                            <div>
                                <h3 className="text-white mb-5 flex items-center gap-2 font-semibold text-xl">
                                    <Users size={20} className="text-primary" />
                                    Create Member
                                </h3>

                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={userForm.name}
                                            onChange={(e) =>
                                                setUserForm({
                                                    ...userForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Enter member name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={userForm.email}
                                            onChange={(e) =>
                                                setUserForm({
                                                    ...userForm,
                                                    email: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Role
                                        </label>
                                        <select
                                            value={userForm.role}
                                            onChange={(e) =>
                                                setUserForm({
                                                    ...userForm,
                                                    role: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="Member">Member</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Team Lead">Team Lead</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setActivePanel("")}
                                            className="px-5 py-3 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-5 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                                        >
                                            Create Member
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activePanel === "assign" && (
                            <div>
                                <h3 className="text-white mb-5 flex items-center gap-2 font-semibold text-xl">
                                    <UserPlus size={20} className="text-primary" />
                                    Assign Member to Team
                                </h3>

                                <form onSubmit={handleAssignMember} className="space-y-4">
                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Select Member
                                        </label>
                                        <select
                                            value={assignmentForm.userId}
                                            onChange={(e) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    userId: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            required
                                        >
                                            <option value="">Choose a member...</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Select Team
                                        </label>
                                        <select
                                            value={assignmentForm.teamId}
                                            onChange={(e) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    teamId: e.target.value,
                                                })
                                            }
                                            className={inputClass}
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

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setActivePanel("")}
                                            className="px-5 py-3 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-5 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                                        >
                                            Add to Team
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="border-t border-synergy-dark-gray pt-8 space-y-4">
                <h2 className="text-white text-2xl font-semibold">Teams</h2>

                {isLoading ? (
                    <div className="text-center py-10 text-synergy-light-gray">
                        Loading teams...
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-6 min-w-max">
                            {teamsWithMembers.map((team) => (
                                <button
                                    key={team.id}
                                    type="button"
                                    onClick={() => setSelectedTeam(team)}
                                    className="text-left w-[320px] bg-synergy-charcoal border border-primary/20 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-primary/30 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between mb-4 gap-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Users className="text-primary" size={24} />
                                            </div>

                                            <div className="px-3 py-1 bg-synergy-blue/10 text-synergy-blue rounded-lg text-sm whitespace-nowrap">
                                                {team.members.length} members
                                            </div>
                                        </div>

                                        <h3 className="text-white text-xl mb-2 font-semibold">
                                            {team.name}
                                        </h3>

                                        <p className="text-sm text-synergy-light-gray mb-5 min-h-[44px]">
                                            {team.description || "No description provided"}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-synergy-dark-gray">
                                        <div className="flex -space-x-2">
                                            {team.members.slice(0, 4).map((member, index) => (
                                                <div
                                                    key={index}
                                                    className="w-9 h-9 bg-primary/20 border-2 border-synergy-charcoal rounded-full flex items-center justify-center text-primary text-xs font-semibold"
                                                    title={member.name}
                                                >
                                                    {member.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                            ))}

                                            {team.members.length > 4 && (
                                                <div className="w-9 h-9 bg-synergy-dark-gray border-2 border-synergy-charcoal rounded-full flex items-center justify-center text-synergy-light-gray text-xs">
                                                    +{team.members.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-synergy-dark-gray pt-8 space-y-4">
                <h2 className="text-white text-2xl font-semibold">Members</h2>

                <div className="bg-synergy-charcoal border border-primary/20 rounded-2xl p-6 shadow-lg shadow-black/20 space-y-4">
                    {allMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl px-5 py-4 flex flex-col gap-4 hover:bg-synergy-dark-gray/20 hover:border-primary/30 transition-all"
                        >
                            {editingUserId === member.id ? (
                                <form onSubmit={handleUpdateUser} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            value={editUserForm.name}
                                            onChange={(e) =>
                                                setEditUserForm({
                                                    ...editUserForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Full Name"
                                            required
                                        />

                                        <input
                                            type="email"
                                            value={editUserForm.email}
                                            onChange={(e) =>
                                                setEditUserForm({
                                                    ...editUserForm,
                                                    email: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            placeholder="Email"
                                            required
                                        />

                                        <select
                                            value={editUserForm.role}
                                            onChange={(e) =>
                                                setEditUserForm({
                                                    ...editUserForm,
                                                    role: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="Member">Member</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Team Lead">Team Lead</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditingUserId(null)}
                                            className="px-4 py-2 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all font-semibold"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-primary font-semibold">
                                                {member.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-white mb-1 font-medium">
                                                {member.name}
                                            </div>

                                            <div className="flex items-center gap-3 text-sm text-synergy-light-gray flex-wrap">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <Mail size={14} />
                                                    <span className="truncate">{member.email}</span>
                                                </div>
                                                <div>|</div>
                                                <div>{member.role}</div>
                                                <div>|</div>
                                                <div>{member.teams} teams</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="px-3 py-1.5 rounded-lg text-sm bg-primary/10 text-primary">
                                            Active
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => startEditingUser(member)}
                                            className="p-2 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                            title="Edit user"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedTeam && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="bg-synergy-charcoal border border-primary/20 rounded-2xl p-8 w-full max-w-2xl shadow-2xl shadow-black/50 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl text-white font-bold mb-2">
                                    {selectedTeam.name}
                                </h3>
                                <p className="text-synergy-light-gray">
                                    {selectedTeam.description || "No description provided"}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={startEditingTeam}
                                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all font-medium"
                                >
                                    Edit Team
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDeleteTeam}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all font-medium"
                                >
                                    Delete Team
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedTeam(null);
                                        setIsEditingTeam(false);
                                    }}
                                    className="p-2 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {isEditingTeam && (
                            <div className="mb-6 bg-synergy-dark-gray/40 border border-primary/20 rounded-xl p-5">
                                <h4 className="text-white text-lg font-semibold mb-4">
                                    Edit Team
                                </h4>

                                <form onSubmit={handleUpdateTeam} className="space-y-4">
                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Team Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editTeamForm.name}
                                            onChange={(e) =>
                                                setEditTeamForm({
                                                    ...editTeamForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 text-sm">
                                            Description
                                        </label>
                                        <textarea
                                            value={editTeamForm.description}
                                            onChange={(e) =>
                                                setEditTeamForm({
                                                    ...editTeamForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            className={`${inputClass} resize-none`}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingTeam(false)}
                                            className="px-5 py-3 rounded-lg bg-synergy-dark-gray hover:bg-synergy-gray text-white transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-5 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="mb-5 flex items-center justify-between">
                            <h4 className="text-white text-lg font-semibold">
                                Team Members
                            </h4>
                            <div className="px-3 py-1 bg-synergy-blue/10 text-synergy-blue rounded-lg text-sm">
                                {selectedTeam.members.length} total
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selectedTeam.members.length === 0 ? (
                                <div className="text-center py-8 text-synergy-light-gray border border-synergy-dark-gray rounded-xl">
                                    No members assigned to this team yet.
                                </div>
                            ) : (
                                selectedTeam.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-11 h-11 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-primary font-semibold text-sm">
                                                    {member.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </span>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="text-white font-medium mb-1">
                                                    {member.name}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-synergy-light-gray flex-wrap">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <Mail size={14} />
                                                        <span className="truncate">
                                                            {member.email}
                                                        </span>
                                                    </div>
                                                    <div>•</div>
                                                    <div>{member.role}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all self-start md:self-auto"
                                        >
                                            <UserMinus size={16} />
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}