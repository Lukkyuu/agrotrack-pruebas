import React, { useState, useMemo } from 'react';
import {
  Delivery,
  DeliveryStatus,
  AppRole,
  AuthUser,
  DashboardMetrics,
  DeliveryRequest,
} from '../types/agrotrack';
import { mockCurrentUser } from '../data/mockData';
import { useDeliveries } from '../hooks/useDeliveries';
import { useCatalog } from '../hooks/useCatalog';
import { useDeliveryTransition } from '../hooks/useDeliveryTransition';
import TopAppBar from '../components/layout/TopAppBar';
import SidebarNav from '../components/layout/SidebarNav';
import MetricSummaryCards from '../components/dashboard/MetricSummaryCards';
import WarehouseCapacityWidget from '../components/dashboard/WarehouseCapacityWidget';
import DeliveryPipelineFlow from '../components/dashboard/DeliveryPipelineFlow';
import RecentDeliveriesTable from '../components/dashboard/RecentDeliveriesTable';
import StatusTransitionModal from '../components/dashboard/StatusTransitionModal';
import NewDeliveryModal from '../components/dashboard/NewDeliveryModal';

interface DashboardPageProps {
  readonly initialUser?: AuthUser;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  initialUser = mockCurrentUser,
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser>(initialUser);
  const [activeNavRoute, setActiveNavRoute] = useState<string>('/');

  const {
    deliveries,
    filteredDeliveries,
    isLoading: isLoadingDeliveries,
    selectedStatus,
    searchQuery,
    setSelectedStatus,
    setSearchQuery,
    refetch: refetchDeliveries,
    updateDeliveryLocally,
  } = useDeliveries();

  const {
    products,
    isLoading: isLoadingCatalog,
    totalCapacidadKg,
    totalDisponibleKg,
    porcentajeOcupacion,
    refetch: refetchCatalog,
  } = useCatalog();

  const [activeDeliveryForTransition, setActiveDeliveryForTransition] = useState<Delivery | null>(null);
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState<boolean>(false);
  const [isCreatingDelivery, setIsCreatingDelivery] = useState<boolean>(false);

  const {
    isSubmitting: isSubmittingTransition,
    error: transitionError,
    successMessage,
    changeStatus,
    clearAlerts,
  } = useDeliveryTransition((id, nuevoEstado) => {
    updateDeliveryLocally(id, nuevoEstado);
  });

  const metrics: DashboardMetrics = useMemo(() => {
    const totalKilos = deliveries.reduce((acc, d) => acc + d.cantidadKg, 0);
    const activas = deliveries.filter(
      (d) => d.status !== 'DESPACHADA' && d.status !== 'RECHAZADA'
    ).length;
    const rechazadas = deliveries.filter((d) => d.status === 'RECHAZADA').length;
    const tasaRechazo =
      deliveries.length > 0 ? Math.round((rechazadas / deliveries.length) * 100) : 0;

    return {
      totalKilosHoy: totalKilos,
      entregasActivas: activas,
      capacidadOcupadaPorcentaje: porcentajeOcupacion,
      tasaRechazoPorcentaje: tasaRechazo,
    };
  }, [deliveries, porcentajeOcupacion]);

  const handleRoleSwitch = (newRole: AppRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      roles: [newRole],
    }));
  };

  const handleCreateDelivery = async (req: DeliveryRequest): Promise<boolean> => {
    setIsCreatingDelivery(true);
    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        await refetchDeliveries();
        return true;
      }
      return true;
    } catch {
      return true;
    } finally {
      setIsCreatingDelivery(false);
    }
  };

  const handleRefreshAll = async () => {
    await Promise.all([refetchDeliveries(), refetchCatalog()]);
  };

  const canCreateDelivery =
    currentUser.roles.includes('ADMIN') ||
    currentUser.roles.includes('OPERADOR') ||
    currentUser.roles.includes('PRODUCTOR');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Barra Superior */}
      <TopAppBar
        user={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onRefresh={handleRefreshAll}
        isRefreshing={isLoadingDeliveries || isLoadingCatalog}
      />

      {/* Layout de 2 columnas: Menú Lateral + Contenido Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Barra de Navegación Lateral con textura y menú */}
        <div className="hidden lg:block shrink-0">
          <SidebarNav
            user={currentUser}
            activeRoute={activeNavRoute}
            onNavigate={setActiveNavRoute}
            onRoleSwitch={handleRoleSwitch}
          />
        </div>

        {/* Contenedor de contenido scrollable */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Banner de Bienvenida con Mascota AgroTrack */}
          <div className="rounded-2xl border-2 border-[#5C3D2E]/20 bg-[#FFF8E7] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#6FCF97] border-2 border-[#5C3D2E] p-1 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="AgroTrack Tractor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#5C3D2E] tracking-tight">
                    ¡Hola, {currentUser.name.split(' ')[0]}! 👋
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#6FCF97] text-[#5C3D2E] border border-[#5C3D2E]/30 shadow-2xs">
                    Turno Activo
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C3D2E]/70 font-semibold mt-0.5">
                  Centro de Acopio en sincronía con el BFF (Spring Boot &amp; Azure AD)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {canCreateDelivery && (
                <button
                  type="button"
                  onClick={() => setIsNewDeliveryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-[#0D5C3A] hover:bg-[#09432A] shadow-sm border-2 border-[#5C3D2E]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="text-sm">📥</span>
                  Nueva Entrega (Romana)
                </button>
              )}
            </div>
          </div>

          {/* Notificaciones contextuales */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={clearAlerts}
                className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-bold"
              >
                Descartar
              </button>
            </div>
          )}

          {/* Bloque 1: Tarjetas de Resumen Numérico (KPIs) */}
          <MetricSummaryCards
            metrics={metrics}
            isLoading={isLoadingDeliveries || isLoadingCatalog}
          />

          {/* Bloque 2: Capacidad de Bodega por Silo/Producto */}
          <WarehouseCapacityWidget
            products={products}
            isLoading={isLoadingCatalog}
            totalCapacidadKg={totalCapacidadKg}
            totalDisponibleKg={totalDisponibleKg}
            porcentajeOcupacion={porcentajeOcupacion}
          />

          {/* Bloque 3: Stepper de Flujo Operativo y Pipeline de Estados */}
          <DeliveryPipelineFlow
            deliveries={deliveries}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
          />

          {/* Bloque 4: Tabla Central de Entregas con Búsqueda y Transición de Estados */}
          <RecentDeliveriesTable
            deliveries={filteredDeliveries}
            isLoading={isLoadingDeliveries}
            userRoles={currentUser.roles}
            onOpenTransitionModal={(del) => {
              clearAlerts();
              setActiveDeliveryForTransition(del);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </main>
      </div>

      {/* Modal de Transición de Estados de Lote */}
      <StatusTransitionModal
        delivery={activeDeliveryForTransition}
        isOpen={activeDeliveryForTransition !== null}
        isSubmitting={isSubmittingTransition}
        error={transitionError}
        onClose={() => setActiveDeliveryForTransition(null)}
        onConfirmTransition={changeStatus}
      />

      {/* Modal de Recepción de Nueva Entrega */}
      <NewDeliveryModal
        isOpen={isNewDeliveryModalOpen}
        products={products}
        isSubmitting={isCreatingDelivery}
        onClose={() => setIsNewDeliveryModalOpen(false)}
        onSubmit={handleCreateDelivery}
      />
    </div>
  );
};

export default DashboardPage;
