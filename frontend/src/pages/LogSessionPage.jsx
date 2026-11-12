import React, { useState } from 'react';

const RESOLUTIONS = ['720p HD', '1080p FHD', '1440p QHD', '4K UHD'];

export default function LogSessionPage({
  games,
  selectedGameId,
  onLogSession,
}) {
  const [gameId, setGameId] = useState(
    selectedGameId || games[0]?.gameId || 'GM-501'
  );
  const [player, setPlayer] = useState('NexusRider_42');
  const [hardware, setHardware] = useState('RTX 4080 • Core i7-14700K');
  const [resolution, setResolution] = useState('1440p QHD');
  const [fps, setFps] = useState(142);
  const [cpu, setCpu] = useState(54);
  const [gpu, setGpu] = useState(89);
  const [crashed, setCrashed] = useState(false);

  const fpsRatio = Math.min(fps / 144, 1.0);
  const fpsPoints = Number((fpsRatio * 70).toFixed(1));
  const crashPoints = crashed ? 0 : 30;
  const totalScore = Number((fpsPoints + crashPoints).toFixed(1));

  const tierInfo =
    totalScore >= 85
      ? {
          badgeClass:
            'bg-amber-100/90 text-amber-900 border-amber-700/20',
          text: 'TIER S • SMOOTH',
        }
      : totalScore >= 65
      ? {
          badgeClass:
            'bg-emerald-100/90 text-emerald-900 border-emerald-700/20',
          text: 'TIER A • STABLE',
        }
      : {
          badgeClass: 'bg-rose-100/90 text-rose-900 border-rose-700/20',
          text: 'TIER D • UNSTABLE',
        };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!player.trim()) return;
    onLogSession({
      gameId,
      player: player.trim(),
      hardware: hardware.trim() || `${player.trim()} Rig`,
      resolution,
      averageFps: Number(fps),
      cpuUsagePercent: Number(cpu),
      gpuUsagePercent: Number(gpu),
      crashed,
    });
  };

  return (
    <div className="flex flex-col w-full gap-7 pb-12 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col gap-1.5">
        <span className="w-fit px-2.5 py-0.5 rounded-full bg-primary-fixed/80 text-on-primary-fixed-variant border border-primary/20 font-label-sm text-label-sm uppercase font-semibold">
          Telemetry Ingest
        </span>
        <h1 className="font-headline-lg text-headline-lg text-[#2b1d14] tracking-tight">
          Log FPS Session
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form Card (8 Cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] p-6 flex flex-col gap-6"
        >
          {/* Game & Player */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Target Game
              </label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md font-semibold text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
              >
                {games.map((g) => (
                  <option key={g.gameId} value={g.gameId}>
                    {g.title} ({g.gameId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Gamer Username
              </label>
              <input
                type="text"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md font-semibold text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Hardware Input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md uppercase text-on-surface-variant">
              Hardware Rig (GPU • CPU)
            </label>
            <input
              type="text"
              value={hardware}
              onChange={(e) => setHardware(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Resolution Buttons */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md uppercase text-on-surface-variant">
              Display Resolution
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {RESOLUTIONS.map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`py-2.5 px-3 rounded-xl border font-label-md text-label-md uppercase font-semibold transition-all cursor-pointer ${
                    resolution === res
                      ? 'bg-[#7c4a21] text-white border-[#7c4a21] shadow-xs'
                      : 'bg-surface-container-low/80 text-on-surface border-[#2b1d14]/12 hover:bg-surface-container'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-5 pt-4 border-t border-[#2b1d14]/10">
            {/* Average FPS */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md uppercase text-on-surface-variant">
                  Average Frame Rate
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-primary-fixed/80 border border-primary/20 font-headline-sm text-headline-sm text-[#2b1d14]">
                  {fps} FPS
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="240"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full accent-[#7c4a21] cursor-pointer"
              />
            </div>

            {/* CPU & GPU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md uppercase text-on-surface-variant">
                    CPU Load
                  </span>
                  <span className="font-label-lg text-label-lg font-bold text-[#2b1d14]">
                    {cpu}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={cpu}
                  onChange={(e) => setCpu(Number(e.target.value))}
                  className="w-full accent-[#c88a52] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md uppercase text-on-surface-variant">
                    GPU Load
                  </span>
                  <span className="font-label-lg text-label-lg font-bold text-[#2b1d14]">
                    {gpu}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={gpu}
                  onChange={(e) => setGpu(Number(e.target.value))}
                  className="w-full accent-[#d99b26] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Crash Toggle & Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#2b1d14]/10">
            <button
              type="button"
              onClick={() => setCrashed((prev) => !prev)}
              className={`px-4 py-2 rounded-xl border font-label-md text-label-md uppercase font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                crashed
                  ? 'bg-rose-100 text-rose-900 border-rose-700/20'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-700/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {crashed ? 'warning' : 'verified'}
              </span>
              <span>
                {crashed ? 'Session Crashed (-30 pts)' : 'Zero Crashes (+30 pts)'}
              </span>
            </button>

            <button
              type="submit"
              className="group px-6 py-2.5 rounded-xl bg-[#7c4a21] text-white border border-[#7c4a21] shadow-xs font-headline-sm text-headline-sm hover:bg-[#663b19] transition-all cursor-pointer"
            >
              <span className="nav-flip-wrapper">
                <span className="nav-flip-inner">
                  <span className="nav-flip-front">Save FPS Session</span>
                  <span className="nav-flip-back text-[#f7deb0]">
                    Save FPS Session
                  </span>
                </span>
              </span>
            </button>
          </div>
        </form>

        {/* Right: Live Score Preview Card (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] overflow-hidden">
          <div className="bg-surface-container-low border-b border-[#2b1d14]/10 px-5 py-3.5 flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-[#2b1d14]">
              Live Score Preview
            </span>
            <span className="material-symbols-outlined text-primary">
              bolt
            </span>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="p-5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/10 text-center">
              <div className="font-display-hero text-display-hero text-[#2b1d14]">
                {totalScore}
              </div>
              <div className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold">
                Stability Score / 100
              </div>
              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full border font-label-sm text-label-sm font-semibold ${tierInfo.badgeClass}`}
                >
                  {tierInfo.text}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 font-label-md text-label-md">
              <div className="flex justify-between py-1.5 border-b border-[#2b1d14]/10">
                <span className="text-on-surface-variant">FPS Score (70%)</span>
                <span className="font-bold text-[#2b1d14]">+{fpsPoints} pts</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2b1d14]/10">
                <span className="text-on-surface-variant">Crash Bonus (30%)</span>
                <span className="font-bold text-[#2b1d14]">
                  +{crashPoints} pts
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-on-surface-variant">Resolution</span>
                <span className="font-bold text-[#2b1d14]">{resolution}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
