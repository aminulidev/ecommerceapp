"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/hooks/use-transactions"
import { format } from "date-fns"
import { Printer, Download, CreditCard, Wallet, Landmark, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReceiptDialogProps {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
}

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    WALLET: { label: "Wallet", icon: Wallet, color: "text-blue-500" },
    BANK_TRANSFER: { label: "Bank", icon: Landmark, color: "text-purple-500" },
    PAYPAL: { label: "PayPal", icon: CreditCard, color: "text-info" },
    MASTERCARD: { label: "MasterCard", icon: CreditCard, color: "text-warning" },
}

export function ReceiptDialog({ transaction, isOpen, onClose }: ReceiptDialogProps) {
    if (!transaction) return null

    const config = typeConfig[transaction.type] || { label: transaction.type, icon: CreditCard, color: "" }

    const handlePrint = () => {
        window.print()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Transaction Receipt</DialogTitle>
                        <Badge variant={transaction.status === "COMPLETED" ? "default" : transaction.status === "PENDING" ? "secondary" : "destructive"}>
                            {transaction.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Invoice #{transaction.invoiceNumber} • {format(new Date(transaction.date), "PPP")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center justify-center space-y-2 border-y py-6">
                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Total Amount</span>
                        <span className="text-4xl font-bold text-success">${transaction.amount.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Payment Method</span>
                            <div className="flex items-center gap-2 font-medium">
                                <config.icon className={cn("h-4 w-4", config.color)} />
                                <span>{config.label}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-muted-foreground">Transaction ID</span>
                            <span className="font-mono text-xs">{transaction.id}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Description</span>
                            <span className="font-medium">{transaction.description}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-muted-foreground">Date & Time</span>
                            <span className="font-medium">{format(new Date(transaction.date), "HH:mm, MMM dd, yyyy")}</span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">${transaction.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Processing Fee</span>
                            <span className="font-medium">$0.00</span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
                            <span>Total Paid</span>
                            <span className="text-success">${transaction.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-row gap-2 sm:justify-between">
                    <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
