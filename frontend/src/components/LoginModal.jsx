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
      // Activity Diagram: "Show Error & Retry"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b1d14]/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#FAF7F3] border-2 border-[#2b1d14] p-7 shadow-2xl transition-all"
        style={{
          boxShadow: '0 20px 40px -15px rgba(43, 29, 20, 0.35)',
        }}
      >
        {/* Close Button if user is already logged in */}
        {currentUser && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#2b1d14]/20 bg-white/80 hover:bg-white text-[#2b1d14] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#7c4a21] text-white border-2 border-[#2b1d14] shadow-sm mb-3">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h2
            className="text-2xl font-black text-[#2b1d14] tracking-tight uppercase"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            Frame<span className="text-[#8b5a2b]">Pulse</span> Auth
          </h2>
          <p className="text-xs text-[#6e5849] mt-1 font-medium">
            OOAD Authentication & Access Control (Activity & Sequence Diagram)
          </p>
        </div>

        {/* Error Alert (Activity Diagram: Show Error & Retry) */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-red-600 flex-shrink-0">
              error
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5849] mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8c7464]">
                person
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. shadow_ninja or admin_usman"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#2b1d14]/20 text-[#2b1d14] text-sm font-medium focus:outline-none focus:border-[#7c4a21] focus:ring-1 focus:ring-[#7c4a21]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5849] mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8c7464]">
                key
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#2b1d14]/20 text-[#2b1d14] text-sm font-medium focus:outline-none focus:border-[#7c4a21] focus:ring-1 focus:ring-[#7c4a21]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#7c4a21] hover:bg-[#633a17] text-white font-bold text-xs uppercase tracking-wider border border-[#2b1d14] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Sign In to System</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Buttons for Viva Presentation */}
        <div className="mt-6 pt-5 border-t border-[#2b1d14]/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c7464] text-center mb-3">
            Quick Viva Demo Login (Diagram Actors)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {DEFAULT_ACCOUNTS.map((acc) => {
              const isAdmin = acc.role === 'Admin';
              return (
                <button
                  key={acc.userId}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                    isAdmin
                      ? 'bg-[#EFECE6] border-[#6F4E37]/30 hover:border-[#6F4E37] hover:bg-[#eae6de]'
                      : 'bg-white border-[#2b1d14]/15 hover:border-[#7c4a21] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        isAdmin
                          ? 'bg-[#6F4E37] text-white'
                          : 'bg-[#8b5a2b]/20 text-[#7c4a21]'
                      }`}
                    >
                      {acc.role}
                    </span>
                    <span className="text-[10px] text-[#8c7464] font-mono">
                      {acc.userId}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#2b1d14] truncate">
                    {acc.username}
                  </div>
                  <div className="text-[10px] text-[#6e5849]/80 font-mono mt-0.5">
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
