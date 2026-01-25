# 📋 Project Requirements - Ecommerce Dashboard

**Project Name:** Ecommerce Dashboard (Vuexy-inspired)  
**Interview Date:** 2026-01-24  
**Architect:** Universal AI Architect

---

## 1. Project Overview

A comprehensive eCommerce admin dashboard for managing orders, products, customers, and analytics. The application is inspired by the Vuexy dashboard template and will serve as a full-featured admin panel for eCommerce operations.

## 2. Technical Stack

### Framework & Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS
- **Component Library:** Shadcn UI (Radix UI + Tailwind)
- **Icons:** Lucide React

### State Management
- **Global State:** Zustand
- **Server State:** React Query (TanStack Query)

### Database & Backend
- **Database:** SQLite (Development phase)
- **ORM:** Prisma
- **Data Source:** Database seeder (no external API initially)
- **Authentication:** NextAuth.js with role-based access control

### Charts & Visualization
- **Chart Library:** Recharts (recommended for React/Next.js integration)

### Real-time Features
- **Implementation:** Server-Sent Events (SSE) or polling for order updates
- **Future:** WebSocket support for production

### Deployment
- **Platform:** Netlify
- **Environment:** Edge Functions for API routes

---

## 3. Priority Features (15-Minute Build Focus)

### Phase 1: Dashboard Overview (CRITICAL)
- **KPI Cards:** Sales, Customers, Products, Revenue with trend indicators
- **Revenue Chart:** Bar chart showing earning vs expense over 12 months
- **Profit Card:** Line chart with percentage change
- **Expense Gauge:** Circular progress indicator
- **Generated Leads:** Donut chart with monthly report
- **Earning Reports:** Weekly earnings mini chart
- **Popular Products List:** Top 5 products with images and sales
- **Orders by Countries:** Geographic distribution with status badges

### Phase 2: Orders Management (CRITICAL)
- **Orders List Table:** Paginated table with filters
  - Columns: Order #, Date, Customer, Payment, Status, Method, Actions
  - Features: Search, sort, filter by status, bulk actions
- **Order Details View:** Complete order information
  - Order items table with product details
  - Subtotal, shipping, tax, total calculation
  - Shipping activity timeline
  - Customer details sidebar
  - Shipping/billing address cards
  - Payment method and status

### Phase 3: Products & Categories (Secondary)
- Categories table with total products and earnings
- Product management (future phase)

### Phase 4: Transactions (Secondary)
- Transaction list with type icons
- Invoice table (future phase)

---

## 4. Authentication & User Roles

### Authentication Requirements
- **Provider:** NextAuth.js with credentials provider
- **Session:** JWT-based sessions
- **Protected Routes:** All dashboard routes require authentication

### User Roles & Permissions

#### ADMIN
- Full access to all features
- Can create, read, update, delete all entities
- Can manage users and roles
- Can view all analytics and reports

#### MANAGER
- Can view and manage orders
- Can view and manage products/categories
- Can view analytics and reports
- Cannot manage users or system settings

#### VIEWER
- Read-only access to dashboard
- Can view orders, products, and analytics
- Cannot create, update, or delete any entities

### Role-Based UI
- Show/hide action buttons based on role
- Disable edit/delete actions for VIEWER role
- Display role badge in user profile menu

---

## 5. Real-time Features

### Order Updates
- Real-time notification when new orders are placed
- Live status updates for order processing
- Toast notifications for order state changes

### Dashboard Stats
- Auto-refresh KPI cards every 30 seconds
- Live revenue chart updates
- Real-time inventory alerts (low stock)

### Implementation Approach
- **Development:** Polling mechanism (every 30s)
- **Production:** Server-Sent Events (SSE) or WebSocket

---

## 6. Data Model Summary

### Core Entities
1. **User** - Authentication and role management
2. **Order** - Order lifecycle and tracking
3. **OrderItem** - Individual products in orders
4. **Product** - Product catalog
5. **Category** - Product categorization
6. **Transaction** - Financial transactions
7. **ShippingActivity** - Order tracking timeline
8. **Address** - Shipping and billing addresses

### Relationships
- User → Orders (1:M)
- Order → OrderItems (1:M)
- Order → ShippingActivity (1:M)
- Product → Category (M:1)
- Product → OrderItems (1:M)

---

## 7. Database Seeding Requirements

### Initial Seed Data
- **Users:** 5 users (2 Admin, 2 Manager, 1 Viewer)
- **Orders:** 100+ orders with various statuses
- **Products:** 150+ products across 12 categories
- **Categories:** 12 categories (Smart Phone, Clothing, Home & Kitchen, Beauty, Books, Games, Baby Products, Groceries, Computer Accessories, Fitness Tracker)
- **Transactions:** 75+ transactions (income and expenses)
- **Shipping Activities:** Realistic tracking data for orders
- **Revenue Data:** 12 months of earning/expense data

### Data Characteristics
- Realistic customer names and addresses
- Varied order statuses (30% Delivered, 25% Pending, 20% Out for Delivery, 15% Ready to Pickup, 10% Cancelled)
- Multiple payment methods (PayPal, Mastercard, Visa, COD)
- Realistic product prices and categories
- Time-distributed orders (last 6 months)

---

## 8. Design & UX Requirements

### Visual Fidelity
- Match Vuexy dashboard aesthetics
- Purple/violet primary color (#7C3AED)
- Clean, modern card-based layout
- Subtle shadows and rounded corners

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive tables (horizontal scroll or card stacks)
- Touch-friendly tap targets (44x44px minimum)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly (ARIA labels)
- Focus states on all interactive elements
- High contrast mode support

### Loading States
- Skeleton loaders for all data components
- Loading spinners for actions
- Optimistic UI updates where possible

### Empty States
- "No data found" messages for empty tables
- Helpful illustrations or icons
- Call-to-action buttons where appropriate

---

## 9. Performance Requirements

### Core Web Vitals
- **LCP:** < 2.5s (Largest Contentful Paint)
- **FID:** < 100ms (First Input Delay)
- **CLS:** < 0.1 (Cumulative Layout Shift)

### Optimization Strategies
- Server Components by default
- Client Components only when necessary
- Image optimization (Next.js Image component)
- Code splitting and lazy loading
- Efficient database queries with Prisma

---

## 10. Future Enhancements (Post-MVP)

- Customer management module
- Product inventory management
- Advanced analytics and reporting
- Email notifications for orders
- Export data to CSV/PDF
- Multi-language support
- Dark mode toggle
- Advanced search and filtering
- Bulk operations for orders
- Integration with payment gateways
- Integration with shipping providers

---

## 11. Success Criteria

### Functional
- ✅ User can log in with role-based access
- ✅ Dashboard displays real-time statistics
- ✅ Orders can be viewed, filtered, and searched
- ✅ Order details show complete information
- ✅ Charts render correctly with real data
- ✅ Real-time updates work as expected

### Technical
- ✅ All TypeScript strict mode checks pass
- ✅ No console errors in browser
- ✅ Lighthouse score > 90
- ✅ All Shadcn components properly integrated
- ✅ Database seeder runs successfully
- ✅ Authentication flow works correctly

### UX
- ✅ Interface matches Vuexy inspiration
- ✅ Responsive on mobile, tablet, and desktop
- ✅ Loading states provide feedback
- ✅ Empty states are informative
- ✅ Accessibility standards met
