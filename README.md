# 🛡️ LogCentral

LogCentral is a professional-grade, centralized log monitoring and management platform. It provides a unified command center for tracking real-time logs, analyzing error patterns, and managing project-wide visibility across distributed systems.

---

## ✨ Key Features

### 📊 Intelligent Dashboard
* **Real-time Analytics**: Instant visualization of log volumes and error spikes.
* **Health Monitoring**: At-a-glance status of all connected projects.
* **Trend Analysis**: Track log patterns over time to identify recurring issues.

### 📁 Advanced Project Management
* **Dynamic Provisioning**: Add and configure new projects in seconds.
* **API Integration**: Each project comes with dedicated API endpoints for log ingestion.
* **Status Tracking**: Toggle project visibility and monitoring status.

### 🔍 Live Log Streaming
* **Real-time Feed**: Watch logs flow in as they happen with zero latency.
* **Severity Filtering**: Quickly isolate `ERROR`, `WARN`, `INFO`, or `DEBUG` messages.
* **Metadata Inspection**: Deep-dive into structured log data and stack traces.

### 🔐 Enterprise-Grade Security
* **RBAC**: Granular Role-Based Access Control (Admin vs. Viewer).
* **Secure Auth**: Integrated with Google OAuth for seamless and secure login.
* **Firestore Rules**: Hardened security rules preventing unauthorized data access.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **State Management** | React Context API |
| **Real-time Data** | Firebase Firestore (WebSockets) |
| **Authentication** | Firebase Auth (Google) |
| **Styling** | Tailwind CSS, Shadcn UI |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Deployment** | Docker, Nginx |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Docker**: (Optional) For containerized deployment

### Local Development

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd logcentral
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and populate your Firebase credentials.
   ```bash
   cp .env.example .env
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

### 🐳 Docker Deployment

For a production-ready environment, use the provided Docker configuration:

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f
```
The app will be served via Nginx on [http://localhost:8080](http://localhost:8080).

---

## 📡 API Integration

To send logs from your external applications to LogCentral, use the following pattern:

```javascript
// Example Log Ingestion
fetch('https://your-api-endpoint/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'YOUR_PROJECT_ID',
    level: 'error',
    message: 'Database connection failed',
    timestamp: new Date().toISOString(),
    metadata: { service: 'auth-api', region: 'us-east-1' }
  })
});
```

---

## ⚙️ Administration

### Initial Admin Setup
The system includes a "Super-Admin" bypass for initial configuration. The following email is automatically granted administrative privileges:
* `Vishnuvvp007@gmail.com`

### Security Rules
Firestore rules are located in `firestore.rules`. These rules enforce:
1. **Ownership**: Users can only see projects they are assigned to.
2. **Immutability**: Critical fields like `createdAt` cannot be modified after creation.
3. **Validation**: All incoming logs must match the required schema.

---

## 📂 Project Structure

```text
.
├── src/
│   ├── components/   # UI components (Atomic design)
│   ├── context/      # Auth and Global state providers
│   ├── lib/          # Shared utilities and error handlers
│   ├── pages/        # Route-level components
│   ├── services/     # Firebase and external API logic
│   └── types/        # Global TypeScript definitions
├── public/           # Static assets
├── Dockerfile        # Production build configuration
└── nginx.conf        # SPA routing configuration
```

---

## 📄 License

Copyright © 2026 LogCentral. All rights reserved.
