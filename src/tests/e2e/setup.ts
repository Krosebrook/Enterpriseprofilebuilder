/**
 * @fileoverview End-to-End Test Setup
 * @module tests/e2e/setup
 * @description Playwright E2E test configuration and global setup
 */

import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for E2E tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test suite...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Clear test data
  await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Seed test data if needed
  console.log('✅ E2E test environment ready');
  
  await browser.close();
}

export default globalSetup;
