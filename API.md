# TaskFlow API

Base URL: `/api/v1`

## Health

```http
GET /api/v1/health
```

Response:

```json
{
  "status": "ok",
  "uptime": 42.2,
  "timestamp": "2026-05-24T10:00:00.000Z"
}
```

## List Todos

```http
GET /api/v1/todos?status=pending&priority=high&category=Work&search=report&sortBy=createdAt&sortOrder=desc
```

Query parameters:

| Name | Values |
| --- | --- |
| `status` | `pending`, `in_progress`, `completed` |
| `priority` | `low`, `medium`, `high` |
| `category` | Any category string |
| `search` | Text matched against title and description |
| `sortBy` | `title`, `status`, `priority`, `dueDate`, `createdAt`, `updatedAt` |
| `sortOrder` | `asc`, `desc` |

## Create Todo

```http
POST /api/v1/todos
Content-Type: application/json
```

```json
{
  "title": "Prepare sprint plan",
  "description": "Review backlog and set priorities",
  "status": "pending",
  "priority": "high",
  "category": "Work",
  "dueDate": "2026-05-31T00:00:00.000Z"
}
```

## Update Todo

```http
PUT /api/v1/todos/{id}
Content-Type: application/json
```

```json
{
  "status": "completed"
}
```

## Delete Todo

```http
DELETE /api/v1/todos/{id}
```

Successful deletes return `204 No Content`.

## Stats

```http
GET /api/v1/todos/stats
```

Response data includes total, completed, pending, in-progress, overdue, priority counts, and category counts.
