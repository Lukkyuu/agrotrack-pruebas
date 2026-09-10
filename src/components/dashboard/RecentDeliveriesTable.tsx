import React, { useState } from 'react';
import { Delivery, DeliveryStatus, AppRole } from '../../types/agrotrack';
import DeliveryStatusBadge from '../common/DeliveryStatusBadge';
import SkeletonLoader from '../common/SkeletonLoader';

interface RecentDeliveriesTableProps {
  readonly deliveries: readonly Delivery[];
  readonly isLoading?: boolean;
  readonly userRoles: readonly AppRole[];
  readonly onOpenTransitionModal: (delivery: Delivery) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
}

export const RecentDeliveriesTable: React.FC<RecentDeliveriesTableProps> = ({
  deliveries,
  isLoading = false,
  userRoles,
  onOpenTransitionModal,
  searchQuery,
  onSearchChange,
}) => {
  const [sortField, setSortField] = useState<'id' | 'cantidadKg' | 'fechaCreacion'>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const canUpdateStatus = userRoles.includes('ADMIN') || userRoles.includes('OPERADOR');

  const handleSort = (field: 'id' | 'cantidadKg' | 'fechaCreacion') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sorted = [...deliveries].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'id') cmp = a.id - b.id;
    if (sortField === 'cantidadKg') cmp = a.cantidadKg - b.cantidadKg;
    if (sortField === 'fechaCreacion') cmp = a.fechaCreacion.localeCompare(b.fechaCreacion);
    return sortAsc ? cmp : -cmp;
  });

  return (
    <div className="rounded-2xl border-3 border-[#5C3D2E] bg-white shadow-comic overflow-hidden">
      {/* Table Toolbar */}
      <div className="bg-[#C8F0D9] border-b-3 border-[#5C3D2E] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-hidden="true">
            📋
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-baloo font-extrabold text-[#5C3D2E] leading-tight">
              Registro de Entregas y Recepción
            </h2>
            <p className="text-xs font-semibold text-[#5C3D2E]/70 mt-0.5">
              Mostrando {deliveries.length} lotes monitoreados por el BFF en memoria
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por RUT, productor o ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border-2 border-[#5C3D2E] bg-white text-[#5C3D2E] placeholder-[#5C3D2E]/50 font-bold focus:outline-hidden shadow-comic-sm"
          />
          <svg
            className="w-4 h-4 text-[#5C3D2E] absolute left-3 top-2.5 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="p-6">
          <SkeletonLoader rows={5} type="table" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="p-12 text-center">
          <span className="text-4xl block mb-2" role="img" aria-hidden="true">
            🚜
          </span>
          <p className="text-sm font-baloo font-bold text-[#5C3D2E]">
            No se encontraron lotes con los criterios actuales
          </p>
          <p className="text-xs text-[#5C3D2E]/60 mt-1 font-medium">
            Intenta cambiar el filtro de estado o limpiar el buscador.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#5C3D2E]/20 bg-[#FFF8E7]/60 text-[11px] font-baloo font-extrabold uppercase tracking-wider text-[#5C3D2E]/80">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#5C3D2E]"
                >
                  <div className="flex items-center gap-1">
                    <span>Lote ID</span>
                    {sortField === 'id' && (sortAsc ? ' ▲' : ' ▼')}
                  </div>
                </th>
                <th className="py-3.5 px-4">Productor / RUT</th>
                <th className="py-3.5 px-4">Producto Agrícola</th>
                <th
                  onClick={() => handleSort('cantidadKg')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#5C3D2E] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Carga (kg)</span>
                    {sortField === 'cantidadKg' && (sortAsc ? ' ▲' : ' ▼')}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Estado Actual</th>
                <th
                  onClick={() => handleSort('fechaCreacion')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#5C3D2E]"
                >
                  <div className="flex items-center gap-1">
                    <span>Fecha Registro</span>
                    {sortField === 'fechaCreacion' && (sortAsc ? ' ▲' : ' ▼')}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-[#5C3D2E]/15 text-xs">
              {sorted.map((item) => {
                const isTerminal = item.status === 'DESPACHADA' || item.status === 'RECHAZADA';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FFF8E7]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-black text-[#5C3D2E]">
                      #{item.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-baloo font-bold text-[#5C3D2E] text-sm">
                        {item.productorNombre}
                      </div>
                      <div className="text-[11px] font-mono text-[#5C3D2E]/60">
                        {item.productorRut}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#5C3D2E] font-medium">
                      {item.productoNombre || `Producto #${item.productoId}`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-baloo font-black text-sm text-[#3F9E67]">
                      {item.cantidadKg.toLocaleString()} kg
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <DeliveryStatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[#5C3D2E]/70 font-mono text-[11px]">
                      {new Date(item.fechaCreacion).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canUpdateStatus && !isTerminal ? (
                        <button
                          type="button"
                          onClick={() => onOpenTransitionModal(item)}
                          className="px-3 py-1.5 text-xs font-baloo font-extrabold rounded-xl text-[#5C3D2E] bg-[#FFC94D] hover:bg-[#FFB703] border-2 border-[#5C3D2E] shadow-comic-sm transition-all cursor-pointer active:translate-y-0.5"
                        >
                          Avanzar Estado &rarr;
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#5C3D2E]/40 font-mono italic">
                          {isTerminal ? 'Completado' : 'Solo lectura'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentDeliveriesTable;
