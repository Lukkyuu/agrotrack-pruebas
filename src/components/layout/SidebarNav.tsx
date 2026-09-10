import React from 'react';
import { AppRole, AuthUser } from '../../types/agrotrack';

interface SidebarNavProps {
  readonly user: AuthUser;
  readonly activeRoute?: string;
  readonly onNavigate?: (route: string) => void;
  readonly onRoleSwitch?: (role: AppRole) => void;
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
  { id: 'catalog', label: 'Catálogo', route: '/catalog', iconEmoji: '🌾' },
  { id: 'reports', label: 'Reportería', route: '/reports', iconEmoji: '📈' },
  { id: 'audit', label: 'Auditoría', route: '/audit', iconEmoji: '🔍' },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  user,
  activeRoute = '/',
  onNavigate,
  onRoleSwitch,
}) => {
  const allRoles: readonly AppRole[] = ['ADMIN', 'OPERADOR', 'PRODUCTOR', 'AUDITOR'];

  return (
    <aside
      className="w-64 min-h-screen border-r border-[#5C3D2E]/15 bg-[#FFF8E7] bg-cover bg-top bg-no-repeat flex flex-col justify-between shrink-0 shadow-sm"
      style={{ backgroundImage: "url('/sidebar-bg.png')" }}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#5C3D2E]/10 flex items-center justify-between">
          <a href="/" className="block focus:outline-hidden">
            <img
              src="/brand-lockup.png"
              alt="AgroTrack"
              className="h-9 w-auto object-contain drop-shadow-xs"
            />
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1" aria-label="Navegación principal">
          <p className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#5C3D2E]/60">
            Operaciones de Planta
          </p>

          {navItems.map((item) => {
            const isActive = activeRoute === item.route;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.route)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-[#6FCF97] text-[#5C3D2E] shadow-sm ring-2 ring-[#5C3D2E]/20'
                    : 'text-[#5C3D2E]/80 hover:bg-[#6FCF97]/25 hover:text-[#5C3D2E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Brote indicador de selección activa */}
                  {isActive ? (
                    <span className="text-sm scale-110" role="img" aria-label="Activo">
                      🌱
                    </span>
                  ) : (
                    <span className="text-sm opacity-80" role="img" aria-hidden="true">
                      {item.iconEmoji}
                    </span>
                  )}
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-black rounded-full ${
                      isActive
                        ? 'bg-[#FFF8E7] text-[#5C3D2E]'
                        : 'bg-[#5C3D2E]/10 text-[#5C3D2E]'
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

      {/* User & RBAC Switcher Footer */}
      <div className="p-3 border-t border-[#5C3D2E]/10 bg-white/70 backdrop-blur-xs space-y-2.5">
        {/* Selector de Rol Azure AD */}
        {onRoleSwitch && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#5C3D2E]/70 uppercase tracking-wider block">
              Simulador Rol (Azure AD)
            </span>
            <div className="grid grid-cols-2 gap-1">
              {allRoles.map((role) => {
                const isSelected = user.roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onRoleSwitch(role)}
                    className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tight transition-colors ${
                      isSelected
                        ? 'bg-[#0D5C3A] text-white shadow-xs'
                        : 'bg-[#5C3D2E]/5 text-[#5C3D2E]/80 hover:bg-[#5C3D2E]/10'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* User Card */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-8 h-8 rounded-full bg-[#FFC94D] border-2 border-[#5C3D2E] flex items-center justify-center font-black text-xs text-[#5C3D2E] shadow-xs">
            🚜
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-black text-[#5C3D2E] truncate">
              {user.name}
            </span>
            <span className="text-[10px] font-mono text-[#5C3D2E]/60 truncate">
              {user.rut || '16.482.910-K'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
