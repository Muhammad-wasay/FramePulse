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
      <div className="flex flex-col gap-1">
        <span className="w-fit px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold">
          Catalog Repository • {games.length} Active Titles
        </span>
        <h1 className="font-headline-lg text-headline-lg text-[#18181b] uppercase tracking-tight">
          Manage Games
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Add New Game Card (4 Cols, Crisp 2px Outline) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-4 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] overflow-hidden"
        >
          <div className="bg-primary-container border-b-[2px] border-[#18181b] px-5 py-3.5 flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm uppercase text-[#18181b]">
              Add New Game
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-[#18181b] font-label-sm text-label-sm font-bold">
              GM-{nextGameNumber}
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-[#18181b]">
                Game Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Armored Core VII"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-md text-body-md font-semibold text-[#18181b] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-[#18181b]">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-md text-body-md font-semibold text-[#18181b] focus:bg-white focus:outline-none"
              >
                <option value="RPG">RPG</option>
                <option value="Racing">Racing</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Action">Action</option>
                <option value="FPS">FPS</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-[#18181b]">
                Engine Stack
              </label>
              <input
                type="text"
                value={engineStack}
                onChange={(e) => setEngineStack(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-md text-body-md text-[#18181b] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-secondary-container text-on-secondary-container border-[2px] border-[#18181b] font-headline-sm text-headline-sm uppercase hover:bg-amber-300 transition-all cursor-pointer mt-1"
            >
              + Add Game
            </button>
          </div>
        </form>

        {/* Right: Game Catalog Table (8 Cols, Crisp 2px Outline) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-[2px] border-[#18181b]">
            <h2 className="font-headline-sm text-headline-sm uppercase text-[#18181b]">
              Indexed Game Catalog
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title or genre..."
              className="px-3.5 py-1.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-sm text-body-sm text-[#18181b] focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[2px] border-[#18181b] bg-surface-container-low font-label-md text-label-md uppercase text-[#18181b]">
                  <th className="py-3 px-4">Game</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Avg FPS</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Stability</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-[#18181b]/15 font-body-md text-body-md">
                {filteredGames.map((g) => {
                  const fps = calculateAverageFps(g);
                  const rating = calculateAverageRating(g);
                  const stability = calculateStabilityScore(g);
                  const revCount = getApprovedReviews(g).length;

                  return (
                    <tr
                      key={g.gameId}
                      className="hover:bg-secondary-fixed/20 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#18181b]">{g.title}</div>
                        <div className="font-label-sm text-label-sm text-primary font-bold">
                          {g.gameId}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                          {g.genre}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-headline-sm text-headline-sm text-[#18181b]">
                        {fps.toFixed(1)} FPS
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#18181b]">
                        <span className="text-secondary-container">★</span>{' '}
                        {rating.toFixed(1)}{' '}
                        <span className="text-xs text-on-surface-variant">
                          ({revCount})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4ade80] text-[#18181b] border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                          {stability.toFixed(1)} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onInspectGame(g.gameId)}
                          className="group px-3 py-1 rounded-lg bg-primary-container text-on-primary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold hover:bg-primary-fixed cursor-pointer"
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
