
"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"

export function CategoryDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "layout-grid"
    })

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                queryClient.invalidateQueries({ queryKey: ["categories"] })
                setOpen(false)
                setFormData({ name: "", description: "", icon: "layout-grid" })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={onSubmit} className="h-full flex flex-col">
                    <SheetHeader>
                        <SheetTitle>Add Category</SheetTitle>
                        <SheetDescription>
                            Create a new category to organize your products.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4 flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Category name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe this category"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Category
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
