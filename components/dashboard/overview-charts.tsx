
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

interface CustomerGrowthChartProps {
    data: {
        month: string
        customers: number
    }[]
}

export function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>Monthly new customer acquisition</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="customers"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

interface RevenueByCategoryChartProps {
    data: {
        name: string
        revenue: number
    }[]
}

export function RevenueByCategoryChart({ data }: RevenueByCategoryChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Performance comparison across categories</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <Tooltip
                                formatter={(value: number | string | undefined) => [
                                    value !== undefined ? `$${Number(value).toLocaleString()}` : "$0",
                                    "Revenue"
                                ]}
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

interface DistributionChartProps {
    data: {
        name: string
        value: number
    }[]
    title: string
    description: string
    legend?: boolean
    innerRadius?: number
}

export function DistributionChart({ data, title, description, legend = true, innerRadius = 60 }: DistributionChartProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={innerRadius}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: '12px'
                                }}
                            />
                            {legend && <Legend verticalAlign="bottom" height={36} iconType="circle" />}
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
