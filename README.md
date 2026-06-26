# Smart Campus Web Companion

A Progressive Web App (PWA) designed to help University of Kelaniya students manage their daily academic life through mobile viewports.

---

## Framework & Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.6 | UI framework |
| Vite | 8.0.12 | Build tool and dev server |
| Tailwind CSS | 4.3.1 | Styling |
| React Router DOM | 7.18.0 | Client-side routing |
| json-server | 1.0.0-beta.15 | Mock REST API for schedules and assignments |
| Lucide React | 1.20.0 | Icon library |
| Web Notifications API | Browser built-in | Deadline reminder notifications |

---

## Features

- **Dashboard** — Daily overview showing today's lecture schedule, pending assignments, completed credits, and a motivational quote
- **Schedule** — Weekly timetable with day-based filtering fetched from json-server
- **Assignments** — Full CRUD assignment management with status filtering, delete confirmation, and dynamic credit tracking
- **Profile** — Local student profile with auto-tracked credit progress based on completed assignments
- **Notifications** — Web Notifications API integration that alerts students about assignments due within 24 hours

---

## Browser Compatibility

| Browser | Supported | Notes |
|---|---|---|
| Google Chrome | ✅ Full | Recommended browser |
| Microsoft Edge | ✅ Full | Chromium-based, full support |
| Chrome (Android) | ✅ Full | Recommended for mobile testing |

> **Note:** The Web Notifications API requires user permission and works best on Chrome and Edge. Safari has limited support for the Notifications API — the app still functions fully without notifications.

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — https://nodejs.org
- **npm** (comes with Node.js)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Mock API Server

json-server must be running for schedule and assignment data to load.
Open a terminal and run:

```bash
npm run server
```

This starts json-server at **http://localhost:3001**

Available endpoints:
GET    http://localhost:3001/schedules

GET    http://localhost:3001/assignments

POST   http://localhost:3001/assignments

PATCH  http://localhost:3001/assignments/:id

DELETE http://localhost:3001/assignments/:id

### 4. Run the React App

Open a **second terminal** and run:

```bash
npm run dev
```

This starts the Vite dev server at **http://localhost:5173**

### 5. Open in Browser

Navigate to:
http://localhost:5173

> For the best mobile experience, open Chrome DevTools (F12) → Toggle Device Toolbar → select a mobile device like iPhone 12 or Pixel 5.

---

## Project Structure
smart-campus/

├── public/

│   └── favicon.ico

├── src/

│   ├── components/

│   │   └── BottomNav.jsx

│   ├── hooks/

│   │   └── useDeadlineNotifications.js

│   ├── pages/

│   │   ├── Dashboard.jsx

│   │   ├── Schedule.jsx

│   │   ├── Assignments.jsx

│   │   └── Profile.jsx

│   ├── App.jsx

│   ├── main.jsx

│   └── index.css

├── db.json

├── package.json

├── vite.config.js

├── tailwind.config.js

└── README.md

---

## Data Storage

| Data | Storage | Reason |
|---|---|---|
| Schedules | json-server (db.json) | Shared institutional data |
| Assignments | json-server (db.json) | Persistent across sessions |
| Profile | localStorage | Personal user data |
| Notification tracking | localStorage | Browser-specific state |

---

## Notification Testing

To test deadline notifications immediately:

**Step 1** — Clear previously fired notifications:
```javascript

localStorage.removeItem('smart_campus_notified');
```

**Step 2** — Refresh the page and allow notification permission when prompted.

**Step 3** — Notifications fire for any pending assignment due within 24 hours.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start React development server |
| `npm run server` | Start json-server mock API |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Developer

**Buddhika**  
BSc (Hons) in Software Engineering  
Faculty of Science, University of Kelaniya  
Module: SENG 41293 — Mobile Web Application Development