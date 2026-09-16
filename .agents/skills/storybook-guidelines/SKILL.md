---
name: storybook-guidelines
description: "Component-driven development with Storybook: CSF 3 story standards, autodocs, argTypes, MSW API mocking, and interaction testing."
category: testing
risk: safe
tags: [storybook, components, testing, documentation, csf3]
---

# Storybook Component-Driven Development

Standards for isolating, developing, and documenting UI components in Storybook 8+.

## 1. CSF 3 Standard Story Format

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost'],
    },
    onClick: { action: 'clicked' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Confirm Action',
  },
};
```

## 2. Interaction & Accessibility Testing

- Integrate `@storybook/addon-a11y` to catch WCAG violations directly in the component panel.
- Use the `play` function with `@storybook/testing-library` (`userEvent`) to simulate user interactions and assert DOM state transitions.
