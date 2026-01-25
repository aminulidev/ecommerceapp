"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar className="h-full" />
            </div>
            <main className="md:pl-64 h-full relative flex flex-col min-h-screen transition-all duration-300 ease-in-out">
                <Header />
                <div className="flex-1 p-6 bg-muted/30 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
