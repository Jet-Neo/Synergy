import { Users, Mail, Calendar, Plus } from "lucide-react";

export default function TeamsPage() {
    const teams = [
        {
            id: 1,
            name: "Frontend Development",
            members: ["Alex Morgan", "Sarah Chen", "Mike Johnson"],
            created: "2026-01-15",
            activeTasks: 8,
        },
        {
            id: 2,
            name: "Backend Development",
            members: ["Emma Davis", "James Wilson"],
            created: "2026-01-20",
            activeTasks: 5,
        },
        {
            id: 3,
            name: "Design Team",
            members: ["Alex Morgan", "Mike Johnson"],
            created: "2026-02-01",
            activeTasks: 3,
        },
    ];

    const allMembers = [
        {
            name: "Alex Morgan",
            email: "alex.morgan@university.edu",
            role: "Team Lead",
            teams: 2,
            status: "active",
        },
        {
            name: "Sarah Chen",
            email: "sarah.chen@university.edu",
            role: "Developer",
            teams: 1,
            status: "active",
        },
        {
            name: "Mike Johnson",
            email: "mike.johnson@university.edu",
            role: "Designer",
            teams: 2,
            status: "active",
        },
        {
            name: "Emma Davis",
            email: "emma.davis@university.edu",
            role: "Developer",
            teams: 1,
            status: "active",
        },
        {
            name: "James Wilson",
            email: "james.wilson@university.edu",
            role: "Developer",
            teams: 1,
            status: "away",
        },
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl text-white mb-2 font-bold">Teams</h1>
                    <p className="text-synergy-light-gray">
                        Manage your teams and collaborate effectively
                    </p>
                </div>

                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold">
                    <Plus size={20} />
                    Create Team
                </button>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="bg-synergy-charcoal border border-synergy-dark-gray rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Users className="text-primary" size={24} />
                            </div>

                            <div className="px-3 py-1 bg-synergy-blue/10 text-synergy-blue rounded-lg text-sm">
                                {team.activeTasks} active tasks
                            </div>
                        </div>

                        <h3 className="text-white text-xl mb-3 font-semibold">
                            {team.name}
                        </h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-synergy-light-gray">
                                <Users size={16} />
                                {team.members.length} members
                            </div>

                            <div className="flex items-center gap-2 text-sm text-synergy-light-gray">
                                <Calendar size={16} />
                                Created{" "}
                                {new Date(team.created).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-synergy-dark-gray">
                            <div className="flex -space-x-2">
                                {team.members.slice(0, 3).map((member, index) => (
                                    <div
                                        key={index}
                                        className="w-8 h-8 bg-primary/20 border-2 border-synergy-charcoal rounded-full flex items-center justify-center text-primary text-xs font-semibold"
                                        title={member}
                                    >
                                        {member
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                ))}

                                {team.members.length > 3 && (
                                    <div className="w-8 h-8 bg-synergy-dark-gray border-2 border-synergy-charcoal rounded-full flex items-center justify-center text-synergy-light-gray text-xs">
                                        +{team.members.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Members */}
            <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-2xl p-6 shadow-lg shadow-black/20">
                <h3 className="text-white mb-6 font-semibold">All Team Members</h3>

                <div className="space-y-3">
                    {allMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-synergy-charcoal border border-synergy-dark-gray rounded-xl p-4 flex items-center justify-between hover:bg-synergy-dark-gray/20 hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-semibold">
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>

                                <div>
                                    <div className="text-white mb-1 font-medium">
                                        {member.name}
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-synergy-light-gray flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={14} />
                                            {member.email}
                                        </div>
                                        <div>•</div>
                                        <div>{member.role}</div>
                                        <div>•</div>
                                        <div>{member.teams} teams</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`px-3 py-1.5 rounded-lg text-sm ${member.status === "active"
                                        ? "bg-primary/10 text-primary"
                                        : "bg-synergy-yellow/10 text-synergy-yellow"
                                    }`}
                            >
                                {member.status.charAt(0).toUpperCase() +
                                    member.status.slice(1)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}