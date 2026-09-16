---
name: framer-motion-patterns
description: "Production Framer Motion animations in React: layoutId transitions, gesture physics, AnimatePresence exit animations, and reduced-motion support."
category: frontend
risk: safe
tags: [framer-motion, animation, react, micro-interactions, ui]
---

# Framer Motion Animation Standards

Guidelines for crafting silky-smooth, 60fps micro-interactions and layout transitions in React.

## 1. Magic Shared Layouts (`layoutId`)

Create seamless fluid tabs, active indicators, and morphing cards with zero manual geometry calculation:
```tsx
import { motion } from 'framer-motion';

{tabs.map((tab) => (
  <button key={tab.id} onClick={() => setActive(tab.id)} className="relative px-4 py-2">
    {tab.label}
    {active === tab.id && (
      <motion.div
        layoutId="activeTabIndicator"
        className="absolute inset-0 bg-primary/10 rounded-md"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    )}
  </button>
))}
```

## 2. Smooth Enter/Exit via `AnimatePresence`

Always specify `initial`, `animate`, and `exit` when rendering or removing conditional elements:
```tsx
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    />
  )}
</AnimatePresence>
```

## 3. Accessible Motion (`useReducedMotion`)

Respect user accessibility settings by disabling spring physics when requested:
```tsx
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : { type: 'spring' };
```
