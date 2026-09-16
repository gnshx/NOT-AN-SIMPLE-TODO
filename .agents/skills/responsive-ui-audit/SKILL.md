---
name: responsive-ui-audit
description: "Automated and manual multi-device viewport audit: 320px (iPhone SE) to 4K desktop, touch targets, text wrapping, and sticky header ergonomics."
category: quality
risk: safe
tags: [responsive, audit, mobile, viewport, ui]
---

# Responsive UI Audit Matrix

Comprehensive viewport matrix and validation criteria to audit web interfaces.

## 1. Standard Viewport Matrix

| Device Class | Viewport Width | Key Checkpoints |
|---|---|---|
| **Compact Mobile** | `320px` (iPhone SE) | No horizontal scrolling, no word clipping, compact buttons |
| **Standard Mobile** | `375px` - `414px` | Thumb-friendly navigation, 44px touch targets, readable 16px inputs |
| **Tablet Portrait** | `768px` (iPad) | Collapsed sidebar into sheet/drawer, 2-column card grids |
| **Tablet Landscape / Laptop** | `1024px` | Persistent side navigation, 3-column grids, data tables visible |
| **Desktop** | `1440px` | Centered container max-width (`max-w-7xl`), spacious whitespace |
| **Ultra-Wide** | `2560px` (4K) | Content does not stretch uncontrollably across screen |

## 2. Critical Audit Points

1. Ensure table columns collapse gracefully or support swipeable horizontal containers with shadow indicators.
2. Confirm sticky headers and floating bottom action bars do not obscure viewport content on short mobile keyboards.
