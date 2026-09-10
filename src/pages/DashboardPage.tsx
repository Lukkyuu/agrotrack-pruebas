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
    <div className="h-screen w-screen bg-[#FFF9EE] text-[#5C3D2E] flex overflow-hidden font-sans antialiased">
      {/* 1. Master Sidebar a la izquierda (Full height, sin duplicaciones) */}
      <div className="hidden lg:block shrink-0">
        <SidebarNav
          user={currentUser}
          activeRoute={activeNavRoute}
          onNavigate={setActiveNavRoute}
        />
      </div>

      {/* 2. Área de Contenido Principal a la derecha */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Barra Superior dedicada a Contexto, Rol Switcher y Acciones Rápidas */}
        <TopAppBar
          user={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onRefresh={handleRefreshAll}
          isRefreshing={isLoadingDeliveries || isLoadingCatalog}
          onOpenNewDelivery={() => setIsNewDeliveryModalOpen(true)}
        />

        {/* Contenedor con Scroll Suave del Dashboard */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Banner de Bienvenida Cálido (Inspirado en el mockup oficial) */}
          <div className="rounded-2xl border-3 border-[#5C3D2E] bg-white p-6 shadow-comic flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#FFC94D] border-3 border-[#5C3D2E] flex items-center justify-center text-3xl shadow-comic-sm shrink-0">
                👩‍🌾
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-baloo font-black text-[#5C3D2E] tracking-tight">
                    ¡Buenos días, {currentUser.name.split(' ')[0]}! 👋
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-baloo font-bold bg-[#C8F0D9] text-[#3F9E67] border border-[#5C3D2E] shadow-2xs">
                    Turno Activo
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C3D2E]/70 font-semibold mt-1">
                  Esto es lo que está pasando hoy en tu centro de acopio y romana
                </p>

                {/* Quick Status Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF8E7] border border-[#5C3D2E]/30 text-xs font-baloo font-bold text-[#5C3D2E]">
                    <span>📦</span>
                    <strong>{metrics.entregasActivas}</strong> lotes en patio
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF8E7] border border-[#5C3D2E]/30 text-xs font-baloo font-bold text-[#5C3D2E]">
                    <span>🏬</span>
                    <strong>{metrics.capacidadOcupadaPorcentaje}%</strong> capacidad usada
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF8E7] border border-[#5C3D2E]/30 text-xs font-baloo font-bold text-[#5C3D2E]">
                    <span>⚡</span>
                    Microservicios BFF en memoria
                  </span>
                </div>
              </div>
            </div>

            {/* Tractor Mascot Stamp (Desktop) */}
            <div className="hidden md:flex items-center shrink-0 pr-2">
              <div className="w-24 h-24 rounded-2xl bg-[#FFF8E7] border-2 border-[#5C3D2E] p-2 shadow-comic-sm flex items-center justify-center rotate-2 hover:rotate-0 transition-transform">
                <img
                  src="/logo.png"
                  alt="AgroTrack Mascot"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Notificaciones contextuales (Éxito o Advertencias de Transición) */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-[#C8F0D9] border-2 border-[#5C3D2E] text-xs font-baloo font-bold text-[#5C3D2E] shadow-comic-sm flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={clearAlerts}
                className="px-2 py-1 rounded-md bg-white border border-[#5C3D2E] text-xs text-[#5C3D2E] hover:bg-[#FFF8E7] font-black cursor-pointer"
              >
                Cerrar
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
