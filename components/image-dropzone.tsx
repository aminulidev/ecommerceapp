
"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus, X, Loader2, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageDropzoneProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function ImageDropzone({
    value,
    onChange,
    disabled
}: ImageDropzoneProps) {
    const [loading, setLoading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")

            const data = await response.json()
            onChange(data.url)
        } catch (error) {
            console.error("Error uploading image:", error)
        } finally {
            setLoading(false)
        }
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"]
        },
        maxFiles: 1,
        disabled: disabled || loading
    })

    const onRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange("")
    }

    return (
        <div className="space-y-4 w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "relative aspect-square rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center overflow-hidden cursor-pointer",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/50",
                    (disabled || loading) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />

                {value ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Upload"
                            className="h-full w-full object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 z-10"
                            onClick={onRemove}
                            disabled={disabled || loading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground text-center p-4">
                        {loading ? (
                            <>
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="text-xs font-medium">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="h-8 w-8" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-semibold">Click to upload or drag and drop</span>
                                    <span className="text-xs">PNG, JPG or WEBP (MAX. 800x400px)</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
