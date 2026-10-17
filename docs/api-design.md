# QuickNotes Production API Design

## Overview
This document specifies the REST API contract for the production QuickNotes backend service.

## Endpoints Table

| Method | Endpoint | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notes` | Retrieves paginated list of notes | `200 OK` |
| `POST` | `/api/v1/notes` | Creates a new note | `201 Created` |
| `GET` | `/api/v1/notes/:id` | Retrieves a specific note by ID | `200 OK` |
| `PUT` | `/api/v1/notes/:id` | Updates an existing note | `200 OK` |
| `DELETE` | `/api/v1/notes/:id` | Deletes a note | `200 OK` / `204 No Content` |
| `GET` | `/api/v1/users/:id/notes` | Lists all notes created by a specific user | `200 OK` |

---

## Request & Response Examples

### Create Note (`POST /api/v1/notes`)
* **Request Body:**
  ```json
  {
    "title": "Project Architecture",
    "body": "Draft system design outline before Tuesday.",
    "userId": 1
  }
{
  "id": 105,
  "title": "Project Architecture",
  "body": "Draft system design outline before Tuesday.",
  "userId": 1,
  "created_at": "2026-10-17T12:00:00Z"
}
