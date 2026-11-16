import React, { useState } from 'react';
import {
  DEFAULT_ACCOUNTS,
  authenticateUser,
  registerNewUser,
} from '../services/supabaseService';

export default function LoginModal({
  isOpen,
  currentUser,
  onLoginSuccess,
  onClose,
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    const result = await authenticateUser(username, password);
    setLoading(false);

    if (result.success) {
      onLoginSuccess(result.user);
      resetForm();
    } else {
      setError(result.error || 'Invalid credentials. Please retry.');
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    const result = await registerNewUser({ username, email, password });
    setLoading(false);

    if (result.success) {
      onLoginSuccess(result.user);
      resetForm();
    } else {
      setError(result.error || 'Failed to create account. Please retry.');
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
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
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-[#2b1d14]/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md my-auto max-h-[94vh] overflow-y-auto rounded-3xl bg-[#FAF7F3] border border-[#2b1d14]/20 p-5 sm:p-6 shadow-2xl transition-all"
        style={{
          boxShadow: '0 25px 50px -12px rgba(43, 29, 20, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Always Visible Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#2b1d14]/15 bg-white/90 hover:bg-white text-[#2b1d14] flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105 z-10"
          title="Close dialog"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header with Clean FP Favicon Emblem */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1a120c] border border-[#2b1d14]/25 flex items-center justify-center shadow-sm p-1.5">
              <img
                src="/logo/favicon.png"
                alt="FP Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h2
            className="text-xl font-black text-[#2b1d14] tracking-tight uppercase"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            {mode === 'signin' ? (
              <>
                Sign In to Frame<span className="text-[#8b5a2b]">Pulse</span>
              </>
            ) : (
              <>
                Gamer <span className="text-[#8b5a2b]">Sign Up</span>
              </>
            )}
          </h2>
          <p className="text-xs text-[#6e5849] mt-0.5 font-medium">
            {mode === 'signin'
              ? 'Access game telemetry, hardware logs & reviews'
              : 'Create your Gamer profile to log telemetry & review games'}
          </p>
        </div>

        {/* Sign In vs Gamer Sign Up Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#2b1d14]/8 border border-[#2b1d14]/10 mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#2b1d14] shadow-xs'
                : 'text-[#6e5849] hover:text-[#2b1d14]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#2b1d14] shadow-xs'
                : 'text-[#6e5849] hover:text-[#2b1d14]'
            }`}
          >
            Gamer Sign Up
          </button>
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

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-3">
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
        ) : (
          /* Gamer Sign Up Form (Public registration strictly creates Gamer profiles) */
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6e5849] mb-1">
                Choose Gamer Tag / Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-[#8c7464]">
                  sports_esports
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. cyber_sniper"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#2b1d14]/20 text-[#2b1d14] text-xs font-medium focus:outline-none focus:border-[#7c4a21] focus:ring-1 focus:ring-[#7c4a21]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6e5849] mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-[#8c7464]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sniper@gaming.org"
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
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-[#2b1d14]/20 text-[#2b1d14] text-xs font-medium focus:outline-none focus:border-[#7c4a21] focus:ring-1 focus:ring-[#7c4a21]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#7c4a21] hover:bg-[#633a17] text-white font-bold text-xs uppercase tracking-wider border border-[#2b1d14]/50 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[17px]">person_add</span>
                  <span>Create Gamer Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Access (Pre-Configured System Actors) */}
        <div className="mt-4 pt-3.5 border-t border-[#2b1d14]/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c7464] text-center mb-2">
            Fast Demo Access (Diagram Actors)
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
