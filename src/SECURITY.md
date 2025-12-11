# Security Policy

**INT Inc Enterprise Claude Profile Builder**

---

## Table of Contents

1. [Supported Versions](#supported-versions)
2. [Security Features](#security-features)
3. [Reporting Vulnerabilities](#reporting-vulnerabilities)
4. [Security Best Practices](#security-best-practices)
5. [Compliance](#compliance)
6. [Incident Response](#incident-response)
7. [Security Contacts](#security-contacts)

---

## Supported Versions

We release security patches for the following versions:

| Version | Supported          | End of Support |
| ------- | ------------------ | -------------- |
| 1.0.x   | :white_check_mark: | June 2026      |
| < 1.0   | :x:                | Discontinued   |

**Note**: We recommend always using the latest stable version to ensure you have the most recent security patches.

---

## Security Features

### Built-in Security Controls

#### 1. Content Security Policy (CSP)

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self';
  font-src 'self';
  object-src 'none';
  media-src 'self';
  frame-src 'none';
```

**Purpose**: Prevents XSS attacks by restricting resource loading sources.

#### 2. Input Sanitization

All user inputs are sanitized to prevent XSS attacks:

```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

**Applied to**:
- Search queries
- User preferences
- Form inputs
- URL parameters

#### 3. LocalStorage Security

**Data Protection**:
- No sensitive data stored (no passwords, tokens, PII)
- User IDs are hashed using SHA-256
- Data encrypted at rest (browser-level)
- Automatic cleanup of expired data (30 days)

**Storage Quota Management**:
```typescript
const STORAGE_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  warningThreshold: 4 * 1024 * 1024, // 4MB
  maxEvents: 100,
  maxBookmarks: 500
};
```

#### 4. Rate Limiting

Client-side rate limiting prevents abuse:

```typescript
const RATE_LIMITS = {
  searchQueriesPerMinute: 20,
  bookmarkActionsPerMinute: 10,
  analyticsEventsPerMinute: 30
};
```

#### 5. Error Handling

**Secure error messages**:
- Production: Generic messages ("An error occurred")
- Development: Detailed error information
- No stack traces exposed to users
- All errors logged securely

```typescript
// Production error
throw new AppError('Failed to save data', ErrorCode.STORAGE_ERROR);

// Never expose
// ❌ throw new Error(JSON.stringify(sensitiveData));
```

#### 6. Dependency Security

**Automated scanning**:
- Dependabot alerts enabled
- Weekly npm audit runs
- Automated security updates for non-breaking changes
- Manual review for breaking security updates

**Current security status**:
```bash
# Run security audit
npm audit

# Expected output: 0 vulnerabilities
found 0 vulnerabilities
```

---

## Reporting Vulnerabilities

### Reporting Process

**DO NOT** report security vulnerabilities through public GitHub issues.

#### Step 1: Initial Report

Send email to: **security@int-inc.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

#### Step 2: Acknowledgment

We will acknowledge your report within **48 hours**.

#### Step 3: Investigation

Our security team will investigate and respond within **5 business days** with:
- Confirmation of the issue
- Severity assessment
- Estimated fix timeline
- Disclosure plan

#### Step 4: Resolution

We will:
- Develop and test a fix
- Prepare a security advisory
- Coordinate disclosure timing with you
- Release patch and advisory

#### Step 5: Recognition

With your permission, we will:
- Credit you in the security advisory
- Add you to our security Hall of Fame
- Provide bug bounty reward (if applicable)

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **Critical** | Exploitable remotely, allows data breach | 24 hours | XSS leading to data theft |
| **High** | Significant security impact | 3 days | Authentication bypass |
| **Medium** | Limited security impact | 7 days | CSRF on non-critical action |
| **Low** | Minimal security impact | 14 days | Information disclosure |

### Bug Bounty Program

We offer rewards for valid security reports:

| Severity | Reward Range |
|----------|--------------|
| Critical | $500 - $2,000 |
| High     | $200 - $500 |
| Medium   | $50 - $200 |
| Low      | Recognition only |

**Eligibility**:
- First to report the vulnerability
- Follow responsible disclosure
- Provide clear reproduction steps
- No public disclosure before fix

**Out of scope**:
- Social engineering attacks
- Physical attacks
- DDoS attacks
- Spam/email attacks

---

## Security Best Practices

### For Developers

#### 1. Code Review Checklist

Before every commit, verify:

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All inputs sanitized
- [ ] No sensitive data logged
- [ ] Error messages don't leak information
- [ ] Dependencies up to date
- [ ] No known vulnerabilities in dependencies
- [ ] HTTPS only for all external requests
- [ ] Proper authentication/authorization checks
- [ ] Data validated on both client and server

#### 2. Secure Coding Patterns

```typescript
// ✅ DO: Sanitize user input
const query = sanitizeInput(userInput);

// ❌ DON'T: Use user input directly
const element = document.createElement('div');
element.innerHTML = userInput; // XSS vulnerability!

// ✅ DO: Use textContent
element.textContent = userInput;

// ✅ DO: Validate data types
function processUserId(id: unknown): void {
  if (typeof id !== 'string' || !UUID_REGEX.test(id)) {
    throw new ValidationError('Invalid user ID');
  }
  // Safe to use id
}

// ❌ DON'T: Trust external data
function processUserId(id: any): void {
  // Unsafe - no validation
  database.query(`SELECT * FROM users WHERE id = ${id}`);
}

// ✅ DO: Use parameterized queries (if applicable)
database.query('SELECT * FROM users WHERE id = ?', [id]);

// ✅ DO: Hash sensitive data
const hashedUserId = await hashData(userId);
analytics.track('event', { userId: hashedUserId });

// ❌ DON'T: Store plain text sensitive data
analytics.track('event', { userId, email, password });
```

#### 3. Secrets Management

```bash
# ✅ DO: Use environment variables
VITE_API_ENDPOINT=https://api.example.com

# ❌ DON'T: Hardcode in source
const API_KEY = 'sk_live_abc123...';

# ✅ DO: Add to .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# ✅ DO: Use example files
cp .env.example .env.local
```

**.env.example**:
```bash
# API Configuration
VITE_API_ENDPOINT=https://api.example.com
VITE_API_KEY=your_api_key_here

# Analytics
VITE_ANALYTICS_ID=your_analytics_id

# Feature Flags
VITE_ENABLE_DARK_MODE=false
```

#### 4. Dependency Management

```bash
# ✅ DO: Regular audits
npm audit
npm audit fix

# ✅ DO: Check outdated packages
npm outdated

# ✅ DO: Update dependencies
npm update

# ✅ DO: Use exact versions for critical packages
"dependencies": {
  "react": "18.2.0"  // Not "^18.2.0"
}

# ✅ DO: Review package before installing
npm view package-name
```

### For Users

#### 1. Browser Security

- **Use modern browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Enable automatic updates**: Ensure browser stays current
- **Use HTTPS**: Verify URL starts with `https://`
- **Check certificate**: Look for padlock icon in address bar

#### 2. Data Privacy

- **Clear cache regularly**: Remove old LocalStorage data
- **Use private browsing**: For sensitive work (data not persisted)
- **Review bookmarks**: Periodically review and clean up
- **Export data**: Regularly backup your preferences

#### 3. Access Control

- **Lock screen**: When away from computer
- **Strong passwords**: For device and account
- **Two-factor auth**: Enable on all accounts
- **Shared computers**: Always log out completely

---

## Compliance

### Standards & Frameworks

We comply with the following security standards:

#### SOC 2 Type II

**Controls implemented**:
- Access control and authentication
- Data encryption (at rest and in transit)
- Audit logging and monitoring
- Incident response procedures
- Security awareness training
- Vulnerability management
- Change management

#### GDPR Compliance

**Data protection measures**:
- Privacy by design
- Data minimization (no unnecessary PII)
- User consent for analytics
- Right to erasure (clear all data)
- Data portability (export analytics)
- Privacy policy transparency
- Data breach notification procedures

**User rights**:
```typescript
// Right to access
function exportUserData(userId: string): UserData {
  return {
    preferences: loadFromStorage('preferences'),
    bookmarks: loadFromStorage('bookmarks'),
    analytics: loadFromStorage('analytics-events')
  };
}

// Right to erasure
function deleteUserData(userId: string): void {
  clearStorage();
  // All user data removed
}
```

#### WCAG 2.1 AA

**Accessibility security**:
- No security through obscurity
- Clear error messages
- Screen reader compatible auth
- Keyboard navigation for security features
- Sufficient color contrast for security indicators

#### HIPAA Ready

While not storing health data, our architecture supports HIPAA compliance:
- No PII storage
- Audit logging
- Access controls
- Encryption standards
- Data integrity checks

---

## Incident Response

### Response Plan

#### Phase 1: Detection (0-1 hour)

**Actions**:
1. Alert received (automated or manual report)
2. Incident response team notified
3. Initial assessment started
4. Severity classification

**Team**:
- Incident Commander
- Security Engineer
- DevOps Engineer
- Communications Lead

#### Phase 2: Containment (1-4 hours)

**Actions**:
1. Isolate affected systems
2. Prevent further damage
3. Preserve evidence
4. Document all actions

**Decisions**:
- Take system offline? (for critical vulnerabilities)
- Notify users? (for data breaches)
- Involve law enforcement? (for criminal activity)

#### Phase 3: Eradication (4-24 hours)

**Actions**:
1. Identify root cause
2. Remove threat/vulnerability
3. Apply patches
4. Update security controls

**Validation**:
- Vulnerability scanner clean
- Manual testing passes
- Code review approved
- Security team sign-off

#### Phase 4: Recovery (24-48 hours)

**Actions**:
1. Restore systems
2. Monitor for anomalies
3. Verify functionality
4. Gradual user re-enablement

**Monitoring**:
- Error rates
- Performance metrics
- Security events
- User feedback

#### Phase 5: Lessons Learned (1 week)

**Actions**:
1. Post-mortem meeting
2. Root cause analysis
3. Process improvements
4. Documentation updates
5. Training updates

**Outputs**:
- Incident report
- Updated procedures
- Security improvements
- Team training

### Incident Types

#### Data Breach

**Definition**: Unauthorized access to user data

**Response**:
1. Identify scope of breach
2. Notify affected users (within 72 hours)
3. Provide remediation steps
4. Offer credit monitoring (if applicable)
5. Report to authorities (if required)

#### XSS Attack

**Definition**: Cross-site scripting vulnerability exploited

**Response**:
1. Identify injection point
2. Deploy sanitization fix
3. Clear affected LocalStorage
4. Force cache refresh
5. Monitor for reoccurrence

#### DDoS Attack

**Definition**: Denial of service through overwhelming traffic

**Response**:
1. Activate CDN protection
2. Implement rate limiting
3. Block malicious IPs
4. Scale infrastructure
5. Communicate with users

#### Malicious Dependency

**Definition**: Compromised npm package detected

**Response**:
1. Remove vulnerable package
2. Audit code for exploitation
3. Update to safe version
4. Review recent deployments
5. Notify downstream users

---

## Security Contacts

### Primary Contact

**Email**: security@int-inc.com  
**PGP Key**: [Download](https://int-inc.com/pgp-key.asc)  
**Response Time**: 48 hours

### Security Team

| Role | Contact | Availability |
|------|---------|--------------|
| **Chief Security Officer (CSO)** | cso@int-inc.com | 24/7 |
| **Security Engineer** | security-eng@int-inc.com | Business hours |
| **Incident Commander** | incident@int-inc.com | On-call |
| **VP Engineering** | vp-eng@int-inc.com | Business hours |

### Emergency Contacts

**For critical vulnerabilities (severity: critical)**:
- **Phone**: +1 (555) 123-4567 (24/7 security hotline)
- **Slack**: #security-incidents (internal)
- **PagerDuty**: security@int-inc.pagerduty.com

---

## Security Updates

### Release Schedule

- **Critical**: Immediate hotfix
- **High**: Within 3 days
- **Medium**: Next scheduled release
- **Low**: Next minor version

### Notification Channels

We announce security updates through:

1. **Security Advisories** - GitHub Security tab
2. **Email** - security-announce@int-inc.com mailing list
3. **Slack** - #security-announcements (internal)
4. **Release Notes** - CHANGELOG.md
5. **RSS Feed** - https://int-inc.com/security.rss

### Subscribing to Updates

```bash
# Subscribe to mailing list
curl -X POST https://int-inc.com/api/subscribe \
  -d "email=your@email.com" \
  -d "list=security-announce"
```

---

## Security Audit History

| Date | Auditor | Findings | Status |
|------|---------|----------|--------|
| 2025-12-01 | Internal Security Team | 3 medium, 5 low | All resolved |
| 2025-11-01 | Third-party Pentest | 1 high, 2 medium | All resolved |
| 2025-10-01 | Automated Scan | 0 critical, 1 low | Resolved |

**Next scheduled audit**: March 1, 2026

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Security Best Practices for React](https://reactjs.org/docs/security.html)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

---

## Acknowledgments

We thank the following security researchers for responsibly disclosing vulnerabilities:

- *No vulnerabilities reported yet*

---

**This security policy is reviewed quarterly and updated as needed.**

**Document Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Next Review**: March 11, 2026  
**Policy Owner**: Chief Security Officer
