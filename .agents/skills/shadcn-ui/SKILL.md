---
name: shadcn-ui
description: "Master patterns for shadcn/ui: accessible, customizable React & Tailwind component systems, CVA configuration, Radix primitives, form validation, and data tables."
category: frontend
risk: safe
tags: [react, tailwind, shadcn, radix, components, ui]
---

# shadcn/ui Architecture & Patterns

Guide for building, extending, and styling applications using shadcn/ui components.

## 1. Core Architecture

- **Code Ownership**: Components live inside your own repository (`components/ui/`), not inside `node_modules`. Customize them directly.
- **Utility First**: Style primitives using Tailwind CSS merged via `cn(...)` (`clsx` + `tailwind-merge`).
- **Variants via CVA**: Use `class-variance-authority` (CVA) for all multi-variant components (Buttons, Badges, Cards).

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

## 2. Best Practices

1. **Polymorphic Components (`asChild`)**: Always use Radix's `Slot` primitive via `asChild` to render custom links (`<Link href="...">`) without invalid nested buttons or anchors.
2. **Form Integration**: Connect shadcn Form with `react-hook-form` and `zod` schema resolvers.
3. **Data Tables**: Wrap `@tanstack/react-table` with shadcn Table primitives for pagination, sorting, and column filtering.
