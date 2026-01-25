# 🚀 START HERE: Ecommerce Dashboard Development Prompt

**Project:** Vuexy-Inspired Ecommerce Admin Dashboard  
**Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS + Shadcn UI  
**Generated:** 2026-01-24

---

## 👤 Your Role

You are an **expert Full-Stack "Applied AI" Engineer** specializing in modern React/Next.js applications. Your mission is to build a **high-fidelity, production-ready eCommerce admin dashboard** that matches the provided Vuexy inspiration screenshots with pixel-perfect accuracy.

---

## 📂 STEP 1: Initialize Context (MANDATORY)

Before writing **ANY** code, you **MUST** read the following context files in the `.brainchain/` directory:

1. **[`data-model.md`](file:///.brainchain/data-model.md)** - Complete data structures, TypeScript interfaces, and entity relationships
2. **[`design-tokens.md`](file:///.brainchain/design-tokens.md)** - Exact color palette, typography, spacing, and component styles
3. **[`ui-inventory.md`](file:///.brainchain/ui-inventory.md)** - Full component list with Shadcn UI mapping
4. **[`project-requirements.md`](file:///.brainchain/project-requirements.md)** - Technical stack, priority features, and success criteria

**⚠️ CRITICAL:** These files are your source of truth. Do not deviate from the specifications.

---

## 📋 STEP 2: Universal Standards & Guardrails

You must **strictly adhere** to these universal standards:

### Code Quality Standards
Refer to the **framework-rules.md** in the Universal Repo:
- Use Next.js **App Router** (`/app` directory)
- **Server Components by default**, only use `'use client'` when necessary
- **TypeScript strict mode** - No `any` types allowed
- **Tailwind CSS** for styling (no arbitrary values like `w-[342px]`)
- **Shadcn UI** components (Radix UI + Tailwind)
- **Lucide React** for icons
- **Zustand** for global state management
- **React Query** for server-state/data-fetching

### Accessibility Standards
Refer to the **accessibility-std.md** in the Universal Repo:
- **WCAG 2.1 AA compliance** (4.5:1 contrast ratio minimum)
- **Semantic HTML** (`<nav>`, `<main>`, `<header>`, `<table>`)
- **ARIA labels** for all icons without text
- **Focus states** on all interactive elements
- **Tap targets** minimum 44x44 pixels
- **Keyboard navigation** support (Tab order, modal focus trapping)

### Dashboard Layout Patterns
Refer to the **dashboard-patterns.md** in the Universal Repo:
- **F-Pattern Hierarchy** (Logo top-left, user actions top-right, sidebar left)
- **KPI Cards** at the top in a 4-column responsive grid
- **Sticky table headers** for tables with 10+ rows
- **Pagination** at bottom-right of tables
- **Active navigation state** with visual distinction
- **Collapsible sidebar** for desktop

---

## 🛠️ STEP 3: Execution Plan

Follow this **4-phase implementation approach**:

### Phase 1: Foundation & Authentication (Priority: CRITICAL)

**Objective:** Set up the project structure and authentication system

**Tasks:**
1. Initialize Next.js 16 project with TypeScript
2. Install and configure dependencies:
   - Tailwind CSS
   - Shadcn UI (init with default config)
   - Prisma (SQLite for development)
   - NextAuth.js
   - Zustand
   - React Query
   - Recharts
   - Lucide React
3. Set up Prisma schema based on `data-model.md`:
   - User model with role enum (ADMIN, MANAGER, VIEWER)
   - Order, OrderItem, Product, Category models
   - Transaction, ShippingActivity, Address models
4. Create database seeder with realistic data:
   - 5 users (2 Admin, 2 Manager, 1 Viewer)
   - 100+ orders with varied statuses
   - 150+ products across 12 categories
   - 75+ transactions
   - 12 months of revenue data
5. Configure NextAuth.js with credentials provider:
   - JWT sessions
   - Role-based access control
   - Protected route middleware
6. Create `app/layout.tsx` with global styles
7. Build authentication pages:
   - `/login` - Login form with email/password
   - Protected routes wrapper

**Verification:**
- Run `npm run dev` - Server starts without errors
- Run `npx prisma db push` - Database schema created
- Run `npx prisma db seed` - Seed data populated
- Login works with seeded user credentials
- Protected routes redirect to login when unauthenticated

---

### Phase 2: Layout Shell & Navigation (Priority: CRITICAL)

**Objective:** Build the main application layout with sidebar and header

**Tasks:**
1. Install required Shadcn UI components:
   ```bash
   npx shadcn@latest add button card input label avatar dropdown-menu badge sheet scroll-area separator
   ```
2. Create layout components in `components/layout/`:
   - **`app-layout.tsx`** - Main shell with sidebar + content area
   - **`sidebar.tsx`** - Left navigation with logo, menu items, collapse toggle
     - Navigation items: Dashboard, Orders, Products, Categories, Transactions
     - Active state highlighting (purple background for active item)
     - Collapsible on desktop, Sheet drawer on mobile
   - **`header.tsx`** - Top bar with search, notifications, user menu
     - Global search input
     - Notification bell with badge
     - User avatar with dropdown (profile, settings, logout)
3. Apply design tokens from `design-tokens.md`:
   - Configure `tailwind.config.ts` with color palette
   - Set up CSS variables in `globals.css`
   - Use purple primary color (#7C3AED)
4. Implement responsive behavior:
   - Mobile: Hamburger menu, full-width content
   - Desktop: Fixed sidebar (260px), collapsible to 80px
5. Add keyboard navigation:
   - Tab order flows logically
   - Focus states visible on all interactive elements

**Verification:**
- Sidebar renders with all navigation items
- Active route is highlighted correctly
- Sidebar collapses/expands on desktop
- Mobile menu opens/closes properly
- User dropdown shows role badge
- Logout functionality works

---

### Phase 3: Dashboard Overview (Priority: CRITICAL)

**Objective:** Build the main dashboard page with KPI cards and charts

**Tasks:**
1. Install additional Shadcn components:
   ```bash
   npx shadcn@latest add table checkbox skeleton tooltip
   ```
2. Create dashboard components in `components/dashboard/`:
   - **`stats-card.tsx`** - KPI card with icon, value, label, trend
     - Props: label, value, trend, icon, color
     - Show trend indicator (green up arrow for positive, red down for negative)
   - **`revenue-chart.tsx`** - Bar chart (Recharts)
     - Dual bars: Earning (purple) vs Expense (orange)
     - 12 months of data from seed
     - Legend, tooltip, responsive container
   - **`profit-card.tsx`** - Line/Area chart with percentage
   - **`expense-gauge.tsx`** - Circular progress (donut chart)
   - **`generated-leads-card.tsx`** - Donut chart with center text
   - **`earning-reports-widget.tsx`** - Mini bar chart
   - **`popular-products-list.tsx`** - List with product images
   - **`orders-by-countries-list.tsx`** - Geographic list with badges
3. Create `app/(dashboard)/page.tsx`:
   - 4-column grid for KPI cards (responsive: 1 col mobile, 2 tablet, 4 desktop)
   - Revenue chart in full-width card
   - 3-column grid for Profit, Expense, Leads cards
   - 3-column grid for Earning Reports, Popular Products, Orders by Countries
4. Fetch data using React Query:
   - Create API routes in `app/api/dashboard/`
   - Use Prisma to query aggregated data
   - Implement loading states with Skeleton components
5. Apply exact styling from `design-tokens.md`:
   - Card padding: 1.5rem
   - Card shadow: subtle
   - Border radius: 0.5rem
   - Font sizes match specification

**Verification:**
- Dashboard loads with real data from database
- All KPI cards display correct values
- Revenue chart renders with 12 months of data
- Charts are responsive and interactive (hover tooltips)
- Loading skeletons appear during data fetch
- No console errors or TypeScript warnings

---

### Phase 4: Orders Management (Priority: CRITICAL)

**Objective:** Build orders list and detail views

**Tasks:**
1. Install remaining Shadcn components:
   ```bash
   npx shadcn@latest add pagination select command dialog tabs
   ```
2. Create orders components in `components/orders/`:
   - **`orders-list-table.tsx`** - Paginated table
     - Columns: Checkbox, Order #, Date, Customer (with avatar), Payment, Status, Method, Actions
     - Sortable columns (click header to sort)
     - Filter by status (dropdown)
     - Search by order number or customer name
     - Pagination (10 items per page)
     - Row actions: View, Edit, Delete (role-based visibility)
   - **`order-details-card.tsx`** - Order information
     - Order items table
     - Subtotal, shipping, tax, total calculations
   - **`customer-details-card.tsx`** - Customer info sidebar
   - **`shipping-activity-timeline.tsx`** - Vertical timeline
   - **`shipping-address-card.tsx`** - Address display
3. Create shared components in `components/shared/`:
   - **`status-badge.tsx`** - Colored badge for statuses
     - Variants: success (green), warning (amber), error (red), info (blue)
   - **`trend-indicator.tsx`** - Arrow with percentage
   - **`empty-state.tsx`** - No data placeholder
   - **`loading-skeleton.tsx`** - Loading states
4. Create pages:
   - `app/(dashboard)/orders/page.tsx` - Orders list
   - `app/(dashboard)/orders/[id]/page.tsx` - Order details
5. Implement API routes:
   - `app/api/orders/route.ts` - GET (list with filters), POST (create)
   - `app/api/orders/[id]/route.ts` - GET (single), PATCH (update), DELETE
6. Add role-based access control:
   - ADMIN: Full CRUD access
   - MANAGER: Read and update orders
   - VIEWER: Read-only access
7. Implement real-time updates:
   - Polling mechanism (every 30 seconds)
   - Toast notifications for new orders
   - Optimistic UI updates

**Verification:**
- Orders table displays all orders from database
- Sorting works on all sortable columns
- Filtering by status updates table correctly
- Search finds orders by number or customer name
- Pagination navigates through pages
- Clicking order row navigates to detail page
- Order details show complete information
- Shipping timeline displays activity history
- Role-based permissions work correctly (test with different user roles)
- Real-time updates reflect new orders

---

### Phase 5: Polish & Optimization (Priority: SECONDARY)

**Objective:** Add final touches and optimize performance

**Tasks:**
1. Add micro-animations:
   - Hover effects on cards and buttons
   - Smooth transitions for sidebar collapse
   - Fade-in animations for page loads
2. Implement global search (Cmd+K):
   - Command palette component
   - Search across orders, products, customers
   - Grouped results by category
3. Add empty states for all data tables
4. Optimize images with Next.js Image component
5. Add error boundaries for graceful error handling
6. Implement dark mode support (optional)
7. Run Lighthouse audit and optimize:
   - Target: Performance > 90, Accessibility > 95
8. Add loading states for all async operations
9. Test keyboard navigation thoroughly
10. Verify WCAG compliance with accessibility tools

**Verification:**
- Lighthouse scores meet targets
- No console errors or warnings
- All animations are smooth (60fps)
- Global search works and is keyboard accessible
- Empty states display when no data
- Error boundaries catch and display errors gracefully
- Application is fully keyboard navigable

---

## 🚨 Critical Constraints

### Visual Fidelity
- **Pixel-perfect match** to the Vuexy inspiration screenshots
- Use exact colors from `design-tokens.md`
- Match spacing, typography, and component sizes precisely
- Icons must be from Lucide React library

### No Hallucinations
- Use **ONLY** technologies specified in `framework-rules.md`
- Do not invent data fields not in `data-model.md`
- Do not use placeholder comments like `// Logic goes here`
- Write actual, functional code for all features

### Clean Code
- Export reusable components to `@/components`
- Use descriptive variable and function names
- Add JSDoc comments for complex logic
- Follow TypeScript strict mode (no `any` types)
- Use proper error handling and loading states

### Real Data
- Map components to fields in `data-model.md`
- Use Prisma queries to fetch real database data
- No hardcoded mock data in components
- Seed database with realistic, varied data

---

## 📁 Expected Directory Structure

```
ecommerce-dashboard/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── orders/
│   │   │   ├── page.tsx        # Orders list
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Order details
│   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   └── transactions/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   ├── stats/
│   │   │   │   └── route.ts
│   │   │   └── revenue/
│   │   │       └── route.ts
│   │   └── orders/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── layout.tsx              # Root layout
│   └── globals.css
├── components/
│   ├── ui/                     # Shadcn primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── app-layout.tsx
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   ├── revenue-chart.tsx
│   │   ├── profit-card.tsx
│   │   └── ...
│   ├── orders/
│   │   ├── orders-list-table.tsx
│   │   ├── order-details-card.tsx
│   │   └── ...
│   └── shared/
│       ├── status-badge.tsx
│       ├── trend-indicator.tsx
│       ├── empty-state.tsx
│       └── loading-skeleton.tsx
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   ├── utils.ts                # cn() utility
│   └── constants.ts
├── hooks/
│   ├── use-orders.ts           # React Query hooks
│   ├── use-dashboard-stats.ts
│   └── use-auth.ts
├── types/
│   └── index.ts                # Global TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/
├── .brainchain/                # Context files (READ FIRST!)
│   ├── data-model.md
│   ├── design-tokens.md
│   ├── ui-inventory.md
│   └── project-requirements.md
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ User authentication with role-based access works
- ✅ Dashboard displays real-time statistics from database
- ✅ Orders can be viewed, filtered, searched, and sorted
- ✅ Order details show complete information with timeline
- ✅ Charts render correctly with real data
- ✅ Real-time updates work (polling every 30s)
- ✅ Role-based permissions enforced (Admin, Manager, Viewer)

### Technical Requirements
- ✅ All TypeScript strict mode checks pass
- ✅ No console errors or warnings in browser
- ✅ Lighthouse Performance score > 90
- ✅ Lighthouse Accessibility score > 95
- ✅ All Shadcn components properly integrated
- ✅ Database seeder runs successfully
- ✅ Prisma migrations work correctly

### UX Requirements
- ✅ Interface matches Vuexy inspiration screenshots
- ✅ Responsive on mobile (375px), tablet (768px), desktop (1280px+)
- ✅ Loading states provide visual feedback
- ✅ Empty states are informative and helpful
- ✅ Accessibility standards met (WCAG 2.1 AA)
- ✅ Keyboard navigation works throughout application

---

## 🚀 Getting Started

**Your first move:**

1. Read all files in `.brainchain/` directory
2. Initialize Next.js 16 project with TypeScript
3. Set up Prisma with SQLite database
4. Create database schema based on `data-model.md`
5. Build authentication system with NextAuth.js
6. Create layout shell (sidebar + header)
7. Build dashboard overview page
8. Implement orders management

**Ready to build something world-class? Let's start with Phase 1: Foundation & Authentication!** 🎨✨

---

## 📚 Reference Files

- **Inspiration Screenshots:** See attached Vuexy dashboard images
- **Data Model:** `.brainchain/data-model.md`
- **Design Tokens:** `.brainchain/design-tokens.md`
- **UI Inventory:** `.brainchain/ui-inventory.md`
- **Requirements:** `.brainchain/project-requirements.md`
- **Framework Rules:** Universal Repo `framework-rules.md`
- **Accessibility:** Universal Repo `accessibility-std.md`
- **Dashboard Patterns:** Universal Repo `dashboard-patterns.md`

---

**Remember:** Look at the images, read the context, follow the standards, and build with precision. No shortcuts, no placeholders, just production-ready code. 🚀
