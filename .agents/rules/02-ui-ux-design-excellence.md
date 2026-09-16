# Universal UI/UX Design Excellence & Anti-Slop Standard

> **MANDATORY POLICY FOR ALL FRONTEND WORK ACROSS ALL PROJECTS.**

## 1. Eliminate "AI Slop"
- NEVER output generic unstyled HTML, default blue browser links, or unstyled form buttons.
- Every interface must feel distinct, modern, and production-grade (inspired by Vercel, Linear, Stripe).
- Use curated HSL semantic color tokens (`--background`, `--foreground`, `--primary`, `--border`) instead of arbitrary raw hex colors.
- Default to sleek, refined dark modes with layered depth tokens:
  - Base: `#000000` / `#0a0a0a`
  - Cards/Surfaces: `#121212` with subtle 1px border (`rgba(255, 255, 255, 0.08)`)
  - Elevated/Active: `#1c1c1c`

## 2. Typography & Layout Rhythms
- Use modern fonts (Geist Sans, Inter, Outfit).
- Tighten heading tracking (`tracking-tight` / `-0.02em`) and decrease line-height as font size increases.
- Use fluid responsive spacing via CSS `clamp()` and container queries (`@container`).
- Guarantee minimum **44x44px** touch targets on mobile viewports.

## 3. Mandatory Component States
Every component, view, or data card must support:
1. **Loading State**: Skeleton screens matching exact content geometry (zero layout shifts).
2. **Empty State**: Clear heading + helpful explanation + primary action button.
3. **Error State**: Non-blocking message explaining what failed and how to recover.
4. **Interactive States**: Smooth hover, active, and high-contrast `:focus-visible` rings.
