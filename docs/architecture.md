---

### Step D: Create `docs/architecture.md`
Tap on **`docs/architecture.md`** to create this independent file for your system architecture[span_4](start_span)[span_4](end_span):

```markdown
# QuickNotes Architecture & Scaling Document

## 1. Requirements & Estimates (1 Million Users)
* **Assumptions:** 1M Daily Active Users (DAU), 50 feed reads/day, 5 notes created/day.
* **Reads/sec:** ~580 reads/sec.
* **Writes/sec:** ~58 writes/sec.
* **Storage/year:** ~365 GB text storage/year.

---

## 2. Architecture Diagram
[ Client App ] ---> [ DNS ] ---> [ CDN ] ---> [ Load Balancer ]
|
+---------------+---------------+
|                               |
v                               v
[ App Server 1 ]                [ App Server 2 ]
|                               |
+-------------> [ Cache (Redis) ]
|
v
[ Primary DB (Writes) ]
|
v
[ Read Replica (Reads) ]
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
* **Trade-Off:** Using database read replicas introduces eventual consistency—a user might experience a split-second delay before seeing a newly written note on secondary read queries.
* **SPOF Mitigation:** The Primary Database is a single point of failure; we mitigate this by setting up automated database failover to a standby replica.