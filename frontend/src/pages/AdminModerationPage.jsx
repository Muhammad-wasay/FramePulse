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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold">
              🚨 {counts.PENDING} Pending Review(s)
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg uppercase text-[#18181b] tracking-tight">
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
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-container-lowest border-[2px] border-[#18181b] font-body-sm text-body-sm text-[#18181b] focus:outline-none"
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
              className={`px-4 py-2 rounded-xl border-[2px] border-[#18181b] font-label-md text-label-md uppercase font-bold transition-all cursor-pointer flex items-center gap-2 ${
                active
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>{tab}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface border border-[#18181b] text-[11px]">
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Moderation Table */}
      <div className="bg-surface-container-lowest rounded-xl border-[2px] border-[#18181b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-[2px] border-[#18181b] bg-surface-container-low font-label-md text-label-md uppercase text-[#18181b]">
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
            <tbody className="divide-y-[1.5px] divide-[#18181b]/15 font-body-md text-body-md">
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
                      ? 'bg-[#4ade80] text-[#18181b]'
                      : rev.status === 'REJECTED'
                      ? 'bg-tertiary-container text-[#18181b]'
                      : 'bg-secondary-container text-[#18181b]';

                  return (
                    <tr
                      key={rev.reviewId}
                      className="hover:bg-secondary-fixed/20 transition-colors"
                    >
                      <td className="py-4 px-4 font-label-md text-label-md font-bold text-[#18181b] whitespace-nowrap">
                        {rev.reviewId}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#18181b]">
                        {rev.gameTitle}
                      </td>
                      <td className="py-4 px-4 font-semibold text-primary">
                        @{rev.player}
                      </td>
                      <td className="py-4 px-4 text-secondary-container font-bold whitespace-nowrap">
                        {'★'.repeat(rev.rating)}
                      </td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-[#18181b] max-w-md">
                        “{rev.comment}”
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold ${statusBadge}`}
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
                                className="px-2.5 py-1 rounded-lg bg-[#4ade80] text-[#18181b] border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold hover:opacity-90 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onModerateReviews([rev.reviewId], 'REJECTED')
                                }
                                className="px-2.5 py-1 rounded-lg bg-secondary-container text-[#18181b] border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold hover:opacity-90 cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onModerateReviews([rev.reviewId], 'DELETE')
                                }
                                className="px-2.5 py-1 rounded-lg bg-tertiary-container text-[#18181b] border-[1.5px] border-[#18181b] font-label-sm text-label-sm uppercase font-bold hover:opacity-90 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
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
