<div align="center">

<img src="frontend/public/logo/logo.png" alt="FramePulse Logo" width="160" />

# ⚡ FramePulse — Game Performance & Review Analytics System

**A full-stack OOAD game telemetry & moderated community review suite powered by a Java 17+ Backend (`HttpServer` + Swing Desktop GUI) and a React 18 + Vite Cel-Shaded "Gaming Toon" Web Frontend.**

![Java](https://img.shields.io/badge/Backend-Java_17%2B_%26_HttpServer-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite_5-61DAFB?style=for-the-badge&logo=react&logoColor=18181B)
![Tailwind & GSAP](https://img.shields.io/badge/UI_&_Motion-Tailwind_CSS_%2B_GSAP_3-C88A52?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-OOAD_%2B_Singleton_%2B_REST-5B8C5A?style=for-the-badge)
![UML](https://img.shields.io/badge/UML-PlantUML_(8_Diagrams)-6F4E37?style=for-the-badge&logo=uml&logoColor=white)

<br />

<img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_analytics_dashboard_toon_edition_2/screen.png" alt="FramePulse Analytics Dashboard — Gaming Toon Web Edition" width="85%" />

</div>

---

## 📖 Overview & Core Concept

When a modern PC title launches, players and optimization engineers face a **telemetry fragmentation problem**: hardware benchmarks (average FPS, 1% lows, CPU/GPU utilization, and crash frequency across `720p`, `1080p`, `1440p`, and `4K`) are scattered across separate benchmarking utilities, while community review feeds suffer from unmoderated spam and review-bombing that distort a game's true rating.

**FramePulse** unifies **multi-session hardware telemetry logging**, **role-guarded community review moderation**, and **automated stability scoring (`0–100`)** into a single Object-Oriented system designed for **CT-263 Object-Oriented Analysis & Design (OOAD)**. It ships with a dual-interface architecture:
- **Web Frontend (`frontend/`)**: An eye-safe Warm Mocha / Caramel cel-shaded **React 18 + Vite** web application with GSAP staggered entrance animations (`AnimatedContent.jsx`), animated 2D canvas isometric stickers (`Sticker.tsx`), and persistent `localStorage` + live Java REST API synchronization.
- **Java Backend & Desktop Suite (`src/`)**: A zero-dependency **Java 17+** domain core implementing all 8 UML diagrams, complete with a built-in REST API server (`ApiServer.java` on `http://localhost:8080/api`), authentication service (`AuthService.java`), data access repository (`DatabaseHandler.java`), and a native **Java Swing & Java2D** desktop client (`MainFrame.java`).

### 🔄 Step-by-Step Core Workflow
1. **Authenticate Session (`LoginDialog.java`, `AuthService.java`)**: Users authenticate as an **Admin** (`admin_usman` / `A-101`) or **Gamer** (`shadow_ninja` / `G-201`) following the Activity & Sequence Diagram credential verification loop (`verifyCredentials()`).
2. **Browse or Register Games (`ManageGamesPage.jsx`, `GamesPanel.java`, `Game.java`)**: Inspect catalog titles (*Cyber Odyssey `GM-501`*, *Apex Overdrive / Shadow Racers `GM-502`*, *Chronos Rift / Mystic Realms `GM-503`*, *Valkyrie Strike 2 `GM-504`*) or index new games with auto-incrementing `GM-xxx` IDs.
3. **Log Hardware Telemetry (`LogSessionPage.jsx`, `LogSessionPanel.java`, `PerformanceLog.java`)**: Gamers record gameplay benchmark passes (`LOG-301`, `LOG-302`, ...) with resolution, average FPS, 1% low FPS, CPU/GPU load percentages, and crash status.
4. **Submit 5-Star Community Reviews (`SubmitReviewPage.jsx`, `ReviewPanel.java`, `Review.java`)**: Gamers submit star ratings (`1–5`), hardware tags, and written feedback (`REV-901`, `REV-902`, ...), which enter the `ReviewStatus.PENDING` moderation queue.
5. **Moderate Reviews (`AdminModerationPage.jsx`, `AdminPanel.java`, `Admin.java`)**: Administrators filter reviews by `PENDING`, `APPROVED`, `REJECTED`, or `ALL`, approving verified telemetry reviews or rejecting/deleting toxic spam.
6. **Analyze Live Telemetry & Export Reports (`DashboardPage.jsx`, `AnalyticsEngine.java`, `Report.java`)**: The singleton `AnalyticsEngine` recalculates the **Average Rating** (approved reviews only), **Average FPS**, and **System Stability Score (`0–100`)**, and exports formatted `.txt` diagnostic reports (`REP-001`).

---

## 🖼️ Visual Showcase / Screenshots Gallery

### 🌐 Web Application Screens (React 18 + Vite "Gaming Toon" Edition)

| 📊 Analytics Dashboard (Telemetry & KPIs) | 🎮 Log FPS Session (Hardware Telemetry Form) |
| :---: | :---: |
| <img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_analytics_dashboard_toon_edition_2/screen.png" width="100%" alt="Analytics Dashboard Web UI" /> | <img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_log_fps_session_toon_edition/screen.png" width="100%" alt="Log FPS Session Web UI" /> |
| **⭐ Submit Review (Interactive 5-Star Matrix)** | **🛡️ Admin Moderation (Queue & Bulk Actions)** |
| <img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_submit_review_toon_edition/screen.png" width="100%" alt="Submit Review Web UI" /> | <img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_admin_moderation_toon_edition/screen.png" width="100%" alt="Admin Moderation Web UI" /> |
| **🗂️ Manage Games Catalog & Comparison Matrix** | **📈 Telemetry Deep-Dive View** |
| <img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_manage_games_toon_edition/screen.png" width="100%" alt="Manage Games Web UI" /> | <img src="stitch_framepulse_analytics_dashboard/stitch_framepulse_analytics_dashboard/framepulse_analytics_dashboard_toon_edition_1/screen.png" width="100%" alt="Analytics Dashboard Alternate View" /> |

### 🖥️ Native Java Swing & Java2D Desktop Screens (`src/`)

| 📊 Java Swing Analytics Dashboard | 🎮 Java Swing Log FPS Session |
| :---: | :---: |
| <img src="assets/screenshots/1_dashboard.png" width="100%" alt="Java Swing Dashboard" /> | <img src="assets/screenshots/2_log_session.png" width="100%" alt="Java Swing Log Session" /> |
| **⭐ Java Swing Submit Review** | **🛡️ Java Swing Admin Moderation** |
| <img src="assets/screenshots/3_submit_review.png" width="100%" alt="Java Swing Submit Review" /> | <img src="assets/screenshots/4_admin_moderation.png" width="100%" alt="Java Swing Admin Moderation" /> |
| **🗂️ Java Swing Manage Games** | **⚡ FramePulse Official Emblem** |
| <img src="assets/screenshots/5_manage_games.png" width="100%" alt="Java Swing Manage Games" /> | <img src="assets/logo.png" width="55%" alt="FramePulse Emblem" /> |

### 📐 Complete UML Diagrams Suite (`diagrams/`)

| 1. Class Diagram (`1_class_diagram.png`) | 2. Object Diagram (`2_object_diagram.png`) |
| :---: | :---: |
| <img src="diagrams/1_class_diagram.png" width="100%" alt="Class Diagram" /> | <img src="diagrams/2_object_diagram.png" width="100%" alt="Object Diagram" /> |
| **3. Use Case Diagram (`3_use_case_diagram.png`)** | **4. Sequence Diagram (`4_sequence_diagram.png`)** |
| <img src="diagrams/3_use_case_diagram.png" width="100%" alt="Use Case Diagram" /> | <img src="diagrams/4_sequence_diagram.png" width="100%" alt="Sequence Diagram" /> |
| **5. Communication Diagram (`5_communication_diagram.png`)** | **6. Activity Diagram (`6_activity_diagram.png`)** |
| <img src="diagrams/5_communication_diagram.png" width="100%" alt="Communication Diagram" /> | <img src="diagrams/6_activity_diagram.png" width="100%" alt="Activity Diagram" /> |
| **7. Component Diagram (`7_component_diagram.png`)** | **8. Deployment Diagram (`8_deployment_diagram.png`)** |
| <img src="diagrams/7_component_diagram.png" width="100%" alt="Component Diagram" /> | <img src="diagrams/8_deployment_diagram.png" width="100%" alt="Deployment Diagram" /> |

---

## ✨ Key Features (Mapped to Real Code)

### 🏛️ 1. Object-Oriented Domain Architecture & Design Patterns (`src/`)
- **Abstraction, Inheritance & Polymorphism (`User.java`, `Gamer.java`, `Player.java`, `Admin.java`)**: Abstract base class `User` encapsulates shared identity state (`userId`, `username`, `email`, `login()`, `logout()`) and enforces the polymorphic `getRole()` contract overridden by `Gamer` and `Admin`.
- **Lifecycle-Bound Composition (`Game.java`, `PerformanceLog.java`, `PerformanceSession.java`, `Review.java`)**: Implements the Class Diagram's filled-diamond composition (`*--`) where each `Game` instance owns its `List<PerformanceSession>` and `List<Review>` collections and exposes `recordPerformance()` and `getGameDetails()`.
- **Singleton Calculation Engine (`AnalyticsEngine.java`)**: Implements the **Singleton Design Pattern** (`AnalyticsEngine.getInstance()`) with overloaded methods supporting both `Game` references and `String gameId` lookups (`calculateAverageRating()`, `calculateAverageFps()`, `getSystemStabilityScore()`, `generateGameReport()`).
- **Authentication & Data Access Layers (`AuthService.java`, `DatabaseHandler.java`, `LoginDialog.java`)**: Implements the Component, Sequence, and Activity Diagram workflows (`verifyCredentials()`, `savePerformanceLog()`, `saveReview()`, `fetchAllReviews()`, `fetchAllLogs()`) with role-based access enforcement in `AdminPanel.java` and `GamesPanel.java`.

### 🌐 2. Cel-Shaded "Gaming Toon" React 18 Web Frontend (`frontend/src/`)
- **Floating Glossy Pill HUD Navbar (`Header.jsx`, `index.css`)**: Single-bar rounded-full navigation pill featuring the `FP` emblem, vertical 3D roll-shift link hover transitions (`.nav-flip-wrapper`), live pending moderation badge, and a one-click Java API sync button.
- **Isometric 2D Canvas Stickers (`Sticker.tsx`, `fun.ts`, `icons.ts`, `motions.ts`)**: Custom 60fps HTML5 `<canvas>` isometric sticker renderer using Riso palettes (`#F15060`, `#0078BF`, `#FFB511`, `#00A95C`) and After Effects cubic-bezier keyframe presets (`trophy`, `streak`, `battery`, `notes`, `chat`, `search`) across KPI cards and empty states.
- **GSAP Staggered Entrance Animations (`AnimatedContent.jsx`)**: ScrollTrigger and mount-driven spring/back-out transitions (`gsap`) across dashboard cards and page switches.
- **Hybrid Java REST + Persistent LocalStorage Engine (`App.jsx`, `api.js`, `initialData.js`)**: Automatically syncs with the Java backend on `http://localhost:8080/api` (`ApiServer.java`) and persists all logged sessions, new games, and review moderation changes in `localStorage` (`framepulse_telemetry_store_v1`) so state survives browser refreshes (`F5`) even on static cloud deployments (Vercel).

### 📊 3. Automated Telemetry Formulas & Report Exporter
- **Weighted System Stability Score (`Game.java`, `initialData.js`)**: Combines normalized frame-rate points (up to 70 pts) with crash-free session ratio (up to 30 pts), producing the exact Object Diagram benchmark of **`82.5 / 100`** for *Cyber Odyssey (`GM-501`, `72.4 FPS`, `0 crashes`)*.
- **One-Click Diagnostic Report Generator (`Report.java`, `ReportModal.jsx`)**: Generates structured `REP-001` telemetry reports with instant clipboard copy and `.txt` file download (`FramePulse_GM-501_REP-001.txt`).

---

## 🎮 Controls, CLI Commands & REST API Reference

### 🖥️ CLI & Build Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **One-Click Java Launch (Windows)** | `.\run.bat` | Auto-detects JDK, compiles `src\*.java` into `out/`, starts `ApiServer` (`:8080`), and opens the Swing GUI. |
| **Compile Java Sources Manually** | `javac -d out src\*.java` | Compiles all 22 Java classes into the `out/` bytecode folder. |
| **Run Headless Java API Server** | `java -cp out ApiServer` | Runs only the Java HTTP REST server on `http://localhost:8080/api`. |
| **Start React Web Dev Server** | `cd frontend && npm run dev` | Starts Vite dev server on `http://localhost:5173` (proxying `/api` to `:8080`). |
| **Build React Production Bundle** | `cd frontend && npm run build` | Outputs optimized static production bundle into `frontend/dist/`. |

### 🔌 Java HTTP REST API Endpoints (`src/ApiServer.java` $\leftrightarrow$ `frontend/src/services/api.js`)

| HTTP Method | Endpoint | Request Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/games` | None | Returns JSON array of all `Game` objects with nested `sessions`, `reviews`, and stability scores. |
| `POST` | `/api/games` | `{ "title": "...", "genre": "..." }` | Calls `AnalyticsSystem.addGame()` via `Admin.addGame()` and returns the created `GM-xxx` game. |
| `POST` | `/api/sessions` | `{ "gameId", "player", "resolution", "averageFps", "cpuUsagePercent", "gpuUsagePercent", "crashed" }` | Calls `AnalyticsSystem.logSession()` & `DatabaseHandler.savePerformanceLog()` (`LOG-xxx`). |
| `POST` | `/api/reviews` | `{ "gameId", "player", "rating", "comment" }` | Calls `AnalyticsSystem.submitReview()` & `DatabaseHandler.saveReview()` with status `PENDING` (`REV-xxx`). |
| `PUT` | `/api/reviews/:id` | `{ "status": "APPROVED" \| "REJECTED" }` | Moderates review status via `Admin.approveReview()` or `Admin.rejectReview()`. |
| `DELETE` | `/api/reviews/:id` | URL Parameter `:id` (`REV-xxx`) | Permanently removes a review via `Admin.deleteReview()`. |

### 🔑 Default Demo Credentials (`AuthService.java` & `LoginDialog.java`)

| Role | User ID | Username | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `A-101` | `admin_usman` | `admin123` | Full access: Add games, Approve/Reject/Delete reviews, Log sessions, Export reports. |
| **Gamer** | `G-201` | `shadow_ninja` | `gamer123` | Gamer access: Log FPS sessions, Submit 1–5 star reviews, Inspect analytics & reports. |

---

## 🗺️ Architecture & Workflow Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph Client["Presentation Layer (React 18 Web UI + Java Swing GUI)"]
        ReactUI["React 18 + Vite Web App (frontend/src/App.jsx)"]
        SwingUI["Java Swing Desktop App (src/MainFrame.java & LoginDialog.java)"]
    end

    subgraph Transport["API & Controller Layer (src/)"]
        API["ApiServer.java (JDK HttpServer :8080/api)"]
        SYS["AnalyticsSystem.java (Central Use-Case Controller)"]
        AUTH["AuthService.java (verifyCredentials / Session State)"]
        ENG["AnalyticsEngine.java «Singleton»"]
    end

    subgraph Domain["OOAD Domain & Data Access Layer (src/)"]
        DBH["DatabaseHandler.java (saveReview / savePerformanceLog / fetchAll)"]
        USR["User.java «abstract»"]
        GMR["Gamer.java / Player.java"]
        ADM["Admin.java"]
        GM["Game.java (GM-501..GM-504)"]
        LOG["PerformanceLog.java / PerformanceSession.java (LOG-301..)"]
        REV["Review.java + ReviewStatus.java (REV-901..)"]
        RPT["Report.java (REP-001)"]
    end

    ReactUI <-->|"HTTP JSON (/api/games, /api/sessions, /api/reviews)"| API
    API --> SYS
    SwingUI --> SYS
    SYS --> AUTH
    SYS --> ENG
    SYS --> DBH
    DBH --> GM
    USR <|-- GMR
    USR <|-- ADM
    ADM -->|manages| GM
    GMR -->|generates| LOG
    GMR -->|submits| REV
    GM *-- LOG
    GM *-- REV
    ENG -->|analyzes| GM
    ENG -->|produces| RPT
```

---

## 📂 Project Structure (Annotated Tree)

```text
FramePulse/
├── assets/
│   ├── logo.png                          # Official FramePulse brand emblem
│   └── screenshots/                      # Native Java Swing UI screenshots (1_dashboard..5_manage_games)
├── diagrams/                             # All 8 UML Diagrams (.puml source + rendered .png images)
│   ├── 1_class_diagram.puml / .png       # Class Diagram (8 core classes, inheritance & composition)
│   ├── 2_object_diagram.puml / .png      # Object Diagram (GM-501, LOG-301, REV-901, REP-001 snapshot)
│   ├── 3_use_case_diagram.puml / .png    # Use Case Diagram (Admin, Gamer & Analytics Engine actors)
│   ├── 4_sequence_diagram.puml / .png    # Sequence Diagram (End-to-end 21-step message lifecycle)
│   ├── 5_communication_diagram.puml/.png # Communication Diagram (Object link topology)
│   ├── 6_activity_diagram.puml / .png    # Activity Diagram (3-swimlane authentication & action flow)
│   ├── 7_component_diagram.puml / .png   # Component Diagram (Presentation, Business Logic & Data Access)
│   └── 8_deployment_diagram.puml / .png  # Deployment Diagram (Client, Application Server & Storage nodes)
├── frontend/                             # React 18 + Vite 5 + Tailwind Cel-Shaded Web Application
│   ├── index.html                        # Warm Mocha theme config, Google Fonts & Material Symbols
│   ├── package.json                      # Frontend dependencies (react, gsap, vite) & build scripts
│   ├── vite.config.js                    # Vite dev server config with /api proxy to localhost:8080
│   ├── public/logo/                      # Static brand assets (favicon.png, logo.png)
│   └── src/
│       ├── main.jsx                      # React DOM root mount
│       ├── index.css                     # Tactical grid background, 3D nav flip & cel-shaded utilities
│       ├── App.jsx                       # Root controller, normalizeGames(), localStorage & API sync
│       ├── components/
│       │   ├── Header.jsx                # Floating rounded-full pill HUD navbar with FP emblem
│       │   ├── AnimatedContent.jsx       # GSAP ScrollTrigger & mount entrance animation wrapper
│       │   ├── ReportModal.jsx           # Interactive REP-001 report viewer, copy & .txt downloader
│       │   └── Toast.jsx                 # Cel-shaded notification toast banner
│       ├── pages/
│       │   ├── DashboardPage.jsx         # Screen 1: Bento KPIs, FPS bar chart, session table & reviews
│       │   ├── LogSessionPage.jsx        # Screen 2: Hardware telemetry submission form & formula card
│       │   ├── SubmitReviewPage.jsx      # Screen 3: Interactive 5-star rating matrix & review form
│       │   ├── AdminModerationPage.jsx   # Screen 4: Filterable moderation queue (Approve/Reject/Delete)
│       │   └── ManageGamesPage.jsx       # Screen 5: Catalog registration & game comparison matrix
│       ├── services/
│       │   └── api.js                    # REST client connecting React frontend to Java ApiServer (:8080)
│       ├── data/
│       │   └── initialData.js            # Initial dataset & JS telemetry calculation helpers
│       └── stickers/                     # Isometric 2D canvas sticker engine (kelvinkn17/fun-isometric)
│           ├── Sticker.tsx               # React canvas animation loop component
│           ├── fun.ts                    # Isometric projection math & Riso color palettes
│           ├── icons.ts                  # Sticker draw routines (trophy, streak, battery, notes, chat, search)
│           └── motions.ts                # Cubic-bezier keyframe animation presets
├── src/                                  # Java 17+ OOAD Backend, REST API Server & Swing Desktop GUI
│   ├── Main.java                         # Main entry point (starts ApiServer :8080 + MainFrame + LoginDialog)
│   ├── ApiServer.java                    # Built-in JDK HttpServer exposing /api/games, /sessions, /reviews
│   ├── AnalyticsSystem.java              # Central controller orchestrating domain objects & sample data
│   ├── AnalyticsEngine.java              # Singleton engine calculating ratings, FPS, stability & reports
│   ├── AuthService.java                  # Credential verification & active user session registry
│   ├── DatabaseHandler.java              # Data Access Layer repository matching Sequence/Component diagrams
│   ├── User.java                         # Abstract base user class (userId, username, email, getRole())
│   ├── Gamer.java                        # Gamer subclass (playTimeHours, submitReview, logSession)
│   ├── Player.java                       # Player compatibility subclass extending Gamer
│   ├── Admin.java                        # Admin subclass (addGame, approve/reject/deleteReview)
│   ├── Game.java                         # Game entity owning sessions & reviews lists + stability score
│   ├── PerformanceLog.java               # Hardware telemetry log entity (LOG-301, FPS, CPU/GPU %, crash)
│   ├── PerformanceSession.java           # Session wrapper extending PerformanceLog
│   ├── Review.java                       # Community review entity (REV-901, 1-5 rating, comment, status)
│   ├── ReviewStatus.java                 # Enum: PENDING, APPROVED, REJECTED
│   ├── Report.java                       # Diagnostic report entity (REP-001, exportReport())
│   ├── MainFrame.java                    # Java Swing main window with sidebar & user session badge
│   ├── LoginDialog.java                  # Modal authentication dialog with quick-fill demo accounts
│   ├── DashboardPanel.java               # Swing Screen 1: KPI cards, Java2D FPS chart & report export
│   ├── LogSessionPanel.java              # Swing Screen 2: Hardware session logging form
│   ├── ReviewPanel.java                  # Swing Screen 3: Interactive 5-star review form
│   ├── AdminPanel.java                   # Swing Screen 4: Role-guarded review moderation table
│   ├── GamesPanel.java                   # Swing Screen 5: Role-guarded game catalog manager
│   ├── FpsChartPanel.java                # Custom Java2D anti-aliased FPS line-and-area chart
│   ├── MetricCard.java                   # Custom Swing KPI card widget
│   ├── RoundedPanel.java                 # Custom Java2D rounded card container
│   ├── Refreshable.java                  # Interface for reactive Swing panel refreshes
│   └── Theme.java                        # Centralized Swing color palette, typography & component builders
├── run.bat                               # One-click Windows script to compile & launch Java Backend + GUI
├── PROJECT_GUIDE.md                      # Complete team Viva & CCP/CCA report reference guide
└── README.md                             # Main repository documentation
```

---

## 🚀 Getting Started (Installation & Run Guide)

### Prerequisites
- **Java Development Kit (JDK) 17 or higher** (for the Java Backend & Swing Desktop Suite)
- **Node.js 18+ and npm** (for the React + Vite Web Frontend)

### 1. Clone the Repository
```bash
git clone https://github.com/Muhammad-wasay/FramePulse.git
cd FramePulse
```

### 2. Run the Java Backend & Desktop Suite (`src/`)
**Option A — One-Click Windows Launcher (`run.bat`):**
```powershell
.\run.bat
```
*(This compiles all Java classes into `out/`, starts the REST API Server on `http://localhost:8080/api`, and launches the Java Swing application with the Login Dialog).*

**Option B — Manual Terminal Commands (All Platforms):**
```bash
mkdir out
javac -d out src/*.java
java -cp out Main
```

### 3. Run the React 18 Web Frontend (`frontend/`)
Open a second terminal in the project root and run:
```bash
cd frontend
npm install
npm run dev
```
Then open **`http://localhost:5173`** in your browser. If the Java Backend is running on `:8080`, the top navbar badge will automatically show **`JAVA API: ONLINE`**!

---

## 👤 Authors & Project Team

- **Muhammad Wasay** — [@Muhammad-wasay](https://github.com/Muhammad-wasay) (`wasayrafiq6@gmail.com`)
- **Muhammad Usman Masood** (`m.usman6614@gmail.com`)
- **Raza Ali**
- **Course:** CT-263 Object-Oriented Analysis & Design (CCA Live Demonstration & CCP Report)
