
"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

// Since react-intersection-observer is not installed, I will implement a simple version or use a button
// Wait, I can't use react-intersection-observer if it's not installed.
// I'll implement a custom one.

interface InfiniteScrollProps {
    fetchNextPage: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
    children?: React.ReactNode
}

export function InfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    children
}: InfiniteScrollProps) {
    const observerTarget = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 1.0 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    return (
        <div className="space-y-4">
            {children}
            <div ref={observerTarget} className="flex justify-center p-4">
                {isFetchingNextPage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : hasNextPage ? (
                    <div className="h-4 w-4" /> // Invisible trigger
                ) : (
                    <p className="text-sm text-muted-foreground">No more items to load</p>
                )}
            </div>
        </div>
    )
}
