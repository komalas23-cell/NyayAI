import React from 'react';
import { Menu, Key, ShieldCheck, ArrowLeft } from 'lucide-react';
import { ModuleTab } from '../types';

interface HeaderProps {
  currentTab: ModuleTab;
  onOpenMobileSidebar: () => void;
  isAuthenticated?: boolean;
  canGoBack?: boolean;
  onGoBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  isAuthenticated = false,
  canGoBack = false,
  onGoBack,
}) => {
  const getTitle = () => {
    switch (currentTab) {
      case 'login':
        return 'Login Portal';
      case 'dashboard':
        return 'Executive Dashboard';
      case 'workspace':
        return 'NyayAI Workspace';
      case 'compliance':
        return 'Compliance & Logs';
      default:
        return 'NyayAI Secure Cloud';
    }
  };

  return (
    <header className="bg-[#0f172a] border-b border-slate-800/80 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Back Button + Breadcrumb / Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {canGoBack && onGoBack && (
            <button
              onClick={onGoBack}
              title="Go back to previous screen"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all shadow-sm cursor-pointer group flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          )}

          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase truncate flex items-center gap-1.5">
              <span>NyayAI Secure Judicial Cloud</span>
              {currentTab !== 'login' && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-blue-400 font-mono text-[10px]">{currentTab}</span>
                </>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
              {getTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Security & Operational Status Pills */}
        <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
          {/* Network secure */}
          <div className="hidden md:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
            <div className="text-left leading-tight">
              <div className="text-xs font-semibold text-slate-200">Network secure</div>
              <div className="text-[9px] text-slate-400 font-mono">VPC perimeter active</div>
            </div>
          </div>

          {/* CMEK protected */}
          <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 shadow-sm">
            <Key className="w-3.5 h-3.5 text-blue-400" />
            <div className="text-left leading-tight">
              <div className="text-xs font-semibold text-slate-200">CMEK protected</div>
              <div className="text-[9px] text-slate-400 font-mono">Data sovereignty enabled</div>
            </div>
          </div>

          {/* Operational status pill */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg shadow-sm ${
              isAuthenticated
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/40 border border-amber-500/40 text-amber-400'
            }`}
          >
            <ShieldCheck
              className={`w-4 h-4 ${
                isAuthenticated ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <span className="text-xs font-semibold">
              {isAuthenticated ? 'All systems operational' : 'SSO Gatehouse Active'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
