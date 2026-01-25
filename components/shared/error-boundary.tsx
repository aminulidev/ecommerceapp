"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
    children?: ReactNode
    fallbackTitle?: string
    className?: string
}

interface State {
    hasError: boolean
}

export class WidgetErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in widget:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className={this.props.className}>
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <CardTitle className="text-sm font-medium">
                                {this.props.fallbackTitle || "Widget Error"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground">
                                Something went wrong while loading this component.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => this.setState({ hasError: false })}
                            >
                                <RefreshCcw className="mr-2 h-3 w-3" />
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}
