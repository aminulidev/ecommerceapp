# 📊 Data Model - Ecommerce Dashboard

**Objective:** Define all entities, relationships, and data structures based on the Vuexy dashboard screenshots.

## 1. Core Entities

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string; // e.g., "#5434"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'READY_TO_PICKUP' | 'OUT_FOR_DELIVERY';
  paymentMethod: 'PAYPAL' | 'MASTERCARD' | 'VISA' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  total: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  orderDate: Date;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingActivity: ShippingActivity[];
  createdAt: Date;
  updatedAt: Date;
}
```

### OrderItem
```typescript
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  total: number;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  categoryId: string;
  price: number;
  stock: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  totalProducts: number;
  totalEarning: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  invoiceNumber: string; // e.g., "#4987"
  type: 'WALLET' | 'BANK_TRANSFER' | 'PAYPAL' | 'MASTERCARD';
  description: string;
  amount: number; // Positive for income, negative for expense
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Address
```typescript
interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}
```

### ShippingActivity
```typescript
interface ShippingActivity {
  id: string;
  orderId: string;
  status: string; // e.g., "Order was placed", "Pick-up", "Dispatched"
  description: string;
  timestamp: Date;
  location?: string;
}
```

### DashboardStats
```typescript
interface DashboardStats {
  sales: {
    value: number;
    label: string;
  };
  customers: {
    value: number;
    label: string;
  };
  products: {
    value: number;
    label: string;
  };
  revenue: {
    value: number;
    label: string;
  };
}
```

### RevenueData
```typescript
interface RevenueData {
  month: string;
  earning: number;
  expense: number;
}
```

### PopularProduct
```typescript
interface PopularProduct {
  id: string;
  name: string;
  image: string;
  itemNumber: string;
  price: number;
  sales: number;
}
```

### OrdersByCountry
```typescript
interface OrdersByCountry {
  id: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: 'DELIVERED' | 'SENDER' | 'RECEIVER';
}
```

## 2. Database Schema (SQLite - Prisma)

The Prisma schema will include:
- User authentication with role-based access
- Orders with full order lifecycle tracking
- Products and Categories with inventory management
- Transactions for financial tracking
- Shipping activities for order tracking

## 3. Relationships

- **User** → **Orders** (One-to-Many)
- **Order** → **OrderItems** (One-to-Many)
- **Order** → **ShippingActivity** (One-to-Many)
- **Product** → **Category** (Many-to-One)
- **Product** → **OrderItems** (One-to-Many)

## 4. Seed Data Requirements

Initial database seeder should include:
- 3-5 users with different roles (Admin, Manager, Viewer)
- 50+ orders with various statuses
- 100+ products across 10+ categories
- 50+ transactions
- Realistic shipping activities for orders
- Popular products data
- Revenue data for the last 12 months
