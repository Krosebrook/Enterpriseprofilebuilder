# Manual Smoke Test Checklist

This document provides a step-by-step manual testing procedure to verify key user flows in the Enterprise Profile Builder application.

## Prerequisites

- [ ] Application is running locally (`npm run dev`)
- [ ] Browser is open (Chrome, Firefox, or Safari recommended)
- [ ] Browser console is open (F12) to check for errors

## Test Environment

- **Date:** ________________
- **Tester:** ________________
- **Build Version:** ________________
- **Browser:** ________________

---

## 1. Initial Load & Environment

### Test: Application Loads Successfully
- [ ] Navigate to `http://localhost:3000`
- [ ] Page loads within 3 seconds
- [ ] No console errors visible
- [ ] Main navigation is visible
- [ ] Content area displays correctly

**Expected Result:** Application loads without errors, displays main content

---

## 2. Navigation & Core UI

### Test: Section Navigation
- [ ] Click on "Overview" in navigation
- [ ] Verify content changes to Overview section
- [ ] Click on "FAQ"
- [ ] Verify content changes to FAQ section
- [ ] Click on "Best Practices"
- [ ] Verify content changes to Best Practices section

**Expected Result:** All sections load correctly, URLs update, content displays

### Test: Sidebar Functionality
- [ ] Collapse sidebar using toggle button (if available)
- [ ] Verify content area expands
- [ ] Expand sidebar again
- [ ] Verify layout returns to normal

**Expected Result:** Sidebar collapses/expands smoothly without breaking layout

---

## 3. Search Functionality

### Test: Search Works Correctly
- [ ] Locate search input field
- [ ] Type "deployment" in search box
- [ ] Verify search results appear (within 500ms)
- [ ] Verify results contain "deployment" keyword
- [ ] Clear search input
- [ ] Verify results disappear

**Expected Result:** Search returns relevant results quickly, clears properly

### Test: Search Edge Cases
- [ ] Search for "xyz123notfound"
- [ ] Verify "no results" message appears
- [ ] Search with special characters: "@#$%"
- [ ] Verify no errors occur

**Expected Result:** Edge cases handled gracefully without crashes

---

## 4. Role Filtering

### Test: Role Selector Functionality
- [ ] Open role selector dropdown
- [ ] Select "Engineering" role
- [ ] Verify content filters to Engineering-specific items
- [ ] Select "Finance" role
- [ ] Verify content filters to Finance-specific items
- [ ] Select "All Roles"
- [ ] Verify all content is visible again

**Expected Result:** Role filter works correctly, persists selection

---

## 5. Bookmarks

### Test: Bookmark Functionality
- [ ] Find a bookmark button (star icon)
- [ ] Click to add bookmark
- [ ] Verify button state changes (filled star)
- [ ] Reload page
- [ ] Verify bookmark is still active (persisted)
- [ ] Click bookmark button again to remove
- [ ] Verify bookmark is removed

**Expected Result:** Bookmarks persist across page reloads

---

## 6. Copy to Clipboard

### Test: Copy Feature
- [ ] Find a "Copy" button
- [ ] Click copy button
- [ ] Verify toast notification appears ("Copied!")
- [ ] Paste content elsewhere (Ctrl+V or Cmd+V)
- [ ] Verify content was copied correctly

**Expected Result:** Content copies successfully, toast notification shows

---

## 7. Error Handling

### Test: Error Boundary
- [ ] Open browser console
- [ ] Force an error (if test button available)
- [ ] Verify Error Boundary displays
- [ ] Verify "Something went wrong" message appears
- [ ] Click "Reload Application" button
- [ ] Verify app reloads successfully

**Expected Result:** Errors caught gracefully, reload works

### Test: Network Failure Resilience
- [ ] Open DevTools Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to perform an action (if app has network requests)
- [ ] Verify error is handled gracefully (not blank screen)
- [ ] Set network back to "Online"
- [ ] Verify app recovers

**Expected Result:** App handles offline state without crashing

---

## 8. Persistence & LocalStorage

### Test: State Persistence
- [ ] Navigate to different section
- [ ] Add a bookmark
- [ ] Reload page (F5)
- [ ] Verify section persists
- [ ] Verify bookmark persists

**Expected Result:** User preferences persist across reloads

---

## 9. Responsive Design

### Test: Mobile View
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select "iPhone 12" or "Pixel 5"
- [ ] Verify mobile layout displays correctly
- [ ] Verify navigation adapts (hamburger menu)
- [ ] Test navigation in mobile view
- [ ] Verify content is readable (no overflow)

**Expected Result:** Mobile view is functional and usable

### Test: Tablet View
- [ ] Select "iPad" or similar tablet device
- [ ] Verify layout adapts appropriately
- [ ] Test all main features work

**Expected Result:** Tablet view displays correctly

---

## 10. Performance

### Test: Load Time
- [ ] Open Network tab in DevTools
- [ ] Reload page (Ctrl+R)
- [ ] Check "Load" time in Network tab
- [ ] Verify load time is under 3 seconds

**Expected Result:** Page loads in under 3 seconds

### Test: Smooth Interactions
- [ ] Scroll through long content
- [ ] Verify smooth scrolling (no jank)
- [ ] Open/close dropdowns
- [ ] Verify animations are smooth (60fps)

**Expected Result:** All interactions feel responsive and smooth

---

## 11. Accessibility

### Test: Keyboard Navigation
- [ ] Tab through interactive elements
- [ ] Verify focus indicators are visible
- [ ] Press Enter on focused buttons
- [ ] Verify buttons activate correctly
- [ ] Use Esc to close modals/dropdowns
- [ ] Verify Esc key works

**Expected Result:** All interactive elements accessible via keyboard

### Test: Screen Reader Support
- [ ] Check that images have alt text
- [ ] Verify headings have proper hierarchy (h1, h2, h3)
- [ ] Check that buttons have descriptive labels

**Expected Result:** Basic accessibility requirements met

---

## Test Summary

### Overall Results

| Category | Status | Notes |
|----------|--------|-------|
| Initial Load | ⬜ Pass ⬜ Fail | |
| Navigation | ⬜ Pass ⬜ Fail | |
| Search | ⬜ Pass ⬜ Fail | |
| Role Filtering | ⬜ Pass ⬜ Fail | |
| Bookmarks | ⬜ Pass ⬜ Fail | |
| Copy Feature | ⬜ Pass ⬜ Fail | |
| Error Handling | ⬜ Pass ⬜ Fail | |
| Persistence | ⬜ Pass ⬜ Fail | |
| Responsive | ⬜ Pass ⬜ Fail | |
| Performance | ⬜ Pass ⬜ Fail | |
| Accessibility | ⬜ Pass ⬜ Fail | |

### Critical Issues Found

1. ________________________________________________
2. ________________________________________________

### Sign-off

- **Tester Name:** ________________
- **Date:** ________________
- **Overall Status:** ⬜ PASS ⬜ FAIL ⬜ BLOCKED
