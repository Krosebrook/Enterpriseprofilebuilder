# Deployment Guide

**INT Inc Enterprise Claude Profile Builder**  
**Production Deployment Documentation**

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Build Process](#build-process)
5. [Deployment Platforms](#deployment-platforms)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring & Logging](#monitoring--logging)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Post-Deployment](#post-deployment)

---

## Overview

This guide covers the complete deployment process for the Claude Profile Builder, from local builds to production releases.

### Deployment Strategy

- **Environment Tiers**: Development → Staging → Production
- **Deployment Method**: Continuous Deployment (CD) via GitHub Actions
- **Release Schedule**: Weekly releases (Tuesdays, 2 PM EST)
- **Hotfix Process**: Immediate deployment for critical issues
- **Zero-Downtime**: Blue-green deployment strategy

### Deployment Flow

```
Developer
    ↓
  Push to GitHub
    ↓
  CI/CD Pipeline
    ↓ (Tests Pass)
  Deploy to Staging
    ↓ (Approval)
  Deploy to Production
    ↓
  Monitor & Verify
```

---

## Prerequisites

### Required Tools

```bash
# Node.js (v18 or higher)
node --version  # v18.x.x

# npm (v9 or higher)
npm --version   # 9.x.x

# Git
git --version   # 2.x.x

# Vercel CLI (for Vercel deployments)
npm install -g vercel
```

### Access Requirements

- [ ] GitHub repository access (write permission)
- [ ] Vercel account with deployment permissions
- [ ] Environment variable access
- [ ] Domain/DNS management access
- [ ] Monitoring dashboard access
- [ ] Incident response team contact

---

## Environment Configuration

### Environment Variables

Create environment-specific `.env` files:

#### Development (`.env.development`)

```bash
# Application
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_DEBUG=true

# Feature Flags
VITE_FEATURE_DARK_MODE=true
VITE_FEATURE_ADVANCED_SEARCH=true

# API (future)
VITE_API_ENDPOINT=http://localhost:3000/api
```

#### Staging (`.env.staging`)

```bash
# Application
VITE_APP_ENV=staging
VITE_APP_URL=https://staging.claude-profile.int-inc.com

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_DEBUG=false

# Feature Flags
VITE_FEATURE_DARK_MODE=true
VITE_FEATURE_ADVANCED_SEARCH=true

# API
VITE_API_ENDPOINT=https://staging-api.int-inc.com/api
```

#### Production (`.env.production`)

```bash
# Application
VITE_APP_ENV=production
VITE_APP_URL=https://claude-profile.int-inc.com

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_DEBUG=false

# Feature Flags
VITE_FEATURE_DARK_MODE=false
VITE_FEATURE_ADVANCED_SEARCH=true

# API
VITE_API_ENDPOINT=https://api.int-inc.com/api

# Performance
VITE_ENABLE_SOURCE_MAPS=false
VITE_MINIFY=true
```

### Security Notes

⚠️ **Never commit `.env` files to version control**

```bash
# .gitignore
.env
.env.local
.env.development.local
.env.staging.local
.env.production.local
```

---

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Run type check
npm run type-check

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js      # Main bundle (~120KB gzipped)
│   ├── index-[hash].css     # Styles (~15KB gzipped)
│   └── vendor-[hash].js     # Vendor chunks (~80KB gzipped)
├── index.html               # Entry point
└── favicon.ico              # Favicon
```

### Build Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  build: {
    // Target modern browsers
    target: 'es2015',
    
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for debugging (staging only)
    sourcemap: process.env.VITE_APP_ENV === 'staging',
    
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.VITE_APP_ENV === 'production',
        drop_debugger: true
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react'],
          'utils-vendor': ['date-fns']
        }
      }
    }
  },
  
  // Base public path
  base: '/',
  
  // Server config
  server: {
    port: 5173,
    host: true
  },
  
  // Preview config
  preview: {
    port: 4173,
    host: true
  }
});
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

#### Initial Setup

```bash
# Login to Vercel
vercel login

# Link project
cd claude-profile-builder
vercel link

# Set environment variables
vercel env add VITE_APP_ENV production
vercel env add VITE_APP_URL production
# ... add all production variables
```

#### Configuration

```json
// vercel.json
{
  "version": 2,
  "name": "claude-profile-builder",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  
  "env": {
    "VITE_APP_ENV": "production"
  },
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none';"
        }
      ]
    }
  ],
  
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  
  "crons": []
}
```

#### Manual Deployment

```bash
# Deploy to staging
vercel --env staging

# Deploy to production
vercel --prod

# Promote staging to production
vercel promote [deployment-url] --prod
```

#### Vercel Dashboard

- **URL**: https://vercel.com/int-inc/claude-profile-builder
- **Deployments**: View all deployments and their status
- **Domains**: Manage custom domains
- **Environment Variables**: Manage secrets
- **Analytics**: View performance metrics

---

### Option 2: Netlify

#### Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

### Option 3: AWS S3 + CloudFront

#### S3 Bucket Setup

```bash
# Create S3 bucket
aws s3 mb s3://claude-profile-builder

# Configure bucket for static hosting
aws s3 website s3://claude-profile-builder \
  --index-document index.html \
  --error-document index.html

# Upload build
aws s3 sync dist/ s3://claude-profile-builder \
  --delete \
  --cache-control "max-age=31536000, public"

# Upload index.html separately (no cache)
aws s3 cp dist/index.html s3://claude-profile-builder/index.html \
  --cache-control "no-cache, no-store, must-revalidate"
```

#### CloudFront Distribution

```javascript
// cloudfront-config.json
{
  "Comment": "Claude Profile Builder CDN",
  "DefaultRootObject": "index.html",
  "Origins": [
    {
      "Id": "S3-claude-profile-builder",
      "DomainName": "claude-profile-builder.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-claude-profile-builder",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "CachedMethods": ["GET", "HEAD"],
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }
  ]
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
  
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_APP_ENV: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 30
  
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.claude-profile.int-inc.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
          scope: int-inc
      
      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: https://staging.claude-profile.int-inc.com
  
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://claude-profile.int-inc.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
          scope: int-inc
      
      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: https://claude-profile.int-inc.com
      
      - name: Notify team
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚀 Claude Profile Builder v${{ github.sha }} deployed to production"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Deployment Secrets

Configure these secrets in GitHub repository settings:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
SLACK_WEBHOOK_URL=your_slack_webhook
CODECOV_TOKEN=your_codecov_token
```

---

## Monitoring & Logging

### Vercel Analytics

```typescript
// Add to src/main.tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

### Error Tracking with Sentry

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
    environment: import.meta.env.VITE_APP_ENV,
    beforeSend(event) {
      // Don't send errors in development
      if (import.meta.env.DEV) return null;
      return event;
    }
  });
}
```

### Custom Monitoring Dashboard

```typescript
// src/utils/monitoring.ts
export const monitoring = {
  // Track page load time
  pageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log(`Page load time: ${pageLoadTime}ms`);
      
      // Send to analytics
      trackEvent('performance', {
        metric: 'page_load',
        value: pageLoadTime
      });
    }
  },
  
  // Track errors
  error(error: Error, context?: Record<string, unknown>) {
    console.error('Application error:', error, context);
    
    // Send to error tracking service
    if (import.meta.env.PROD) {
      // Sentry or similar
    }
  },
  
  // Track custom metrics
  metric(name: string, value: number) {
    console.log(`Metric ${name}:`, value);
    
    trackEvent('custom_metric', { name, value });
  }
};
```

---

## Rollback Procedures

### Quick Rollback (Vercel)

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Rollback to previous deployment
vercel rollback --yes
```

### Manual Rollback

```bash
# Checkout previous version
git checkout tags/v1.0.0

# Build
npm run build

# Deploy
vercel --prod
```

### Rollback Checklist

- [ ] Identify issue and severity
- [ ] Notify team of rollback intent
- [ ] Execute rollback
- [ ] Verify application functionality
- [ ] Monitor error rates
- [ ] Update status page
- [ ] Notify users if needed
- [ ] Schedule post-mortem
- [ ] Create hotfix branch

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Out of memory" error

```bash
# Solution: Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Issue**: Type checking fails

```bash
# Solution: Run type check to see errors
npm run type-check

# Fix errors or skip type check (not recommended)
VITE_SKIP_TYPE_CHECK=true npm run build
```

### Deployment Failures

**Issue**: Deployment times out

```bash
# Solution: Check build size
du -sh dist/

# Optimize if too large (>10MB)
npm run build -- --mode production
```

**Issue**: Environment variables not loaded

```bash
# Solution: Verify variables are set
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME production
```

### Runtime Errors

**Issue**: Application shows blank page

```bash
# Check browser console for errors
# Common causes:
# 1. Wrong base path in vite.config.ts
# 2. Missing environment variables
# 3. CSP header blocking resources
```

**Issue**: LocalStorage quota exceeded

```typescript
// Solution: Clear old data
storage.clear();

// Or implement data rotation
function cleanOldData() {
  const events = getAnalyticsEvents();
  const recent = events.slice(-50); // Keep last 50
  saveAnalyticsEvents(recent);
}
```

---

## Post-Deployment

### Verification Checklist

- [ ] Application loads successfully
- [ ] All pages accessible
- [ ] Search functionality works
- [ ] Bookmarks can be added/removed
- [ ] Role filtering works
- [ ] Analytics tracking active
- [ ] No console errors
- [ ] Lighthouse score >95
- [ ] Mobile responsive
- [ ] SSL certificate valid

### Smoke Tests

```bash
# Run automated smoke tests
npm run test:smoke

# Manual smoke test checklist
# 1. Navigate to homepage
# 2. Search for "security"
# 3. Bookmark an item
# 4. Change role filter
# 5. Navigate to deployment section
# 6. Mark a task complete
# 7. Print a page
```

### Performance Monitoring

```bash
# Check Core Web Vitals
lighthouse https://claude-profile.int-inc.com --view

# Monitor for 24 hours:
# - Error rate <0.1%
# - Page load time <3s
# - 99th percentile <5s
# - No memory leaks
```

### Communication

**Internal Announcement (Slack)**:
```
🚀 Claude Profile Builder v1.0.1 is now live!

Changes:
✅ Fixed search performance issue
✅ Updated FAQ content
✅ Improved mobile navigation

Testing: All smoke tests passed
Monitoring: No errors detected

Questions? Ask in #claude-support
```

**User Announcement (Email)**:
```
Subject: Claude Profile Builder Updated

We've released an update to the Claude Profile Builder with the following improvements:

- Faster search performance
- Updated FAQ section
- Better mobile experience

No action required on your part. Simply refresh your browser to get the latest version.

As always, let us know if you have any questions or feedback.

Best,
INT Inc Engineering Team
```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Sentry Documentation](https://docs.sentry.io/)

---

**Document Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Maintained By**: INT Inc Engineering Team  
**Next Review**: March 11, 2026
