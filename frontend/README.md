# Smart Campus Web Companion

A Progressive Web App (PWA) designed to help University of Kelaniya students manage their daily academic life through mobile viewports.

---

## Framework & Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool and dev server |
| Tailwind CSS | 4 | Styling |
| React Router | 7 | Client-side routing |
| json-server | - | Mock REST API for schedules and assignments |
| Lucide React | - | Icon library |
| Web Notifications API | Built-in | Deadline reminder notifications |

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
| Firefox | ✅ Full | All features supported |
| Safari (macOS) | ⚠️ Partial | Notifications API limited on Safari |
| Safari (iOS) | ⚠️ Partial | PWA and Notifications support limited |
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
cd <project-folder>
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