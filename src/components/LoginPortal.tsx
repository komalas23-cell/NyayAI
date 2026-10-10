import React, { useState } from 'react';
import { Gavel, ChevronRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess }) => {
  const [authorityId, setAuthorityId] = useState('clerk.04@judiciary.gov.in');
  const [accessKey, setAccessKey] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Authenticating with Judicial Cloud HSM...');

    setTimeout(() => {
      setStatusMessage('CMEK Key Exchange verified · Access Granted');
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background blueprint grid styling & faint watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #f8fafc 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Decorative subtle gavel outline watermark */}
      <div className="absolute opacity-[0.03] pointer-events-none transform -rotate-12 select-none">
        <Gavel className="w-[580px] h-[580px] text-slate-900" />
      </div>

      {/* Central Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200/90 p-8 sm:p-10 z-10 transition-all">
        {/* Emblem */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 text-white">
            <Gavel className="w-7 h-7 text-blue-400" />
          </div>
        </div>

        {/* Header Text */}
        <div className="mt-5 text-center">
          <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
            Authorized Personnel Only
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1.5">
            Judicial Authority
            <span className="block">Single Sign-On (SSO)</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Access the protected legal intelligence environment using your
            judiciary-issued credentials.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judicial authority ID
            </label>
            <input
              type="text"
              value={authorityId}
              onChange={(e) => setAuthorityId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-colors font-mono"
              placeholder="name.id@judiciary.gov.in"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Secure access key
            </label>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{statusMessage || 'Verifying...'}</span>
              </span>
            ) : (
              <>
                <span>Authenticate & enter workspace</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Guarded by Cloud Armor Badge */}
        <div className="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-emerald-900">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">
                Guarded by Google Cloud Armor
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                TLS 1.3 Active · Session encrypted end-to-end
              </div>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        </div>

        {/* Warning Footnote */}
        <div className="mt-5 flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 text-center">
          <Lock className="w-3 h-3 flex-shrink-0" />
          <span>
            This system is monitored. Unauthorized access is prohibited and subject to prosecution.
          </span>
        </div>
      </div>
    </div>
  );
};
