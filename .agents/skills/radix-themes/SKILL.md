---
name: radix-themes
description: "Radix Themes: modern, pre-styled accessible component library built on Radix primitives. Theme configuration, accent colors, scaling, and typography."
category: frontend
risk: safe
tags: [radix-themes, react, styling, design-tokens, ui]
---

# Radix Themes Design Standards

Radix Themes combines Radix Primitives with a unified design token system for building professional, responsive web apps rapidly.

## 1. Theme Configuration

```tsx
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

export default function App({ children }) {
  return (
    <Theme
      accentColor="indigo"
      grayColor="slate"
      panelBackground="translucent"
      scaling="100%"
      radius="medium"
    >
      {children}
    </Theme>
  );
}
```

## 2. Key Layout Primitives

- **Box, Flex, Grid**: Layout building blocks that accept responsive props (`display={{ initial: 'none', md: 'flex' }}`).
- **Container**: Centers content with predefined max-width breakpoints.
- **Section**: Standard vertical padding container for page sections.
- **Callout**: Contextual alert boxes with matching accent icons and borders.
- **Kbd**: Keyboard shortcut styling with proper typography and border styling.
