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
* **Commit message:** `Add data model doc.`[span_18](start_span)[span_18](end_span)

---

#### 3. `docs/architecture.md` (Task 6)[span_19](start_span)[span_19](end_span)[span_20](start_span)[span_20](end_span)
```markdown
# QuickNotes Architecture & Scaling Document

## 1. Requirements & Estimates (1 Million Users)
* **Assumptions:** 1M DAU, 50 feed reads/day, 5 notes created/day.
* **Reads/sec:** ~580 reads/sec.
* **Writes/sec:** ~58 writes/sec.
* **Storage/year:** ~365 GB text storage/year.

---

## 2. Architecture Diagram
---

## 3. Component Breakdown
* **CDN:** Caches static assets globally to minimize network latency.
* **Load Balancer:** Distributes traffic evenly across application servers.
* **App Servers:** Executes backend business logic and API routing.
* **Cache (Redis):** Stores recent note feeds in memory for sub-millisecond retrieval.
* **Primary Database:** Handles strict transaction writes.
* **Read Replicas:** Offloads high-volume read traffic from the main database.

---

## 4. Request Flow
* **GET `/notes` Flow:** Client hits CDN/Load Balancer $\rightarrow$ App Server checks Redis Cache $\rightarrow$ If cache miss, queries Database Read Replica $\rightarrow$ returns notes.
* **POST `/notes` Flow:** Client sends request $\rightarrow$ Load Balancer routes to App Server $\rightarrow$ App Server validates input $\rightarrow$ writes new note to Primary Database $\rightarrow$ clears user cache.

---

## 5. Trade-Offs & Single Points of Failure (SPOF)
* **Trade-Off:** Using database read replicas means eventual consistency—a user might experience a split-second delay before seeing a newly written note on secondary read queries.
* **SPOF Mitigation:** The Primary Database is a single point of failure; we mitigate this by setting up automated database failover to a standby replica.