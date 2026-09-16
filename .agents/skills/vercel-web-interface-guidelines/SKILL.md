---
name: vercel-web-interface-guidelines
description: "Vercel Web Interface Guidelines for world-class design engineering: craft, micro-interactions, layout shift prevention, focus rings, typography, dark mode, and fluid spacing."
category: frontend
risk: safe
tags: [design, ui, ux, vercel, frontend, design-engineering]
---

# Vercel Web Interface Guidelines

Design engineering standards inspired by Vercel's design ethos: ruthless attention to detail, instantaneous feedback, visual harmony, and dark mode sophistication.

## 1. Core Principles

1. **Speed is Craft**: A slow UI feels broken, regardless of visual polish. Every interaction must respond within 100ms.
2. **Subtle Elevation & Contrast**: Avoid harsh black borders or heavy drop shadows. Use subtle borders (`rgba(255, 255, 255, 0.08)` on dark, `rgba(0, 0, 0, 0.08)` on light) with layered ambient shadows.
3. **No Layout Shifts (CLS = 0)**:
   - Reserve space for async content with skeleton screens matching exact aspect ratios.
   - Specify explicit `width` and `height` on all image and media containers.
   - Use `font-display: swap` with matched fallback font metrics.
4. **Keyboard & Focus States**:
   - Every interactive element must be reachable and operable via keyboard.
   - Never suppress `:focus-visible`. Use high-contrast focus rings: `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`.
5. **Fluid Typography & Spacing**:
   - Use strict typographic scales (e.g. Geist Sans / Inter).
   - Headings must have tight letter-spacing (`tracking-tight` or `-0.02em`).
   - Line height must decrease as font size increases (Display: 1.1, Body: 1.5).

## 2. Micro-Interactions & Animation

- **Duration**: Micro-interactions must complete in 150ms–200ms. Page transitions must complete under 300ms.
- **Easing**: Use standard cubic-bezier curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)` for snappy spring-like entries).
- **Hover Transitions**: Only transition `transform`, `opacity`, and `box-shadow` to maintain 60–120 FPS GPU acceleration. Never transition `width`, `height`, or `margin`.

## 3. Dark Mode Engineering

- Dark background should not be pure `#000000` for content surfaces; use layered depths:
  - Base: `#000000`
  - Layer 1 (Cards, panels): `#0a0a0a` or `#111111`
  - Layer 2 (Modals, popovers): `#171717`
  - Layer 3 (Hover/Active states): `#262626`
- Use translucent white text:
  - Primary text: `rgba(255, 255, 255, 0.92)`
  - Secondary text: `rgba(255, 255, 255, 0.65)`
  - Muted/Tertiary text: `rgba(255, 255, 255, 0.45)`
