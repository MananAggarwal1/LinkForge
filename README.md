# ⚡ LinkForge - Production URL Shortener & Analytics Platform

LinkForge is a high-performance, production-grade URL Shortener and Link Management Platform built with **React**, **Java (Spring Boot 3)**, **MongoDB**, and **Redis**, secured with **Spring Security 6 & Stateless JWT**.

---

## 🏛️ System Design Architecture

```
                          [ Client / Browser ]
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
       [ React Frontend ]                      [ Public Redirect ]
       (Port 5173 - Vite)                     (GET /r/{shortCode})
              │ (JWT Bearer Token)                      │
              ▼                                         ▼
   ┌──────────────────────┐                  ┌──────────────────────┐
   │ Spring Boot 3 API    │                  │  Redirect Controller │
   │ (Port 8080 - REST)   │                  └──────────┬───────────┘
   └──────────┬───────────┘                             │
              │                                 1. Check Cache (<5ms)
              │                                         ▼
              │                                 ┌───────────────┐
              │                                 │  Redis Cache  │ (localhost:6379)
              │                                 │ (Cache-Aside) │
              │                                 └───────┬───────┘
              │                                         │ (On Miss)
              │                                 2. Query Fallback
              │                                         ▼
              │ 3. Owner Scoped Queries         ┌───────────────┐
              └────────────────────────────────►│    MongoDB    │ (localhost:27017)
                                                │ (Collections) │
                                                └───────────────┘
                                                        ▲
                                                        │ Async Click Log
                                                ┌───────┴───────┐
                                                │ ThreadPool    │
                                                │ TaskExecutor  │ (Non-blocking)
                                                └───────────────┘
```

---

## 🧠 Key System Design Concepts

### 1. High Read-to-Write Ratio
- In a URL shortener like Bitly or TinyURL, the ratio of redirects (reads) to link creations (writes) is typically **100:1** or higher.
- Direct database lookups for every click would quickly overwhelm the primary database.
- **Solution**: We implement the **Cache-Aside Pattern** with Redis. The redirection engine checks Redis first. On a cache hit, the redirection completes in **< 5ms** without executing a single database query.

### 2. Base62 Slug Generation vs Hash Collisions
- Standard hexadecimal (Base16) uses `0-9, a-f`.
- **Base62** uses `0-9`, `a-z`, and `A-Z` (62 characters). It is 100% URL-safe without requiring URL encoding.
- Math:
  - 6-character Base62 string: $62^6 \approx 56.8 \text{ Billion}$ unique combinations.
  - 7-character Base62 string: $62^7 \approx 3.5 \text{ Trillion}$ unique combinations.
- LinkForge generates collision-resistant 7-character Base62 tokens and supports custom branded slugs (e.g. `/r/my-portfolio`).

### 3. Decoupled & Asynchronous Analytics Telemetry
- When an end-user clicks a short link, they expect instant redirection to the target destination.
- Parsing `User-Agent` headers, checking client IP, extracting referrer domains, and persisting a `ClickEvent` into MongoDB must **never block** the HTTP 302 response.
- **Solution**: Spring Boot's `@Async("analyticsTaskExecutor")` offloads click telemetry to a dedicated thread pool, allowing the redirect to return immediately.

### 4. Stateless Multi-Tenant Data Isolation (JWT)
- Every shortened link belongs to an authenticated user (`userId`).
- User authentication is verified via HMAC-SHA256 signed JWT tokens in the `Authorization: Bearer <token>` header.
- Multi-tenancy is enforced at both the security filter and repository layer (`findByIdAndUserId`). User A cannot view, update, delete, or inspect analytics of User B's links.

---

## 🛠️ Tech Stack & Directory Structure

```
LinkForge/
├── backend/                              # Spring Boot 3 Application
│   ├── src/main/java/com/linkforge/
│   │   ├── LinkForgeApplication.java
│   │   ├── config/                       # Security, JWT, Redis, Async, CORS
│   │   ├── controller/                   # Auth, Link, Redirect, Analytics, QR
│   │   ├── dto/                          # Request & Response Data Transfer Objects
│   │   ├── exception/                    # Global Exception Handler
│   │   ├── model/                        # MongoDB Entities (User, UrlMapping, ClickEvent)
│   │   ├── repository/                   # Spring Data MongoDB Repositories
│   │   ├── service/                      # Business Logic & Cache Invalidation
│   │   └── util/                         # Base62Encoder, UserAgentParser, SecurityUtil
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
├── frontend/                             # React + Vite Application
│   ├── src/
│   │   ├── api/client.js                 # Axios instance with JWT interceptor
│   │   ├── context/AuthContext.jsx       # Auth State & Token Persistence
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Header & User Profile
│   │   │   ├── auth/AuthModal.jsx        # Login & Registration Modals
│   │   │   ├── dashboard/                # KPIs, Create Link, Link List, Analytics, QR
│   │   │   └── common/Toast.jsx          # Notification Toasts
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── docker-compose.yml                    # Redis & MongoDB container orchestration
```

---

## 🚀 How to Run LinkForge Locally

### Prerequisites
- **Java 21+** (Java 24 supported)
- **Node.js 18+** & npm
- **MongoDB** (Running locally on port 27017 or via Docker)
- **Redis** (Running locally on port 6379 or via Docker)

### 1. (Optional) Start Redis & MongoDB with Docker
```bash
docker compose up -d redis
```

### 2. Run the Backend API (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*The Spring Boot server will start at `http://localhost:8080`.*

### 3. Run the Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Sign in and receive a JWT Bearer token
- `GET /api/auth/me` - Get profile of the currently logged-in user

### Link Management (Requires JWT Bearer Token)
- `POST /api/links` - Create a new short link (supports custom slug, title, tags, expiry, password)
- `GET /api/links` - List all links created by the authenticated user (supports `?search=` and `?tag=`)
- `GET /api/links/{id}` - Get specific link details
- `PUT /api/links/{id}` - Update destination URL, title, tags, expiry, or password
- `DELETE /api/links/{id}` - Delete link, purge analytics, and evict Redis cache
- `PATCH /api/links/{id}/toggle` - Toggle link active/inactive status

### Telemetry & QR Codes (Requires JWT Bearer Token)
- `GET /api/links/{id}/analytics` - Deep analytics breakdown (time series, devices, browsers, referrers)
- `GET /api/links/dashboard/overview` - Aggregate account analytics
- `GET /api/links/{id}/qr?size=400` - Generate and download PNG QR code

### Public Redirection
- `GET /r/{shortCode}` - High-speed 302 Found redirect with Redis caching and asynchronous click logging
- `POST /r/{shortCode}/verify` - Unlock and retrieve destination URL for password-protected links
