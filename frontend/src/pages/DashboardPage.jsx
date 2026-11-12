import React, { useState } from 'react';
import AnimatedContent from '../components/AnimatedContent';
import { Sticker } from '../stickers/Sticker';
import { brand } from '../stickers/fun';
import { trophy, streak, battery, notes, chat } from '../stickers/icons';

// Warm coffee palette for the animated isometric stickers (minimal: KPI cards only)
const COFFEE = brand('#c88a52', '#7c4a21');
const STICKER_STYLE = { width: 52, height: 52, flexShrink: 0, margin: '-6px -4px' };
import {
  calculateAverageCpu,
  calculateAverageFps,
  calculateAverageGpu,
  calculateAverageRating,
  calculateOnePercentLow,
  calculateStabilityScore,
  getApprovedReviews,
  getCrashCount,
} from '../data/initialData';

export default function DashboardPage({
  games,
  selectedGameId,
  onSelectGame,
  onOpenReport,
  onNavigate,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const game = games.find((g) => g.gameId === selectedGameId) || games[0];
  if (!game) return null;

  const avgRating = calculateAverageRating(game);
  const approvedReviews = getApprovedReviews(game);
  const avgFps = calculateAverageFps(game);
  const avgCpu = calculateAverageCpu(game);
  const avgGpu = calculateAverageGpu(game);
  const onePercentLow = calculateOnePercentLow(game);
  const stabilityScore = calculateStabilityScore(game);
  const crashCount = getCrashCount(game);

  const extraSessionBars = (game.sessions || []).slice(3).map((s, idx) => ({
    run: `#${13 + idx}*`,
    fps: Math.round(s.averageFps),
    note: `${s.player}: ${s.averageFps} FPS (${s.resolution})`,
    current: true,
  }));

  const chartBars = [...(game.chartHistory || []), ...extraSessionBars].slice(
    -10
  );

  const tierLetter =
    stabilityScore >= 80
      ? 'S'
      : stabilityScore >= 65
      ? 'A'
      : stabilityScore >= 50
      ? 'B'
      : 'D';

  const newestSessions = [...(game.sessions || [])].reverse();

  return (
    <div className="flex flex-col w-full gap-7 pb-12">
      {/* TOP BAR / CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/80 text-on-primary-fixed-variant border border-primary/20 font-label-sm text-label-sm uppercase">
              {game.genre} • {game.gameId}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {game.engineStack}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-[#2b1d14] tracking-tight">
            {game.title} — Telemetry
          </h1>
        </div>

        {/* GAME SELECTOR + EXPORT REPORT */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-xl border border-[#2b1d14]/15 shadow-xs font-label-lg text-label-lg text-[#2b1d14] hover:bg-white transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                sports_esports
              </span>
              <span>
                {game.title} ({game.gameId})
              </span>
              <span
                className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl border border-[#2b1d14]/15 shadow-xl z-40 overflow-hidden">
                <div className="px-3.5 py-2 bg-surface-container-low border-b border-[#2b1d14]/10 font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                  Select Target Game
                </div>
                {games.map((g) => (
                  <button
                    key={g.gameId}
                    type="button"
                    onClick={() => {
                      onSelectGame(g.gameId);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-[#2b1d14]/8 last:border-none hover:bg-primary-fixed/35 transition-colors cursor-pointer ${
                      g.gameId === game.gameId
                        ? 'bg-secondary-fixed/50 font-bold'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-[#2b1d14]">
                        {g.title}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {g.gameId} • {g.genre}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container border border-[#2b1d14]/12 font-label-sm text-label-sm font-bold text-[#2b1d14]">
                      {calculateAverageFps(g)} FPS
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenReport(game)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7c4a21] text-white rounded-xl border border-[#7c4a21] shadow-xs font-label-lg text-label-lg hover:bg-[#663b19] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              ios_share
            </span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 BENTO KPI CARDS (Sleek 1px Border + Subtle Card Elevation) */}
      <AnimatedContent
        key={`kpi-${game.gameId}`}
        trigger="mount"
        distance={28}
        duration={0.55}
        ease="back.out(1.35)"
        stagger={0.07}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* 1. AVERAGE RATING */}
        <div
          onClick={() => onNavigate('submit-review')}
          className="bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] hover:shadow-[0_8px_22px_-6px_rgba(43,29,20,0.14)] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-md bg-primary-fixed/70 text-on-primary-fixed-variant border border-primary/15">
                USER VERDICT
              </span>
              <Sticker icon={trophy} palette={COFFEE} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-[#2b1d14]">
                {avgRating.toFixed(1)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                / 5.0
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= Math.round(avgRating);
                return (
                  <span
                    key={star}
                    className={`material-symbols-outlined text-[20px] ${
                      filled ? 'text-[#d99b26]' : 'text-outline-variant'
                    }`}
                    style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
                  >
                    star
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2b1d14]/10 flex items-center justify-between font-label-md text-label-md">
            <span className="text-primary font-semibold">Approved Reviews</span>
            <span className="text-[#2b1d14] font-bold">
              {approvedReviews.length}
            </span>
          </div>
        </div>

        {/* 2. AVERAGE FPS */}
        <div
          onClick={() => onNavigate('log-fps-session')}
          className="bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] hover:shadow-[0_8px_22px_-6px_rgba(43,29,20,0.14)] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-700/15">
                RENDER PACE
              </span>
              <Sticker icon={streak} palette={COFFEE} offset={20} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-[#2b1d14]">
                {avgFps.toFixed(1)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                FPS
              </span>
            </div>
            <span
              className={`mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full border font-label-sm text-label-sm font-semibold ${
                avgFps >= 60
                  ? 'bg-emerald-100/80 text-emerald-900 border-emerald-700/20'
                  : 'bg-amber-100/80 text-amber-900 border-amber-700/20'
              }`}
            >
              {avgFps >= 60 ? '60+ FPS Target Met' : 'Below 60 FPS Target'}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2b1d14]/10 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">1% Low FPS</span>
            <span className="text-[#2b1d14] font-bold">{onePercentLow} FPS</span>
          </div>
        </div>

        {/* 3. STABILITY SCORE */}
        <div className="bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] hover:shadow-[0_8px_22px_-6px_rgba(43,29,20,0.14)] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-700/15">
                STABILITY SCORE
              </span>
              <Sticker icon={battery} palette={COFFEE} offset={40} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-display-hero text-display-hero text-[#2b1d14]">
                  {stabilityScore.toFixed(1)}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                  /100
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary border border-primary/20 flex items-center justify-center font-headline-md text-headline-md">
                {tierLetter}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2b1d14]/10 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">Avg HW Load</span>
            <span className="text-[#2b1d14] font-bold">
              CPU {avgCpu}% • GPU {avgGpu}%
            </span>
          </div>
        </div>

        {/* 4. LOGGED RUNS & CRASHES */}
        <div
          onClick={() => onNavigate('log-fps-session')}
          className="bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] hover:shadow-[0_8px_22px_-6px_rgba(43,29,20,0.14)] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-900 border border-orange-700/15">
                LOGGED RUNS
              </span>
              <Sticker icon={notes} palette={COFFEE} offset={60} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-[#2b1d14]">
                {game.sessions.length}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                Runs
              </span>
            </div>
            <span
              className={`mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full border font-label-sm text-label-sm font-semibold ${
                crashCount === 0
                  ? 'bg-emerald-100/80 text-emerald-900 border-emerald-700/20'
                  : 'bg-rose-100/90 text-rose-900 border-rose-700/20'
              }`}
            >
              {crashCount === 0 ? '0 Crashes Detected' : `${crashCount} Crash(es)`}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2b1d14]/10 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">Action</span>
            <span className="text-primary font-bold">+ Log New Run →</span>
          </div>
        </div>
      </AnimatedContent>

      {/* MIDDLE ROW: FPS BAR CHART + APPROVED COMMUNITY REVIEWS */}
      <AnimatedContent
        key={`mid-${game.gameId}`}
        trigger="mount"
        distance={30}
        duration={0.6}
        delay={0.08}
        ease="power3.out"
        stagger={0.09}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* LEFT: FPS PER SESSION BAR CHART (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#2b1d14]/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <h2 className="font-headline-sm text-headline-sm text-[#2b1d14]">
                  FPS Per Session
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-700/15 font-label-sm text-label-sm font-semibold">
                60 FPS Target Line
              </span>
            </div>

            {/* Clean Analytics Bar Chart */}
            <div className="relative h-60 mt-5 pt-4 pb-6 px-4 bg-surface-container-low/75 rounded-xl border border-[#2b1d14]/10 flex items-end justify-between gap-3">
              {/* 60 FPS Dashed Reference Line */}
              <div className="absolute left-0 right-0 bottom-[60%] border-t border-dashed border-[#7c4a21]/35 z-0 pointer-events-none"></div>

              {chartBars.map((bar, index) => {
                const heightPct = Math.min(
                  Math.max(Math.round((bar.fps / 110) * 100), 20),
                  100
                );
                const barColorClass = bar.peak
                  ? 'bg-[#c88a52] border-[#7c4a21]/30'
                  : bar.current
                  ? 'bg-[#e8b252] border-[#8a5a10]/30'
                  : bar.fps >= 60
                  ? 'bg-[#52946b] border-[#2e6343]/30'
                  : 'bg-[#df7a5e] border-[#8c331e]/30';

                return (
                  <div
                    key={`${bar.run}-${index}`}
                    className="relative z-10 flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  >
                    <span className="font-label-sm text-label-sm font-bold text-[#2b1d14]">
                      {bar.fps}
                    </span>
                    <div
                      className={`w-full max-w-[34px] ${barColorClass} rounded-t-md border shadow-xs transition-transform duration-200 group-hover:scale-y-105 origin-bottom`}
                      style={{ height: `${heightPct}%` }}
                      title={bar.note}
                    ></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                      {bar.run}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2b1d14]/10 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">
              CPU Avg: <strong className="text-[#2b1d14]">{avgCpu}%</strong> • GPU
              Avg: <strong className="text-[#2b1d14]">{avgGpu}%</strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('log-fps-session')}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              + Record Pass →
            </button>
          </div>
        </div>

        {/* RIGHT: COMMUNITY REVIEWS (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2b1d14]/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                <h2 className="font-headline-sm text-headline-sm text-[#2b1d14]">
                  Community Reviews
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-700/20 font-label-sm text-label-sm font-semibold">
                {approvedReviews.length} Approved
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
              {approvedReviews.length === 0 ? (
                <div className="p-5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/10 text-center flex flex-col items-center">
                  <Sticker icon={chat} palette={COFFEE} style={{ width: 72, height: 72 }} />
                  <p className="font-label-lg text-label-lg text-[#2b1d14]">
                    No Approved Reviews Yet
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Approve pending reviews in Admin Moderation.
                  </p>
                </div>
              ) : (
                approvedReviews.map((rev) => (
                  <div
                    key={rev.reviewId}
                    className="p-3.5 rounded-xl bg-surface-container-low/75 border border-[#2b1d14]/10 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-[#2b1d14] font-bold">
                        @{rev.player}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-[16px] ${
                              s <= rev.rating
                                ? 'text-[#d99b26]'
                                : 'text-outline-variant'
                            }`}
                            style={{
                              fontVariationSettings: `'FILL' ${
                                s <= rev.rating ? 1 : 0
                              }`,
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#2b1d14]/90 leading-relaxed">
                      “{rev.comment}”
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2b1d14]/10 flex items-center justify-between font-label-md text-label-md">
            <button
              type="button"
              onClick={() => onNavigate('submit-review')}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              + Submit Review
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin-moderation')}
              className="text-on-surface-variant hover:text-[#2b1d14] font-bold cursor-pointer"
            >
              Moderation →
            </button>
          </div>
        </div>
      </AnimatedContent>

      {/* BOTTOM CARD: PERFORMANCE SESSIONS TABLE */}
      <AnimatedContent
        key={`table-${game.gameId}`}
        trigger="mount"
        distance={28}
        duration={0.55}
        delay={0.14}
        ease="power3.out"
      >
        <div className="bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#2b1d14]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
              <h2 className="font-headline-sm text-headline-sm text-[#2b1d14]">
                Recent Performance Sessions
              </h2>
            </div>
            <span className="font-label-sm text-label-sm uppercase bg-surface-container-low px-3 py-1 rounded-full border border-[#2b1d14]/12 font-semibold text-on-surface-variant">
              {newestSessions.length} Runs Logged
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2b1d14]/12 bg-surface-container-low/80 font-label-md text-label-md uppercase text-on-surface-variant">
                  <th className="py-3 px-4 rounded-tl-lg">Session / Rig</th>
                  <th className="py-3 px-4">Resolution</th>
                  <th className="py-3 px-4">Avg FPS</th>
                  <th className="py-3 px-4">CPU Load</th>
                  <th className="py-3 px-4">GPU Load</th>
                  <th className="py-3 px-4 text-center rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b1d14]/10 font-body-md text-body-md">
                {newestSessions.map((session) => (
                  <tr
                    key={session.logId}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2b1d14]">
                        {session.hardware || `${session.player} Rig`}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        {session.logId} • @{session.player}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/75 text-on-primary-fixed-variant border border-primary/15 font-label-sm text-label-sm font-semibold">
                        {session.resolution}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-headline-sm text-headline-sm text-[#2b1d14]">
                      {Number(session.averageFps).toFixed(1)} FPS
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-variant rounded-full h-2 border border-[#2b1d14]/10 overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: `${session.cpuUsagePercent}%` }}
                          ></div>
                        </div>
                        <span className="font-label-sm text-label-sm font-semibold text-[#2b1d14]">
                          {session.cpuUsagePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-variant rounded-full h-2 border border-[#2b1d14]/10 overflow-hidden">
                          <div
                            className="bg-secondary-container h-full rounded-full"
                            style={{ width: `${session.gpuUsagePercent}%` }}
                          ></div>
                        </div>
                        <span className="font-label-sm text-label-sm font-semibold text-[#2b1d14]">
                          {session.gpuUsagePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {session.crashed ? (
                        <span className="inline-flex px-3 py-0.5 bg-rose-100 text-rose-900 rounded-full border border-rose-700/20 font-label-sm text-label-sm font-semibold">
                          CRASHED
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-0.5 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-700/20 font-label-sm text-label-sm font-semibold">
                          STABLE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
