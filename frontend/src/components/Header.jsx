import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'analytics-dashboard', label: 'Dashboard', icon: 'monitoring', roles: ['Admin', 'Gamer'] },
  { id: 'log-fps-session', label: 'Log FPS', icon: 'speed', roles: ['Admin', 'Gamer'] },
  { id: 'submit-review', label: 'Submit Review', icon: 'rate_review', roles: ['Admin', 'Gamer'] },
  { id: 'admin-moderation', label: 'Moderation', icon: 'gavel', hasBadge: true, roles: ['Admin'] },
  { id: 'manage-games', label: 'Manage Games', icon: 'sports_esports', roles: ['Admin'] },
];

export default function Header({
  activePage,
  onNavigate,
  backendOnline,
  onRefresh,
  pendingCount,
  currentUser,
  onOpenLogin,
  onLogout,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userRole = currentUser?.role || 'Gamer';

  const handleNavClick = (item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      alert(`Access Restricted: "${item.label}" requires Admin privileges (OOAD Use Case Diagram).`);
      return;
    }
    onNavigate(item.id);
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      {/* Sleek floating glass pill navbar */}
      <header
        className="pointer-events-auto inline-flex w-fit max-w-[98vw] h-14 px-6 rounded-full border border-[#2b1d14]/15 items-center justify-center gap-5 backdrop-blur-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(250, 245, 238, 0.88) 55%, rgba(244, 236, 225, 0.92) 100%)',
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
            const isRestricted = item.roles && !item.roles.includes(userRole);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                title={isRestricted ? `Admin only (${item.label})` : item.label}
                className={`group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isRestricted
                    ? 'opacity-40 hover:opacity-70 bg-transparent text-on-surface-variant border border-transparent'
                    : isActive
                    ? 'bg-[#7c4a21] text-white border border-[#7c4a21] shadow-sm'
                    : 'bg-transparent text-on-surface-variant border border-transparent hover:bg-white/80 hover:text-[#2b1d14] hover:border-[#2b1d14]/12'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] transition-transform duration-300 group-hover:scale-110">
                  {isRestricted ? 'lock' : item.icon}
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

                {item.hasBadge && pendingCount > 0 && !isRestricted && (
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

        {/* Right: Sync + User Auth Profile */}
        <div className="flex items-center gap-2.5 pl-5 border-l border-[#2b1d14]/12 flex-shrink-0 relative">
          <button
            type="button"
            onClick={onRefresh}
            title={
              backendOnline
                ? 'Connected to Java API / Supabase'
                : 'Sync Telemetry Store'
            }
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white border border-[#2b1d14]/15 shadow-xs flex items-center justify-center transition-all group cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-[#2b1d14] group-hover:rotate-180 transition-transform duration-500">
              refresh
            </span>
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#2b1d14]/15 shadow-xs transition-colors cursor-pointer flex-shrink-0"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    currentUser.role === 'Admin' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}
                ></span>
                <span className="text-[12px] font-bold text-[#2b1d14] leading-none">
                  {currentUser.username}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded leading-none ${
                    currentUser.role === 'Admin'
                      ? 'bg-[#7c4a21] text-white'
                      : 'bg-[#2b1d14]/10 text-[#6e5849]'
                  }`}
                >
                  {currentUser.role}
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#6e5849]">
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu for Logout / Switch Account */}
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#2b1d14]/15 p-2 shadow-xl z-50 animate-fade-in"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#2b1d14]/10 mb-1">
                    <div className="text-[10px] font-mono text-[#8c7464]">
                      ID: {currentUser.userId}
                    </div>
                    <div className="text-xs font-bold text-[#2b1d14] truncate">
                      {currentUser.email || currentUser.username}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#2b1d14] hover:bg-[#FAF7F3] rounded-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#7c4a21]">
                      switch_account
                    </span>
                    <span>Switch Role / User</span>
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer mt-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      logout
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#7c4a21] hover:bg-[#633a17] text-white text-[12px] font-bold uppercase tracking-wide border border-[#2b1d14] shadow-xs cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
