# 🧩 UI Component Inventory - Ecommerce Dashboard

**Objective:** Comprehensive list of all UI components identified from the Vuexy dashboard screenshots.

## 1. Layout Components

### AppLayout
- **Description:** Main application shell with sidebar and content area
- **Tech:** Next.js App Router layout component
- **Features:** Responsive, collapsible sidebar, mobile menu

### Sidebar
- **Description:** Left navigation panel with logo, menu items, and collapse toggle
- **Shadcn Components:** Sheet (for mobile), ScrollArea
- **Features:** Active state highlighting, icon + text, collapsible, grouped navigation

### Header
- **Description:** Top bar with search, notifications, and user profile
- **Shadcn Components:** Input, DropdownMenu, Avatar, Badge
- **Features:** Global search, notification bell, user menu

## 2. Dashboard Components

### StatsCard
- **Description:** KPI card showing metric value, label, icon, and trend
- **Shadcn Components:** Card, CardContent
- **Props:** `label`, `value`, `trend`, `icon`, `color`
- **Example:** "230k Sales", "8,549k Customers"

### RevenueChart
- **Description:** Bar chart showing earning vs expense over time
- **Chart Library:** Recharts
- **Type:** Composed bar chart with dual bars
- **Features:** Legend, tooltip, responsive

### ProfitCard
- **Description:** Line chart showing profit trend
- **Chart Library:** Recharts
- **Type:** Area chart with percentage change

### ExpenseGauge
- **Description:** Circular progress indicator for expenses
- **Type:** Radial progress / Donut chart
- **Features:** Percentage display, comparison text

### GeneratedLeadsCard
- **Description:** Circular progress with total count
- **Type:** Donut chart with center text
- **Features:** Monthly report label, trend indicator

### EarningReportsWidget
- **Description:** Weekly earnings overview with mini bar chart
- **Chart Library:** Recharts
- **Type:** Small bar chart with labels

### PopularProductsList
- **Description:** List of top-selling products with images
- **Shadcn Components:** Card, Avatar, ScrollArea
- **Features:** Product image, name, item number, price

### OrdersByCountriesList
- **Description:** Geographic order distribution with status badges
- **Shadcn Components:** Card, Badge, ScrollArea
- **Features:** Customer name, address, status indicator

## 3. Orders Components

### OrdersListTable
- **Description:** Paginated table of all orders
- **Shadcn Components:** Table, Badge, DropdownMenu, Checkbox
- **Columns:** Order #, Date, Customer, Payment, Status, Method, Actions
- **Features:** Sortable, filterable, row selection, pagination

### OrderDetailsCard
- **Description:** Detailed view of a single order
- **Shadcn Components:** Card, Table, Badge, Separator
- **Sections:** Order items, subtotal/tax/total, shipping activity, customer details

### CustomerDetailsCard
- **Description:** Customer information sidebar
- **Shadcn Components:** Card, Avatar, Button
- **Features:** Contact info, total orders, edit button

### ShippingActivityTimeline
- **Description:** Vertical timeline of order shipping status
- **Shadcn Components:** Custom timeline component
- **Features:** Status icons, timestamps, descriptions

### ShippingAddressCard
- **Description:** Display shipping/billing address
- **Shadcn Components:** Card
- **Features:** Edit button, formatted address

## 4. Products & Categories Components

### CategoriesTable
- **Description:** Table listing all product categories
- **Shadcn Components:** Table, Avatar, Button
- **Columns:** Category, Total Products, Total Earning, Actions
- **Features:** Category icons, formatted numbers, edit/delete actions

### ProductsTable
- **Description:** Product inventory table (implied from categories view)
- **Shadcn Components:** Table, Badge, DropdownMenu
- **Features:** Product images, stock status, price, actions

## 5. Transactions Components

### TransactionsList
- **Description:** List of recent transactions with icons
- **Shadcn Components:** Card, Avatar, ScrollArea
- **Features:** Transaction type icons, amounts (positive/negative), descriptions

### InvoicesTable
- **Description:** Table of invoices with status
- **Shadcn Components:** Table, Badge, Button
- **Columns:** Invoice #, Total, Issued Date, Actions
- **Features:** Status badges, view/download actions

## 6. Shadcn UI Primitives Required

### Core Components
- [ ] Button
- [ ] Card (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [ ] Input
- [ ] Label
- [ ] Table (TableHeader, TableBody, TableRow, TableHead, TableCell)
- [ ] Badge
- [ ] Avatar (AvatarImage, AvatarFallback)
- [ ] DropdownMenu
- [ ] Select
- [ ] Checkbox
- [ ] ScrollArea
- [ ] Separator
- [ ] Sheet (for mobile sidebar)
- [ ] Dialog
- [ ] Tabs
- [ ] Skeleton (for loading states)

### Advanced Components
- [ ] Command (for global search)
- [ ] Popover
- [ ] Tooltip
- [ ] Calendar
- [ ] DatePicker
- [ ] Pagination

## 7. Custom Components to Build

### StatusBadge
- **Description:** Colored badge for order/payment status
- **Variants:** success, warning, error, info
- **Props:** `status`, `variant`

### TrendIndicator
- **Description:** Arrow icon with percentage change
- **Props:** `value`, `direction` (up/down)
- **Colors:** Green for positive, red for negative

### EmptyState
- **Description:** Placeholder for empty data tables
- **Features:** Icon, message, optional CTA button

### LoadingSkeleton
- **Description:** Skeleton loaders for each component type
- **Variants:** Card, Table, Chart

### SearchBar
- **Description:** Global search with keyboard shortcut
- **Shadcn Components:** Command, CommandInput, CommandList
- **Features:** Cmd+K trigger, grouped results

## 8. Icons (Lucide React)

Required icons:
- Navigation: Home, ShoppingCart, Package, Users, BarChart3, Settings, LogOut
- Actions: Search, Bell, MoreVertical, Edit, Trash2, Eye, Download
- Status: CheckCircle, Clock, XCircle, TruckIcon, MapPin
- Trends: TrendingUp, TrendingDown
- Payment: CreditCard, Wallet, DollarSign
- UI: ChevronDown, ChevronRight, Menu, X

## 9. Component File Structure

```
components/
├── ui/                    # Shadcn primitives
├── layout/
│   ├── app-layout.tsx
│   ├── sidebar.tsx
│   └── header.tsx
├── dashboard/
│   ├── stats-card.tsx
│   ├── revenue-chart.tsx
│   ├── profit-card.tsx
│   ├── expense-gauge.tsx
│   ├── generated-leads-card.tsx
│   ├── earning-reports-widget.tsx
│   ├── popular-products-list.tsx
│   └── orders-by-countries-list.tsx
├── orders/
│   ├── orders-list-table.tsx
│   ├── order-details-card.tsx
│   ├── customer-details-card.tsx
│   ├── shipping-activity-timeline.tsx
│   └── shipping-address-card.tsx
├── products/
│   ├── categories-table.tsx
│   └── products-table.tsx
├── transactions/
│   ├── transactions-list.tsx
│   └── invoices-table.tsx
└── shared/
    ├── status-badge.tsx
    ├── trend-indicator.tsx
    ├── empty-state.tsx
    ├── loading-skeleton.tsx
    └── search-bar.tsx
```
