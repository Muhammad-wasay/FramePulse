import React, { useState } from 'react';
import {
  calculateAverageCpu,
  calculateAverageFps,
  calculateAverageGpu,
  calculateAverageRating,
  calculateStabilityScore,
  getApprovedReviews,
  getCrashCount,
} from '../data/initialData';

export default function ReportModal({ game, reportNumber = 1, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const reportId = `REP-${String(reportNumber).padStart(3, '0')}`;
  const avgRating = calculateAverageRating(game);
  const avgFps = calculateAverageFps(game);
  const avgCpu = calculateAverageCpu(game);
  const avgGpu = calculateAverageGpu(game);
  const stability = calculateStabilityScore(game);
  const crashes = getCrashCount(game);
  const approvedCount = getApprovedReviews(game).length;
  const generatedDate = new Date().toISOString().split('T')[0];

  const summaryText = `Solid performance with ${avgRating.toFixed(
    1
  )}/5 user rating and ${avgFps.toFixed(1)} avg FPS (${crashes} crashes across ${
    game.sessions.length
  } logged sessions).`;

  const rawReportText = [
    `=== GAME ANALYTICS REPORT (${reportId}) ===`,
    `Game           : ${game.title} (${game.gameId}) - ${game.genre} [Released: ${game.releaseDate}]`,
    `Generated Date : ${generatedDate}`,
    `Average Rating : ${avgRating.toFixed(1)} / 5.0 (${approvedCount} Approved Reviews)`,
    `Average FPS    : ${avgFps.toFixed(1)} FPS (CPU ${avgCpu}% | GPU ${avgGpu}%)`,
    `Overall Score  : ${stability.toFixed(1)} / 100`,
    `Summary        : ${summaryText}`,
  ].join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rawReportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}_${game.gameId}_Telemetry_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2b1d14]/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/15 shadow-2xl overflow-hidden animate-spring-pop">
        {/* Top Clean Header */}
        <div className="bg-surface-container-low border-b border-[#2b1d14]/12 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">
                description
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#2b1d14] leading-none">
                Generated Game Report ({reportId})
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                AnalyticsEngine.generateGameReport()
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/80 border border-[#2b1d14]/12 flex items-center justify-center hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#2b1d14]/10">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                Target Game
              </span>
              <span className="font-headline-sm text-[16px] text-[#2b1d14] font-bold">
                {game.title}
              </span>
              <span className="font-label-sm text-label-sm text-primary block">
                {game.gameId}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#2b1d14]/10">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                Avg FPS &amp; Load
              </span>
              <span className="font-headline-sm text-[16px] text-emerald-700 font-bold">
                {avgFps.toFixed(1)} FPS
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                CPU {avgCpu}% • GPU {avgGpu}%
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#2b1d14]/10">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                Overall Score
              </span>
              <span className="font-headline-sm text-[16px] text-[#2b1d14] font-bold">
                {stability.toFixed(1)} / 100
              </span>
              <span className="font-label-sm text-label-sm text-primary block">
                Rating: {avgRating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-[#241912] text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto border border-[#2b1d14]/20">
            {rawReportText}
          </pre>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-surface-container-low border border-[#2b1d14]/15 font-label-md text-label-md font-semibold text-[#2b1d14] hover:bg-surface-container transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy Report'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-[#7c4a21] text-white border border-[#7c4a21] font-label-md text-label-md font-semibold hover:bg-[#663b19] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                download
              </span>
              <span>Download .TXT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
