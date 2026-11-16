import React, { useState } from 'react';
import { DEFAULT_ACCOUNTS, authenticateUser } from '../services/supabaseService';

export default function LoginModal({ isOpen, currentUser, onLoginSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    const result = await authenticateUser(username, password);
    setLoading(false);

    if (result.success) {
      onLoginSuccess(result.user);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError(result.error || 'Invalid credentials. Please retry.');
    }
  };

  const handleQuickLogin = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setError('');
    onLoginSuccess({
      userId: account.userId,
      username: account.username,
      role: account.role,
      email: account.email,
      badge: account.badge,
      playTimeHours: account.playTimeHours,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-[#2b1d14]/65 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF7F3] border border-[#2b1d14]/20 p-5 sm:p-6 shadow-2xl transition-all"
        style={{
          boxShadow: '0 25px 50px -12px rgba(43, 29, 20, 0.35)',
        }}
      >
        {/* Close Button if user is already logged in */}
        {currentUser && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full border border-[#2b1d14]/15 bg-white/80 hover:bg-white text-[#2b1d14] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}

        {/* Modal Header with Real FramePulse Logo */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2.5">
            <img
              src="/logo/logo.png"
              alt="FramePulse"
              className="h-9 sm:h-10 w-auto object-contain"
              onError={(e) => {
                // Graceful fallback to favicon emblem if full logo missing
                e.currentTarget.src = '/logo/favicon.png';
              }}
            />
          </div>
          <h2
            className="text-xl font-black text-[#2b1d14] tracking-tight uppercase"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            Sign In to Frame<span className="text-[#8b5a2b]">Pulse</span>
          </h2>
          <p className="text-xs text-[#6e5849] mt-0.5 font-medium">
            Access game telemetry, hardware logs & reviews
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-red-600 flex-shrink-0">
              error
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6e5849] mb-1">
              Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-[#8c7464]">
                person
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. shadow_ninja or admin_usman"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#2b1d14]/20 text-[#2b1d14] text-xs font-medium focus:outline-none focus:border-[#7c4a21] focus:ring-1 focus:ring-[#7c4a21]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6e5849] mb-1">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-[#8c7464]">
                key
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#2b1d14]/20 text-[#2b1d14] text-xs font-medium focus:outline-none focus:border-[#7c4a21] focus:ring-1 focus:ring-[#7c4a21]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 rounded-xl bg-[#7c4a21] hover:bg-[#633a17] text-white font-bold text-xs uppercase tracking-wider border border-[#2b1d14]/50 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px]">login</span>
                <span>Sign In to System</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access (Gamer & Admin) */}
        <div className="mt-4 pt-3.5 border-t border-[#2b1d14]/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c7464] text-center mb-2">
            Fast Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_ACCOUNTS.map((acc) => {
              const isAdmin = acc.role === 'Admin';
              return (
                <button
                  key={acc.userId}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                    isAdmin
                      ? 'bg-[#EFECE6] border-[#6F4E37]/30 hover:border-[#6F4E37] hover:bg-[#eae6de]'
                      : 'bg-white border-[#2b1d14]/15 hover:border-[#7c4a21] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none ${
                        isAdmin
                          ? 'bg-[#6F4E37] text-white'
                          : 'bg-[#8b5a2b]/20 text-[#7c4a21]'
                      }`}
                    >
                      {acc.role}
                    </span>
                    <span className="text-[9px] text-[#8c7464] font-mono">
                      {acc.userId}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#2b1d14] truncate">
                    {acc.username}
                  </div>
                  <div className="text-[9px] text-[#6e5849]/80 font-mono">
                    pw: {acc.password}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
