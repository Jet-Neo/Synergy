export function StatCard({ title, value, subtitle, icon: Icon }) {
    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="text-gray-400">{title}</div>

                {Icon && (
                    <div className="p-2 bg-neutral-800 rounded-lg">
                        <Icon size={20} className="text-white" />
                    </div>
                )}
            </div>

            <div className="text-3xl text-white font-bold">{value}</div>

            {subtitle && (
                <div className="text-sm text-gray-400 mt-1">{subtitle}</div>
            )}
        </div>
    );
}