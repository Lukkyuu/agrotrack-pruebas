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
      <div className="rounded-2xl border-3 border-[#5C3D2E] bg-white p-6 shadow-comic">
        <SkeletonLoader rows={4} />
      </div>
    );
  }

  const totalOcupadoKg = totalCapacidadKg - totalDisponibleKg;

  return (
    <div className="rounded-2xl border-3 border-[#5C3D2E] bg-white shadow-comic overflow-hidden">
      {/* Comic Panel Header */}
      <div className="bg-[#C8F0D9] border-b-3 border-[#5C3D2E] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-hidden="true">
            🏬
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-baloo font-extrabold text-[#5C3D2E] leading-tight">
              Capacidad de Acopio y Almacenaje
            </h2>
            <p className="text-xs font-semibold text-[#5C3D2E]/70 mt-0.5">
              Monitoreo en tiempo real de silos y cámaras de frío por variedad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 border-2 border-[#5C3D2E] px-3.5 py-1.5 rounded-xl shadow-comic-sm">
          <div className="text-left">
            <span className="text-[10px] font-baloo font-bold text-[#5C3D2E]/70 uppercase block">
              Ocupación
            </span>
            <span className="text-base font-baloo font-extrabold text-[#3F9E67]">
              {porcentajeOcupacion}%
            </span>
          </div>
          <div className="h-6 w-px bg-[#5C3D2E]/20" />
          <div className="text-left">
            <span className="text-[10px] font-baloo font-bold text-[#5C3D2E]/70 uppercase block">
              Libre Global
            </span>
            <span className="text-xs font-mono font-bold text-[#5C3D2E]">
              {totalDisponibleKg.toLocaleString()} kg
            </span>
          </div>
        </div>
      </div>

      {/* Global Progress Bar */}
      <div className="p-6 border-b-2 border-dashed border-[#5C3D2E]/20 bg-[#FFF8E7]/30">
        <CapacityProgressBar
          totalKg={totalCapacidadKg}
          availableKg={totalDisponibleKg}
          unit="kg"
          showDetails={true}
        />
        <div className="mt-2 flex items-center justify-between text-xs font-mono text-[#5C3D2E]/70 font-semibold">
          <span>Ocupado: <strong className="text-[#5C3D2E]">{totalOcupadoKg.toLocaleString()} kg</strong></span>
          <span>Capacidad Nominal: <strong className="text-[#5C3D2E]">{totalCapacidadKg.toLocaleString()} kg</strong></span>
        </div>
      </div>

      {/* Breakdown por producto */}
      <div className="p-6">
        <h3 className="text-xs font-baloo font-black uppercase tracking-wider text-[#5C3D2E]/70 mb-3">
          Desglose por Variedad en Catálogo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => {
            const dispPct = p.capacidadTotalKg > 0 ? (p.capacidadDisponibleKg / p.capacidadTotalKg) * 100 : 0;
            const isCritical = dispPct <= 15;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCritical
                    ? 'border-[#E8543E] bg-[#E8543E]/5 shadow-comic-sm'
                    : 'border-[#5C3D2E]/30 bg-[#FFF8E7]/40 hover:border-[#5C3D2E]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-baloo font-bold text-[#5C3D2E] truncate">
                    {p.nombre}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#5C3D2E]/30 text-[#5C3D2E] shrink-0 ml-2 font-bold">
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
                  <p className="mt-2 text-xs text-[#E8543E] font-baloo font-bold flex items-center gap-1.5">
                    <span>⚠️</span>
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
