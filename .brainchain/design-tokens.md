# 🎨 Design Tokens - Ecommerce Dashboard

**Objective:** Extract and document all visual design elements from the Vuexy dashboard screenshots.

## 1. Color Palette

### Primary Colors
```css
--primary: 124 58 237;        /* Purple/Violet - Main brand color */
--primary-foreground: 255 255 255;
```

### Status Colors
```css
--success: 34 197 94;         /* Green - Delivered, Paid, Positive */
--warning: 251 191 36;        /* Amber - Pending, Processing */
--error: 239 68 68;           /* Red - Failed, Cancelled, Negative */
--info: 59 130 246;           /* Blue - Information, Downloads */
```

### Neutral Colors
```css
--background: 255 255 255;    /* White background */
--foreground: 15 23 42;       /* Dark text */
--muted: 241 245 249;         /* Light gray backgrounds */
--muted-foreground: 100 116 139;
--border: 226 232 240;
--card: 255 255 255;
--card-foreground: 15 23 42;
```

### Chart Colors
```css
--chart-1: 124 58 237;        /* Primary purple */
--chart-2: 251 191 36;        /* Amber/Orange */
--chart-3: 34 197 94;         /* Green */
--chart-4: 59 130 246;        /* Blue */
--chart-5: 236 72 153;        /* Pink */
```

## 2. Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px - Labels, captions */
--text-sm: 0.875rem;     /* 14px - Body text, table cells */
--text-base: 1rem;       /* 16px - Default body */
--text-lg: 1.125rem;     /* 18px - Subheadings */
--text-xl: 1.25rem;      /* 20px - Card titles */
--text-2xl: 1.5rem;      /* 24px - Section headers */
--text-3xl: 1.875rem;    /* 30px - Large stats */
--text-4xl: 2.25rem;     /* 36px - Hero numbers */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 3. Spacing Scale

```css
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
```

## 4. Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Cards, inputs */
--radius-lg: 0.75rem;    /* 12px - Large cards */
--radius-xl: 1rem;       /* 16px - Modal dialogs */
--radius-full: 9999px;   /* Circular elements */
```

## 5. Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## 6. Component-Specific Tokens

### Sidebar
```css
--sidebar-width: 260px;
--sidebar-collapsed-width: 80px;
--sidebar-bg: 255 255 255;
--sidebar-active-bg: 124 58 237;
--sidebar-active-text: 255 255 255;
```

### Cards
```css
--card-padding: 1.5rem;    /* 24px */
--card-gap: 1rem;          /* 16px */
--card-border: 1px solid var(--border);
--card-shadow: var(--shadow-sm);
```

### Tables
```css
--table-header-bg: 249 250 251;
--table-row-hover: 249 250 251;
--table-border: var(--border);
--table-padding-x: 1rem;
--table-padding-y: 0.75rem;
```

### Buttons
```css
--button-height: 2.5rem;   /* 40px */
--button-padding-x: 1rem;
--button-padding-y: 0.5rem;
--button-radius: var(--radius-md);
```

### Status Badges
```css
/* Success/Delivered */
--badge-success-bg: 220 252 231;
--badge-success-text: 22 101 52;

/* Warning/Pending */
--badge-warning-bg: 254 243 199;
--badge-warning-text: 146 64 14;

/* Error/Failed */
--badge-error-bg: 254 226 226;
--badge-error-text: 153 27 27;

/* Info */
--badge-info-bg: 219 234 254;
--badge-info-text: 30 64 175;
```

## 7. Animations & Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

## 8. Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 9. Z-Index Scale

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## 10. Icon Sizes

```css
--icon-xs: 1rem;     /* 16px */
--icon-sm: 1.25rem;  /* 20px */
--icon-md: 1.5rem;   /* 24px */
--icon-lg: 2rem;     /* 32px */
--icon-xl: 3rem;     /* 48px */
```
