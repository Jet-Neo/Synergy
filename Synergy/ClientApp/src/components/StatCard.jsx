export function StatCard({ title, value, subtitle, icon: Icon, trend }) {
    return (
        <div
            className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6
                       hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10
                       hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="text-synergy-light-gray">{title}</div>

                {Icon && (
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <Icon size={20} className="text-primary" />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="text-3xl text-white font-bold">
                    {value}
                </div>

                {(subtitle || trend) && (
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        {trend && (
                            <span className={trend.isPositive ? "text-primary" : "text-synergy-red"}>
                                {trend.value}
                            </span>
                        )}

                        {subtitle && (
                            <span className="text-synergy-light-gray">
                                {subtitle}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}