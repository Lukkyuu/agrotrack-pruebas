import React from 'react';
import { Producto } from '../../types/agrotrack';
import CapacityProgressBar from '../common/CapacityProgressBar';
import SkeletonLoader from '../common/SkeletonLoader';

interface WarehouseCapacityWidgetProps {
  readonly products: readonly Producto[];
  readonly isLoading?: boolean;
  readonly totalCapacidadKg: number;
  readonly totalDisponibleKg: number;
  readonly porcentajeOcupacion: number;
}

export const WarehouseCapacityWidget: React.FC<WarehouseCapacityWidgetProps> = ({
  products,
  isLoading = false,
  totalCapacidadKg,
  totalDisponibleKg,
  porcentajeOcupacion,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <SkeletonLoader rows={4} />
      </div>
    );
  }

  const totalOcupadoKg = totalCapacidadKg - totalDisponibleKg;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Capacidad de Acopio y Almacenaje
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoreo en tiempo real de silos y cámaras frías por variedad
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Ocupación Total
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
              {porcentajeOcupacion}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Disponible Global
            </span>
            <span className="text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400">
              {totalDisponibleKg.toLocaleString()} kg
            </span>
          </div>
        </div>
      </div>

      {/* Global Progress */}
      <div className="py-4 border-b border-slate-100 dark:border-slate-800">
        <CapacityProgressBar
          totalKg={totalCapacidadKg}
          availableKg={totalDisponibleKg}
          unit="kg"
          showDetails={true}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Ocupado: <strong className="font-mono text-slate-800 dark:text-slate-200">{totalOcupadoKg.toLocaleString()} kg</strong></span>
          <span>Capacidad Nominal: <strong className="font-mono text-slate-800 dark:text-slate-200">{totalCapacidadKg.toLocaleString()} kg</strong></span>
        </div>
      </div>

      {/* Breakdown por producto */}
      <div className="mt-4 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Desglose por Categoría de Producto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => {
            const dispPct = p.capacidadTotalKg > 0 ? (p.capacidadDisponibleKg / p.capacidadTotalKg) * 100 : 0;
            const isCritical = dispPct <= 15;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isCritical
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {p.nombre}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                    ID #{p.id}
                  </span>
                </div>

                <CapacityProgressBar
                  totalKg={p.capacidadTotalKg}
                  availableKg={p.capacidadDisponibleKg}
                  unit={p.unidad}
                  compact={true}
                  showDetails={true}
                />

                {isCritical && (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Alerta de sobrecupo inminente para nuevas recepciones
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WarehouseCapacityWidget;
