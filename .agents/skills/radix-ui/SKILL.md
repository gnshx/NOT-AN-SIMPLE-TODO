---
name: radix-ui
description: "Radix UI Primitives: accessible, unstyled UI components for React. WAI-ARIA compliance, focus traps, portal management, and keyboard event handling."
category: frontend
risk: safe
tags: [react, radix, accessibility, headless, primitives]
---

# Radix UI Primitives

Radix UI provides robust, unstyled foundation primitives designed for complete WAI-ARIA accessibility, keyboard navigation, and customizable design systems.

## 1. Key Primitives & When to Use

- **Dialog / AlertDialog**: Modal overlays, confirmation prompts, screen-dimming dialogs with focus trapping and ESC key dismissal.
- **DropdownMenu / ContextMenu**: Accessible action menus with nested submenus, radio groups, and arrow key navigation.
- **Popover**: Non-modal interactive popups anchored to trigger elements.
- **Tooltip**: Hover and keyboard focus announcements with collision detection.
- **Tabs**: Tabbed interfaces with automatic/manual keyboard activation and ARIA role mappings.
- **Accordion**: Expandable FAQ/details sections with single or multi-expand support.
- **Select**: Accessible custom select element with typeahead search, scrolling viewports, and custom icons.

## 2. Critical Accessibility Rules

1. **Always Provide Accessible Names**:
   - Every `DialogContent` must include a `DialogTitle` (or `aria-describedby` / `aria-labelledby`). If visually hidden, use `<VisuallyHidden>`.
2. **Focus Management**:
   - Radix automatically restores focus to the trigger element when dialogs/popovers close. Do not override this manually unless navigating to a new route.
3. **Collision Detection**:
   - Use `sideOffset`, `alignOffset`, and `collisionPadding` on Popper elements to guarantee popovers never overflow off-screen viewports.
