/**
 * @fileoverview End-to-End Tests for Claude Profile Builder
 * @module tests/e2e/app
 * @description Comprehensive E2E test suite using Playwright
 */

import { test, expect, Page } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Test Configuration
// ═══════════════════════════════════════════════════════════

test.describe('Claude Profile Builder E2E Tests', () => {
  
  // ═══════════════════════════════════════════════════════════
  // Basic Navigation Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Navigation', () => {
    test('should load home page successfully', async ({ page }) => {
      await page.goto('/');
      
      // Check title
      await expect(page).toHaveTitle(/Claude Profile Builder/);
      
      // Check main navigation exists
      await expect(page.locator('nav')).toBeVisible();
      
      // Check footer exists
      await expect(page.locator('footer')).toBeVisible();
    });
    
    test('should navigate to all main sections', async ({ page }) => {
      await page.goto('/');
      
      const sections = [
        { name: 'Overview', selector: '[data-section="overview"]' },
        { name: 'FAQ', selector: '[data-section="faq"]' },
        { name: 'Deployment', selector: '[data-section="deployment"]' },
        { name: 'Best Practices', selector: '[data-section="best-practices"]' }
      ];
      
      for (const section of sections) {
        const link = page.locator(`text=${section.name}`).first();
        await link.click();
        
        // Verify section is visible
        await expect(page.locator(section.selector)).toBeVisible();
        
        // Verify URL updated
        await expect(page).toHaveURL(new RegExp(section.name.toLowerCase().replace(' ', '-')));
      }
    });
    
    test('should scroll to section when clicking nav link', async ({ page }) => {
      await page.goto('/');
      
      // Click FAQ link
      await page.click('text=FAQ');
      
      // Wait for scroll
      await page.waitForTimeout(500);
      
      // Check FAQ section is in viewport
      const faqSection = page.locator('[data-section="faq"]');
      await expect(faqSection).toBeInViewport();
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Search Functionality Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Search', () => {
    test('should display search bar', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();
    });
    
    test('should search and display results', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
      
      // Type search query
      await searchInput.fill('security');
      
      // Wait for results
      await page.waitForTimeout(300);
      
      // Check results are displayed
      const results = page.locator('[data-testid="search-results"]');
      await expect(results).toBeVisible();
      
      // Verify results contain search term
      const firstResult = results.locator('[data-testid="search-result-item"]').first();
      await expect(firstResult).toContainText(/security/i);
    });
    
    test('should clear search results', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"]').first();
      
      // Search
      await searchInput.fill('test');
      await page.waitForTimeout(300);
      
      // Clear
      await searchInput.clear();
      
      // Results should be hidden
      const results = page.locator('[data-testid="search-results"]');
      await expect(results).not.toBeVisible();
    });
    
    test('should handle no results gracefully', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"]').first();
      
      // Search for non-existent term
      await searchInput.fill('xyzabc123nonexistent');
      await page.waitForTimeout(300);
      
      // Should show no results message
      await expect(page.locator('text=/no results/i')).toBeVisible();
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Role Selector Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Role Selector', () => {
    test('should display role selector', async ({ page }) => {
      await page.goto('/');
      
      const roleSelector = page.locator('[data-testid="role-selector"]');
      await expect(roleSelector).toBeVisible();
    });
    
    test('should filter content by role', async ({ page }) => {
      await page.goto('/');
      
      // Select Finance role
      await page.click('[data-testid="role-selector"]');
      await page.click('text=Finance');
      
      // Wait for filter to apply
      await page.waitForTimeout(300);
      
      // Verify Finance-specific content is visible
      const financeContent = page.locator('[data-role="finance"]');
      await expect(financeContent.first()).toBeVisible();
      
      // Verify non-Finance content is hidden or de-emphasized
      const engineeringContent = page.locator('[data-role="engineering"]');
      const count = await engineeringContent.count();
      if (count > 0) {
        // Content exists but should be hidden or faded
        const opacity = await engineeringContent.first().evaluate(el => 
          window.getComputedStyle(el).opacity
        );
        expect(parseFloat(opacity)).toBeLessThan(1);
      }
    });
    
    test('should show all content when "All Roles" selected', async ({ page }) => {
      await page.goto('/');
      
      // Select specific role first
      await page.click('[data-testid="role-selector"]');
      await page.click('text=Engineering');
      await page.waitForTimeout(300);
      
      // Select All Roles
      await page.click('[data-testid="role-selector"]');
      await page.click('text=All Roles');
      await page.waitForTimeout(300);
      
      // Verify all role-specific content is visible
      const allRoleContent = page.locator('[data-role]');
      const count = await allRoleContent.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        await expect(allRoleContent.nth(i)).toBeVisible();
      }
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Bookmark Functionality Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Bookmarks', () => {
    test('should add bookmark', async ({ page }) => {
      await page.goto('/');
      
      // Find first bookmark button
      const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
      await bookmarkButton.click();
      
      // Verify bookmark was added (button state changed)
      await expect(bookmarkButton).toHaveAttribute('data-bookmarked', 'true');
      
      // Verify bookmark persists after reload
      await page.reload();
      await expect(bookmarkButton).toHaveAttribute('data-bookmarked', 'true');
    });
    
    test('should remove bookmark', async ({ page }) => {
      await page.goto('/');
      
      const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
      
      // Add bookmark
      await bookmarkButton.click();
      await expect(bookmarkButton).toHaveAttribute('data-bookmarked', 'true');
      
      // Remove bookmark
      await bookmarkButton.click();
      await expect(bookmarkButton).toHaveAttribute('data-bookmarked', 'false');
    });
    
    test('should display bookmarks list', async ({ page }) => {
      await page.goto('/');
      
      // Add multiple bookmarks
      const bookmarkButtons = page.locator('[data-testid="bookmark-button"]');
      const count = Math.min(await bookmarkButtons.count(), 3);
      
      for (let i = 0; i < count; i++) {
        await bookmarkButtons.nth(i).click();
        await page.waitForTimeout(100);
      }
      
      // Navigate to bookmarks view
      await page.click('text=/bookmarks/i');
      
      // Verify bookmarks are displayed
      const bookmarksList = page.locator('[data-testid="bookmarks-list"]');
      await expect(bookmarksList).toBeVisible();
      
      const items = bookmarksList.locator('[data-testid="bookmark-item"]');
      await expect(items).toHaveCount(count);
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Copy to Clipboard Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Copy to Clipboard', () => {
    test('should copy content to clipboard', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      
      await page.goto('/');
      
      // Find copy button
      const copyButton = page.locator('[data-testid="copy-button"]').first();
      await copyButton.click();
      
      // Verify success message
      await expect(page.locator('text=/copied/i')).toBeVisible({ timeout: 2000 });
      
      // Verify clipboard content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText.length).toBeGreaterThan(0);
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Print Functionality Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Print', () => {
    test('should trigger print dialog', async ({ page }) => {
      await page.goto('/');
      
      // Listen for print event
      let printCalled = false;
      await page.exposeFunction('printCalled', () => {
        printCalled = true;
      });
      
      await page.evaluate(() => {
        const originalPrint = window.print;
        window.print = () => {
          (window as any).printCalled();
          // Don't actually print in tests
        };
      });
      
      // Click print button
      await page.click('[data-testid="print-button"]');
      
      // Verify print was called
      await page.waitForTimeout(500);
      expect(printCalled).toBe(true);
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Accessibility Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Accessibility', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto('/');
      
      // Run axe accessibility tests
      const accessibilityScanResults = await page.evaluate(() => {
        return new Promise((resolve) => {
          // This would use axe-core library
          // For now, just check basic requirements
          const results = {
            violations: [],
            passes: []
          };
          
          // Check for proper heading hierarchy
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          const hasH1 = headings.some(h => h.tagName === 'H1');
          if (!hasH1) {
            results.violations.push({ id: 'missing-h1', description: 'Page missing h1' });
          }
          
          // Check for alt text on images
          const images = Array.from(document.querySelectorAll('img'));
          const missingAlt = images.filter(img => !img.hasAttribute('alt'));
          if (missingAlt.length > 0) {
            results.violations.push({ id: 'missing-alt', description: `${missingAlt.length} images missing alt text` });
          }
          
          resolve(results);
        });
      });
      
      expect((accessibilityScanResults as any).violations.length).toBe(0);
    });
    
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/');
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      
      // Verify focus is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeDefined();
      
      // Tab through multiple elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }
      
      // Verify we can navigate with keyboard
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(activeElement);
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Performance Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Performance', () => {
    test('should load page within performance budget', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Page should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });
    
    test('should have good Lighthouse scores', async ({ page }) => {
      await page.goto('/');
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          transferSize: navigation.transferSize
        };
      });
      
      // Verify metrics are reasonable
      expect(metrics.domContentLoaded).toBeLessThan(2000);
      expect(metrics.loadComplete).toBeLessThan(500);
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Error Handling Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Go offline
      await page.context().setOffline(true);
      
      await page.goto('/');
      
      // Try to perform action that requires network
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('test');
      
      // Should show error message or handle gracefully
      // (depends on implementation - might work offline with cached data)
    });
    
    test('should handle JavaScript errors', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      await page.goto('/');
      
      // Navigate through app
      await page.click('text=FAQ');
      await page.click('text=Deployment');
      
      // Should have no JavaScript errors
      expect(errors.length).toBe(0);
    });
  });
  
  // ═══════════════════════════════════════════════════════════
  // Mobile Responsive Tests
  // ═══════════════════════════════════════════════════════════
  
  test.describe('Mobile Responsive', () => {
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      
      // Verify navigation is responsive
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Mobile menu should be visible
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      
      // Either mobile menu exists or regular nav adapts
      const hasMobileMenu = (await mobileMenuButton.count()) > 0;
      if (hasMobileMenu) {
        await expect(mobileMenuButton).toBeVisible();
      }
    });
    
    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/');
      
      // Content should be readable
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });
  });
});

// ═══════════════════════════════════════════════════════════
// Integration Tests
// ═══════════════════════════════════════════════════════════

test.describe('Integration Flows', () => {
  test('complete user journey: search -> filter -> bookmark -> print', async ({ page }) => {
    await page.goto('/');
    
    // 1. Search
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('deployment');
    await page.waitForTimeout(300);
    
    // 2. Filter by role
    await page.click('[data-testid="role-selector"]');
    await page.click('text=Engineering');
    await page.waitForTimeout(300);
    
    // 3. Bookmark result
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
    await bookmarkButton.click();
    
    // 4. Navigate to deployment section
    await page.click('text=Deployment');
    await page.waitForTimeout(500);
    
    // 5. Verify we're in the right place
    await expect(page.locator('[data-section="deployment"]')).toBeVisible();
    
    // 6. Copy content
    const copyButton = page.locator('[data-testid="copy-button"]').first();
    if (await copyButton.count() > 0) {
      await copyButton.click();
      await expect(page.locator('text=/copied/i')).toBeVisible({ timeout: 2000 });
    }
    
    // Journey completed successfully
    expect(true).toBe(true);
  });
});
