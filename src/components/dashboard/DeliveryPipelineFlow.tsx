import React from 'react';
import { Delivery, DeliveryStatus } from '../../types/agrotrack';
import { statusConfigMap } from '../../data/mockData';

interface DeliveryPipelineFlowProps {
  readonly deliveries: readonly Delivery[];
  readonly selectedStatus: DeliveryStatus | 'ALL';
  readonly onSelectStatus: (status: DeliveryStatus | 'ALL') => void;
}

const pipelineSteps: readonly DeliveryStatus[] = [
  'REGISTRADA',
  'RECIBIDA',
  'EN_CLASIFICACION',
  'EN_DESPACHO',
  'DESPACHADA',
];

export const DeliveryPipelineFlow: React.FC<DeliveryPipelineFlowProps> = ({
  deliveries,
  selectedStatus,
  onSelectStatus,
}) => {
  // Conteo de lotes por estado
  const countByStatus = deliveries.reduce<Record<DeliveryStatus, number>>(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    },
    {
      REGISTRADA: 0,
      RECIBIDA: 0,
      EN_CLASIFICACION: 0,
      EN_DESPACHO: 0,
      DESPACHADA: 0,
      RECHAZADA: 0,
    }
  );

  const rechazadaCount = countByStatus.RECHAZADA;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Flujo Operativo de Lotes (Máquina de Estados)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Haz clic en una etapa para filtrar los registros de la tabla inferior
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectStatus('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              selectedStatus === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Ver Todos ({deliveries.length})
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus('RECHAZADA')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedStatus === 'RECHAZADA'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Rechazados ({rechazadaCount})
          </button>
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1">
        {pipelineSteps.map((status, index) => {
          const config = statusConfigMap[status];
          const count = countByStatus[status] || 0;
          const isSelected = selectedStatus === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => onSelectStatus(status)}
              className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  0{index + 1}
                </span>
                <span className={`text-base font-bold font-mono ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                  {count}
                </span>
              </div>

              <div className="mt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {config.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1 mt-0.5">
                  {config.description}
                </span>
              </div>

              {/* Indicador de estado activo */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryPipelineFlow;
