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
      badgeClass: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300',
      description: 'Total de fruta y hortalizas pesadas en romana',
      icon: (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      title: 'Entregas Activas',
      value: metrics.entregasActivas.toString(),
      badge: 'En patio / cámara',
      badgeClass: 'text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300',
      description: 'Lotes en estados Registrada, Recibida o Clasificación',
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Ocupación de Bodega',
      value: `${metrics.capacidadOcupadaPorcentaje}%`,
      badge: metrics.capacidadOcupadaPorcentaje > 80 ? 'Capacidad Alta' : 'Operación Normal',
      badgeClass:
        metrics.capacidadOcupadaPorcentaje > 80
          ? 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300'
          : 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300',
      description: 'Capacidad acumulada en los 4 silos/cámaras activas',
      icon: (
        <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Tasa de Rechazo Fitosanitario',
      value: `${metrics.tasaRechazoPorcentaje}%`,
      badge: metrics.tasaRechazoPorcentaje > 5 ? 'Atención Control' : 'Bajo Umbral',
      badgeClass:
        metrics.tasaRechazoPorcentaje > 5
          ? 'text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300'
          : 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300',
      description: 'Lotes rechazados por calibre, plaga o temperatura',
      icon: (
        <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm animate-pulse space-y-3"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
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
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow ring-1 ring-black/5 dark:ring-white/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
              {card.icon}
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {card.value}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.badgeClass}`}>
              {card.badge}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default MetricSummaryCards;
