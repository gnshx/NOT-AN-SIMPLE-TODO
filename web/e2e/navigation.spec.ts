import { test, expect } from '@playwright/test';

test.describe('DayNight Pilot SaaS E2E Suite', () => {
  test('Home Dashboard loads and renders core branding', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DayNight Pilot/);
    await expect(page.locator('h1.hero-title')).toBeVisible();
    await expect(page.locator('text=ACTIVE PIPELINE')).toBeVisible();
  });

  test('Navigation links route to correct views', async ({ page }) => {
    await page.goto('/');
    
    // Go to Today
    await page.goto('/today');
    await expect(page.locator('text=PERSONAL DAILY COMMAND CENTER')).toBeVisible();

    // Go to AI Review Queue
    await page.goto('/ai-review');
    await expect(page.locator('text=HUMAN-IN-THE-LOOP GOVERNANCE')).toBeVisible();

    // Go to Applications Pipeline
    await page.goto('/pipeline');
    await expect(page.locator('text=CAREER EXECUTION PIPELINE').first()).toBeVisible();
    await expect(page.locator('text=ASSIGNMENT TEST').first()).toBeVisible();
    await expect(page.locator('text=SELECTED / JOB OFFER GIVEN').first()).toBeVisible();

    // Go to Opportunities Radar
    await page.goto('/opportunities');
    await expect(page.locator('text=JOB INTELLIGENCE RADAR')).toBeVisible();

    // Go to Resume Workspace
    await page.goto('/resume');
    await expect(page.locator('text=RESUME INTELLIGENCE WORKSPACE')).toBeVisible();

    // Go to Interview Center
    await page.goto('/interviews');
    await expect(page.locator('text=INTERVIEW CENTER & AI COACH')).toBeVisible();

    // Go to Intelligence
    await page.goto('/intelligence');
    await expect(page.locator('text=CAREER GRAPH & DECISION INTELLIGENCE')).toBeVisible();

    // Go to Tasks
    await page.goto('/tasks');
    await expect(page.locator('text=TASK EXECUTION & ACTION ITEMS')).toBeVisible();

    // Go to Settings
    await page.goto('/settings/organization');
    await expect(page.locator('text=ENTERPRISE GOVERNANCE & RBAC')).toBeVisible();
  });

  test('Interactive AI Mock Interview Modal trigger', async ({ page }) => {
    await page.goto('/interviews');
    await page.click('button:has-text("Start AI Mock Interview")');
    await expect(page.locator('h3:has-text("AI Mock Interview Simulator")')).toBeVisible();
    await expect(page.locator('text=QUESTION 1 OF 3')).toBeVisible();
  });
});
