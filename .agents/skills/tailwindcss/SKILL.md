---
name: tailwindcss
description: "Tailwind CSS engineering standards: design tokens, responsive modifiers, container queries, arbitrary values vs theme extension, and dark mode."
category: frontend
risk: safe
tags: [tailwind, css, styling, design-tokens, responsive]
---

# Tailwind CSS Engineering Guidelines

Modern guidelines for writing scalable, maintainable, and maintainable Tailwind CSS.

## 1. Golden Rules

1. **No Arbitrary Value Chaos**:
   - Avoid ad-hoc values like `p-[17px]`, `w-[321px]`, `text-[#fa8072]`.
   - Always map spacing to the standard 4px scale (`p-4` = 16px, `p-5` = 20px) and colors to semantic design tokens.
2. **Order of Class Names**:
   - Use official Prettier Tailwind plugin (`prettier-plugin-tailwindcss`) to enforce deterministic class ordering:
     1. Layout / Box Model (`flex`, `grid`, `block`, `relative`)
     2. Sizing / Spacing (`w-full`, `max-w-md`, `p-4`, `m-2`)
     3. Typography (`text-sm`, `font-semibold`, `tracking-tight`)
     4. Visuals / Backgrounds (`bg-background`, `border`, `rounded-lg`, `shadow-sm`)
     5. Transitions / Interactive (`transition-colors`, `hover:bg-accent`, `focus-visible:ring-2`)
3. **Container Queries**:
   - Use `@container` and `@sm:`, `@md:` when styling cards or reusable widgets whose layout depends on parent width, not viewport width.
