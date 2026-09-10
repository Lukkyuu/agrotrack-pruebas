import React from 'react';
import { AppRole, AuthUser } from '../../types/agrotrack';

interface SidebarNavProps {
  readonly user: AuthUser;
  readonly activeRoute?: string;
  readonly onNavigate?: (route: string) => void;
}

interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly route: string;
  readonly iconEmoji: string;
  readonly badge?: string;
}

const navItems: readonly NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/', iconEmoji: '📊' },
  { id: 'deliveries', label: 'Entregas', route: '/deliveries', iconEmoji: '📦', badge: '12' },
  { id: 'catalog', label: 'Catálogo de Silos', route: '/catalog', iconEmoji: '🌾' },
  { id: 'reports', label: 'Reportería', route: '/reports', iconEmoji: '📈' },
  { id: 'audit', label: 'Auditoría', route: '/audit', iconEmoji: '🔍' },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  user,
  activeRoute = '/',
  onNavigate,
}) => {
  return (
    <aside className="w-64 h-screen border-r-3 border-[#5C3D2E] bg-[#FFF8E7] flex flex-col justify-between shrink-0 select-none sticky top-0 left-0 z-30">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b-3 border-[#5C3D2E] bg-white/60 flex items-center justify-center">
          <a href="/" className="block focus:outline-hidden hover:opacity-90 transition-opacity">
            <img
              src="/brand-lockup.png"
              alt="AgroTrack"
              className="h-10 w-auto object-contain"
            />
          </a>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1.5" aria-label="Navegación principal">
          <p className="px-3 pt-3 pb-1 text-[11px] font-black uppercase tracking-wider text-[#5C3D2E]/60 font-baloo">
            Operaciones de Planta
          </p>

          {navItems.map((item) => {
            const isActive = activeRoute === item.route;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.route)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-baloo font-bold transition-all border-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#6FCF97] text-[#5C3D2E] border-[#5C3D2E] shadow-comic-sm translate-x-0.5'
                    : 'border-transparent text-[#5C3D2E]/80 hover:bg-[#6FCF97]/25 hover:border-[#5C3D2E]/30 hover:text-[#5C3D2E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isActive ? (
                    <span className="text-base animate-bounce" role="img" aria-label="Activo">
                      🌱
                    </span>
                  ) : (
                    <span className="text-base" role="img" aria-hidden="true">
                      {item.iconEmoji}
                    </span>
                  )}
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-extrabold rounded-full border border-[#5C3D2E] ${
                      isActive
                        ? 'bg-white text-[#5C3D2E]'
                        : 'bg-[#FFC94D] text-[#5C3D2E]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer (Single Source of Truth in Sidebar) */}
      <div className="p-3.5 border-t-3 border-[#5C3D2E] bg-white/70 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFC94D] border-2 border-[#5C3D2E] flex items-center justify-center font-black text-sm text-[#5C3D2E] shadow-comic-sm shrink-0">
            👩‍🌾
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-black text-[#5C3D2E] truncate font-baloo">
              {user.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-1.5 py-0.2 rounded-md bg-[#6FCF97] text-[#5C3D2E] border border-[#5C3D2E] font-black text-[9px] uppercase tracking-wider font-mono">
                {user.roles[0]}
              </span>
              <span className="text-[10px] font-mono text-[#5C3D2E]/70 truncate">
                {user.rut || '16.482.910-K'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
