
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trash2, X, CheckCircle2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface BulkActionBarProps {
    selectedCount: number
    onClear: () => void
    actions: {
        label: string
        icon: any
        onClick: () => void
        variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    }[]
}

export function BulkActionBar({ selectedCount, onClear, actions }: BulkActionBarProps) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-background border shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 min-w-[300px]">
                        <div className="flex items-center gap-3 pr-6 border-r">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {selectedCount}
                            </span>
                            <span className="text-sm font-medium">Selected</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full hover:bg-muted"
                                onClick={onClear}
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {actions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant={action.variant || "secondary"}
                                    size="sm"
                                    className="h-9 rounded-full gap-2"
                                    onClick={action.onClick}
                                >
                                    <action.icon className="h-4 w-4" />
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
