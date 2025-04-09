# 🚦 Express Rate Limiting with Redis (In-Memory vs Distributed)

This project showcases how to implement **rate limiting** in an Express.js API using two approaches:

- ✅ **In-Memory Rate Limiting** – Simple and lightweight, but limited to a single server instance.
- ⚡ **Redis-Backed Rate Limiting** – Scalable and ideal for distributed or multi-instance environments.

---

## 🧠 What is Rate Limiting?

**Rate limiting** restricts the number of requests a user can make to your API within a specific time window. It’s essential for securing and optimizing your application.

🔒 It protects against:
- Abuse (e.g., brute force attacks)
- Endpoint spamming
- Server overload

---

## 💥 The Problem with In-Memory Rate Limiting

By default, `express-rate-limit` stores request counters **in memory**. This works for a single server but fails in distributed setups:

```bash
User 1 → Server A → Request count stored in Server A's memory  
User 1 → Server B → Request count stored separately in Server B's memory  
```

Since each server maintains its own counter, the rate limit isn’t enforced consistently across instances.  
❌ Users could bypass limits by hitting different servers.  
❌ No shared state = unreliable limits in real-world deployments.

---

## 🛠️ The Solution: Redis-Backed Rate Limiting

Using Redis with `rate-limit-redis`, you can centrally store rate limit counters. This ensures consistent enforcement across all servers:

✅ Shared counter  
✅ Works in load-balanced environments  
✅ More production-ready and scalable

---

## 🔧 Prerequisites

- Node.js
- Docker (for Redis setup)

---

## 📦 Install Dependencies

```bash
npm install express express-rate-limit rate-limit-redis ioredis
```

---

## 🚀 Run Redis Using Docker

```bash
docker run -d --name redis-rate-limit -p 6379:6379 redis
```

---

## 🧪 Usage Examples

### 1. In-Memory Limiting

```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
});

app.use('/api', limiter);
```

---

### 2. Redis-Backed Limiting (Distributed)

```js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
});

app.use('/api', limiter);
```

---

## 🧪 Testing the Limit

Start the server, and try to hit `/api` more than 5 times within a minute.  
You'll see a 429 `Too Many Requests` response.

Try the same using multiple instances (load balancer simulation) and:

✅ Redis will enforce the limit globally  
❌ In-memory will enforce it per process

---

## 📝 Conclusion

| Approach    | Pros                  | Cons                            |
|------------|-----------------------|---------------------------------|
| In-Memory  | Simple to use         | Not suitable for multi-instance setups |
| Redis-Based| Scalable and consistent| Requires Redis setup            |

For **real-world production apps**, always prefer **Redis-backed rate limiting**.

---

## 📁 Project Structure

```
📦 express-rate-limit-demo/
├── in-memory.js        # In-memory rate limiting example
├── redis-limit.js      # Redis-backed rate limiting example
├── Dockerfile (optional if needed)
└── README.md
```

---
