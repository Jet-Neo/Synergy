import {
    LayoutDashboard,
    CheckSquare,
    Clock,
    BarChart3,
    Users,
    Settings,
    LogOut,
} from "lucide-react";

import { Logo } from "../components/ui/Logo";
import { auth } from "../services/api";

export function Sidebar({ activeTab, onTabChange, onLogout }) {
    const handleLogout = async () => {
        try {
            await auth.logout();
            if (onLogout) onLogout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "worklogs", label: "Work Logs", icon: Clock },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "teams", label: "Teams", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="w-64 h-full bg-synergy-black border-r border-synergy-charcoal flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-synergy-charcoal">
                <Logo size="md" />
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20 border border-primary/30"
                                    : "text-synergy-light-gray hover:bg-synergy-charcoal hover:text-white hover:border hover:border-primary/20"
                                }`}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-synergy-light-gray"} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-synergy-charcoal">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-synergy-light-gray
                     hover:bg-synergy-charcoal hover:text-synergy-red
                     hover:border hover:border-synergy-red/30
                     transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );
}