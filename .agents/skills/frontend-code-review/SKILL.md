---
name: frontend-code-review
description: "Systematic frontend code review checklist: component modularity, state colocation, render performance, memory leak prevention, and clean CSS."
category: quality
risk: safe
tags: [code-review, frontend, react, performance, clean-code]
---

# Frontend Code Review Checklist

Engineering checklist for reviewing frontend pull requests and AI-generated code.

## 1. React & Architecture Checks

- [ ] **State Colocation**: Is state kept as close to where it is used as possible, rather than shoved into global context?
- [ ] **`useEffect` Misuse**: Is `useEffect` being abused for calculating derived state? (Derived state should be computed during render or wrapped in `useMemo`).
- [ ] **Memory Leaks**: Are all event listeners, WebSockets, and `setInterval` handles cleanly torn down in effect cleanup functions?
- [ ] **Component Sizing**: Does any single component exceed 200 lines? If so, break into sub-components.

## 2. Styling & CSS Checks

- [ ] **No Hardcoded Magic Numbers**: Are margins, padding, and colors mapped to design tokens?
- [ ] **Layout Shifts**: Are loading skeletons provided for all async data queries?
- [ ] **Interactive Feedback**: Do all buttons and links have hover, active, and focus-visible states?
