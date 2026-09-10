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

  // Permiso para cambiar estado: ADMIN u OPERADOR
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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Registro de Entregas y Recepción
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mostrando {deliveries.length} lotes monitoreados por el BFF
          </p>
        </div>

        {/* Input de Búsqueda */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por RUT, productor o ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No se encontraron lotes con los criterios actuales
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Intenta cambiar el filtro de estado o borrar el texto de búsqueda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Lote ID</span>
                    {sortField === 'id' && (sortAsc ? ' ▲' : ' ▼')}
                  </div>
                </th>
                <th className="py-3 px-4">Productor / RUT</th>
                <th className="py-3 px-4">Producto Agrícola</th>
                <th
                  onClick={() => handleSort('cantidadKg')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Carga (kg)</span>
                    {sortField === 'cantidadKg' && (sortAsc ? ' ▲' : ' ▼')}
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Estado Actual</th>
                <th
                  onClick={() => handleSort('fechaCreacion')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Fecha Registro</span>
                    {sortField === 'fechaCreacion' && (sortAsc ? ' ▲' : ' ▼')}
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {sorted.map((item) => {
                const isTerminal = item.status === 'DESPACHADA' || item.status === 'RECHAZADA';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{item.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.productorNombre}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {item.productorRut}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {item.productoNombre || `Producto #${item.productoId}`}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {item.cantidadKg.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <DeliveryStatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(item.fechaCreacion).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canUpdateStatus && !isTerminal ? (
                        <button
                          type="button"
                          onClick={() => onOpenTransitionModal(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
                        >
                          Avanzar Estado &rarr;
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {isTerminal ? 'Finalizado' : 'Solo lectura'}
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
