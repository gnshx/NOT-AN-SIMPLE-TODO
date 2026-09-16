---
name: ant-design
description: "Ant Design 5 (AntD): enterprise web applications, CSS-in-JS design tokens, form orchestration, complex tables, tree selects, and modal workflows."
category: design-systems
risk: safe
tags: [ant-design, antd, enterprise, react, forms, tables]
---

# Ant Design 5 (AntD) Architecture

Ant Design is one of the most widely used enterprise UI libraries in the world, renowned for its exhaustive component catalog and enterprise-grade data handling.

## 1. Design Tokens via ThemeConfig

AntD v5 uses dynamic CSS-in-JS tokens:
```tsx
import { ConfigProvider, theme } from 'antd';

<ConfigProvider
  theme={{
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 6,
      fontFamily: 'Inter, sans-serif',
    },
  }}
>
  <App />
</ConfigProvider>
```

## 2. Advanced Form & Table Features

- **Form**: Automatic layout management (`horizontal`, `vertical`, `inline`), field-level dependency triggers, and integrated async validator rules.
- **Table**: Built-in column sorting, multi-column filtering, expandable child rows, column pinning (`fixed: 'left' | 'right'`), and virtualized scrolling for 10,000+ rows.
