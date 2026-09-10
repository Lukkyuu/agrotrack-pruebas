import React from 'react';
import { AuthUser, AppRole } from '../../types/agrotrack';

interface TopAppBarProps {
  readonly user: AuthUser;
  readonly onRoleSwitch?: (newRole: AppRole) => void;
  readonly onRefresh?: () => void;
  readonly isRefreshing?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  user,
  onRoleSwitch,
  onRefresh,
  isRefreshing = false,
}) => {
  const allRoles: readonly AppRole[] = ['ADMIN', 'OPERADOR', 'PRODUCTOR', 'AUDITOR'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand Link (Stitch Gate requirement: Link to /) */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
            title="AgroTrack — Volver al inicio"
          >
            <img
              src="/logo.png"
              alt="AgroTrack Logo"
              className="w-9 h-9 rounded-full object-cover shadow-xs ring-1 ring-black/10 dark:ring-white/10"
            />
            <div className="flex flex-col">
              <span className="leading-tight flex items-center gap-1.5">
                AgroTrack
                <span className="text-[10px] font-semibold font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">
                Plataforma de Acopio & Trazabilidad
              </span>
            </div>
          </a>
        </div>

        {/* Action Center & User Profile */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Sincronizar datos con el BFF"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}

          {/* Selector de Rol Simulado (Para probar la lógica de permisos RBAC de Azure AD) */}
          {onRoleSwitch && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">Rol:</span>
              {allRoles.map((role) => {
                const isActive = user.roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onRoleSwitch(role)}
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          )}

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {user.rut || 'Azure AD ID'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
