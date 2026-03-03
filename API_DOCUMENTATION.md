# API Documentation - Enterprise Profile Builder

## Overview

This document describes the API endpoints, data structures, and integration patterns for the Enterprise Profile Builder application.

## Base URLs

- **Development**: `http://localhost:54321`
- **Staging**: `https://staging-api.enterpriseprofilebuilder.com`
- **Production**: `https://api.enterpriseprofilebuilder.com`

## Authentication

### Supabase Authentication

All authenticated requests require a valid JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Getting an Access Token

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const accessToken = data.session?.access_token
```

## Core Data Types

### User Profile

```typescript
interface UserProfile {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
}
```

### Deployment Task

```typescript
interface DeploymentTask {
  id: string;
  phase: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
```

### Bookmark

```typescript
interface Bookmark {
  id: string;
  user_id: string;
  resource_id: string;
  resource_type: 'feature' | 'tool' | 'faq' | 'role';
  created_at: string;
}
```

## API Endpoints

### Authentication Endpoints

#### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**: `200 OK`
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { ... }
}
```

#### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer <access_token>
```

### User Profile Endpoints

#### Get Current User Profile
```http
GET /rest/v1/profiles?select=*
Authorization: Bearer <access_token>
```

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "Engineering",
  "preferences": { ... }
}
```

#### Update User Profile
```http
PATCH /rest/v1/profiles?id=eq.<user_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "preferences": {
    "theme": "dark",
    "fontSize": "medium"
  }
}
```

### Deployment Task Endpoints

#### List All Tasks
```http
GET /rest/v1/deployment_tasks?select=*&order=priority.desc,phase.asc
Authorization: Bearer <access_token>
```

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "phase": 1,
    "title": "Define Security Baseline",
    "status": "completed",
    "priority": "critical"
  }
]
```

#### Create Task
```http
POST /rest/v1/deployment_tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phase": 1,
  "title": "New Task",
  "description": "Task description",
  "priority": "high"
}
```

#### Update Task Status
```http
PATCH /rest/v1/deployment_tasks?id=eq.<task_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /rest/v1/deployment_tasks?id=eq.<task_id>
Authorization: Bearer <access_token>
```

### Bookmark Endpoints

#### List User Bookmarks
```http
GET /rest/v1/bookmarks?user_id=eq.<user_id>&select=*
Authorization: Bearer <access_token>
```

#### Add Bookmark
```http
POST /rest/v1/bookmarks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "resource_id": "feature-artifacts",
  "resource_type": "feature"
}
```

#### Remove Bookmark
```http
DELETE /rest/v1/bookmarks?id=eq.<bookmark_id>
Authorization: Bearer <access_token>
```

### Search Endpoints

#### Search Content
```http
GET /rest/v1/rpc/search_content
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "search_query": "prompt engineering"
}
```

**Response**: `200 OK`
```json
[
  {
    "id": "result-1",
    "title": "Prompt Engineering Best Practices",
    "section": "best-practices",
    "content": "...",
    "relevance": 95
  }
]
```

### Analytics Endpoints (Future)

#### Track Event
```http
POST /rest/v1/analytics_events
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "event_name": "page_view",
  "properties": {
    "page": "/features",
    "duration": 45
  }
}
```

## Real-time Subscriptions

Supabase provides real-time updates via WebSockets.

### Subscribe to Task Updates

```typescript
const channel = supabase
  .channel('deployment-tasks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'deployment_tasks'
    },
    (payload) => {
      console.log('Task updated:', payload)
    }
  )
  .subscribe()
```

### Subscribe to User Profile Changes

```typescript
const channel = supabase
  .channel('profile-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${userId}`
    },
    (payload) => {
      console.log('Profile updated:', payload)
    }
  )
  .subscribe()
```

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

- **Anonymous requests**: 60 requests/minute
- **Authenticated requests**: 300 requests/minute
- **Search requests**: 100 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1640000000
```

## Pagination

For list endpoints, use `limit` and `offset` parameters:

```http
GET /rest/v1/deployment_tasks?limit=20&offset=40
```

**Response includes range header**:
```
Content-Range: 40-59/120
```

## Filtering and Sorting

Supabase supports powerful query operators:

```http
GET /rest/v1/deployment_tasks?status=eq.completed&priority=in.(high,critical)&order=created_at.desc
```

### Operators
- `eq` - equals
- `neq` - not equals
- `gt` - greater than
- `gte` - greater than or equal
- `lt` - less than
- `lte` - less than or equal
- `in` - in list
- `like` - pattern matching
- `ilike` - case-insensitive pattern matching

## SDKs and Client Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

### Python
```bash
pip install supabase
```

### Go
```bash
go get github.com/supabase-community/supabase-go
```

## Webhook Integration (Future)

Subscribe to events via webhooks:

```http
POST /api/webhooks
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["task.completed", "profile.updated"],
  "secret": "your_webhook_secret"
}
```

## Testing

### Postman Collection
Download the Postman collection: [Link to collection]

### cURL Examples

#### Get deployment tasks
```bash
curl -X GET \
  'https://api.example.com/rest/v1/deployment_tasks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'apikey: YOUR_ANON_KEY'
```

#### Create a bookmark
```bash
curl -X POST \
  'https://api.example.com/rest/v1/bookmarks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "resource_id": "feature-artifacts",
    "resource_type": "feature"
  }'
```

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** - never in localStorage for sensitive apps
3. **Handle token refresh** - implement automatic token refresh
4. **Implement retry logic** - with exponential backoff
5. **Validate responses** - don't trust API responses blindly
6. **Log API errors** - for debugging and monitoring
7. **Use connection pooling** - for better performance
8. **Implement caching** - reduce API calls where appropriate

## Support

For API issues or questions:
- GitHub Issues: [Link]
- Email: api-support@enterpriseprofilebuilder.com
- Documentation: [Link]

---

**Version**: 1.0.0  
**Last Updated**: December 2025
