---
name: core-web-vitals
description: "Web performance optimization for Google Core Web Vitals: LCP (<2.5s), INP (<200ms), and CLS (<0.1). Image preloading, font swap, and script deferral."
category: performance
risk: safe
tags: [performance, core-web-vitals, lcp, inp, cls, lighthouse]
---

# Core Web Vitals (CWV) Optimization

Actionable checklist to achieve green 95+ performance scores on Lighthouse and real user monitoring (RUM).

## 1. Largest Contentful Paint (LCP < 2.5s)

- **Preload Hero Assets**: Preload hero images with `<link rel="preload" as="image" href="...">` or `priority={true}` in Next.js.
- **Serve Next-Gen Image Formats**: Convert PNG/JPEG to WebP or AVIF with responsive `srcset` resolutions.
- **Fast Server Responses**: Cache static pages on edge CDNs; stream dynamic HTML via React Server Components.

## 2. Interaction to Next Paint (INP < 200ms)

- **Avoid Main-Thread Blocking**: Break large JS tasks (>50ms) using `requestIdleCallback`, Web Workers, or `scheduler.yield()`.
- **Debounce & Throttle**: Debounce expensive search filtering and throttle scroll/resize listeners.
- **Optimistic UI**: Update UI state immediately upon user click, then sync with the server in the background.

## 3. Cumulative Layout Shift (CLS < 0.1)

- **Explicit Dimensions**: Always specify `width` and `height` or aspect-ratio (`aspect-video`, `aspect-square`) on all media.
- **Font Fallback Matching**: Use `size-adjust`, `ascent-override`, and `descent-override` in `@font-face` so custom fonts don't shift text blocks when loaded.
- **Reserved Ad & Banner Slots**: Reserve explicit min-height on dynamic promotional banners and announcement bars.
