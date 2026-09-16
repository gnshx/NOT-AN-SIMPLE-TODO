---
name: design-system-guidelines
description: "Architecture and governance of scalable design systems: design token taxonomy, 4px/8px grid, semantic color scales, and component API contracts."
category: design-systems
risk: safe
tags: [design-system, tokens, architecture, governance, ui]
---

# Scalable Design System Guidelines

Principles for structuring, naming, and governing production design systems.

## 1. Design Token Taxonomy (3 Tiers)

1. **Global / Primitive Tokens**: Pure values with no context:
   - `color-blue-500: #3b82f6`
   - `space-4: 16px`
2. **Semantic / Alias Tokens**: Tokens mapped to intent:
   - `color-action-primary: var(--color-blue-500)`
   - `color-surface-elevated: var(--color-gray-900)`
   - `color-feedback-error: var(--color-red-600)`
3. **Component Tokens**: Specific component overrides:
   - `button-primary-bg: var(--color-action-primary)`
   - `card-padding: var(--space-4)`

## 2. Layout Grid & Spacing

- **Base Unit**: 4px micro-grid with an 8px macro-rhythm (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Consistent Elevation Scale**: `sm`, `md`, `lg`, `xl`, `2xl`.
- **Predictable Component Props**: Standardize prop names across all UI controls (`variant`, `size`, `isLoading`, `isDisabled`, `hasError`).
