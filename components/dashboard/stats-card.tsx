"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: number
    trendLabel?: string
    color?: "primary" | "info" | "success" | "warning" | "error"
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendLabel,
    color = "primary",
}: StatsCardProps) {
    const colorMap = {
        primary: "bg-primary/10 text-primary",
        info: "bg-blue-500/10 text-blue-500",
        success: "bg-green-500/10 text-green-500",
        warning: "bg-amber-500/10 text-amber-500",
        error: "bg-red-500/10 text-red-500",
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
                            {trend !== undefined && (
                                <div
                                    className={cn(
                                        "flex items-center text-xs font-medium rounded px-1.5 py-0.5",
                                        trend >= 0
                                            ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                            : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                                    )}
                                >
                                    {trend >= 0 ? (
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                    )}
                                    {Math.abs(trend)}%
                                </div>
                            )}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <div
                        className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                            colorMap[color]
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
