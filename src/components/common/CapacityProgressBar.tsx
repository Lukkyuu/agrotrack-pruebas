import React from 'react';

interface CapacityProgressBarProps {
  readonly totalKg: number;
  readonly availableKg: number;
  readonly unit?: string;
  readonly showDetails?: boolean;
  readonly compact?: boolean;
}

export const CapacityProgressBar: React.FC<CapacityProgressBarProps> = ({
  totalKg,
  availableKg,
  unit = 'kg',
  showDetails = true,
  compact = false,
}) => {
  const usedKg = Math.max(0, totalKg - availableKg);
  const usedPercent = totalKg > 0 ? Math.min(100, Math.round((usedKg / totalKg) * 100)) : 0;
  const availablePercent = 100 - usedPercent;

  // Estado de advertencia según la disponibilidad
  let statusColor = 'bg-emerald-500 dark:bg-emerald-400';
  let badgeText = 'Normal';
  let badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

  if (availablePercent <= 15) {
    statusColor = 'bg-rose-500 dark:bg-rose-400';
    badgeText = 'Crítico (<15%)';
    badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse';
  } else if (availablePercent <= 30) {
    statusColor = 'bg-amber-500 dark:bg-amber-400';
    badgeText = 'Alerta (<30%)';
    badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  }

  return (
    <div className="w-full space-y-1.5">
      {showDetails && (
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {usedPercent}% Ocupado
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
              {badgeText}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              {availableKg.toLocaleString()} / {totalKg.toLocaleString()} {unit}
            </span>
          </div>
        </div>
      )}

      {/* Barra de progreso */}
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${
          compact ? 'h-2' : 'h-3'
        }`}
        role="progressbar"
        aria-valuenow={usedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Ocupación de bodega: ${usedPercent}%`}
      >
        <div
          className={`h-full transition-all duration-500 rounded-full ${statusColor}`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityProgressBar;
