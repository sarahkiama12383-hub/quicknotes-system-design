# QuickNotes Production API Design

## Overview
This document specifies the REST API contract for the production QuickNotes backend service.

## Endpoints Table

| Method | Endpoint | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notes` | Retrieves a paginated list of notes | `200 OK` |
| `POST` | `/api/v1/notes` | Creates a new note | `201 Created` |
| `GET` | `/api/v1/notes/:id` | Retrieves a specific note by ID | `200 OK` |
| `PUT` | `/api/v1/notes/:id` | Updates an existing note | `200 OK` |
| `DELETE` | `/api/v1/notes/:id` | Deletes a note | `200 OK` / `204 No Content` |

---

## Request & Response Examples

### 1. List Notes (`GET /api/v1/notes`)
* **Response Body (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "title": "Project Architecture",
      "body": "Outline system design notes.",
      "userId": 1
    }
  ]
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
{
  "error": "Bad Request",
  "message": "Title is required and cannot exceed 100 characters.",
  "status": 400
}
---

### Step C: Fill Out `docs/data-model.md`
Tap on **`docs/data-model.md`** and make sure it includes the `tags` table, the `note_tags` join table, indexing, and SQL queries[span_3](start_span)[span_3](end_span):

```markdown
# QuickNotes Data Model

## 1. Entities & Schema Columns
* **`users`**: `user_id` (PK, INTEGER), `username` (TEXT, UNIQUE), `email` (TEXT, UNIQUE)
* **`notes`**: `note_id` (PK, INTEGER), `user_id` (FK, INTEGER), `title` (TEXT), `body` (TEXT), `created_at` (TIMESTAMP)
* **`tags`**: `tag_id` (PK, INTEGER), `tag_name` (TEXT, UNIQUE)
* **`note_tags`**: `note_id` (FK, INTEGER), `tag_id` (FK, INTEGER) — *Composite Primary Key (`note_id`, `tag_id`)*

---

## 2. Relationships
* **Users to Notes:** One-to-Many (One user can author multiple notes).
* **Notes to Tags:** Many-to-Many (One note can have multiple tags, and a tag can belong to many notes, linked via the `note_tags` join table).

---

## 3. SQL `CREATE TABLE` Statements
```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_name TEXT NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);