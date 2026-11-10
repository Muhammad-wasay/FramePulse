import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import ReportModal from './components/ReportModal';
import Toast from './components/Toast';
import AnimatedContent from './components/AnimatedContent';
import DashboardPage from './pages/DashboardPage';
import LogSessionPage from './pages/LogSessionPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import AdminModerationPage from './pages/AdminModerationPage';
import ManageGamesPage from './pages/ManageGamesPage';
import { AVATARS, GAME_COVERS, INITIAL_GAMES } from './data/initialData';
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
      cpuUsagePercent: Number(s.cpuUsagePercent ?? s.cpuUsage ?? 50),
      gpuUsagePercent: Number(s.gpuUsagePercent ?? s.gpuUsage ?? 80),
      crashed: Boolean(s.crashed),
      timestamp: s.timestamp ?? '2026-10-10 09:15',
    }));

    const rawReviews = g.reviews ?? [];
    const reviews = rawReviews.map((r, idx) => ({
      reviewId: r.reviewId ?? `REV-${901 + idx}`,
      player:
        typeof r.player === 'object' && r.player !== null
          ? r.player.username || r.player.name || 'shadow_ninja'
          : r.player ?? 'shadow_ninja',
      roleBadge: r.roleBadge ?? 'Verified Gamer',
      avatar: r.avatar || avatarKeys[idx % avatarKeys.length],
      hardwareSpec: r.hardwareSpec ?? '1440p Telemetry Verified',
      tags: r.tags ?? [g.genre || 'PC', 'Verified Log'],
      rating: Number(r.rating ?? 5),
      comment: r.comment ?? '',
      submissionDate: r.submissionDate ?? '2026-10-10',
      status: r.status ?? 'PENDING',
    }));

    const chartHistory =
      Array.isArray(g.chartHistory) && g.chartHistory.length > 0
        ? g.chartHistory
        : sessions.map((s, idx) => ({
            run: `#${String(idx + 1).padStart(2, '0')}${
              idx === sessions.length - 1 ? '*' : ''
            }`,
            fps: Math.round(s.averageFps),
            note: `${s.resolution} • ${s.averageFps} FPS`,
            current: idx === sessions.length - 1,
          }));

    return {
      ...g,
      gameId: g.gameId ?? `GM-${501 + i}`,
      title: g.title ?? 'Untitled Game',
      genre: g.genre ?? 'Action',
      releaseDate: g.releaseDate ?? '2023-11-15',
      engineStack: g.engineStack || `${g.releaseDate || '2024'} • OOAD Telemetry Engine`,
      patchVersion: g.patchVersion || 'Patch v1.0',
      coverUrl: g.coverUrl || coverKeys[i % coverKeys.length],
      chartHistory,
      sessions,
      reviews,
    };
  });
}

export default function App() {
  const [activePage, setActivePage] = useState('analytics-dashboard');
  const [games, setGames] = useState(INITIAL_GAMES);
  const [selectedGameId, setSelectedGameId] = useState('GM-501');
  const [backendOnline, setBackendOnline] = useState(false);
  const [reportModalGame, setReportModalGame] = useState(null);
  const [reportCounter, setReportCounter] = useState(1);
  const [toast, setToast] = useState(null);

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
        'Synced with local React state store (Java API standby on :8080)',
        'success',
        'sync'
      );
    }
  };

  const handleLogSession = async (sessionPayload) => {
    await apiLogSession(sessionPayload);

    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.gameId !== sessionPayload.gameId) return game;

        const maxLogNum = prevGames
          .flatMap((g) => g.sessions || [])
          .reduce((max, s) => {
            const n = parseInt(String(s.logId).replace(/\D/g, ''), 10);
            return Number.isNaN(n) ? max : Math.max(max, n);
          }, 300);
        const nextLogNum = maxLogNum + 1;
        const nextRunNum = `#${String((game.sessions?.length || 0) + 1).padStart(
          2,
          '0'
        )}`;
        const onePercentLow = Number(
          (sessionPayload.averageFps * 0.78).toFixed(1)
        );

        const newSession = {
          logId: `LOG-${nextLogNum}`,
          runNumber: nextRunNum,
          player: sessionPayload.player,
          hardware: sessionPayload.hardware,
          resolution: sessionPayload.resolution,
          averageFps: sessionPayload.averageFps,
          onePercentLow,
          cpuUsagePercent: sessionPayload.cpuUsagePercent,
          gpuUsagePercent: sessionPayload.gpuUsagePercent,
          crashed: sessionPayload.crashed,
          timestamp: 'Just now • Live Ingest Session',
        };

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
    await apiSubmitReview(reviewPayload);

    setGames((prevGames) => {
      const maxReviewNum = prevGames
        .flatMap((g) => g.reviews || [])
        .reduce((max, r) => {
          const n = parseInt(String(r.reviewId).replace(/\D/g, ''), 10);
          return Number.isNaN(n) ? max : Math.max(max, n);
        }, 900);
      const newReviewId = `REV-${maxReviewNum + 1}`;

      return prevGames.map((game) => {
        if (game.gameId !== reviewPayload.gameId) return game;

        const newReview = {
          reviewId: newReviewId,
          player: reviewPayload.player,
          roleBadge: 'Verified Rig',
          avatar: AVATARS.vortex,
          rating: reviewPayload.rating,
          comment: reviewPayload.comment,
          status: 'PENDING',
          timestamp: 'Just now',
          hardwareSpec: reviewPayload.hardwareSpec,
        };

        return {
          ...game,
          reviews: [newReview, ...(game.reviews || [])],
        };
      });
    });

    setSelectedGameId(reviewPayload.gameId);
    showToast(
      'Review Queued!',
      `Submitted by ${reviewPayload.player} with status PENDING for Admin Moderation.`,
      'warning',
      'rate_review'
    );
  };

  const handleModerateReviews = async (reviewIds, action) => {
    for (const id of reviewIds) {
      await apiModerateReview(id, action);
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
          player: 'TelemetryBot_01',
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
    setActivePage('analytics-dashboard');
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
      {/* Top Horizontal Gaming HUD Navbar (with 180° Flip Text) */}
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        backendOnline={backendOnline}
        onRefresh={handleRefresh}
        pendingCount={pendingCount}
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
              onNavigate={setActivePage}
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
              />
            </AnimatedContent>
          )}

          {activePage === 'admin-moderation' && (
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
          )}

          {activePage === 'manage-games' && (
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
          )}
        </div>
      </main>

      {/* Report Export Modal (REP-001) */}
      <ReportModal
        game={reportModalGame}
        reportNumber={reportCounter}
        onClose={handleCloseReport}
      />

      {/* Cel-Shaded Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
