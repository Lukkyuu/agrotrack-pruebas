import React from 'react';
import { DashboardMetrics } from '../../types/agrotrack';

interface MetricSummaryCardsProps {
  readonly metrics: DashboardMetrics;
  readonly isLoading?: boolean;
}

export const MetricSummaryCards: React.FC<MetricSummaryCardsProps> = ({
  metrics,
  isLoading = false,
}) => {
  const cards = [
    {
      title: 'Volumen Acopiado Hoy',
      value: `${metrics.totalKilosHoy.toLocaleString()} kg`,
      badge: '+12.5% vs ayer',
      badgeClass: 'bg-[#C8F0D9] text-[#3F9E67]',
      description: 'Pesaje total registrado en báscula de romana',
      emoji: '⚖️',
      colorBg: 'bg-[#FFF8E7]',
    },
    {
      title: 'Entregas Activas',
      value: metrics.entregasActivas.toString(),
      badge: 'En patio / cámara',
      badgeClass: 'bg-blue-100 text-blue-800',
      description: 'Lotes en registro, recepción o clasificación',
      emoji: '📦',
      colorBg: 'bg-blue-50/40',
    },
    {
      title: 'Ocupación de Bodega',
      value: `${metrics.capacidadOcupadaPorcentaje}%`,
      badge: metrics.capacidadOcupadaPorcentaje > 80 ? 'Capacidad Alta' : 'Operación Normal',
      badgeClass:
        metrics.capacidadOcupadaPorcentaje > 80
          ? 'bg-[#FFC94D] text-[#5C3D2E]'
          : 'bg-[#C8F0D9] text-[#3F9E67]',
      description: 'Capacidad acumulada en silos y cámaras frigoríficas',
      emoji: '🏬',
      colorBg: 'bg-[#FFF8E7]',
    },
    {
      title: 'Tasa de Rechazo Fitosanitario',
      value: `${metrics.tasaRechazoPorcentaje}%`,
      badge: metrics.tasaRechazoPorcentaje > 5 ? 'Atención Control' : 'Bajo Umbral',
      badgeClass:
        metrics.tasaRechazoPorcentaje > 5
          ? 'bg-[#E8543E] text-white'
          : 'bg-[#C8F0D9] text-[#3F9E67]',
      description: 'Lotes desviados por calibre o control fitosanitario',
      emoji: '⚠️',
      colorBg: 'bg-rose-50/40',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border-3 border-[#5C3D2E] bg-white p-5 shadow-comic animate-pulse space-y-3"
          >
            <div className="h-4 bg-slate-200 rounded-md w-1/2" />
            <div className="h-8 bg-slate-200 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 rounded-md w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Métricas clave de operación" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="rounded-2xl border-3 border-[#5C3D2E] bg-white p-5 shadow-comic hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-baloo font-extrabold uppercase tracking-wider text-[#5C3D2E]/70">
                {card.title}
              </span>
              <div className="w-9 h-9 rounded-full border-2 border-[#5C3D2E] bg-[#FFF8E7] flex items-center justify-center text-lg shadow-comic-sm shrink-0">
                {card.emoji}
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-baloo font-extrabold tracking-tight text-[#3F9E67]">
                {card.value}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t-2 border-dashed border-[#5C3D2E]/15 flex items-center justify-between">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border border-[#5C3D2E] font-mono ${card.badgeClass}`}>
              {card.badge}
            </span>
            <span className="text-[11px] text-[#5C3D2E]/60 truncate ml-2 font-medium">
              {card.description}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MetricSummaryCards;
