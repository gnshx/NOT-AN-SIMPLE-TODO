---
name: design-system-enforcement
description: "Tooling and automated rules for strictly enforcing design system tokens, preventing arbitrary utility classes, and disallowing ad-hoc colors."
category: quality
risk: safe
tags: [design-system, linting, tokens, tailwind, enforcement]
---

# Design System Enforcement Guide

Automating the prevention of "design drift" and arbitrary CSS overrides in teams and AI agents.

## 1. ESLint & Tailwind Linter Rules

- **Disallow Arbitrary Values**: Enforce ESLint rules that flag `bg-[#hex]`, `p-[13px]`, `text-[22px]`.
- **Enforce Component Imports**: Prohibit importing raw HTML `<button>` or `<input>` in feature pages; enforce `<Button>` and `<Input>` from `@/components/ui`.

## 2. Stylelint Token Verification

Require all CSS properties to use defined CSS custom properties:
```css
/* ❌ Prohibited */
.custom-card {
  background: #1e1e1e;
  padding: 18px;
}

/* ✅ Enforced */
.custom-card {
  background: var(--surface-card);
  padding: var(--space-4);
}
```
