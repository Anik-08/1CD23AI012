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
