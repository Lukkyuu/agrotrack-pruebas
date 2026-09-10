import React from 'react';
import { AuthUser, AppRole } from '../../types/agrotrack';

interface TopAppBarProps {
  readonly user: AuthUser;
  readonly onRoleSwitch?: (newRole: AppRole) => void;
  readonly onRefresh?: () => void;
  readonly isRefreshing?: boolean;
  readonly onOpenNewDelivery?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  user,
  onRoleSwitch,
  onRefresh,
  isRefreshing = false,
  onOpenNewDelivery,
}) => {
  const allRoles: readonly AppRole[] = ['ADMIN', 'OPERADOR', 'PRODUCTOR', 'AUDITOR'];
  const canCreate = user.roles.includes('ADMIN') || user.roles.includes('OPERADOR') || user.roles.includes('PRODUCTOR');

  return (
    <header className="sticky top-0 z-20 w-full border-b-3 border-[#5C3D2E] bg-white/95 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      {/* Context / Status Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-hidden="true">
            🌾
          </span>
          <span className="font-baloo font-bold text-sm sm:text-base text-[#5C3D2E]">
            Centro de Acopio Curicó
          </span>
        </div>
        <div className="h-4 w-[2px] bg-[#5C3D2E]/20 hidden sm:block" />
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C8F0D9] border border-[#5C3D2E] text-[11px] font-black text-[#5C3D2E] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#3F9E67] animate-pulse" />
          BFF: :8080 Conectado
        </span>
      </div>

      {/* Role Switcher & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Role Switcher */}
        {onRoleSwitch && (
          <div className="flex items-center gap-1 bg-[#FFF8E7] p-1 rounded-xl border-2 border-[#5C3D2E] shadow-comic-sm">
            <span className="text-[10px] font-baloo font-extrabold text-[#5C3D2E]/70 px-1 uppercase hidden md:inline">
              Rol:
            </span>
            {allRoles.map((role) => {
              const isActive = user.roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => onRoleSwitch(role)}
                  className={`px-2 py-0.5 rounded-lg font-baloo font-black text-[11px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3F9E67] text-white shadow-xs'
                      : 'text-[#5C3D2E]/80 hover:bg-[#6FCF97]/25 hover:text-[#5C3D2E]'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        )}

        {/* Refresh button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border-2 border-[#5C3D2E] bg-[#FFF8E7] text-[#5C3D2E] hover:bg-[#6FCF97]/30 shadow-comic-sm transition-all cursor-pointer disabled:opacity-50"
            title="Sincronizar con microservicios Spring Boot"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#3F9E67]' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}

        {/* Quick action: Nueva Entrega */}
        {canCreate && onOpenNewDelivery && (
          <button
            type="button"
            onClick={onOpenNewDelivery}
            className="px-3 py-1.5 rounded-xl border-2 border-[#5C3D2E] bg-[#3F9E67] text-white hover:bg-[#0D5C3A] font-baloo font-bold text-xs shadow-comic-sm transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
          >
            <span className="text-sm">📥</span>
            <span className="hidden sm:inline">Nueva Entrega</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TopAppBar;
