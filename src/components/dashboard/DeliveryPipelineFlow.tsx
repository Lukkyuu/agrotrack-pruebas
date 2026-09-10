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
    <div className="rounded-2xl border-3 border-[#5C3D2E] bg-white shadow-comic overflow-hidden">
      {/* Header */}
      <div className="bg-[#C8F0D9] border-b-3 border-[#5C3D2E] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-hidden="true">
            🔄
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-baloo font-extrabold text-[#5C3D2E] leading-tight">
              Flujo Operativo de Lotes (Máquina de Estados)
            </h2>
            <p className="text-xs font-semibold text-[#5C3D2E]/70 mt-0.5">
              Haz clic en una etapa para filtrar los registros de la tabla inferior
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-baloo font-extrabold border-2 border-[#5C3D2E] transition-all cursor-pointer ${
              selectedStatus === 'ALL'
                ? 'bg-[#3F9E67] text-white shadow-comic-sm -translate-y-0.5'
                : 'bg-white text-[#5C3D2E] hover:bg-[#6FCF97]/25'
            }`}
          >
            Ver Todos ({deliveries.length})
          </button>

          <button
            type="button"
            onClick={() => onSelectStatus('RECHAZADA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-baloo font-extrabold border-2 border-[#5C3D2E] transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatus === 'RECHAZADA'
                ? 'bg-[#E8543E] text-white shadow-comic-sm -translate-y-0.5'
                : 'bg-[#E8543E]/10 text-[#E8543E] hover:bg-[#E8543E]/20'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#E8543E]" />
            Rechazados ({rechazadaCount})
          </button>
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {pipelineSteps.map((status, index) => {
            const config = statusConfigMap[status];
            const count = countByStatus[status] || 0;
            const isSelected = selectedStatus === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => onSelectStatus(status)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-[#5C3D2E] bg-[#6FCF97] shadow-comic text-[#5C3D2E] -translate-y-1'
                    : 'border-[#5C3D2E]/30 bg-[#FFF8E7]/30 hover:border-[#5C3D2E] text-[#5C3D2E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-[#5C3D2E]/50">
                    0{index + 1}
                  </span>
                  <span className="text-xl font-baloo font-black text-[#5C3D2E]">
                    {count}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-xs font-baloo font-extrabold text-[#5C3D2E] block truncate">
                    {config.label}
                  </span>
                  <span className="text-[11px] text-[#5C3D2E]/70 block line-clamp-1 mt-0.5 font-medium">
                    {config.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPipelineFlow;
