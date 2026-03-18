export function StatCard({ title, value, subtitle, icon: Icon, trend }) {
    return (
        <div
            className="bg-[#151515] border border-[#18453b] rounded-xl p-6
                 shadow-[0_0_8px_rgba(16,185,129,0.04)]
                 hover:border-primary/35 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="text-synergy-light-gray">{title}</div>

                {Icon && (
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="text-primary" size={20} />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="text-3xl text-white font-bold">{value}</div>

                {(subtitle || trend) && (
                    <div className="flex items-center gap-2 text-sm">
                        {trend && (
                            <span className={trend.isPositive ? "text-primary" : "text-synergy-red"}>
                                {trend.value}
                            </span>
                        )}

                        {subtitle && (
                            <span className="text-synergy-light-gray">{subtitle}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}