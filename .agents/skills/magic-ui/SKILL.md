---
name: magic-ui
description: "Magic UI: 50+ animated landing page components built with React, Tailwind CSS, and Framer Motion. Marquee, Bento Grid, Animated Beams, and Border Beam."
category: frontend
risk: safe
tags: [magic-ui, landing-page, animation, react, tailwind]
---

# Magic UI Engineering Guide

Magic UI provides production-ready, beautifully animated components for marketing landing pages and high-impact dashboards.

## 1. Core Component Patterns

- **Bento Grid**: Asymmetric, responsive card layouts with dynamic hover animations, icons, and subtle border highlights.
- **Marquee**: Infinite horizontal or vertical ticker with seamless looping, pause-on-hover, and smooth CSS keyframe animations.
- **Animated Beam**: SVG path connecting multiple nodes with a pulsating gradient light beam.
- **Border Beam**: Luminous gradient line traveling continuously along the perimeter of cards and buttons.
- **Number Ticker / Word Rotate**: Smooth animated counters and headline dynamic word rotators.

## 2. Integration Best Practices

1. **Tailwind Config Extensions**:
   - Ensure `keyframes` and `animation` tokens for `marquee`, `border-beam`, and `pulse` are defined cleanly in CSS/Tailwind config.
2. **Performance in Production**:
   - Use `will-change: transform` sparingly on animated elements.
   - Utilize CSS animation loops rather than JS intervals whenever possible.
