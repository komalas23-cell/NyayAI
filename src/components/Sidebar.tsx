import React from 'react';
import {
  Gavel,
  ShieldCheck,
  LayoutGrid,
  Lock,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { ModuleTab } from '../types';

interface SidebarProps {
  currentTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onToggleMobile,
  onLogout,
  isAuthenticated,
}) => {
  const navItems = [
    {
      id: 'login' as ModuleTab,
      number: '01',
      label: 'Login Portal',
      sublabel: 'System gatehouse',
      icon: Lock,
    },
    {
      id: 'dashboard' as ModuleTab,
      number: '02',
      label: 'Executive Dashboard',
      sublabel: 'Case ingestion',
      icon: LayoutGrid,
    },
    {
      id: 'workspace' as ModuleTab,
      number: '03',
      label: 'NyayAI Workspace',
      sublabel: 'Legal intelligence',
      icon: Gavel,
    },
    {
      id: 'compliance' as ModuleTab,
      number: '04',
      label: 'Compliance & Logs',
      sublabel: 'Audit ledger',
      icon: ShieldCheck,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a1120] text-slate-300 border-r border-slate-800/80 w-72 select-none">
      {/* Top Brand Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-blue-900 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-950/50">
            <Gavel className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center text-xl font-bold tracking-tight text-white">
              <span>Nyay</span>
              <span className="text-blue-400 font-extrabold ml-0.5">AI</span>
            </div>
            <div className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
              Judicial Intelligence System
            </div>
          </div>
        </div>

        {/* Secure Government Cloud Pill */}
        <div className="mt-5">
          <div className="flex items-center justify-center space-x-2 py-1.5 px-3 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span>SECURE GOVERNMENT CLOUD</span>
          </div>
        </div>
      </div>

      {/* Module Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase flex items-center justify-between">
          <span>Operational Modules</span>
          {!isAuthenticated && (
            <span className="text-[9px] text-amber-400 font-normal normal-case flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              Locked
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const IconComponent = item.icon;
          const isDisabled = !isAuthenticated && item.id !== 'login';

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                onSelectTab(item.id);
                if (mobileOpen) onToggleMobile();
              }}
              className={`w-full group relative flex items-center px-3.5 py-3 rounded-lg text-left transition-all duration-150 ${
                isDisabled
                  ? 'opacity-35 cursor-not-allowed select-none text-slate-500 hover:bg-transparent'
                  : isActive
                  ? 'bg-blue-600/15 text-white shadow-sm cursor-pointer'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 cursor-pointer'
              }`}
              title={isDisabled ? 'Authenticate via Login Portal to access' : item.label}
            >
              {/* Number prefix */}
              <span
                className={`text-[11px] font-mono mr-2.5 transition-colors ${
                  isDisabled
                    ? 'text-slate-600'
                    : isActive
                    ? 'text-blue-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {item.number}
              </span>

              {/* Icon */}
              <div
                className={`mr-3 p-1 rounded-md transition-colors ${
                  isDisabled
                    ? 'text-slate-600'
                    : isActive
                    ? 'text-blue-400'
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold tracking-tight truncate ${
                    isDisabled
                      ? 'text-slate-500'
                      : isActive
                      ? 'text-white'
                      : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </div>
                <div
                  className={`text-[11px] truncate font-normal ${
                    isDisabled ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {isDisabled ? 'Auth Required' : item.sublabel}
                </div>
              </div>

              {/* Locked badge if disabled */}
              {isDisabled && (
                <div className="ml-2 flex items-center">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}

              {/* Active blue marker indicator */}
              {!isDisabled && isActive && (
                <div className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-l-full shadow-lg shadow-blue-500/50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Security & Profile Container */}
      <div className="p-4 pt-2 border-t border-slate-800/70 space-y-3 bg-[#080d19]">
        {/* Protected Session Card */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center space-x-2.5">
            <div
              className={`p-1 rounded ${
                isAuthenticated
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {isAuthenticated ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {isAuthenticated ? 'Protected session' : 'Session locked'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {isAuthenticated
                  ? 'VPC-SC · TLS 1.3 · CMEK'
                  : 'Awaiting Authentication'}
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Security posture</span>
            <span
              className={`font-mono font-semibold ${
                isAuthenticated ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isAuthenticated ? '100%' : 'Locked'}
            </span>
          </div>
          <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAuthenticated ? 'bg-emerald-400 w-full' : 'bg-amber-400 w-1/6'
              }`}
            />
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center tracking-tight shadow-md ${
                isAuthenticated
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/80'
              }`}
            >
              {isAuthenticated ? 'SC' : <Lock className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {isAuthenticated ? 'Senior Clerk' : 'Unauthorized'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isAuthenticated
                  ? 'Bench 04 · Verified'
                  : 'Sign in to access modules'}
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={onLogout}
              title="Lock & Exit Portal"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase text-center pt-1">
          RESTRICTED · JUDICIAL USE ONLY
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onToggleMobile}
          />
          <div className="relative z-50 flex flex-col h-full animate-in slide-in-from-left duration-200">
            <button
              onClick={onToggleMobile}
              className="absolute right-2 top-2 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 z-10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
