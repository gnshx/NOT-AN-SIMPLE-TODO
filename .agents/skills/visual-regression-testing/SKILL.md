---
name: visual-regression-testing
description: "Automated visual regression testing with Playwright and Storybook: pixel-level diffing, masking dynamic content, multi-viewport matrices, and CI automation."
category: testing
risk: safe
tags: [testing, visual-regression, playwright, screenshots, qa]
---

# Visual Regression Testing Standards

Protect against unintentional UI visual bugs, layout breaks, and CSS regressions.

## 1. Playwright Visual Comparison

```ts
import { test, expect } from '@playwright/test';

test('Dashboard overview visual snapshot', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Wait for fonts, network, and animations to stabilize
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  
  // Mask dynamic timestamps and user avatars to prevent false positive flakes
  await expect(page).toHaveScreenshot('dashboard-overview.png', {
    mask: [page.locator('.dynamic-timestamp'), page.locator('.user-avatar')],
    maxDiffPixelRatio: 0.01,
  });
});
```

## 2. Preventing Test Flakiness

1. **Disable CSS Animations & Caret Blinking**: Set `animations: 'disabled'` in Playwright or inject `@media (prefers-reduced-motion: reduce)`.
2. **Fixed Timezones & Locales**: Force UTC timezone and `en-US` locale in test worker configuration.
3. **Deterministic Seed Data**: Run against mock fixtures rather than live mutating databases.
