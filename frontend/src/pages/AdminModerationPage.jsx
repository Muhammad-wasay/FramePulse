import React, { useState } from 'react';
import { Sticker } from '../stickers/Sticker';
import { brand } from '../stickers/fun';
import { search } from '../stickers/icons';

const COFFEE = brand('#c88a52', '#7c4a21');

export default function AdminModerationPage({ games, onModerateReviews }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allReviews = games.flatMap((game) =>
    (game.reviews || []).map((rev) => ({
      ...rev,
      gameId: game.gameId,
      gameTitle: game.title,
    }))
  );

  const counts = {
    ALL: allReviews.length,
    PENDING: allReviews.filter((r) => r.status === 'PENDING').length,
    APPROVED: allReviews.filter((r) => r.status === 'APPROVED').length,
    REJECTED: allReviews.filter((r) => r.status === 'REJECTED').length,
  };

  const filteredReviews = allReviews.filter((rev) => {
    const matchesStatus =
      statusFilter === 'ALL' || rev.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      rev.reviewId.toLowerCase().includes(q) ||
      rev.gameTitle.toLowerCase().includes(q) ||
      rev.player.toLowerCase().includes(q) ||
      rev.comment.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Hide the Actions column completely on APPROVED and REJECTED tabs
  const showActionsColumn =
    statusFilter === 'ALL' || statusFilter === 'PENDING';

  return (
    <div className="flex flex-col w-full gap-7 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-700/20 font-label-sm text-label-sm uppercase font-semibold">
              {counts.PENDING} Pending Review(s)
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-[#2b1d14] tracking-tight">
            Admin Moderation
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-container-lowest border border-[#2b1d14]/15 shadow-xs font-body-sm text-body-sm text-[#2b1d14] focus:bg-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => {
          const active = statusFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl border font-label-md text-label-md uppercase font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                active
                  ? 'bg-[#7c4a21] text-white border-[#7c4a21] shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface border-[#2b1d14]/12 hover:bg-surface-container-low'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container text-[#2b1d14]'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Moderation Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-[#2b1d14]/12 shadow-[0_2px_12px_-3px_rgba(43,29,20,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2b1d14]/12 bg-surface-container-low/80 font-label-md text-label-md uppercase text-on-surface-variant">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Game</th>
                <th className="py-3.5 px-4">Gamer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Comment</th>
                <th className="py-3.5 px-4">Status</th>
                {showActionsColumn && (
                  <th className="py-3.5 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b1d14]/10 font-body-md text-body-md">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={showActionsColumn ? 7 : 6}
                    className="py-8 text-center font-label-lg text-label-lg text-on-surface-variant"
                  >
                    <div className="flex flex-col items-center">
                      <Sticker icon={search} palette={COFFEE} style={{ width: 84, height: 84 }} />
                      <span>No reviews found for this filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => {
                  const statusBadge =
                    rev.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-700/20'
                      : rev.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-900 border-rose-700/20'
                      : 'bg-amber-100 text-amber-900 border-amber-700/20';

                  return (
                    <tr
                      key={rev.reviewId}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-label-md text-label-md font-bold text-[#2b1d14] whitespace-nowrap">
                        {rev.reviewId}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#2b1d14]">
                        {rev.gameTitle}
                      </td>
                      <td className="py-4 px-4 font-semibold text-primary">
                        @{rev.player}
                      </td>
                      <td className="py-4 px-4 text-[#d99b26] font-bold whitespace-nowrap">
                        {'★'.repeat(rev.rating)}
                      </td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-[#2b1d14]/90 max-w-md leading-relaxed">
                        “{rev.comment}”
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full border font-label-sm text-label-sm font-semibold ${statusBadge}`}
                        >
                          {rev.status}
                        </span>
                      </td>

                      {showActionsColumn && (
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {rev.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  onModerateReviews([rev.reviewId], 'APPROVED')
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-700/25 font-label-sm text-label-sm uppercase font-semibold hover:bg-emerald-200 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onModerateReviews([rev.reviewId], 'REJECTED')
                                }
                                className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-700/25 font-label-sm text-label-sm uppercase font-semibold hover:bg-amber-200 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onModerateReviews([rev.reviewId], 'DELETE')
                                }
                                className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-700/25 font-label-sm text-label-sm uppercase font-semibold hover:bg-rose-200 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-medium">
                              ✓ Moderated
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
