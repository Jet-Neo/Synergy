import { Leaf } from "lucide-react";

export function Logo({ size = "md", showText = true, className = "" }) {
    const sizeClasses = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
    const iconSizes = { sm: 20, md: 28, lg: 40 };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={iconSizes[size]} strokeWidth={2.5} />
            </div>
            {showText && (
                <span className={`${sizeClasses[size]} tracking-tight text-white font-bold`}>
                    Synergy
                </span>
            )}
        </div>
    );
}