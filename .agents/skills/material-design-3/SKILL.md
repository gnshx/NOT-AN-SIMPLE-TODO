---
name: material-design-3
description: "Material Design 3 (M3) specifications: dynamic color, tonal palettes, surface elevation, typography scale, shape tokens, and navigation patterns."
category: design-systems
risk: safe
tags: [design-system, google, material-design, m3, ui]
---

# Google Material Design 3 (M3) Guidelines

Material Design 3 introduces personalized, adaptive, and expressive digital product experiences through dynamic color algorithms and tonal elevation.

## 1. Key Concepts

1. **Dynamic Color & Tonal Palettes**:
   - Colors are generated algorithmically from a single key seed color into five tonal palettes: Primary, Secondary, Tertiary, Neutral, and Neutral Variant.
   - Contrast is guaranteed by pairing light tones (`tone 90` or `tone 100`) with dark tones (`tone 10` or `tone 20`).
2. **Surface Elevation via Tonal Tint**:
   - M3 avoids harsh drop shadows.
   - Elevation levels (Level 0 through Level 5) are represented by layering a semi-transparent tint of the primary color onto the neutral surface.
3. **Typography Scale (15 Roles)**:
   - **Display** (Large: 57px, Medium: 45px, Small: 36px) — Big impact numbers/titles.
   - **Headline** (Large: 32px, Medium: 28px, Small: 24px) — High-emphasis section headers.
   - **Title** (Large: 22px, Medium: 16px, Small: 14px) — Medium-emphasis card titles.
   - **Body** (Large: 16px, Medium: 14px, Small: 12px) — Main reading text.
   - **Label** (Large: 14px, Medium: 12px, Small: 11px) — Buttons, badges, and captions.

## 2. Shape Tokens & Interaction States

- **Corner Radii**: Fully rounded chips and pill buttons (`rounded-full`), cards (`rounded-2xl` = 16px), dialogs (`rounded-3xl` = 28px).
- **State Layers**: Semi-transparent overlays indicating Hover (8% opacity), Focus (12% opacity), and Pressed (12% opacity).
