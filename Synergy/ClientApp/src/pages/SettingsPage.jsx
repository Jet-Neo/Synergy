import { useState } from 'react';
import { User, Bell, Lock, Palette, Globe } from 'lucide-react';

function LanguageRegionSettings() {
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>
                Language & Region
            </h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-white mb-2 text-sm">Language</label>
                    <select className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                        <option>English (United States)</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white mb-2 text-sm">Region</label>
                    <select className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white mb-2 text-sm">Timezone</label>
                    <select className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                        <option>(UTC-06:00) Central Time</option>
                        <option>(UTC-05:00) Eastern Time</option>
                        <option>(UTC-08:00) Pacific Time</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white mb-2 text-sm">Date Format</label>
                    <select className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

function PrivacySecuritySettings() {
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>
                Privacy & Security
            </h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-white mb-2 text-sm">Current Password</label>
                    <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                    />
                </div>

                <div>
                    <label className="block text-white mb-2 text-sm">New Password</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                    />
                </div>

                <div>
                    <label className="block text-white mb-2 text-sm">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                    />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-synergy-dark-gray">
                    <div>
                        <div className="text-white mb-1" style={{ fontWeight: 500 }}>
                            Two-Factor Authentication
                        </div>
                        <div className="text-sm text-synergy-light-gray">
                            Add an extra layer of security to your account
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-synergy-gray rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}

function AppearanceSettings() {
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>
                Appearance
            </h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-white mb-2 text-sm">Theme</label>
                    <select className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                        <option>Dark</option>
                        <option>Light</option>
                        <option>System Default</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white mb-2 text-sm">Accent Color</label>
                    <select className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                        <option>Purple</option>
                        <option>Blue</option>
                        <option>Green</option>
                        <option>Orange</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export function SettingsPage({ user }) {
    const [activeTab, setActiveTab] = useState('Profile');
    const [profile, setProfile] = useState(() => ({
        name: user?.name || user?.Name || '',
        email: user?.email || user?.Email || '',
        role: user?.role || user?.Role || '',
        bio: user?.bio || user?.Bio || '',
    }));

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-4xl text-white mb-2" style={{ fontWeight: 700 }}>
                    Settings
                </h1>
                <p className="text-synergy-light-gray">
                    Manage your account and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                        {[
                            { icon: User, label: 'Profile' },
                            { icon: Bell, label: 'Notifications' },
                            { icon: Lock, label: 'Privacy & Security' },
                            { icon: Palette, label: 'Appearance' },
                            { icon: Globe, label: 'Language & Region' },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${activeTab === item.label
                                            ? 'bg-primary/10 text-primary border border-primary/30'
                                            : 'text-synergy-light-gray hover:bg-synergy-charcoal hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'Profile' && (
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>
                                Profile Information
                            </h3>

                            <div className="space-y-5">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                                        <User className="text-primary" size={32} />
                                    </div>
                                    <button className="px-4 py-2 bg-synergy-dark-gray hover:bg-synergy-gray text-white rounded-lg transition-all text-sm">
                                        Change Photo
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white mb-2 text-sm">Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    
                                </div>

                                <div>
                                    <label className="block text-white mb-2 text-sm">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2 text-sm">Role</label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2 text-sm">Bio</label>
                                    <textarea
                                        defaultValue="Enter Bio Here"
                                        className="w-full bg-synergy-dark-gray border border-synergy-gray rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>
                                Notification Preferences
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { label: 'Task assignments', description: "Get notified when you're assigned to a task" },
                                    { label: 'Burnout alerts', description: 'Receive warnings when approaching overwork threshold' },
                                    { label: 'Team updates', description: 'Stay informed about team activity' },
                                    { label: 'Weekly reports', description: 'Receive weekly productivity summaries' }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-3 border-b border-synergy-dark-gray last:border-b-0"
                                    >
                                        <div>
                                            <div className="text-white mb-1" style={{ fontWeight: 500 }}>
                                                {item.label}
                                            </div>
                                            <div className="text-sm text-synergy-light-gray">
                                                {item.description}
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-synergy-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Privacy & Security' && <PrivacySecuritySettings />}

                    {activeTab === 'Appearance' && <AppearanceSettings />}

                    {activeTab === 'Language & Region' && <LanguageRegionSettings />}

                    <div className="flex justify-end gap-3">
                        <button className="px-6 py-3 bg-synergy-dark-gray hover:bg-synergy-gray text-white rounded-lg transition-all">
                            Cancel
                        </button>
                        <button
                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20 transition-all"
                            style={{ fontWeight: 600 }}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}