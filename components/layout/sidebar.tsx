"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    BarChart3,
    Settings,
    Menu,
    LogOut,
    CreditCard,
    Truck
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
            active: pathname === "/",
        },
        {
            label: "Orders",
            icon: ShoppingCart,
            href: "/orders",
            active: pathname.startsWith("/orders"),
        },
        {
            label: "Products",
            icon: Package,
            href: "/products",
            active: pathname.startsWith("/products"),
        },
        {
            label: "Categories",
            icon: BarChart3,
            href: "/categories",
            active: pathname.startsWith("/categories"),
        },
        {
            label: "Transactions",
            icon: CreditCard,
            href: "/transactions",
            active: pathname.startsWith("/transactions"),
        },
        {
            label: "Customers",
            icon: Users,
            href: "/customers",
            active: pathname.startsWith("/customers"),
        },
        {
            label: "Shipping",
            icon: Truck,
            href: "/shipping",
            active: pathname.startsWith("/shipping"),
        },
    ]

    return (
        <div className={cn("pb-12 border-r bg-sidebar h-full flex flex-col", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between px-4 mb-6">
                        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <span className={cn("transition-all", collapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                                Vuexy
                            </span>
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    route.active && "bg-sidebar-accent text-sidebar-primary-foreground font-medium border-r-2 border-primary rounded-r-none rounded-l-md",
                                    !route.active && "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("h-5 w-5", route.active ? "text-primary" : "")} />
                                    <span className={cn("transition-all", collapsed ? "hidden" : "block")}>
                                        {route.label}
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-3 py-2 mt-auto">
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5" />
                        <span className={cn("transition-all", collapsed ? "hidden" : "block")}>
                            Logout
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <Sidebar className="w-full border-r-0" />
            </SheetContent>
        </Sheet>
    )
}
