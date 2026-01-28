"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { format } from "date-fns"

interface SalesTrendsChartProps {
    data: {
        date: string
        sales: number
        orders: number
    }[]
}

export function SalesTrendsChart({ data }: SalesTrendsChartProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Sales & Orders Trends</CardTitle>
                <CardDescription>Performance trend over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(str) => format(new Date(str), "MMM dd")}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: '12px'
                                }}
                                labelFormatter={(label) => format(new Date(label), "PPP")}
                                formatter={(value: any, name: string | undefined) => [
                                    name === "sales" ? `$${value?.toLocaleString() ?? 0}` : (value ?? 0),
                                    name === "sales" ? "Revenue" : "Orders"
                                ]}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="sales"
                                fill="var(--primary)"
                                stroke="var(--primary)"
                                fillOpacity={0.1}
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="orders"
                                barSize={20}
                                fill="var(--success)"
                                opacity={0.8}
                                radius={[4, 4, 0, 0]}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
