import React, { useState } from 'react';
import {
  calculateAverageFps,
  calculateAverageRating,
  calculateStabilityScore,
  getApprovedReviews,
} from '../data/initialData';

export default function ManageGamesPage({
  games,
  nextGameNumber,
  onAddGame,
  onInspectGame,
}) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('RPG');
  const [engineStack, setEngineStack] = useState('2024 • Unreal Engine 5.4');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((g) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.gameId.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddGame({
      title: title.trim(),
      genre,
      engineStack: engineStack.trim() || '2024 • Custom Engine',
    });
    setTitle('');
  };

  return (
    <div className="flex flex-col w-full gap-7 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <span className="w-fit px-2.5 py-0.5 rounded-full bg-primary-fixed/80 text-on-primary-fixed-variant border border-primary/20 font-label-sm text-label-sm uppercase font-semibold">
          Catalog Repository • {games.length} Active Titles
        </span>
        <h1 className="font-headline-lg text-headline-lg text-[#2b1d14] tracking-tight">
          Manage Games
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Add New Game Card (4 Cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] overflow-hidden"
        >
          <div className="bg-surface-container-low border-b border-[#2b1d14]/10 px-5 py-3.5 flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-[#2b1d14]">
              Add New Game
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-primary-fixed text-primary border border-primary/20 font-label-sm text-label-sm font-bold">
              GM-{nextGameNumber}
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Game Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Armored Core VII"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md font-semibold text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md font-semibold text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
              >
                <option value="RPG">RPG</option>
                <option value="Racing">Racing</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Action">Action</option>
                <option value="FPS">FPS</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Engine Stack
              </label>
              <input
                type="text"
                value={engineStack}
                onChange={(e) => setEngineStack(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#7c4a21] text-white border border-[#7c4a21] shadow-xs font-headline-sm text-headline-sm hover:bg-[#663b19] transition-all cursor-pointer mt-1"
            >
              + Add Game
            </button>
          </div>
        </form>

        {/* Right: Game Catalog Table (8 Cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#2b1d14]/10">
            <h2 className="font-headline-sm text-headline-sm text-[#2b1d14]">
              Indexed Game Catalog
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title or genre..."
              className="px-3.5 py-1.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-sm text-body-sm text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2b1d14]/12 bg-surface-container-low/80 font-label-md text-label-md uppercase text-on-surface-variant">
                  <th className="py-3 px-4 rounded-tl-lg">Game</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Avg FPS</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Stability</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b1d14]/10 font-body-md text-body-md">
                {filteredGames.map((g) => {
                  const fps = calculateAverageFps(g);
                  const rating = calculateAverageRating(g);
                  const stability = calculateStabilityScore(g);
                  const revCount = getApprovedReviews(g).length;

                  return (
                    <tr
                      key={g.gameId}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#2b1d14]">{g.title}</div>
                        <div className="font-label-sm text-label-sm text-primary font-semibold">
                          {g.gameId}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/75 text-on-primary-fixed-variant border border-primary/15 font-label-sm text-label-sm font-semibold">
                          {g.genre}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-headline-sm text-headline-sm text-[#2b1d14]">
                        {fps.toFixed(1)} FPS
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2b1d14]">
                        <span className="text-[#d99b26]">★</span>{' '}
                        {rating.toFixed(1)}{' '}
                        <span className="text-xs text-on-surface-variant">
                          ({revCount})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-700/20 font-label-sm text-label-sm font-semibold">
                          {stability.toFixed(1)} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onInspectGame(g.gameId)}
                          className="group px-3 py-1 rounded-lg bg-primary-fixed/80 text-on-primary-fixed-variant border border-primary/20 font-label-sm text-label-sm uppercase font-semibold hover:bg-primary-container hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="nav-flip-wrapper">
                            <span className="nav-flip-inner">
                              <span className="nav-flip-front">Inspect →</span>
                              <span className="nav-flip-back">Inspect →</span>
                            </span>
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
