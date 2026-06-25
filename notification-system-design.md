# Notification System Design

## Stage 1

### Overview

The campus notification system receives a continuous stream of alerts across
three categories — Placements, Results, and Events. As volume grows, users
miss critical updates. This document describes the Priority Inbox logic that
surfaces the most important notifications first.

---

## Scoring Logic

Each notification is assigned an **importance score** computed as:

```
score = base_priority + decay_bonus
```

### Base Priority (by type)

| Notification Type | Base Priority |
|-------------------|---------------|
| Placement         | 10            |
| Result            | 6             |
| Event             | 3             |

Placements are the most critical (career impact), Results are academically
significant, and Events are general interest.

### Decay Bonus (recency)

```
decay_bonus = 1 / (1 + log(1 + age_in_minutes))
```

- A notification posted **just now** gets a bonus close to **1.0**
- A notification posted **1 hour ago** gets a bonus around **0.22**
- A notification posted **1 day ago** gets a bonus close to **0.05**

Using logarithmic decay (instead of linear) ensures:
- Very recent notifications get a meaningful boost
- Old notifications don't vanish — type weight still dominates
- The gap between a 5-min and 10-min old notification isn't exaggerated

---

## Algorithm Steps

1. Call the Notification API (`GET /evaluation-service/notifications`)
2. For every notification, compute its importance score
3. Sort all notifications by score in **descending order**
4. Return the **top N** (default: 10, configurable)

**Time complexity:** O(n log n) — sorting dominates

---

## Handling a Continuous Stream of Notifications

### Strategy A — Stateless Re-fetch (current implementation)
Re-fetch and re-score the full list every time the inbox is requested.
- Always accurate, simple, no state to maintain

### Strategy B — Min-Heap (for scale)
Maintain a min-heap of size N in memory:
- When a new notification arrives, score it and push to heap
- If heap size exceeds N, pop the lowest score
- Heap always holds the current top N

**Insertion:** O(log N) per notification | **Query:** O(1)

---

## How to Run

```bash
python campus_priority_inbox.py <bearer_token> [top_n]
```

Example:
```bash
python campus_priority_inbox.py eyJhbGciOiJIUzI1NiJ9... 10
```

---

## Why This Approach

- **Type weight dominates** — a Placement always outranks an Event
- **Recency breaks ties** — among same-type notifications, newer wins
- **No database needed** — purely computed from the API response
- **Configurable N** — works for top 10, 15, 20 as required