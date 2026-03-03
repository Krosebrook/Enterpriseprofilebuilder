# AI Prompt Grading API - Technical Specification

**Version:** 1.0.0  
**Last Updated:** December 26, 2025  
**Status:** Draft

---

## Overview

This document provides the complete API specification for the AI-Powered Prompt Grading System, including all endpoints, request/response formats, authentication, and error handling.

## Base URL

```
Development: http://localhost:54321/functions/v1
Staging:     https://staging.enterpriseprofilebuilder.com/functions/v1
Production:  https://api.enterpriseprofilebuilder.com/functions/v1
```

## Authentication

All requests must include a valid Supabase JWT token:

```http
Authorization: Bearer <supabase_access_token>
apikey: <supabase_anon_key>
```

### Getting a Token

```typescript
const { data: { session }, error } = await supabase.auth.getSession();
const accessToken = session?.access_token;
```

---

## Endpoints

### 1. Evaluate Prompt

Grade a user's prompt and provide detailed feedback.

**Endpoint:** `POST /grade-prompt`

**Rate Limit:** 10 requests per minute per user

**Request Body:**

```typescript
interface EvaluatePromptRequest {
  prompt: string;              // 10-5000 characters
  scenario_id: string;         // Must be valid scenario ID
  user_id?: string;           // Optional, defaults to auth user
  attempt_number?: number;     // Optional, auto-incremented
  context?: {
    skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    previous_scores?: number[];
    focus_areas?: string[];
  };
}
```

**Example Request:**

```bash
curl -X POST https://api.example.com/functions/v1/grade-prompt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a function to validate email addresses using regex. Handle common edge cases like multiple @ symbols or missing domains.",
    "scenario_id": "basic-coding-task",
    "context": {
      "skill_level": "beginner",
      "focus_areas": ["clarity", "completeness"]
    }
  }'
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "result_id": "550e8400-e29b-41d4-a716-446655440000",
    "grade": {
      "overall_score": 8.5,
      "max_score": 10,
      "category": "good",
      "breakdown": {
        "clarity": 9.0,
        "specificity": 8.5,
        "structure": 8.0,
        "completeness": 8.5,
        "best_practices": 8.5
      }
    },
    "feedback": {
      "strengths": [
        "Clear task definition with specific goal",
        "Mentioned edge cases explicitly",
        "Appropriate level of detail for the task"
      ],
      "improvements": [
        "Consider specifying the output format (return boolean vs throw exception)",
        "Define behavior for whitespace in email addresses"
      ],
      "suggestions": [
        {
          "type": "enhancement",
          "text": "Add an example of expected input/output to guide implementation",
          "example": "For example: validateEmail('user@example.com') should return true, while validateEmail('invalid@@email.com') should return false."
        },
        {
          "type": "best_practice",
          "text": "Consider using a well-tested library instead of custom regex",
          "learnMoreUrl": "/docs/best-practices/email-validation"
        }
      ]
    },
    "comparison": {
      "exemplar_prompt": "Write a TypeScript function named validateEmail that takes a string as input and returns a boolean indicating whether it's a valid email address...",
      "similarity_score": 85,
      "user_prompt_delta": "Your prompt is 85% similar to the exemplar. Consider adding explicit output format specification and error handling behavior."
    },
    "next_steps": {
      "unlocked": false,
      "retry_suggested": true,
      "advancement_available": false,
      "message": "Good job! Score 9.0+ to unlock advanced scenarios in this category."
    },
    "metadata": {
      "evaluation_time_ms": 1250,
      "model": "claude-3-5-sonnet-20241022",
      "prompt_tokens": 342,
      "response_tokens": 156,
      "cost_usd": 0.0023,
      "timestamp": "2026-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Invalid Input
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Prompt validation failed",
    "details": [
      {
        "field": "prompt",
        "issue": "Prompt must be between 10 and 5000 characters",
        "current_value": 8
      }
    ]
  }
}

// 401 Unauthorized - Missing/Invalid Token
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Valid authentication token required",
    "details": "Token expired or invalid"
  }
}

// 404 Not Found - Invalid Scenario
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Scenario not found",
    "details": "Scenario ID 'invalid-scenario' does not exist"
  }
}

// 429 Too Many Requests - Rate Limited
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Maximum 10 evaluations per minute exceeded",
    "retry_after": 42,
    "metadata": {
      "limit": 10,
      "window": "1m",
      "reset_at": "2026-01-15T10:32:00Z",
      "requests_made": 10,
      "requests_remaining": 0
    }
  }
}

// 500 Internal Server Error - Service Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req_abc123",
    "details": "Please try again or contact support if the problem persists"
  }
}

// 503 Service Unavailable - Claude API Down
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "AI grading service temporarily unavailable",
    "retry_after": 60,
    "details": "The grading service is experiencing high demand. Please try again in a moment."
  }
}
```

---

### 2. Get User Progress

Retrieve a user's grading progress and statistics.

**Endpoint:** `GET /grade-prompt/progress/:userId`

**Rate Limit:** 30 requests per minute per user

**Path Parameters:**
- `userId`: UUID of the user (must match authenticated user or have admin role)

**Query Parameters:**

```typescript
interface ProgressQueryParams {
  timeRange?: 'day' | 'week' | 'month' | 'all'; // Default: 'week'
  includeDetails?: boolean;                       // Default: false
  categoryFilter?: string;                        // Filter by scenario category
}
```

**Example Request:**

```bash
curl -X GET "https://api.example.com/functions/v1/grade-prompt/progress/550e8400-e29b-41d4-a716-446655440000?timeRange=month&includeDetails=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "summary": {
      "total_attempts": 45,
      "average_score": 8.2,
      "improvement_rate": 1.2,
      "skill_level": "intermediate",
      "scenarios_completed": 12,
      "scenarios_mastered": 8,
      "total_time_spent_minutes": 180,
      "current_streak_days": 7,
      "longest_streak_days": 14
    },
    "trends": {
      "score_history": [
        { "date": "2026-01-01", "average_score": 6.5, "attempts": 3 },
        { "date": "2026-01-08", "average_score": 7.8, "attempts": 5 },
        { "date": "2026-01-15", "average_score": 8.2, "attempts": 4 }
      ],
      "category_performance": {
        "clarity": 8.5,
        "specificity": 8.0,
        "structure": 7.5,
        "completeness": 8.2,
        "best_practices": 8.8
      }
    },
    "weak_areas": ["structure", "edge_case_handling"],
    "strengths": ["clarity", "best_practices"],
    "recommendations": [
      {
        "area": "structure",
        "message": "Practice organizing complex prompts with numbered sections",
        "scenario_id": "advanced-structure-001",
        "priority": "high"
      }
    ],
    "achievements": [
      {
        "id": "first-excellent-score",
        "title": "Excellence Achieved!",
        "description": "Scored 9.0 or higher for the first time",
        "unlocked_at": "2026-01-10T14:30:00Z",
        "icon": "🏆",
        "rarity": "rare"
      }
    ],
    "recent_attempts": [
      {
        "result_id": "...",
        "scenario_id": "basic-coding-task",
        "overall_score": 8.5,
        "timestamp": "2026-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 3. Generate Practice Scenarios

Generate personalized practice scenarios based on user's weak areas.

**Endpoint:** `POST /grade-prompt/generate-practice`

**Rate Limit:** 5 requests per hour per user

**Request Body:**

```typescript
interface GeneratePracticeRequest {
  user_id?: string;                    // Optional, defaults to auth user
  focus_areas?: string[];              // Areas to focus on
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  count?: number;                      // 1-5, default: 3
  exclude_completed?: boolean;         // Skip already mastered scenarios
}
```

**Example Request:**

```bash
curl -X POST https://api.example.com/functions/v1/grade-prompt/generate-practice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "focus_areas": ["specificity", "edge_cases"],
    "difficulty": "intermediate",
    "count": 3,
    "exclude_completed": true
  }'
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "scenarios": [
      {
        "id": "generated-scenario-001",
        "title": "Data Validation with Edge Cases",
        "description": "Create a prompt that handles null values, empty strings, and malformed data",
        "difficulty": "intermediate",
        "estimated_time_minutes": 10,
        "category": ["data-handling", "validation"],
        "learning_objectives": [
          "Handle edge cases explicitly",
          "Define error handling behavior",
          "Specify input validation rules"
        ],
        "prerequisites": ["basic-validation"],
        "relevance_score": 95
      },
      {
        "id": "generated-scenario-002",
        "title": "API Error Response Specification",
        "description": "Write a prompt for generating consistent API error responses",
        "difficulty": "intermediate",
        "estimated_time_minutes": 15,
        "category": ["api-design", "specificity"],
        "learning_objectives": [
          "Define specific output formats",
          "Consider multiple error scenarios",
          "Maintain consistency across cases"
        ],
        "prerequisites": ["basic-api-design"],
        "relevance_score": 92
      }
    ],
    "metadata": {
      "generation_time_ms": 1800,
      "total_available": 47,
      "filtered_count": 12,
      "personalization_confidence": 0.88
    }
  }
}
```

---

### 4. Get Grading History

Retrieve detailed history of a user's grading results.

**Endpoint:** `GET /grade-prompt/history`

**Rate Limit:** 30 requests per minute per user

**Query Parameters:**

```typescript
interface HistoryQueryParams {
  user_id?: string;          // Optional, defaults to auth user
  scenario_id?: string;      // Filter by specific scenario
  min_score?: number;        // Filter by minimum score (0-10)
  limit?: number;            // Results per page (1-100, default: 20)
  offset?: number;           // Pagination offset (default: 0)
  sort?: 'asc' | 'desc';    // Sort by timestamp (default: 'desc')
}
```

**Example Request:**

```bash
curl -X GET "https://api.example.com/functions/v1/grade-prompt/history?scenario_id=basic-coding-task&limit=10&sort=desc" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "scenario_id": "basic-coding-task",
        "attempt_number": 3,
        "overall_score": 8.5,
        "category_scores": {
          "clarity": 9.0,
          "specificity": 8.5,
          "structure": 8.0,
          "completeness": 8.5,
          "best_practices": 8.5
        },
        "timestamp": "2026-01-15T10:30:00Z",
        "improvement_from_previous": 1.2
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

---

### 5. Get Scenario Details

Retrieve detailed information about a specific tutorial scenario.

**Endpoint:** `GET /grade-prompt/scenarios/:scenarioId`

**Rate Limit:** 60 requests per minute per user

**Path Parameters:**
- `scenarioId`: ID of the scenario

**Example Request:**

```bash
curl -X GET "https://api.example.com/functions/v1/grade-prompt/scenarios/basic-coding-task" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "basic-coding-task",
    "title": "Email Validation Function",
    "description": "Create a prompt to generate an email validation function",
    "difficulty": "beginner",
    "category": ["coding", "validation"],
    "estimated_time_minutes": 10,
    "learning_objectives": [
      "Write clear task descriptions",
      "Specify input/output requirements",
      "Handle edge cases"
    ],
    "evaluation_criteria": {
      "clarity": {
        "weight": 0.25,
        "description": "Is the instruction clear and unambiguous?",
        "checkpoints": [
          "Task goal is explicitly stated",
          "No ambiguous terms",
          "Language is concise"
        ]
      },
      "specificity": {
        "weight": 0.20,
        "description": "Are requirements precise?",
        "checkpoints": [
          "Input format specified",
          "Output format specified",
          "Constraints defined"
        ]
      }
    },
    "exemplar_prompts": [
      "Write a TypeScript function named validateEmail that takes a string as input and returns a boolean..."
    ],
    "common_mistakes": [
      {
        "pattern": "Missing output format",
        "explanation": "Not specifying whether to return boolean, throw exception, or return error object",
        "correction": "Add: 'The function should return true for valid emails and false for invalid ones'",
        "severity": "major"
      }
    ],
    "prerequisites": [],
    "unlocks": ["intermediate-validation-001"],
    "completion_rate": 0.78,
    "average_score": 7.3,
    "average_attempts": 2.1
  }
}
```

---

## Webhooks (Future)

**Endpoint:** `POST /grade-prompt/webhooks`

Subscribe to events for real-time notifications:

```typescript
interface WebhookSubscription {
  url: string;
  events: ('grading.completed' | 'progress.milestone' | 'achievement.unlocked')[];
  secret: string;  // For webhook signature verification
}
```

**Webhook Payload Example:**

```json
{
  "event": "grading.completed",
  "timestamp": "2026-01-15T10:30:00Z",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "result_id": "...",
    "overall_score": 8.5,
    "category": "good"
  },
  "signature": "sha256=..."
}
```

---

## Rate Limiting

### Limits by Endpoint

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| POST /grade-prompt | 10 requests | 1 minute |
| GET /grade-prompt/progress | 30 requests | 1 minute |
| POST /grade-prompt/generate-practice | 5 requests | 1 hour |
| GET /grade-prompt/history | 30 requests | 1 minute |
| GET /grade-prompt/scenarios | 60 requests | 1 minute |

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1642240000
X-RateLimit-Window: 60
```

### Handling Rate Limits

When rate limited (429 status):
1. Check `retry_after` field in response
2. Wait the specified number of seconds
3. Retry the request
4. Implement exponential backoff for repeated failures

---

## Error Codes

| Code | Status | Description | Retry? |
|------|--------|-------------|--------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters | No |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication | No |
| `FORBIDDEN` | 403 | Insufficient permissions | No |
| `NOT_FOUND` | 404 | Resource not found | No |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Yes |
| `INTERNAL_ERROR` | 500 | Server error | Yes |
| `SERVICE_UNAVAILABLE` | 503 | Temporary service unavailability | Yes |

---

## Best Practices

### 1. Error Handling

```typescript
async function gradePrompt(prompt: string, scenarioId: string) {
  try {
    const response = await fetch('/functions/v1/grade-prompt', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': anon_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, scenario_id: scenarioId })
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        const data = await response.json();
        // Wait and retry
        await sleep(data.error.retry_after * 1000);
        return gradePrompt(prompt, scenarioId);
      }
      throw new Error(`Grading failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Grading error:', error);
    throw error;
  }
}
```

### 2. Caching

Cache scenario details and progress summaries to reduce API calls:

```typescript
const scenarioCache = new Map<string, Scenario>();

async function getScenario(id: string): Promise<Scenario> {
  if (scenarioCache.has(id)) {
    return scenarioCache.get(id)!;
  }
  
  const scenario = await fetchScenario(id);
  scenarioCache.set(id, scenario);
  
  // Cache for 1 hour
  setTimeout(() => scenarioCache.delete(id), 3600000);
  
  return scenario;
}
```

### 3. Optimistic Updates

Show immediate feedback while API request is in flight:

```typescript
function submitPrompt(prompt: string) {
  // Show loading state immediately
  setGradingState('analyzing');
  
  // Make API call
  gradePrompt(prompt, scenarioId)
    .then(result => {
      setGradingState('complete');
      setResult(result);
    })
    .catch(error => {
      setGradingState('error');
      showError(error.message);
    });
}
```

### 4. Request Deduplication

Prevent duplicate requests for identical prompts:

```typescript
const pendingRequests = new Map<string, Promise<GradingResult>>();

async function gradePromptWithDedup(prompt: string, scenarioId: string) {
  const key = `${scenarioId}:${hashPrompt(prompt)}`;
  
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  const promise = gradePrompt(prompt, scenarioId)
    .finally(() => pendingRequests.delete(key));
  
  pendingRequests.set(key, promise);
  return promise;
}
```

---

## Testing

### Test Credentials

```
Endpoint: https://staging.example.com/functions/v1
Test User: test@example.com
API Key: test_key_abc123
```

### Postman Collection

Download: [AI Prompt Grading API Collection](./postman/ai-prompt-grading.json)

### cURL Examples

See [API Examples](./examples/curl-examples.sh) for comprehensive cURL examples.

---

## Support

**Documentation:** [https://docs.enterpriseprofilebuilder.com/api/prompt-grading](https://docs.enterpriseprofilebuilder.com/api/prompt-grading)

**Issues:** [GitHub Issues](https://github.com/Krosebrook/Enterpriseprofilebuilder/issues)

**Email:** api-support@enterpriseprofilebuilder.com

---

**Version History:**

- **1.0.0** (2025-12-26): Initial specification
- Future versions will be documented here
