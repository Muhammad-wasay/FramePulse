import React from 'react';
import { LOGO_URL } from '../data/initialData';

const NAV_ITEMS = [
  { id: 'analytics-dashboard', label: 'Analytics Dashboard', icon: 'monitoring' },
  { id: 'log-fps-session', label: 'Log FPS Session', icon: 'speed' },
  { id: 'submit-review', label: 'Submit Review', icon: 'rate_review' },
  { id: 'admin-moderation', label: 'Admin Moderation', icon: 'gavel', hasBadge: true },
  { id: 'manage-games', label: 'Manage Games', icon: 'sports_esports' },
];

export default function Sidebar({ activePage, onNavigate, pendingCount }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest border-r-[2px] border-[#18181b] z-50 flex flex-col justify-between p-5 select-none">
      <div className="flex flex-col gap-6">
        {/* Toon Brand Logo Card (Crisp Outline, No Thick Shadow) */}
        <div
          onClick={() => onNavigate('analytics-dashboard')}
          className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border-[2px] border-[#18181b] cursor-pointer hover:bg-primary-fixed/40 transition-all"
        >
          <img
            alt="FramePulse Toon Logo"
            className="h-8 w-auto object-contain transition-transform duration-300 hover:rotate-6"
            src={LOGO_URL}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-[#18181b]">
              FramePulse
            </span>
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
              Game Telemetry &amp; Reviews
            </span>
          </div>
        </div>

        {/* Toon Navigation Links (Crisp Outline Only) */}
        <nav className="flex flex-col gap-2.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-[2px] border-[#18181b] font-label-lg text-label-lg uppercase tracking-wider transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.hasBadge && (
                  <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-secondary-container text-on-secondary-container border-[1.5px] border-[#18181b] font-label-sm text-label-sm font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Auditor Card (Crisp Outline Only) */}
      <div
        onClick={() => onNavigate('admin-moderation')}
        className="p-3 bg-surface-container-low rounded-xl border-[2px] border-[#18181b] flex items-center justify-between hover:bg-surface-container transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-container border-[2px] border-[#18181b] flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-[20px]">
                shield_person
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4ade80] rounded-full border-[1.5px] border-[#18181b]"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-lg text-label-lg text-[#18181b] group-hover:text-primary transition-colors">
              admin_usman
            </span>
            <span className="font-label-sm text-label-sm uppercase bg-secondary-fixed text-on-secondary-fixed-variant px-1.5 py-0.5 rounded border border-[#18181b] w-fit font-bold">
              Lv.42 Auditor
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          chevron_right
        </span>
      </div>
    </aside>
  );
}
