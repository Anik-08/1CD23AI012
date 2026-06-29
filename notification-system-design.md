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
