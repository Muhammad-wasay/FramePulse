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
      <div className="flex flex-col gap-1">
        <span className="w-fit px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold">
          Community Feedback
        </span>
        <h1 className="font-headline-lg text-headline-lg uppercase text-[#18181b] tracking-tight">
          Submit Review
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Toon Review Form (8 Cols, Crisp 2px Outline) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] p-6 flex flex-col gap-6"
        >
          {/* Game & Player */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-[#18181b]">
                Select Game
              </label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-md text-body-md font-semibold text-[#18181b] focus:bg-white focus:outline-none"
              >
                {games.map((g) => (
                  <option key={g.gameId} value={g.gameId}>
                    {g.title} ({g.gameId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md uppercase text-[#18181b]">
                Gamer Handle
              </label>
              <input
                type="text"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-md text-body-md font-semibold text-[#18181b] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* 5-Star Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md uppercase text-[#18181b]">
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
                    className={`w-12 h-12 rounded-xl border-[2px] border-[#18181b] flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer ${
                      active
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-low text-outline-variant hover:bg-surface-container'
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
            <label className="font-label-md text-label-md uppercase text-[#18181b]">
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
                    className={`px-3 py-1 rounded-full border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container-low text-[#18181b] hover:bg-surface-container'
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
              <label className="font-label-md text-label-md uppercase text-[#18181b]">
                Review Verdict
              </label>
              <span className="font-label-sm text-label-sm font-bold text-on-surface-variant">
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
              className="w-full p-3.5 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] font-body-md text-body-md text-[#18181b] focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-3 border-t-[2px] border-[#18181b]/15">
            <button
              type="submit"
              className="group px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container border-[2px] border-[#18181b] font-headline-sm text-headline-sm uppercase hover:bg-primary-fixed transition-all cursor-pointer"
            >
              <span className="nav-flip-wrapper">
                <span className="nav-flip-inner">
                  <span className="nav-flip-front">Submit Review</span>
                  <span className="nav-flip-back">Submit Review</span>
                </span>
              </span>
            </button>
          </div>
        </form>

        {/* Right: Toon Live Review Preview Card (4 Cols, Crisp 2px Outline) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] overflow-hidden">
          <div className="bg-primary-container border-b-[2px] border-[#18181b] px-5 py-3.5 flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm uppercase text-[#18181b]">
              Live Card Preview
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container border border-[#18181b] font-label-sm text-label-sm font-bold">
              PENDING ({pendingCount})
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border-[2px] border-[#18181b] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg font-bold text-[#18181b]">
                  @{player || 'anonymous'}
                </span>
                <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-surface border border-[#18181b] font-bold">
                  {selectedGame.title}
                </span>
              </div>

              <div className="flex items-center text-secondary-container">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`material-symbols-outlined text-[18px] ${
                      s <= rating
                        ? 'text-secondary-container'
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

              <p className="font-body-sm text-body-sm text-[#18181b]">
                “{comment || 'Your review text will appear here...'}”
              </p>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              New reviews enter the <strong>PENDING</strong> queue and appear on
              the dashboard once approved by Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
