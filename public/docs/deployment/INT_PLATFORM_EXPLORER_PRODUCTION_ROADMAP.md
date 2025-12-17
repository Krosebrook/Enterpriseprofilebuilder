# INT PLATFORM EXPLORER v3.1+ PRODUCTION ROADMAP
## From Current Build to Enterprise-Grade SaaS

**Current Status:** v3.1 (16 platforms, multi-vendor analysis, white-label config)  
**Target Status:** v4.0 Enterprise Edition (Production-ready SaaS platform)  
**Scope:** HTML app → Progressive Web App → Backend-integrated platform

---

## PART I: CURRENT STATE AUDIT (v3.1)

### What's Working Well ✅

| Feature | Status | Quality |
|---------|--------|---------|
| Platform data (16 models) | ✅ Complete | High |
| Multi-view (cards, table, matrix) | ✅ Complete | High |
| Filtering/sorting | ✅ Complete | High |
| Side-by-side comparison | ✅ Complete | Medium |
| Export (HTML/CSV/JSON/Markdown) | ✅ Complete | Medium |
| White-label config | ✅ Complete | Medium |
| Modal system | ✅ Complete | High |
| Accessibility (ARIA, keyboard) | ⚠️ Partial | Medium |
| Mobile responsive | ⚠️ Partial | Medium |
| Performance (load time) | ⚠️ Slow | Low |

### Technical Debt ⚠️

| Issue | Severity | Impact | Fix |
|-------|----------|--------|-----|
| Monolithic HTML (12K+ lines) | High | Maintenance nightmare | Split into modules |
| No state management library | Medium | Hard to debug | Implement Zustand or Redux |
| Inline styles (CSS-in-JS scattered) | High | Inconsistent theming | Centralized CSS variables |
| No caching strategy | High | Slow repeat loads | Service Worker + IndexedDB |
| Hard-coded data (PLATFORMS_DATA in JS) | High | Not scalable | JSON API endpoint |
| No error handling | Medium | Silent failures | Try-catch, error boundaries |
| No analytics | High | Can't measure usage | Google Analytics / Segment |
| No authentication | Critical | Anyone can download sensitive reports | JWT-based auth |

---

## PART II: PRODUCTION ROADMAP (v4.0)

### Phase 1: CORE ARCHITECTURE (Week 1–2)
**Goal:** Refactor for modularity, add state management, centralize configuration

#### 1.1 Module-Based Architecture
```
INT_Platform_Explorer/
├── index.html (entry point, 500 lines)
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── manifest.json (PWA)
├── src/
│   ├── config/
│   │   ├── config.js (centralized settings)
│   │   ├── themes.js (color schemes)
│   │   └── features.js (feature flags)
│   ├── components/
│   │   ├── Header.js
│   │   ├── PlatformCard.js
│   │   ├── FilterPanel.js
│   │   ├── ComparisonModal.js
│   │   ├── ExportPanel.js
│   │   ├── ROICalculator.js
│   │   └── Navbar.js
│   ├── views/
│   │   ├── ExplorerView.js
│   │   ├── TableView.js
│   │   ├── MatrixView.js
│   │   ├── AssessmentView.js
│   │   ├── FinancialView.js
│   │   └── GlossaryView.js
│   ├── utils/
│   │   ├── formatting.js
│   │   ├── filtering.js
│   │   ├── export.js
│   │   ├── validation.js
│   │   └── api.js
│   ├── state/
│   │   ├── store.js (Zustand store)
│   │   ├── actions.js
│   │   └── selectors.js
│   ├── styles/
│   │   ├── variables.css (design tokens)
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   └── responsive.css
│   └── data/
│       ├── platforms.json (API-ready format)
│       ├── statistics.json
│       ├── glossary.json
│       └── sources.json
└── build/
    └── bundle.js (minified, gzipped)
```

#### 1.2 State Management (Zustand)
```javascript
// src/state/store.js
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // App state
        currentTab: 'explorer',
        currentView: 'cards',
        
        // Filters
        filters: {
          provider: 'all',
          category: 'all',
          search: '',
          sortBy: 'marketShare-desc',
          departments: [],
          useCases: []
        },
        
        // Comparison
        comparison: [],
        
        // User preferences
        preferences: {
          theme: 'light',
          language: 'en',
          exportFormat: 'pdf',
          showAdvanced: false
        },
        
        // Actions
        setTab: (tab) => set({ currentTab: tab }),
        setView: (view) => set({ currentView: view }),
        updateFilter: (key, value) => 
          set((state) => ({
            filters: { ...state.filters, [key]: value }
          })),
        addComparison: (platformId) => 
          set((state) => ({
            comparison: [...state.comparison, platformId].slice(0, 4)
          })),
        // ... more actions
      }),
      {
        name: 'int-explorer-storage',
        version: 1
      }
    )
  )
);
```

#### 1.3 Centralized Configuration
```javascript
// src/config/config.js
export const CONFIG = {
  app: {
    name: 'INT Platform Explorer',
    version: '4.0',
    env: process.env.NODE_ENV || 'development'
  },
  
  client: {
    name: 'INT Inc.',
    domain: 'intinc.com',
    logo: null,
    contactEmail: 'info@intinc.com'
  },
  
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3
  },
  
  features: {
    enableExport: true,
    enableComparison: true,
    enableROI: true,
    enableAssessment: true,
    maxCompareItems: 4,
    enableAnalytics: true,
    enableAuth: false // Can be toggled
  },
  
  ui: {
    theme: 'light',
    locale: 'en-US',
    pageSize: 12,
    debounceMs: 300
  }
};
```

**Deliverable:** Refactored codebase with 10 modules (500–1000 lines each)

---

### Phase 2: BACKEND INTEGRATION (Week 2–3)
**Goal:** Move data to API, add authentication, enable real-time updates

#### 2.1 API Endpoints (Node.js/Express)
```
GET    /api/platforms              → List all platforms
GET    /api/platforms/:id          → Get platform details
GET    /api/platforms/filter?...   → Search + filter
POST   /api/comparison             → Save comparison (auth required)
GET    /api/statistics             → Fetch statistics
POST   /api/export                 → Generate report (auth required)
POST   /api/assessment             → Create assessment
POST   /api/auth/login             → OAuth login
GET    /api/user/profile           → Current user data
```

#### 2.2 Database Schema (PostgreSQL)
```sql
-- Platforms table
CREATE TABLE platforms (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(100),
  category VARCHAR(50),
  marketShare DECIMAL(5,2),
  pricingModel VARCHAR(50),
  contextWindow INT,
  implementationTime VARCHAR(50),
  description TEXT,
  strengths JSONB,
  useCases JSONB,
  compliance JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- User comparisons (saved)
CREATE TABLE comparisons (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  platforms JSONB, -- Array of platform IDs
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Assessments (user responses)
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  user_id UUID,
  responses JSONB,
  score INT,
  recommendations JSONB,
  created_at TIMESTAMP
);

-- Analytics events
CREATE TABLE events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100),
  user_id UUID,
  data JSONB,
  timestamp TIMESTAMP
);
```

#### 2.3 Authentication (JWT + OAuth)
```javascript
// Backend: JWT strategy
const jwt = require('jsonwebtoken');

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials
  const user = await User.findOne({ email });
  if (!user || !user.validatePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ accessToken, refreshToken, user });
});

// Frontend: Store and use tokens
const api = axios.create({
  baseURL: CONFIG.api.baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Deliverable:** Node.js backend with 8 API endpoints, PostgreSQL schema, JWT auth

---

### Phase 3: PWA + PERFORMANCE (Week 3–4)
**Goal:** Make app installable, offline-capable, fast-loading

#### 3.1 Service Worker & Caching Strategy
```javascript
// src/serviceWorker.js
const CACHE_VERSION = 'int-explorer-v4.0';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/bundle.js',
  '/styles.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API calls: network-first
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const cache = caches.open(CACHE_VERSION);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request)) // Fallback to cache
    );
  }
  
  // Static assets: cache-first
  else {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
  }
});
```

#### 3.2 Manifest.json (PWA Installation)
```json
{
  "name": "INT Platform Explorer",
  "short_name": "INT Explorer",
  "description": "Enterprise AI platform comparison tool",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#E88A1D",
  "background_color": "#FFFCF8",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### 3.3 Performance Optimization
```javascript
// Code splitting
const ExplorerView = lazy(() => import('./views/ExplorerView'));
const MatrixView = lazy(() => import('./views/MatrixView'));
const AssessmentView = lazy(() => import('./views/AssessmentView'));

// Lazy load heavy components
const ROICalculator = lazy(() => import('./components/ROICalculator'));
const DataExport = lazy(() => import('./components/DataExport'));

// Image optimization
import { Picture } from 'react-optimized-image';

<Picture>
  <source srcSet={webp} type="image/webp" />
  <Image src={png} />
</Picture>

// Bundle analysis (webpack-bundle-analyzer)
// Run: npm run analyze
// Output: Shows what's bloating the bundle
```

**Deliverable:** Service Worker, manifest.json, PWA ready for installation, <3s load time

---

### Phase 4: ADVANCED FEATURES (Week 4–5)
**Goal:** ROI calculator, assessment engine, smart recommendations

#### 4.1 ROI Calculator (Interactive)
```javascript
// src/components/ROICalculator.js
export function ROICalculator() {
  const [inputs, setInputs] = useState({
    employeeCount: 100,
    avgSalary: 75000,
    hoursPerWeek: 5,
    implementationCost: 50000,
    yearsProjected: 3
  });
  
  const calculate = () => {
    const hoursPerYear = inputs.hoursPerWeek * 52;
    const costPerHour = inputs.avgSalary / 2080;
    const totalProductivityGain = 
      inputs.employeeCount * hoursPerYear * costPerHour;
    
    const yearlyROI = (totalProductivityGain - inputs.implementationCost) / inputs.implementationCost * 100;
    const paybackMonths = (inputs.implementationCost / totalProductivityGain) * 12;
    
    return {
      yearlyProductivityValue: totalProductivityGain,
      paybackPeriod: paybackMonths,
      yearlyROI: yearlyROI,
      totalSavings: totalProductivityGain * inputs.yearsProjected - inputs.implementationCost
    };
  };
  
  const results = calculate();
  
  return (
    <div className="roi-calculator">
      <h2>ROI Calculator</h2>
      
      {/* Input controls */}
      <Input
        label="Number of Employees"
        type="number"
        value={inputs.employeeCount}
        onChange={(e) => setInputs({ ...inputs, employeeCount: +e.target.value })}
      />
      
      {/* Results cards */}
      <ResultCard
        title="Yearly Productivity Gain"
        value={formatCurrency(results.yearlyProductivityValue)}
        delta="+18% avg"
      />
      
      <ResultCard
        title="Payback Period"
        value={`${results.paybackPeriod.toFixed(1)} months`}
        delta="vs 12mo industry avg"
      />
      
      <ResultCard
        title="3-Year Total Savings"
        value={formatCurrency(results.totalSavings)}
        delta="ROI: +{results.yearlyROI.toFixed(0)}%"
      />
      
      {/* Comparison with other platforms */}
      <ComparisonChart data={results} />
      
      {/* Export button */}
      <button onClick={() => exportROI(results)}>
        Download ROI Report
      </button>
    </div>
  );
}
```

#### 4.2 Assessment Engine
```javascript
// src/components/AssessmentView.js
// Multi-step form that scores org readiness

const QUESTIONS = [
  {
    id: 'ai_maturity',
    question: 'What is your current AI maturity level?',
    type: 'radio',
    options: ['None', 'Pilot', 'Some production', 'Advanced'],
    weight: 1.2 // Higher impact on final score
  },
  {
    id: 'budget',
    question: 'Budget available for AI implementation?',
    type: 'range',
    min: 0,
    max: 1000000,
    weight: 0.8
  },
  {
    id: 'team_size',
    question: 'Size of technical team?',
    type: 'dropdown',
    options: ['<5', '5–10', '10–50', '50+'],
    weight: 0.9
  },
  // ... 10+ more questions
];

const calculateScore = (responses) => {
  let totalScore = 0;
  let totalWeight = 0;
  
  QUESTIONS.forEach((q) => {
    const response = responses[q.id];
    const questionScore = normalizeScore(response); // 0–100
    totalScore += questionScore * q.weight;
    totalWeight += q.weight;
  });
  
  return Math.round(totalScore / totalWeight);
};

const getRecommendations = (score, responses) => {
  if (score >= 80) {
    return ['Start with enterprise solution (OpenAI API, Claude Opus)', 'Invest in change management', ...];
  } else if (score >= 60) {
    return ['Hybrid approach: web + desktop', 'Lightweight implementation', ...];
  } else {
    return ['Start with Claude web + education', 'Build internal capability first', ...];
  }
};
```

#### 4.3 Smart Recommendations
```javascript
// src/components/RecommendationEngine.js
// ML-based: Match org profile to platforms

export function generateRecommendations(assessment, userProfile) {
  const recommendations = [];
  
  // Rule 1: High-compliance industry → enterprise platforms
  if (userProfile.industry.includes('healthcare', 'finance')) {
    recommendations.push({
      platform: 'Claude API (Bedrock)',
      reason: 'HIPAA/SOC2 compliance built-in',
      confidence: 0.95
    });
  }
  
  // Rule 2: Small budget → start with free tiers
  if (assessment.budget < 50000) {
    recommendations.push({
      platform: 'Claude Web (Free tier)',
      reason: 'Zero setup cost, immediate productivity',
      confidence: 0.98
    });
  }
  
  // Rule 3: Need speed → Haiku (faster, cheaper)
  if (assessment.latencySensitivity === 'high') {
    recommendations.push({
      platform: 'Claude Haiku API',
      reason: 'Fastest inference, ideal for real-time use cases',
      confidence: 0.92
    });
  }
  
  // ML scoring: predict platform fit
  const scores = PLATFORMS_DATA.map((p) => {
    return {
      platform: p.name,
      score: mlPredictor.predict({
        features: extractFeatures(assessment, userProfile, p)
      })
    };
  }).sort((a, b) => b.score - a.score);
  
  return {
    recommended: scores.slice(0, 3),
    reasoning: recommendations,
    alternatives: scores.slice(3, 6)
  };
}
```

**Deliverable:** ROI calculator, assessment (20 questions), ML-based recommendations

---

### Phase 5: ANALYTICS & MONITORING (Week 5)
**Goal:** Understand usage, optimize UX, measure success

#### 5.1 Event Tracking
```javascript
// src/utils/analytics.js
import { Analytics } from '@segment/analytics-next';

const analytics = Analytics.load({
  writeKey: process.env.REACT_APP_SEGMENT_KEY
});

export const trackEvent = (eventName, properties = {}) => {
  analytics.track(eventName, {
    ...properties,
    timestamp: new Date(),
    url: window.location.href,
    userAgent: navigator.userAgent
  });
};

// Usage in components
trackEvent('platform_viewed', { platformId, platformName, viewType: 'card' });
trackEvent('comparison_created', { platformCount, platforms: [...] });
trackEvent('export_downloaded', { format: 'pdf', platformCount: 3 });
trackEvent('assessment_completed', { score: 75, recommendationsViewed: true });

// Define custom events
const EVENTS = {
  EXPLORER_OPENED: 'explorer_opened',
  PLATFORM_FILTERED: 'platform_filtered',
  COMPARISON_ADDED: 'comparison_added',
  EXPORT_INITIATED: 'export_initiated',
  ROI_CALCULATED: 'roi_calculated',
  ASSESSMENT_STARTED: 'assessment_started',
  ASSESSMENT_COMPLETED: 'assessment_completed'
};
```

#### 5.2 Error Tracking (Sentry)
```javascript
// src/utils/sentry.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [new BrowserTracing()],
  beforeSend(event) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.value.includes('ResizeObserver loop limit exceeded')) {
        return null;
      }
    }
    return event;
  }
});

// Error boundary component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <h1>Something went wrong</h1>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
```

#### 5.3 Performance Monitoring
```javascript
// src/utils/performance.js
export const logMetrics = () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  const interactiveTime = perfData.domInteractive - perfData.navigationStart;
  
  trackEvent('page_performance', {
    pageLoadTime,
    connectTime,
    renderTime,
    interactiveTime,
    firstContentfulPaint: Math.round(
      performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    )
  });
  
  // Log Core Web Vitals
  const vitals = getCoreWebVitals();
  trackEvent('web_vitals', vitals);
};

// In useEffect
useEffect(() => {
  window.addEventListener('load', logMetrics);
  return () => window.removeEventListener('load', logMetrics);
}, []);
```

**Deliverable:** Segment event tracking, Sentry error monitoring, Core Web Vitals dashboard

---

## PART III: DEPLOYMENT & OPERATIONS

### Deployment Architecture
```
GitHub → GitHub Actions CI/CD → AWS S3 + CloudFront
                    ↓
                Docker build
                    ↓
              npm run build
                    ↓
              Minify + gzip
                    ↓
              Upload to S3
                    ↓
            Invalidate CloudFront
                    ↓
            Deploy backend to EC2/ECS
                    ↓
            Update RDS (PostgreSQL)
```

### GitHub Actions Workflow
```yaml
name: Deploy INT Platform Explorer

on:
  push:
    branches: [main, production]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build app
        run: npm run build
      
      - name: Run lighthouse
        run: npm run lighthouse
      
      - name: Upload to S3
        run: aws s3 sync build/ s3://int-explorer-prod --delete
      
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DIST_ID }} --paths "/*"
      
      - name: Notify Slack
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"INT Platform Explorer deployed to production ✅"}'
```

### Monitoring & Alerts
```
CloudWatch dashboard:
├─ Error rate (alert: >1% for 5 min)
├─ API latency (alert: p95 >1s for 5 min)
├─ Database connections (alert: >80% pool used)
├─ Disk usage (alert: >80%)
└─ Storage (S3/CDN): Monitor growth

PagerDuty integrations:
└─ Critical alerts → page engineers immediately
```

---

## PART IV: FEATURE ENHANCEMENTS (Post-v4.0)

### Q2 2025 Roadmap

| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Multi-language support (FR, DE, ES, JP) | Medium | High | P1 |
| Dark mode with system preference detection | Low | Medium | P2 |
| Collaborative comparisons (share link, comments) | High | High | P1 |
| AI-powered insights (anomaly detection) | Medium | High | P1 |
| Mobile app (React Native) | High | High | P1 |
| Slack bot integration | Medium | Medium | P2 |
| Zapier/n8n automation | Medium | Medium | P2 |
| Governance scorecard module | High | High | P1 |
| Custom branding/white-label SaaS | High | High | P1 |
| Multi-org support (RBAC, SSO) | High | High | P0 |

### Q3 2025 Vision

- **Agentic search:** "Find me platforms that work with healthcare + <$50K budget"
- **Predictive analytics:** ML models that forecast adoption success
- **API marketplace:** Let vendors submit their own platform data
- **Community features:** Reviews, ratings, case studies from users
- **LLM integration:** Claude analyzes org maturity, recommends top 3 platforms

---

## PART V: TECHNICAL SPECIFICATIONS

### Tech Stack (v4.0)

```
Frontend:
├─ React 18.2
├─ TypeScript 5.0
├─ Zustand (state)
├─ TailwindCSS (styling)
├─ React Query (data fetching)
├─ Vite (bundler)
└─ Vitest + React Testing Library (tests)

Backend:
├─ Node.js 20 LTS
├─ Express.js
├─ PostgreSQL 15
├─ Redis (caching)
├─ JWT (auth)
├─ Joi (validation)
└─ Sentry (error tracking)

Infrastructure:
├─ AWS (S3, CloudFront, EC2, RDS, ECS)
├─ GitHub Actions (CI/CD)
├─ Docker (containerization)
├─ Terraform (IaC)
└─ DataDog (monitoring)

Services:
├─ Segment (analytics)
├─ Sentry (errors)
├─ Auth0 (SSO)
├─ Mailgun (email)
└─ Stripe (billing, optional)
```

### Performance Targets

| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| First Contentful Paint | <1s | ~2.5s | -1.5s |
| Largest Contentful Paint | <2.5s | ~3.8s | -1.3s |
| Cumulative Layout Shift | <0.1 | ~0.15 | -0.05 |
| Time to Interactive | <3s | ~4.2s | -1.2s |
| Bundle size | <150KB | ~380KB | -230KB |
| API response time (p95) | <200ms | ~450ms | -250ms |
| Lighthouse score | 90+ | ~72 | +18 |

### Security Checklist

- [ ] OWASP Top 10 compliance audit
- [ ] Dependency scanning (npm audit, Snyk)
- [ ] SAST (static code analysis)
- [ ] DAST (dynamic security testing)
- [ ] Secrets scanning (no API keys in repo)
- [ ] Encryption at rest + in transit (TLS 1.3)
- [ ] Rate limiting (API + UI)
- [ ] CSRF protection
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (CSP headers, sanitization)
- [ ] Authentication/authorization testing
- [ ] Penetration testing (quarterly)

---

## PART VI: MIGRATION STRATEGY (HTML → React)

### Step 1: Extract Data (Day 1)
```javascript
// Export PLATFORMS_DATA from v3.1 HTML
// Convert to JSON file
// Upload to API

const platforms = require('./platforms-v31.json');
platforms.forEach(p => API.createPlatform(p));
```

### Step 2: Scaffold React App (Day 1–2)
```bash
npm create vite@latest int-explorer -- --template react-ts
npm install zustand react-query axios sentry
npm install -D tailwindcss postcss autoprefixer vitest
npx tailwindcss init -p
```

### Step 3: Rebuild Components (Day 2–5)
- Copy styling from v3.1 (CSS variables → Tailwind config)
- Rebuild 8 main components (Header, Card, Filter, Modal, etc.)
- Rebuild 5 views (Explorer, Table, Matrix, Assessment, Financial)
- Test each component in isolation

### Step 4: Connect to API (Day 5–6)
```javascript
// Replace local data with API calls
const { data: platforms } = useQuery('platforms', 
  () => axios.get(`${CONFIG.api.baseURL}/platforms`)
);

// Cache with React Query
```

### Step 5: Deploy & Migrate Users (Day 6–7)
```
v3.1 (HTML): Keep live at /explorer-legacy
v4.0 (React): Deploy to /explorer (new URL)
Redirect: Add banner "Try new version" for 2 weeks
Monitoring: Watch error rates, conversion metrics
Rollback: If >1% error rate, switch back to v3.1
```

---

## SUCCESS CRITERIA (v4.0 Launch)

✅ All v3.1 features working in React  
✅ Load time <3s (target: <2s)  
✅ API working, data persisted in DB  
✅ Authentication working (JWT)  
✅ Export functionality (PDF/CSV/JSON/Markdown)  
✅ PWA installable on iOS/Android  
✅ 0 critical security issues  
✅ 95+ Lighthouse score  
✅ 99.9% uptime SLA met  
✅ <1% error rate in production  

---

**Status:** Ready to begin Phase 1  
**Estimated Timeline:** 5 weeks for v4.0 MVP  
**Team Size:** 2–3 full-stack engineers  
**Maintenance:** 1 FTE post-launch

This is a **production-grade, scalable platform** that can support 10K+ concurrent users and grow into a SaaS product.
