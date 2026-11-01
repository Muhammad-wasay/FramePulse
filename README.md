<div align="center">

<img src="assets/logo.png" alt="FramePulse Logo" width="130" />

# ⚡ FramePulse — Game Performance & Review Analytics System

**A Java Swing desktop telemetry & community review analytics suite built with Object-Oriented Analysis & Design (OOAD) principles, custom Java2D charts, and real-time stability scoring.**

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Java Swing](https://img.shields.io/badge/UI-Java_Swing_%26_Java2D-6F4E37?style=for-the-badge&logo=java&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-OOAD_%2B_MVC-5B8C5A?style=for-the-badge)
![UML](https://img.shields.io/badge/UML-PlantUML_(8_Diagrams)-A47551?style=for-the-badge&logo=uml&logoColor=white)
![Course](https://img.shields.io/badge/Course-CT--263_OOAD-3B2A20?style=for-the-badge)

<br />

<img src="assets/screenshots/1_dashboard.png" alt="FramePulse Analytics Dashboard" width="90%" />

</div>

---

## 📖 Overview & Core Concept

**FramePulse** addresses a critical fragmentation problem in PC game quality assessment: hardware performance metrics (FPS, CPU/GPU utilization, crash rates) and player sentiment (ratings and written reviews) usually live on separate platforms, while unmoderated review feeds suffer from review-bombing and spam.

FramePulse unifies **hardware telemetry logging**, **moderated player reviews**, and **automated stability scoring** inside a single, cohesive desktop application built purely in **Java Swing & Java2D** with zero external third-party runtime dependencies.

### 🔄 Core User Journey & Workflow
1. **Select or Register a Game (`GamesPanel.java`, `Game.java`)**: Browse the game catalog (e.g., *Cyber Odyssey `GM-501`*, *Shadow Racers `GM-502`*, *Mystic Realms `GM-503`*) or add new titles with auto-generated IDs.
2. **Log Hardware Telemetry Sessions (`LogSessionPanel.java`, `PerformanceLog.java`)**: Gamers record their resolution (`720p`, `1080p`, `1440p`, `4K`), average FPS, CPU usage %, GPU usage %, and whether the game crashed (`LOG-301`, `LOG-302`, ...).
3. **Submit Star Ratings & Reviews (`ReviewPanel.java`, `Review.java`)**: Gamers rate a title from 1 to 5 stars and write a review (`REV-901`, `REV-902`, ...), which enters the `PENDING` moderation queue.
4. **Moderate Community Reviews (`AdminPanel.java`, `Admin.java`)**: Administrators filter reviews by status (`PENDING`, `APPROVED`, `REJECTED`, `ALL`) and approve valid feedback or delete/reject toxic spam.
5. **Inspect Live Telemetry & Export Reports (`DashboardPanel.java`, `AnalyticsEngine.java`, `Report.java`)**: The dashboard automatically recalculates the **Average Rating**, **Average FPS**, and **System Stability Score (`0–100`)**, plots the last 12 sessions on a custom Java2D line-and-area chart, and exports formatted summary reports (`REP-001`).

---

## 🖼️ Visual Showcase / Screenshots Gallery

### 🖥️ Application Screens

| 📊 Analytics Dashboard | 🎮 Log FPS Session |
| :---: | :---: |
| <img src="assets/screenshots/1_dashboard.png" width="100%" alt="Analytics Dashboard" /> | <img src="assets/screenshots/2_log_session.png" width="100%" alt="Log FPS Session" /> |
| **⭐ Submit Review** | **🛡️ Admin Moderation** |
| <img src="assets/screenshots/3_submit_review.png" width="100%" alt="Submit Review" /> | <img src="assets/screenshots/4_admin_moderation.png" width="100%" alt="Admin Moderation" /> |
| **🗂️ Manage Games Catalog** | **⚡ FramePulse Official Brand Identity** |
| <img src="assets/screenshots/5_manage_games.png" width="100%" alt="Manage Games" /> | <img src="assets/logo.png" width="55%" alt="FramePulse Logo" /> |

### 📐 Complete UML Diagrams Suite (PlantUML)

| 1. Class Diagram | 2. Object Diagram |
| :---: | :---: |
| <img src="diagrams/1_class_diagram.png" width="100%" alt="Class Diagram" /> | <img src="diagrams/2_object_diagram.png" width="100%" alt="Object Diagram" /> |
| **3. Use Case Diagram** | **4. Sequence Diagram** |
| <img src="diagrams/3_use_case_diagram.png" width="100%" alt="Use Case Diagram" /> | <img src="diagrams/4_sequence_diagram.png" width="100%" alt="Sequence Diagram" /> |
| **5. Communication Diagram** | **6. Activity Diagram** |
| <img src="diagrams/5_communication_diagram.png" width="100%" alt="Communication Diagram" /> | <img src="diagrams/6_activity_diagram.png" width="100%" alt="Activity Diagram" /> |
| **7. Component Diagram** | **8. Deployment Diagram** |
| <img src="diagrams/7_component_diagram.png" width="100%" alt="Component Diagram" /> | <img src="diagrams/8_deployment_diagram.png" width="100%" alt="Deployment Diagram" /> |

---

## ✨ Key Features (Mapped to Real Code)

### 🏛️ 1. Object-Oriented Domain Model & Design Patterns
- **Inheritance & Polymorphism (`User.java`, `Gamer.java`, `Player.java`, `Admin.java`)**: Abstract base class `User` defines shared identity attributes (`userId`, `username`, `email`), session state (`login()`, `logout()`), and the abstract polymorphic contract `getRole()`, implemented by `Gamer` and `Admin`.
- **Composition (`Game.java`, `PerformanceLog.java`, `Review.java`)**: Each `Game` owns its lifecycle-bound collections of `PerformanceSession` (`PerformanceLog`) and `Review` objects (`1` to `0..*`), computing aggregated telemetry directly from its encapsulated lists.
- **Singleton Design Pattern (`AnalyticsEngine.java`)**: Ensures a single centralized calculation engine instance (`AnalyticsEngine.getInstance()`) responsible for computing `calculateAverageRating()`, `calculateAverageFps()`, `getSystemStabilityScore()`, and `generateGameReport()`.
- **Central System Controller (`AnalyticsSystem.java`)**: Manages catalog state, auto-incrementing entity IDs (`GM-501`, `G-201`, `LOG-301`, `REV-901`), sample data initialization, and use-case orchestration.

### 📊 2. Telemetry Calculations & Report Generation
- **System Stability Score Algorithm (`Game.java`)**: Computes a weighted `0–100` score combining normalized frame-rate performance (up to 70 points) with crash-free session ratio (up to 30 points).
- **Custom Java2D Telemetry Chart (`FpsChartPanel.java`)**: Renders an anti-aliased line-and-area chart for the latest 12 gameplay sessions, complete with a dashed `60 FPS target` reference line and color-coded data nodes (Green $\ge 60$ FPS, Amber $30\text{--}59$ FPS, Red $< 30$ FPS).
- **One-Click Report Exporter (`Report.java`, `DashboardPanel.java`)**: Generates structured analytics reports (`REP-001`) summarizing release details, average rating, average FPS, CPU/GPU load, and stability score via `exportReport()`.

### 🎨 3. Coffee-Minimalist Custom Swing UI Architecture
- **Centralized Design System (`Theme.java`, `RoundedPanel.java`, `MetricCard.java`)**: Implements a cohesive warm cream (`#F7F3EE`), white card (`#FFFFFF`), and espresso-brown (`#6F4E37`) theme with custom anti-aliased `RoundRectangle2D` cards, left neon accent bars, zebra-striped tables, and status-colored cell renderers.
- **Reactive Screen Switching (`MainFrame.java`, `Refreshable.java`)**: Uses `CardLayout` paired with the `Refreshable` interface so every screen (`DashboardPanel`, `LogSessionPanel`, `ReviewPanel`, `AdminPanel`, `GamesPanel`) automatically reloads live metrics whenever navigated to.

---

## 🎮 Controls, Usage & Core API Reference

### 🖥️ CLI Commands & Launcher Scripts

| Action | Command | Description |
| :--- | :--- | :--- |
| **One-Click Run (Windows)** | `.\run.bat` | Compiles all `.java` sources in `src/` into `out/` and launches `Main`. |
| **Manual Compile** | `javac -d out src\*.java` | Compiles all 18 Java classes into the `out/` bytecode directory. |
| **Manual Launch** | `java -cp out Main` | Starts the FramePulse Swing desktop application on the Event Dispatch Thread. |

### 🧩 Core Domain & Controller API (`src/`)

| Class & Method | Parameters | Return Type | Purpose |
| :--- | :--- | :--- | :--- |
| `AnalyticsSystem.addGame(...)` | `String title, String genre` | `Game` | Creates a new `Game` (`GM-504`, ...) via `Admin.addGame()` and adds it to the catalog. |
| `AnalyticsSystem.logSession(...)` | `Game, String player, String res, double fps, double cpu, double gpu, boolean crashed` | `PerformanceSession` | Registers/fetches the `Gamer` and records a new `PerformanceLog` (`LOG-304`, ...). |
| `AnalyticsSystem.submitReview(...)` | `Game, String player, int rating, String comment` | `Review` | Submits a `1–5` star review (`REV-907`, ...) initialized to `ReviewStatus.PENDING`. |
| `Admin.approveReview(...)` / `rejectReview(...)` | `Review review` | `void` | Transitions review state to `APPROVED` (counted in rating) or `REJECTED`. |
| `Admin.deleteReview(...)` | `String reviewId, List<Game> catalog` | `boolean` | Permanently removes a toxic or spam review from its parent `Game`. |
| `AnalyticsEngine.generateGameReport(...)` | `Game game` | `Report` | Produces a timestamped `Report` (`REP-001`) with overall stability score and summary text. |

---

## 🗺️ Architecture & Workflow Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph UI["Presentation Layer (Java Swing & Java2D)"]
        MF["MainFrame (CardLayout + Brand Sidebar)"]
        DP["DashboardPanel (Metrics + FpsChartPanel)"]
        LP["LogSessionPanel (Telemetry Form)"]
        RP["ReviewPanel (Interactive 5-Star Form)"]
        AP["AdminPanel (Moderation Queue)"]
        GP["GamesPanel (Catalog Manager)"]
    end

    subgraph Logic["Business Logic & Controller Layer"]
        AS["AnalyticsSystem (Use-Case Controller)"]
        AE["AnalyticsEngine «Singleton»"]
    end

    subgraph Domain["OOAD Domain Model Layer"]
        U["User «abstract»"]
        GM["Gamer / Player"]
        AD["Admin"]
        G["Game"]
        PL["PerformanceLog / PerformanceSession"]
        RV["Review + ReviewStatus"]
        RPT["Report"]
    end

    MF --> DP & LP & RP & AP & GP
    DP & LP & RP & AP & GP --> AS
    AS --> AE
    U <|-- GM
    U <|-- AD
    AD -->|manages| G
    GM -->|generates| PL
    GM -->|submits| RV
    G *-- PL
    G *-- RV
    AE -->|processes| G
    AE -->|produces| RPT
```

---

## 📂 Project Structure (Annotated Tree)

```text
GAMING-UI/
├── assets/
│   ├── logo.png                          # Official FramePulse brand & taskbar icon
│   └── screenshots/                      # Rendered high-res screenshots of all 5 screens
│       ├── 1_dashboard.png               # Analytics Dashboard view
│       ├── 2_log_session.png             # Hardware FPS & CPU/GPU telemetry form
│       ├── 3_submit_review.png           # Interactive 5-star review submission view
│       ├── 4_admin_moderation.png        # Admin review approval/rejection/deletion view
│       └── 5_manage_games.png            # Game catalog & comparative metrics table
├── diagrams/                             # Complete suite of 8 UML diagrams (.puml + .png)
│   ├── 1_class_diagram.puml / .png       # Class Diagram (8 core classes & relationships)
│   ├── 2_object_diagram.puml / .png      # Object Diagram (GM-501, LOG-301, REV-901 snapshot)
│   ├── 3_use_case_diagram.puml / .png    # Use Case Diagram (Gamer, Admin, Analytics Engine)
│   ├── 4_sequence_diagram.puml / .png    # Sequence Diagram (21-step interaction flow)
│   ├── 5_communication_diagram.puml/.png # Communication Diagram (numbered object links)
│   ├── 6_activity_diagram.puml / .png    # Activity Diagram (3 swimlanes: User, UI, Engine)
│   ├── 7_component_diagram.puml / .png   # Component Diagram (3-tier layered architecture)
│   └── 8_deployment_diagram.puml / .png  # Deployment Diagram (Client, JVM Server, Storage)
├── src/                                  # Java source code (18 clean, modular classes)
│   ├── Main.java                         # Application entry point (launches Swing UI)
│   ├── MainFrame.java                    # Primary window, custom logo loader & sidebar navigation
│   ├── Theme.java                        # Coffee-brown & cream palette, fonts, UI factories
│   ├── RoundedPanel.java                 # Custom Java2D rounded card component
│   ├── MetricCard.java                   # Bento KPI card widget (Title, Value, Accent Subtitle)
│   ├── FpsChartPanel.java                # Custom Java2D line + area FPS chart with 60 FPS target
│   ├── Refreshable.java                  # Interface for automatic screen data reloading
│   ├── DashboardPanel.java               # Screen 1: Telemetry KPIs, FPS chart, reviews & export
│   ├── LogSessionPanel.java              # Screen 2: Hardware session logging form & validation
│   ├── ReviewPanel.java                  # Screen 3: Interactive star rating & review form
│   ├── AdminPanel.java                   # Screen 4: Review moderation (Approve / Reject / Delete)
│   ├── GamesPanel.java                   # Screen 5: Add new games & compare catalog metrics
│   ├── AnalyticsSystem.java              # Central controller & sample data initializer
│   ├── AnalyticsEngine.java              # Singleton analytics calculator & report generator
│   ├── User.java                         # Abstract base user class (userId, username, email)
│   ├── Gamer.java                        # Gamer subclass (playTimeHours, logSession, submitReview)
│   ├── Player.java                       # Player alias subclass for UI table compatibility
│   ├── Admin.java                        # Admin subclass (addGame, approve/reject/deleteReview)
│   ├── Game.java                         # Game entity (owns reviews & logs, computes stability)
│   ├── PerformanceLog.java               # Hardware session log (FPS, CPU %, GPU %, resolution)
│   ├── PerformanceSession.java           # Session wrapper extending PerformanceLog
│   ├── Review.java                       # Player review entity (1-5 rating, comment, status)
│   ├── ReviewStatus.java                 # Enum: PENDING, APPROVED, REJECTED
│   └── Report.java                       # Analytics report entity (REP-001, exportReport())
├── run.bat                               # One-click Windows compile & run batch script
├── PROJECT_GUIDE.md                      # Complete team guide (Idea, OOP, UML & Viva prep)
├── project.readme                        # Team reference copy of the complete project guide
└── README.md                             # Main repository documentation
```

---

## 🚀 Getting Started (Installation & Run Guide)

### Prerequisites
- **Java Development Kit (JDK) 17 or higher** (Tested on OpenJDK 21 LTS). Verify with:
  ```powershell
  java -version
  javac -version
  ```

### 1. Clone the Repository
```powershell
git clone https://github.com/Muhammad-wasay/FramePulse.git
cd FramePulse
```

### 2. Compile & Run
**Option A — One-Click Script (Windows PowerShell / CMD):**
```powershell
.\run.bat
```

**Option B — Manual Terminal Commands (All Platforms):**
```powershell
mkdir out -Force
javac -d out src\*.java
java -cp out Main
```

---

## 👤 Authors & Project Team

- **Muhammad Wasay** — [@Muhammad-wasay](https://github.com/Muhammad-wasay) (`wasayrafiq6@gmail.com`)
- **M. Usman Masood** & **CT-263 OOAD Group Members**
- **Course:** CT-263 Object-Oriented Analysis & Design (CCA Live Demonstration & CCP Report)
