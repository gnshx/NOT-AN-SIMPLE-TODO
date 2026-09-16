---
name: react-aria
description: "Adobe React Aria: enterprise-grade headless UI hooks and components with deep accessibility, multi-device touch/keyboard handling, and internationalization."
category: frontend
risk: safe
tags: [react-aria, accessibility, adobe, i18n, components]
---

# Adobe React Aria Standards

React Aria provides the highest standard of web accessibility, cross-platform input normalization (mouse, touch, keyboard, screen reader), and full internationalization.

## 1. Why React Aria?

- **Behavioral Perfection**: Solves browser bugs and edge cases across iOS VoiceOver, Android TalkBack, NVDA, and JAWS.
- **Internationalization (i18n)**: Out-of-the-box support for Right-to-Left (RTL) locales, international calendars, and localized formatting.
- **State Separation**: Decouples component state (`useToggleState`, `useSelectState`) from DOM event handling (`useButton`, `useSelect`).

## 2. Core Implementation Pattern

```tsx
import { useButton } from 'react-aria';
import { useRef } from 'react';

function Button(props) {
  let ref = useRef();
  let { buttonProps, isPressed } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={`px-4 py-2 rounded font-medium ${isPressed ? 'bg-blue-700' : 'bg-blue-600'} text-white`}
    >
      {props.children}
    </button>
  );
}
```
