import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminUser: { name: string; role: string; email: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@mrfitgym.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.loginAdmin({ email, password });
      if (res.success && res.adminUser) {
        onLoginSuccess(res.adminUser);
        onClose();
      } else {
        setError(res.error || 'Authentication rejected');
      }
    } catch {
      setError('Connection failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setEmail('admin@mrfitgym.com');
    setPassword('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f121b] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2f83d] uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Staff Security Clearance</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-display">
            Admin & Staff Portal Login
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access member subscriptions, trainer scheduling, financial ledger, and equipment management.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-[#c2f83d]/[0.06] border border-[#c2f83d]/20 rounded-xl text-xs mb-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#c2f83d] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Admin Access</span>
            </span>
            <button
              type="button"
              onClick={fillQuickDemo}
              className="text-[11px] text-white hover:underline cursor-pointer font-mono"
            >
              Autofill Demo
            </button>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            Email: <strong className="text-white">admin@mrfitgym.com</strong>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            Password: <strong className="text-white">admin123</strong> (or PIN <strong className="text-white">1234</strong>)
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Staff Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors"
              placeholder="admin@mrfitgym.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Management Password / Security PIN
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c2f83d]/20 disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating Staff...</span>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                <span>Sign In to Executive Admin Suite</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              fillQuickDemo();
              handleLogin();
            }}
            className="w-full py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-white/[0.06]"
          >
            Instant 1-Click Demo Admin Login
          </button>
        </form>
      </div>
    </div>
  );
};
