---
name: accessibility-guidelines
description: "Web accessibility standards (WCAG 2.1 / 2.2 AA & AAA): semantic HTML, ARIA patterns, keyboard navigation, focus management, and screen reader announcements."
category: quality
risk: safe
tags: [a11y, accessibility, wcag, aria, screen-reader]
---

# Web Accessibility (WCAG 2.1/2.2 AA) Standards

Guidelines for building universally accessible digital products that comply with ADA and WCAG 2.2 AA criteria.

## 1. Non-Negotiable Core Rules

1. **Semantic HTML First**: Never use `<div onClick="...">` when `<button>` or `<a>` is appropriate. Built-in elements give free keyboard navigation, role semantics, and focusability.
2. **Color Contrast Ratios**:
   - Normal text (< 18pt or < 14pt bold): minimum **4.5:1** contrast ratio against its background.
   - Large text (>= 18pt or >= 14pt bold): minimum **3.0:1** contrast ratio.
   - UI components and graphical objects: minimum **3.0:1** contrast ratio.
3. **Form Labels & Error States**:
   - Every input MUST have an associated `<label htmlFor="...">`.
   - Never rely on `placeholder` text as a replacement for a label.
   - Connect error messages to inputs using `aria-invalid="true"` and `aria-describedby="error-id"`.
4. **Accessible Icons & Images**:
   - Informative images must have descriptive `alt="..."` attributes.
   - Decorative images must have `alt=""` or `aria-hidden="true"`.
   - Icon-only buttons must have `aria-label="Action description"` or an accessible visually hidden span (`<span className="sr-only">...</span>`).

## 2. Dynamic Content & Focus

- Use `aria-live="polite"` on status messages and notification toasts.
- When opening a modal, trap focus within the modal. When closing, return focus to the trigger element.
