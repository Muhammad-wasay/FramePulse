import React from 'react';

const NAV_ITEMS = [
  { id: 'analytics-dashboard', label: 'Dashboard', icon: 'monitoring' },
  { id: 'log-fps-session', label: 'Log FPS', icon: 'speed' },
  { id: 'submit-review', label: 'Submit Review', icon: 'rate_review' },
  { id: 'admin-moderation', label: 'Moderation', icon: 'gavel', hasBadge: true },
  { id: 'manage-games', label: 'Manage Games', icon: 'sports_esports' },
];

export default function Header({
  activePage,
  onNavigate,
  backendOnline,
  onRefresh,
  pendingCount,
}) {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      {/* Sleek floating glass pill navbar */}
      <header
        className="pointer-events-auto inline-flex w-fit max-w-[98vw] h-14 px-6 rounded-full border border-[#2b1d14]/15 items-center justify-center gap-5 backdrop-blur-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(250, 245, 238, 0.85) 55%, rgba(244, 236, 225, 0.9) 100%)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.95), 0 10px 30px -10px rgba(43, 29, 20, 0.14)',
        }}
      >
        {/* Left: Bold "FP" in Archivo Black */}
        <div
          onClick={() => onNavigate('analytics-dashboard')}
          className="flex items-center pr-5 border-r border-[#2b1d14]/12 cursor-pointer group select-none flex-shrink-0"
        >
          <span
            className="text-[24px] uppercase tracking-tighter text-[#2b1d14] leading-none transition-transform duration-300 group-hover:scale-105"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            F<span className="text-[#8b5a2b]">P</span>
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1.5 flex-shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#7c4a21] text-white border border-[#7c4a21] shadow-sm'
                    : 'bg-transparent text-on-surface-variant border border-transparent hover:bg-white/80 hover:text-[#2b1d14] hover:border-[#2b1d14]/12'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

                {/* Smooth Roll-Shift Text Container */}
                <span className="nav-flip-wrapper">
                  <span className="nav-flip-inner">
                    <span className="nav-flip-front">{item.label}</span>
                    <span
                      className={`nav-flip-back font-bold ${
                        isActive ? 'text-[#f7deb0]' : 'text-primary'
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>
                </span>

                {item.hasBadge && pendingCount > 0 && (
                  <span
                    className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none ${
                      isActive
                        ? 'bg-secondary-container text-[#2b1d14]'
                        : 'bg-secondary-container/80 text-[#2b1d14] border border-[#2b1d14]/15'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Sync + Admin Profile */}
        <div className="flex items-center gap-2.5 pl-5 border-l border-[#2b1d14]/12 flex-shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            title={
              backendOnline
                ? 'Connected to Java API (:8080)'
                : 'Sync Telemetry Store'
            }
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white border border-[#2b1d14]/15 shadow-xs flex items-center justify-center transition-all group cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-[#2b1d14] group-hover:rotate-180 transition-transform duration-500">
              refresh
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin-moderation')}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white border border-[#2b1d14]/15 shadow-xs transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
            <span className="nav-flip-wrapper font-label-md text-[12px] text-[#2b1d14] leading-none">
              <span className="nav-flip-inner">
                <span className="nav-flip-front">admin</span>
                <span className="nav-flip-back text-primary">A-101 PRO</span>
              </span>
            </span>
          </button>
        </div>
      </header>
    </div>
  );
}
