---
name: aceternity-ui
description: "Aceternity UI: high-end animated React components built with Tailwind CSS and Framer Motion. 3D cards, beam effects, aurora backgrounds, and modern hero sections."
category: frontend
risk: safe
tags: [aceternity, animation, framer-motion, tailwind, ui]
---

# Aceternity UI Components & Patterns

Aceternity UI brings cutting-edge visual dynamism, subtle WebGL/canvas effects, and Framer Motion transitions to modern web applications.

## 1. Signature Components

- **3D Card Effect**: Interactive perspective rotation based on mouse hover coordinates.
- **Background Beams / Aurora Background**: Subtle, fluid gradient animations that create high-tech depth for landing headers.
- **Spotlight**: Radial gradient that tracks mouse coordinates over a dark surface.
- **Floating Navbar**: Sticky navigation header that hides on scroll down and smoothly animates in on scroll up.
- **Meteors & Glowing Stars**: High-performance CSS canvas/DOM particle backgrounds.

## 2. Implementation & Performance Rules

1. **GPU Acceleration**: Animate `transform` and `opacity` only. Keep canvas particle loops bounded to reasonable frame rates.
2. **Accessibility & Motion Preference**:
   - Always honor `prefers-reduced-motion`. Provide a static, elegant gradient fallback when reduced motion is requested.
3. **Responsive Degradation**:
   - Disable heavy 3D perspective shifts on mobile touch devices where mouse cursor tracking does not exist.
