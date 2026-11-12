import React, { useState } from 'react';

const QUICK_TAGS = [
  'RTX 4070 Tested',
  'DLSS Enabled',
  'Zero Stutters',
  'Shader Precomp Lag',
  'UltraWide 21:9',
];

export default function SubmitReviewPage({
  games,
  selectedGameId,
  pendingCount,
  onSubmitReview,
}) {
  const [gameId, setGameId] = useState(
    selectedGameId || games[0]?.gameId || 'GM-501'
  );
  const [player, setPlayer] = useState('Falcon_Pilot');
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState(
    'Solid 120 FPS lock on 1440p High Preset. Frame generation remains clean without noticeable latency artifacts.'
  );
  const [selectedTags, setSelectedTags] = useState([
    'RTX 4070 Tested',
    'DLSS Enabled',
  ]);

  const selectedGame =
    games.find((g) => g.gameId === gameId) || games[0] || {};

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!player.trim() || !comment.trim()) return;

    onSubmitReview({
      gameId,
      player: player.trim(),
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      hardwareSpec: selectedTags.slice(0, 2).join(' • ') || 'Verified PC Rig',
    });
    setComment('');
  };

  return (
    <div className="flex flex-col w-full gap-7 pb-12 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col gap-1.5">
        <span className="w-fit px-2.5 py-0.5 rounded-full bg-primary-fixed/80 text-on-primary-fixed-variant border border-primary/20 font-label-sm text-label-sm uppercase font-semibold">
          Community Feedback
        </span>
        <h1 className="font-headline-lg text-headline-lg text-[#2b1d14] tracking-tight">
          Submit Review
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Review Form (8 Cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] p-6 flex flex-col gap-6"
        >
          {/* Game & Player */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Select Game
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
                Gamer Handle
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

          {/* 5-Star Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md uppercase text-on-surface-variant">
              Star Rating ({rating} / 5)
            </label>
            <div className="flex items-center gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all hover:-translate-y-0.5 cursor-pointer ${
                      active
                        ? 'bg-amber-100/90 text-[#d99b26] border-amber-700/25 shadow-xs'
                        : 'bg-surface-container-low/80 text-outline-variant border-[#2b1d14]/12 hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[26px]"
                      style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Telemetry Tags */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md uppercase text-on-surface-variant">
              Telemetry Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full border font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#7c4a21] text-white border-[#7c4a21]'
                        : 'bg-surface-container-low/80 text-[#2b1d14] border-[#2b1d14]/15 hover:bg-surface-container'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md uppercase text-on-surface-variant">
                Review Verdict
              </label>
              <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                {comment.length} / 300
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={300}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Share your FPS stability and gameplay experience..."
              className="w-full p-3.5 rounded-xl bg-surface-container-low/80 border border-[#2b1d14]/15 font-body-md text-body-md text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-3 border-t border-[#2b1d14]/10">
            <button
              type="submit"
              className="group px-6 py-2.5 rounded-xl bg-[#7c4a21] text-white border border-[#7c4a21] shadow-xs font-headline-sm text-headline-sm hover:bg-[#663b19] transition-all cursor-pointer"
            >
              <span className="nav-flip-wrapper">
                <span className="nav-flip-inner">
                  <span className="nav-flip-front">Submit Review</span>
                  <span className="nav-flip-back text-[#f7deb0]">
                    Submit Review
                  </span>
                </span>
              </span>
            </button>
          </div>
        </form>

        {/* Right: Live Review Preview Card (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] overflow-hidden">
          <div className="bg-surface-container-low border-b border-[#2b1d14]/10 px-5 py-3.5 flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-[#2b1d14]">
              Live Card Preview
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-700/20 font-label-sm text-label-sm font-semibold">
              PENDING ({pendingCount})
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low/75 border border-[#2b1d14]/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg font-bold text-[#2b1d14]">
                  @{player || 'anonymous'}
                </span>
                <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded-md bg-primary-fixed/75 text-on-primary-fixed-variant border border-primary/15 font-semibold">
                  {selectedGame.title}
                </span>
              </div>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`material-symbols-outlined text-[18px] ${
                      s <= rating
                        ? 'text-[#d99b26]'
                        : 'text-outline-variant'
                    }`}
                    style={{
                      fontVariationSettings: `'FILL' ${s <= rating ? 1 : 0}`,
                    }}
                  >
                    star
                  </span>
                ))}
              </div>

              <p className="font-body-sm text-body-sm text-[#2b1d14]/90 leading-relaxed">
                “{comment || 'Your review text will appear here...'}”
              </p>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              New reviews enter the <strong>PENDING</strong> queue and appear on
              the dashboard once approved by Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
