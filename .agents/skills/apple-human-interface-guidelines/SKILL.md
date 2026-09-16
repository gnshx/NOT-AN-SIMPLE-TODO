---
name: apple-human-interface-guidelines
description: "Apple Human Interface Guidelines (HIG): principles of clarity, deference, and depth. San Francisco typography, SF Symbols, safe area insets, and haptic feedback."
category: design-systems
risk: safe
tags: [apple, hig, design-system, ios, macos, ui]
---

# Apple Human Interface Guidelines (HIG)

Core design foundations for creating seamless, native, and delightful experiences across Apple platforms (iOS, iPadOS, macOS, watchOS, visionOS).

## 1. Core Principles

- **Clarity**: Text is legible at every size, icons are precise, adornments are subtle, and functionality drives the design.
- **Deference**: Fluid motion and crisp, beautiful interfaces help people understand and interact with content while never competing with it.
- **Depth**: Visual layers and realistic motion impart vitality and heighten delight and understanding.

## 2. Layout & Typography

- **San Francisco Font & Dynamic Type**:
  - Automatically adapt font weight and tracking according to size.
  - Support Dynamic Type so users can scale text system-wide.
- **Safe Area Insets**:
  - Always respect system boundaries (`env(safe-area-inset-top)`, home indicator bars, dynamic islands).
- **44x44pt Hit Targets**:
  - Every interactive button or touch element must have an accessible hit area of at least 44x44 points.

## 3. Materials & Vibrancy

- Use translucent blur materials (`backdrop-blur-md` / `.systemMaterial`) to create depth between foreground controls and background content.
- Ensure text maintains legibility using system vibrancy modes rather than static opacity.
