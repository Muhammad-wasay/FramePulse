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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase">
              {game.genre} • {game.gameId}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {game.engineStack}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-[#18181b] tracking-tight uppercase">
            {game.title} — Telemetry
          </h1>
        </div>

        {/* GAME SELECTOR + EXPORT REPORT (Crisp Outline, No Thick Shadow) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] font-label-lg text-label-lg text-[#18181b] hover:bg-primary-fixed/40 transition-all cursor-pointer"
            >
              <span className="text-lg">🎮</span>
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
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] z-40 overflow-hidden">
                <div className="px-3.5 py-2 bg-surface-container-low border-b-[2px] border-[#18181b] font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
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
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-[#18181b]/15 last:border-none hover:bg-primary-fixed/40 transition-colors cursor-pointer ${
                      g.gameId === game.gameId
                        ? 'bg-secondary-fixed/60 font-bold'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-[#18181b]">
                        {g.title}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {g.gameId} • {g.genre}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container border border-[#18181b] font-label-sm text-label-sm font-bold">
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
            className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl border-[2px] border-[#18181b] font-label-lg text-label-lg uppercase tracking-wider hover:bg-amber-300 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              ios_share
            </span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 TOON BENTO KPI CARDS (Crisp 2px Outline, Zero Heavy Offset Shadow) */}
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
          className="bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant border-[1.5px] border-[#18181b]">
                USER VERDICT
              </span>
              <Sticker icon={trophy} palette={COFFEE} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-[#18181b]">
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
                      filled ? 'text-secondary-container' : 'text-outline-variant'
                    }`}
                    style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
                  >
                    star
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t-[1.5px] border-[#18181b]/15 flex items-center justify-between font-label-md text-label-md">
            <span className="text-primary font-bold">Approved Reviews</span>
            <span className="text-[#18181b] font-bold">
              {approvedReviews.length}
            </span>
          </div>
        </div>

        {/* 2. AVERAGE FPS */}
        <div
          onClick={() => onNavigate('log-fps-session')}
          className="bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-[#4ade80]/35 text-[#0f5132] border-[1.5px] border-[#18181b]">
                RENDER PACE
              </span>
              <Sticker icon={streak} palette={COFFEE} offset={20} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-[#18181b]">
                {avgFps.toFixed(1)}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                FPS
              </span>
            </div>
            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#4ade80] text-[#18181b] border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
              {avgFps >= 60 ? '60+ FPS Target Met' : 'Below 60 FPS Target'}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t-[1.5px] border-[#18181b]/15 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">1% Low FPS</span>
            <span className="text-[#18181b] font-bold">{onePercentLow} FPS</span>
          </div>
        </div>

        {/* 3. STABILITY SCORE */}
        <div className="bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant border-[1.5px] border-[#18181b]">
                STABILITY SCORE
              </span>
              <Sticker icon={battery} palette={COFFEE} offset={40} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-display-hero text-display-hero text-[#18181b]">
                  {stabilityScore.toFixed(1)}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                  /100
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-container border-[2px] border-[#18181b] flex items-center justify-center font-headline-md text-headline-md text-on-primary-container">
                {tierLetter}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t-[1.5px] border-[#18181b]/15 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">Avg HW Load</span>
            <span className="text-[#18181b] font-bold">
              CPU {avgCpu}% • GPU {avgGpu}%
            </span>
          </div>
        </div>

        {/* 4. LOGGED RUNS & CRASHES */}
        <div
          onClick={() => onNavigate('log-fps-session')}
          className="bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant border-[1.5px] border-[#18181b]">
                LOGGED RUNS
              </span>
              <Sticker icon={notes} palette={COFFEE} offset={60} style={STICKER_STYLE} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display-hero text-display-hero text-[#18181b]">
                {game.sessions.length}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                Runs
              </span>
            </div>
            <span
              className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold ${
                crashCount === 0
                  ? 'bg-[#4ade80] text-[#18181b]'
                  : 'bg-tertiary-container text-[#18181b]'
              }`}
            >
              {crashCount === 0 ? '0 Crashes! 🚀' : `${crashCount} Crash(es) ⚠️`}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t-[1.5px] border-[#18181b]/15 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">Action</span>
            <span className="text-primary font-bold">+ Log New Run →</span>
          </div>
        </div>
      </AnimatedContent>

      {/* MIDDLE ROW: TOON FPS BAR CHART + APPROVED COMMUNITY REVIEWS */}
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
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-[2px] border-[#18181b]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-primary-container border-[1.5px] border-[#18181b]"></span>
                <h2 className="font-headline-sm text-headline-sm uppercase text-[#18181b]">
                  FPS Per Session
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-secondary-container text-on-secondary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                ⚡ 60 FPS Target Line
              </span>
            </div>

            {/* Toon Bar Chart */}
            <div className="relative h-60 mt-5 pt-4 pb-6 px-3 bg-surface-container-low rounded-xl border-[2px] border-[#18181b] flex items-end justify-between gap-3">
              {/* 60 FPS Dashed Reference Line */}
              <div className="absolute left-0 right-0 bottom-[60%] border-t-[2px] border-dashed border-[#18181b]/40 z-0 pointer-events-none"></div>

              {chartBars.map((bar, index) => {
                const heightPct = Math.min(
                  Math.max(Math.round((bar.fps / 110) * 100), 20),
                  100
                );
                const barColorClass = bar.peak
                  ? 'bg-primary-container'
                  : bar.current
                  ? 'bg-secondary-container'
                  : bar.fps >= 60
                  ? 'bg-[#4ade80]'
                  : 'bg-tertiary-container';

                return (
                  <div
                    key={`${bar.run}-${index}`}
                    className="relative z-10 flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  >
                    <span className="font-label-sm text-label-sm font-bold text-[#18181b]">
                      {bar.fps}
                    </span>
                    <div
                      className={`w-full max-w-[34px] ${barColorClass} rounded-t-lg border-[2px] border-[#18181b] transition-transform duration-200 group-hover:scale-y-105 origin-bottom`}
                      style={{ height: `${heightPct}%` }}
                      title={bar.note}
                    ></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                      {bar.run}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-[2px] border-[#18181b]/15 flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">
              CPU Avg: <strong className="text-[#18181b]">{avgCpu}%</strong> • GPU
              Avg: <strong className="text-[#18181b]">{avgGpu}%</strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('log-fps-session')}
              className="text-primary font-bold uppercase hover:underline cursor-pointer"
            >
              + Record Pass →
            </button>
          </div>
        </div>

        {/* RIGHT: COMMUNITY REVIEWS (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-[2px] border-[#18181b]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-secondary-container border-[1.5px] border-[#18181b]"></span>
                <h2 className="font-headline-sm text-headline-sm uppercase text-[#18181b]">
                  Community Reviews
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#4ade80] text-[#18181b] border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                {approvedReviews.length} Approved
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
              {approvedReviews.length === 0 ? (
                <div className="p-5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] text-center flex flex-col items-center">
                  <Sticker icon={chat} palette={COFFEE} style={{ width: 72, height: 72 }} />
                  <p className="font-label-lg text-label-lg text-[#18181b]">
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
                    className="p-3.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-[#18181b] font-bold">
                        @{rev.player}
                      </span>
                      <div className="flex items-center text-secondary-container">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-[16px] ${
                              s <= rev.rating
                                ? 'text-secondary-container'
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
                    <p className="font-body-sm text-body-sm text-[#18181b]">
                      “{rev.comment}”
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-[2px] border-[#18181b]/15 flex items-center justify-between font-label-md text-label-md">
            <button
              type="button"
              onClick={() => onNavigate('submit-review')}
              className="text-primary font-bold uppercase hover:underline cursor-pointer"
            >
              + Submit Review
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin-moderation')}
              className="text-on-surface-variant hover:text-[#18181b] font-bold uppercase cursor-pointer"
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
        <div className="bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-6">
          <div className="flex items-center justify-between pb-3 border-b-[2px] border-[#18181b]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-tertiary-container border-[1.5px] border-[#18181b]"></span>
              <h2 className="font-headline-sm text-headline-sm uppercase text-[#18181b]">
                Recent Performance Sessions
              </h2>
            </div>
            <span className="font-label-sm text-label-sm uppercase bg-surface-container-low px-3 py-1 rounded-full border-[1.5px] border-[#18181b] font-bold">
              {newestSessions.length} Runs Logged
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[2px] border-[#18181b] bg-surface-container-low font-label-md text-label-md uppercase text-on-surface-variant">
                  <th className="py-3 px-4">Session / Rig</th>
                  <th className="py-3 px-4">Resolution</th>
                  <th className="py-3 px-4">Avg FPS</th>
                  <th className="py-3 px-4">CPU Load</th>
                  <th className="py-3 px-4">GPU Load</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-[#18181b]/15 font-body-md text-body-md">
                {newestSessions.map((session) => (
                  <tr
                    key={session.logId}
                    className="hover:bg-secondary-fixed/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#18181b]">
                        {session.hardware || `${session.player} Rig`}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        {session.logId} • @{session.player}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                        {session.resolution}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-headline-sm text-headline-sm text-[#18181b]">
                      {Number(session.averageFps).toFixed(1)} FPS
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-variant rounded-full h-2.5 border-[1.5px] border-[#18181b] overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: `${session.cpuUsagePercent}%` }}
                          ></div>
                        </div>
                        <span className="font-label-sm text-label-sm font-bold">
                          {session.cpuUsagePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-variant rounded-full h-2.5 border-[1.5px] border-[#18181b] overflow-hidden">
                          <div
                            className="bg-secondary-container h-full rounded-full"
                            style={{ width: `${session.gpuUsagePercent}%` }}
                          ></div>
                        </div>
                        <span className="font-label-sm text-label-sm font-bold">
                          {session.gpuUsagePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {session.crashed ? (
                        <span className="inline-flex px-3 py-0.5 bg-tertiary-container text-[#18181b] rounded-full border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                          CRASHED
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-0.5 bg-[#4ade80] text-[#18181b] rounded-full border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
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
