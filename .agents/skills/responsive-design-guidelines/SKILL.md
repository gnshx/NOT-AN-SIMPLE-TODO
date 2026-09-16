---
name: responsive-design-guidelines
description: "Modern responsive web design: fluid typography, clamp() calculations, CSS container queries, touch adaptations, and zero horizontal overflow."
category: frontend
risk: safe
tags: [responsive, mobile, layout, container-queries, css]
---

# Modern Responsive Design Guidelines

Rules and patterns for building websites that look flawless across everything from a 320px mobile screen to a 4K ultra-wide monitor.

## 1. Fluid Layouts & Intrinsic Design

1. **Fluid Typography & Spacing via `clamp()`**:
   - Instead of jarring breakpoint jumps, use fluid math:
     `font-size: clamp(1rem, 0.8rem + 1vw, 1.5rem);`
     `padding: clamp(1rem, 0.5rem + 2vw, 3rem);`
2. **Zero Horizontal Overflow (`overflow-x: hidden`)**:
   - Never use fixed pixel widths (`w-[600px]`). Use `max-w-[600px] w-full`.
   - Use `min-w-0` on flex children to prevent text truncation bugs from blowing out the layout.
3. **Container Queries (`@container`)**:
   - Use container queries when styling reusable cards, widgets, and sidebars so they adapt based on available component space, not viewport width.

## 2. Touch & Mobile Ergonomics

- **Minimum Touch Targets**: All interactive elements must measure at least 44x44px.
- **Bottom Navigation / Thumb Zone**: Primary mobile actions and drawer triggers must be positioned within natural thumb reach.
- **Font Sizing for Inputs**: Never set mobile input font size below 16px to prevent iOS Safari from automatically zooming into the page.
