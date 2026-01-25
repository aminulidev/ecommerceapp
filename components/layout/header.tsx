"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Sun, Moon, Laptop } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { MobileSidebar } from "./sidebar"
import { useTheme } from "next-themes"
import { CommandMenu } from "@/components/shared/command-menu"

export function Header() {
    const { data: session } = useSession()
    const { setTheme, theme } = useTheme()

    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-50">
            <CommandMenu />
            <div className="flex items-center gap-4">
                <MobileSidebar />
                <div className="relative hidden md:block w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search (Ctrl+K)"
                        className="pl-9 bg-muted/50 border-none focus-visible:bg-background transition-colors cursor-pointer"
                        readOnly
                        onClick={() => {
                            const event = new KeyboardEvent('keydown', {
                                key: 'k',
                                ctrlKey: true,
                                bubbles: true,
                                cancelable: true
                            });
                            document.dispatchEvent(event);
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email}
                                </p>
                                <span className="inline-flex items-center rounded-md bg_primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 mt-2 w-fit">
                                    {session?.user?.role || "VIEWER"}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50" onClick={() => signOut()}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
