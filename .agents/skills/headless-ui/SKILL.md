---
name: headless-ui
description: "Headless UI by Tailwind Labs: accessible, unstyled UI components, transition states, comboboxes, dialogs, and disclosure patterns."
category: frontend
risk: safe
tags: [headless-ui, tailwind, accessibility, react, components]
---

# Headless UI Engineering

Headless UI provides accessible components engineered to integrate directly with Tailwind CSS classes and transition states.

## 1. Component Set

- **Menu**: Dropdown menus with arrow-key navigation and keyboard shortcuts.
- **Listbox / Combobox**: Custom autocomplete select inputs with keyboard filtering and virtualized item rendering.
- **Dialog / Modal**: Focus-trapped modals with backdrop dimming and smooth transitions.
- **Disclosure / Accordion**: Collapsible content panels.
- **Switch**: Custom toggle switches with screen reader announcements.
- **Tab**: Accessible tabs with keyboard arrow selection.

## 2. Transition Best Practices

Always wrap dynamic panels in `<Transition>` or use Tailwind CSS `data-[state]` attributes for smooth mounting and unmounting animations:
```tsx
<Transition
  enter="transition duration-150 ease-out"
  enterFrom="transform scale-95 opacity-0"
  enterTo="transform scale-100 opacity-100"
  leave="transition duration-100 ease-in"
  leaveFrom="transform scale-100 opacity-100"
  leaveTo="transform scale-95 opacity-0"
>
  <MenuItems className="..." />
</Transition>
```
