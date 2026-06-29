# Stage 1

## Core Actions Supported by Notification System

The notification platform should support the following actions:

1. Create Notification
2. Get All Notifications
3. Get Notification By ID
4. Get Unread Notifications
5. Mark Notification as Read
6. Delete Notification

---

## 1. Create Notification

### Endpoint

POST /api/notifications

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Request

```json
{
  "studentId": 1042,
  "notificationType": "Placement",
  "message": "CSX Corporation hiring"
}
```

### Response

```json
{
  "id": "abc123",
  "message": "Notification created successfully"
}
```

---

## 2. Get All Notifications

### Endpoint

GET /api/notifications

### Response

```json
{
  "notifications": [
    {
      "id": "abc123",
      "studentId": 1042,
      "notificationType": "Placement",
      "message": "CSX Corporation hiring",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:18"
    }
  ]
}
```

---

## 3. Get Notification By ID

### Endpoint

GET /api/notifications/{id}

### Response

```json
{
  "id": "abc123",
  "studentId": 1042,
  "notificationType": "Placement",
  "message": "CSX Corporation hiring",
  "isRead": false
}
```

---

## 4. Get Unread Notifications

### Endpoint

GET /api/notifications/unread

### Response

```json
{
  "notifications": []
}
```

---

## 5. Mark Notification As Read

### Endpoint

PATCH /api/notifications/{id}/read

### Response

```json
{
  "message": "Notification marked as read"
}
```

---

## 6. Delete Notification

### Endpoint

DELETE /api/notifications/{id}

### Response

```json
{
  "message": "Notification deleted successfully"
}
```

---

## Real Time Notification Design

For real-time notifications, WebSockets can be used.

Flow:

1. User logs in.
2. Client establishes WebSocket connection.
3. Whenever a new notification is created, server pushes it to connected users.
4. Notification appears instantly without page refresh.

Benefits:

* Low latency
* Reduced API polling
* Better user experience


# Stage 2

## Database Choice

I would use PostgreSQL because it is reliable, supports structured data well, and provides good performance through indexing and ACID compliance.

## Notification Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    studentId INT NOT NULL,
    notificationType VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Challenges at Scale

As the number of students and notifications increases, queries may become slower, storage requirements will grow, and the database will experience higher load.

## Optimizations

* Add indexes on frequently queried fields such as `studentId` and `isRead`.
* Use pagination to fetch notifications in smaller batches.
* Archive old notifications to reduce the size of active data.

Example index:

```sql
CREATE INDEX idx_student_read
ON notifications(studentId, isRead);
```

## Sample Queries

Get unread notifications:

```sql
SELECT *
FROM notifications
WHERE studentId = 1042
AND isRead = false;
```

Mark a notification as read:

```sql
UPDATE notifications
SET isRead = true
WHERE id = 'abc123';
```

# Stage 3

The query is logically correct:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

As the table grows, performance may slow because more rows need to be searched.

## Recommended Index

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This helps the database filter and sort records more efficiently.

## Should Every Column Be Indexed?

No. Too many indexes increase storage usage and slow down inserts and updates. Indexes should only be created on frequently queried columns.

## Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 DAYS';
```

## Query Cost

* Without index: O(n)
* With index: O(log n)

# Stage 4

Fetching notifications on every page load can increase database load.

## Improvements

* **Caching (Redis):** Store frequently accessed notifications to reduce database queries and improve response time.
* **Pagination:** Load notifications in smaller batches (e.g., 20 at a time).
* **Lazy Loading:** Fetch more notifications only when needed, such as when the user scrolls.
* **WebSockets:** Push new notifications to users in real time instead of repeatedly polling the server.

## Tradeoffs

* **Redis:** Fast, but requires additional infrastructure.
* **Pagination:** Reduces load, but may require multiple API requests.
* **WebSockets:** Provides instant updates, but adds implementation complexity.

# Stage 5

## Issues with Current Approach

Sending notifications one student at a time is slow, hard to scale, and failures can leave the system in an inconsistent state.

## Better Approach

Use a message queue such as RabbitMQ or Kafka.

### Flow

1. HR clicks **Notify All**.
2. Save the notification request.
3. Push student IDs to a queue.
4. Workers process the queue asynchronously.
5. Send emails and push notifications.

### Pseudocode

```text
Save Notification Request

Push Student IDs To Queue

Worker:
    student = queue.pop()
    save notification
    send email
    if failure -> retry
```

## Database Save vs Email

They should not happen together. Store the notification in the database first, then send emails asynchronously. This makes the system more reliable and easier to recover from failures.

## Benefits

* Faster processing
* Better scalability
* Retry support
* Improved reliability
