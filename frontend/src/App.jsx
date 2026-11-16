import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import ReportModal from './components/ReportModal';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import AnimatedContent from './components/AnimatedContent';
import DashboardPage from './pages/DashboardPage';
import LogSessionPage from './pages/LogSessionPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import AdminModerationPage from './pages/AdminModerationPage';
import ManageGamesPage from './pages/ManageGamesPage';
import { AVATARS, GAME_COVERS, INITIAL_GAMES } from './data/initialData';
import {
  DEFAULT_ACCOUNTS,
  syncSessionToSupabase,
  syncReviewToSupabase,
  moderateReviewInSupabase,
  addGameToSupabase,
  fetchSupabaseData,
} from './services/supabaseService';
import {
  apiAddGame,
  apiLogSession,
  apiModerateReview,
  apiSubmitReview,
  checkJavaBackendStatus,
} from './services/api';

// Makes any backend game JSON safe for the UI: missing arrays/fields never crash a page.
function normalizeGames(list) {
  const coverKeys = [
    GAME_COVERS.cyber,
    GAME_COVERS.apex,
    GAME_COVERS.chronos,
    GAME_COVERS.valkyrie,
    GAME_COVERS.armored,
  ];
  const avatarKeys = [AVATARS.vortex, AVATARS.pixel, AVATARS.kira];

  return list.map((g, i) => {
    const rawSessions = g.sessions ?? g.performanceLogs ?? [];
    const sessions = rawSessions.map((s, idx) => ({
      logId: s.logId ?? s.sessionId ?? `LOG-${301 + idx}`,
      runNumber: s.runNumber ?? `#${String(idx + 1).padStart(2, '0')}`,
      player:
        typeof s.player === 'object' && s.player !== null
          ? s.player.username || s.player.name || 'shadow_ninja'
          : s.player ?? 'shadow_ninja',
      hardware: s.hardware ?? 'Verified PC Telemetry Rig',
      resolution: s.resolution ?? '1440p',
      averageFps: Number(s.averageFps ?? 60),
      onePercentLow: Number(
        s.onePercentLow ?? ((Number(s.averageFps ?? 60) * 0.78).toFixed(1))
      ),
      cpuUsagePercent: Number(s.cpuUsagePercent ?? 50),
      gpuUsagePercent: Number(s.gpuUsagePercent ?? 80),
      crashed: Boolean(s.crashed),
      timestamp: s.timestamp ?? 'Oct 2026 • Verified Pass',
    }));

    const rawReviews = g.reviews ?? [];
    const reviews = rawReviews.map((r, rIdx) => ({
      reviewId: r.reviewId ?? `REV-${901 + rIdx}`,
      player:
        typeof r.player === 'object' && r.player !== null
          ? r.player.username || r.player.name || 'Verified Gamer'
          : r.player ?? 'Verified Gamer',
      roleBadge: r.roleBadge ?? 'Verified Gamer',
      avatar: r.avatar ?? avatarKeys[rIdx % avatarKeys.length],
      rating: Number(r.rating ?? 4),
      comment: r.comment ?? 'Solid performance with minimal frame drop.',
      status: r.status ?? (r.approved ? 'APPROVED' : 'PENDING'),
      timestamp: r.timestamp ?? r.submissionDate ?? 'Oct 2026',
      hardwareSpec: r.hardwareSpec ?? 'RTX 40-Series Verified Rig',
    }));

    return {
      gameId: g.gameId ?? `GM-${501 + i}`,
      title: g.title ?? 'Untitled Game',
      genre: g.genre ?? 'Action',
      releaseDate: g.releaseDate ?? '2023-11-15',
      engineStack: g.engineStack ?? 'DirectX 12 / Vulkan',
      patchVersion: g.patchVersion ?? 'v1.0.0',
      coverUrl: g.coverUrl ?? coverKeys[i % coverKeys.length],
      chartHistory: g.chartHistory ?? [
        { run: '#01', fps: 60, note: 'Baseline' },
        { run: '#02*', fps: 72, note: 'Current Pass', current: true },
      ],
      sessions,
      reviews,
    };
  });
}

const STORAGE_KEY = 'framepulse_telemetry_store_v2';
const USER_STORAGE_KEY = 'framepulse_active_user_v1';

const VALID_PAGES = new Set([
  'analytics-dashboard',
  'log-fps-session',
  'submit-review',
  'admin-moderation',
  'manage-games',
]);

function getInitialPage() {
  const hash = window.location.hash.replace(/^#/, '');
  return VALID_PAGES.has(hash) ? hash : 'analytics-dashboard';
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);

  // Active User session matching OOAD Actor hierarchy (Admin vs Gamer)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Start unauthenticated so user can explicitly Sign In or Sign Up
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (VALID_PAGES.has(hash)) setActivePage(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page) => {
    if (VALID_PAGES.has(page)) {
      window.location.hash = page;
    }
    setActivePage(page);
  };

  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeGames(parsed);
        }
      }
    } catch {
      // Ignore storage read errors and fall back to INITIAL_GAMES
    }
    return INITIAL_GAMES;
  });

  const [selectedGameId, setSelectedGameId] = useState('GM-501');
  const [backendOnline, setBackendOnline] = useState(false);
  const [reportModalGame, setReportModalGame] = useState(null);
  const [reportCounter, setReportCounter] = useState(1);
  const [toast, setToast] = useState(null);

  // Persistent Form Drafts across tab navigation (never resets on tab switch)
  const [fpsDraft, setFpsDraft] = useState({
    gameId: 'GM-501',
    player: 'Falcon_Pilot',
    hardware: 'RTX 4080 • Core i7-14700K',
    resolution: '1440p QHD',
    fps: 142,
    cpu: 54,
    gpu: 89,
    crashed: false,
  });

  const [reviewDraft, setReviewDraft] = useState({
    gameId: 'GM-501',
    player: 'Falcon_Pilot',
    rating: 4,
    comment:
      'Solid 120 FPS lock on 1440p High Preset. Frame generation remains clean without noticeable latency artifacts.',
    selectedTags: ['RTX 4070 Tested', 'DLSS Enabled'],
  });

  // Sync draft player names with active logged-in user
  useEffect(() => {
    if (currentUser?.username) {
      setFpsDraft((prev) => ({ ...prev, player: currentUser.username }));
      setReviewDraft((prev) => ({ ...prev, player: currentUser.username }));
    }
  }, [currentUser]);

  // Persist all telemetry, reviews, moderation status, and games across browser refreshes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch {
      // Ignore storage quota errors
    }
  }, [games]);

  // Persist active user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [currentUser]);

  const showToast = (title, message, type = 'success', icon = 'task_alt') => {
    setToast({ title, message, type, icon });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Probe Java backend status on load (non-blocking)
  useEffect(() => {
    let mounted = true;
    checkJavaBackendStatus().then(({ online, data }) => {
      if (!mounted) return;
      setBackendOnline(online);
      if (online && Array.isArray(data) && data.length > 0) {
        setGames(normalizeGames(data));
      }
    });

    // Also sync reviews dynamically from Supabase
    fetchSupabaseData().then((supaGames) => {
      if (!mounted || !Array.isArray(supaGames) || supaGames.length === 0) return;
      setGames((prevGames) =>
        prevGames.map((game) => {
          const match = supaGames.find((sg) => sg.gameId === game.gameId);
          if (match && Array.isArray(match.reviews) && match.reviews.length > 0) {
            return {
              ...game,
              reviews: match.reviews.map((sr) => {
                const existingRev = (game.reviews || []).find((r) => r.reviewId === sr.reviewId);
                return {
                  ...sr,
                  hardwareSpec: sr.hardwareSpec || existingRev?.hardwareSpec || 'Verified Gaming Rig',
                  tags: existingRev?.tags || ['Verified Rig'],
                  avatar: existingRev?.avatar || AVATARS.vortex,
                };
              }),
            };
          }
          return game;
        })
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Total pending reviews across all games for badges
  const pendingCount = games.reduce(
    (sum, g) =>
      sum + (g.reviews || []).filter((r) => r.status === 'PENDING').length,
    0
  );

  const nextGameNumber = 500 + games.length + 1;

  const handleRefresh = async () => {
    const { online, data } = await checkJavaBackendStatus();
    setBackendOnline(online);
    if (online && Array.isArray(data) && data.length > 0) {
      setGames(normalizeGames(data));
      showToast(
        'Java Backend Synced!',
        'Telemetry refreshed from http://localhost:8080/api/games',
        'success',
        'cloud_done'
      );
    } else {
      showToast(
        'Telemetry Stream Active',
        'Synced with local state store & Supabase Cloud API',
        'success',
        'sync'
      );
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    showToast(
      'Login Successful!',
      `Logged in as ${user.username} (${user.role} • ${user.userId}).`,
      'success',
      'verified_user'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast(
      'Logged Out',
      'Session ended. You are now browsing as Guest.',
      'warning',
      'logout'
    );
  };

  const handleLogSession = async (sessionPayload) => {
    const maxLogNum = games
      .flatMap((g) => g.sessions || [])
      .reduce((max, s) => {
        const n = parseInt(String(s.logId).replace(/\D/g, ''), 10);
        return Number.isNaN(n) ? max : Math.max(max, n);
      }, 300);
    const nextLogNum = maxLogNum + 1;
    const targetGame = games.find((g) => g.gameId === sessionPayload.gameId);
    const nextRunNum = `#${String((targetGame?.sessions?.length || 0) + 1).padStart(2, '0')}`;
    const onePercentLow = Number((sessionPayload.averageFps * 0.78).toFixed(1));

    const newSession = {
      logId: `LOG-${nextLogNum}`,
      runNumber: nextRunNum,
      player: sessionPayload.player || currentUser?.username || 'shadow_ninja',
      hardware: sessionPayload.hardware,
      resolution: sessionPayload.resolution,
      averageFps: sessionPayload.averageFps,
      onePercentLow,
      cpuUsagePercent: sessionPayload.cpuUsagePercent,
      gpuUsagePercent: sessionPayload.gpuUsagePercent,
      crashed: sessionPayload.crashed,
      timestamp: 'Just now • Live Ingest Session',
      gameId: sessionPayload.gameId,
    };

    // 1. Sync to local Java API if running
    apiLogSession(sessionPayload).catch(() => {});

    // 2. Sync to Supabase in background
    syncSessionToSupabase(newSession).catch(() => {});

    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.gameId !== sessionPayload.gameId) return game;
        return {
          ...game,
          sessions: [...(game.sessions || []), newSession],
        };
      })
    );

    setSelectedGameId(sessionPayload.gameId);
    showToast(
      'Session Logged!',
      `${sessionPayload.averageFps} FPS pass recorded for ${sessionPayload.player} (${sessionPayload.resolution}).`,
      sessionPayload.crashed ? 'warning' : 'success',
      sessionPayload.crashed ? 'warning' : 'speed'
    );
  };

  const handleSubmitReview = async (reviewPayload) => {
    const maxReviewNum = games
      .flatMap((g) => g.reviews || [])
      .reduce((max, r) => {
        const n = parseInt(String(r.reviewId).replace(/\D/g, ''), 10);
        return Number.isNaN(n) ? max : Math.max(max, n);
      }, 900);
    const newReviewId = `REV-${maxReviewNum + 1}`;

    const newReview = {
      reviewId: newReviewId,
      gameId: reviewPayload.gameId,
      player: reviewPayload.player || currentUser?.username || 'Verified Gamer',
      roleBadge: currentUser?.role === 'Admin' ? 'A-101 ADMIN' : 'Verified Rig',
      avatar: AVATARS.vortex,
      rating: reviewPayload.rating,
      comment: reviewPayload.comment,
      status: 'PENDING',
      timestamp: 'Just now',
      hardwareSpec: reviewPayload.hardwareSpec,
    };

    // 1. Sync to local Java API if running
    apiSubmitReview(reviewPayload).catch(() => {});

    // 2. Sync to Supabase in background with reviewId
    syncReviewToSupabase(newReview).catch(() => {});

    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.gameId !== reviewPayload.gameId) return game;
        return {
          ...game,
          reviews: [newReview, ...(game.reviews || [])],
        };
      })
    );

    setSelectedGameId(reviewPayload.gameId);
    showToast(
      'Review Queued!',
      `Submitted by ${reviewPayload.player || currentUser?.username} with status PENDING for Admin Moderation.`,
      'warning',
      'rate_review'
    );
  };

  const handleModerateReviews = async (reviewIds, action) => {
    for (const id of reviewIds) {
      await apiModerateReview(id, action);
      moderateReviewInSupabase(id, action).catch(() => {});
    }

    setGames((prevGames) =>
      prevGames.map((game) => {
        if (action === 'DELETE') {
          return {
            ...game,
            reviews: (game.reviews || []).filter(
              (r) => !reviewIds.includes(r.reviewId)
            ),
          };
        }
        return {
          ...game,
          reviews: (game.reviews || []).map((r) =>
            reviewIds.includes(r.reviewId) ? { ...r, status: action } : r
          ),
        };
      })
    );

    const actionLabel =
      action === 'APPROVED'
        ? 'Approved & Published'
        : action === 'REJECTED'
        ? 'Rejected & Excluded'
        : 'Permanently Deleted';

    showToast(
      `Moderation: ${actionLabel}`,
      `Updated ${reviewIds.length} review(s): ${reviewIds.join(', ')}`,
      action === 'APPROVED'
        ? 'success'
        : action === 'REJECTED'
        ? 'warning'
        : 'danger',
      action === 'APPROVED'
        ? 'check_circle'
        : action === 'REJECTED'
        ? 'cancel'
        : 'delete'
    );
  };

  const handleAddGame = async (newGamePayload) => {
    await apiAddGame(newGamePayload);

    const newGameId = `GM-${nextGameNumber}`;
    const coverPool = [
      GAME_COVERS.armored,
      GAME_COVERS.cyber,
      GAME_COVERS.apex,
      GAME_COVERS.chronos,
      GAME_COVERS.valkyrie,
    ];
    const pickedCover = coverPool[games.length % coverPool.length];

    const createdGame = {
      gameId: newGameId,
      title: newGamePayload.title,
      genre: newGamePayload.genre,
      releaseDate: new Date().toISOString().split('T')[0],
      engineStack: newGamePayload.engineStack,
      patchVersion: 'Patch v1.0.0',
      coverUrl: pickedCover,
      chartHistory: [
        { run: '#01', fps: 65, note: 'Initial Baseline: 65 FPS' },
        { run: '#02*', fps: 72, note: 'Current Pass: 72 FPS', current: true },
      ],
      sessions: [
        {
          logId: `LOG-${350 + games.length}`,
          runNumber: '#01',
          player: currentUser?.username || 'TelemetryBot_01',
          hardware: 'RTX 4070 Super • Ryzen 7 7700X',
          resolution: '1440p QHD',
          averageFps: 72.0,
          onePercentLow: 58.0,
          cpuUsagePercent: 48,
          gpuUsagePercent: 86,
          crashed: false,
          timestamp: 'Just now • Baseline Calibration',
        },
      ],
      reviews: [],
    };

    addGameToSupabase(createdGame).catch(() => {});

    setGames((prev) => [...prev, createdGame]);
    setSelectedGameId(newGameId);
    showToast(
      'New Game Indexed!',
      `${createdGame.title} (${createdGame.gameId}) added to the FramePulse catalog.`,
      'success',
      'sports_esports'
    );
  };

  const handleInspectGame = (gameId) => {
    setSelectedGameId(gameId);
    navigateTo('analytics-dashboard');
  };

  const handleOpenReport = (game) => {
    setReportModalGame(game);
  };

  const handleCloseReport = () => {
    setReportModalGame(null);
    setReportCounter((c) => c + 1);
  };

  return (
    <div className="gaming-grid-bg text-on-surface font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Horizontal HUD Navbar */}
      <Header
        activePage={activePage}
        onNavigate={navigateTo}
        backendOnline={backendOnline}
        onRefresh={handleRefresh}
        pendingCount={pendingCount}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Canvas (Centered Full Width, Clean Static Grid Background) */}
      <main className="relative z-10 pt-24 pb-12 px-6 lg:px-10 flex-1 min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto">
          {activePage === 'analytics-dashboard' && (
            <DashboardPage
              games={games}
              selectedGameId={selectedGameId}
              onSelectGame={setSelectedGameId}
              onOpenReport={handleOpenReport}
              onNavigate={navigateTo}
            />
          )}

          {activePage === 'log-fps-session' && (
            <AnimatedContent
              key="page-log-fps"
              trigger="mount"
              distance={28}
              duration={0.55}
              ease="back.out(1.35)"
            >
              <LogSessionPage
                games={games}
                selectedGameId={selectedGameId}
                onLogSession={handleLogSession}
                draft={fpsDraft}
                onDraftChange={setFpsDraft}
              />
            </AnimatedContent>
          )}

          {activePage === 'submit-review' && (
            <AnimatedContent
              key="page-submit-review"
              trigger="mount"
              distance={28}
              duration={0.55}
              ease="back.out(1.35)"
            >
              <SubmitReviewPage
                games={games}
                selectedGameId={selectedGameId}
                pendingCount={pendingCount}
                onSubmitReview={handleSubmitReview}
                draft={reviewDraft}
                onDraftChange={setReviewDraft}
              />
            </AnimatedContent>
          )}

          {activePage === 'admin-moderation' && (
            currentUser?.role === 'Admin' ? (
              <AnimatedContent
                key="page-admin-moderation"
                trigger="mount"
                distance={28}
                duration={0.55}
                ease="back.out(1.35)"
              >
                <AdminModerationPage
                  games={games}
                  onModerateReviews={handleModerateReviews}
                />
              </AnimatedContent>
            ) : (
              <div className="rounded-3xl border-2 border-[#2b1d14] bg-white p-8 text-center max-w-lg mx-auto shadow-lg mt-12 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 border border-[#2b1d14]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px]">gavel</span>
                </div>
                <h3
                  className="text-xl font-black text-[#2b1d14] uppercase mb-2"
                  style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                  Admin Moderation Locked
                </h3>
                <p className="text-xs text-[#6e5849] mb-5 leading-relaxed">
                  Per the <strong>OOAD Use Case Diagram</strong>, only users with the <strong>Admin</strong> role can review, approve, reject, or delete community reviews.
                </p>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#7c4a21] hover:bg-[#633a17] text-white font-bold text-xs uppercase tracking-wide border border-[#2b1d14] shadow-sm cursor-pointer inline-flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">switch_account</span>
                  <span>Login as Admin (admin_usman)</span>
                </button>
              </div>
            )
          )}

          {activePage === 'manage-games' && (
            currentUser?.role === 'Admin' ? (
              <AnimatedContent
                key="page-manage-games"
                trigger="mount"
                distance={28}
                duration={0.55}
                ease="back.out(1.35)"
              >
                <ManageGamesPage
                  games={games}
                  nextGameNumber={nextGameNumber}
                  onAddGame={handleAddGame}
                  onInspectGame={handleInspectGame}
                />
              </AnimatedContent>
            ) : (
              <div className="rounded-3xl border-2 border-[#2b1d14] bg-white p-8 text-center max-w-lg mx-auto shadow-lg mt-12 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 border border-[#2b1d14]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px]">sports_esports</span>
                </div>
                <h3
                  className="text-xl font-black text-[#2b1d14] uppercase mb-2"
                  style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                  Game Management Locked
                </h3>
                <p className="text-xs text-[#6e5849] mb-5 leading-relaxed">
                  Per the <strong>OOAD Use Case Diagram</strong>, only users with the <strong>Admin</strong> role can add or update game titles in the catalog.
                </p>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#7c4a21] hover:bg-[#633a17] text-white font-bold text-xs uppercase tracking-wide border border-[#2b1d14] shadow-sm cursor-pointer inline-flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">switch_account</span>
                  <span>Login as Admin (admin_usman)</span>
                </button>
              </div>
            )
          )}
        </div>
      </main>

      {/* Report Export Modal (REP-001) */}
      <ReportModal
        game={reportModalGame}
        reportNumber={reportCounter}
        onClose={handleCloseReport}
      />

      {/* Login & Role Switch Modal (Activity & Sequence Diagram) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Cel-Shaded Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
