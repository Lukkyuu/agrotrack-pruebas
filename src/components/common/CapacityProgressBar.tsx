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

  let statusColor = 'bg-[#6FCF97]';
  let badgeText = 'Normal';
  let badgeClass = 'bg-[#C8F0D9] text-[#3F9E67]';

  if (availablePercent <= 15) {
    statusColor = 'bg-[#E8543E]';
    badgeText = 'Crítico (<15%)';
    badgeClass = 'bg-[#E8543E] text-white animate-pulse';
  } else if (availablePercent <= 30) {
    statusColor = 'bg-[#FFC94D]';
    badgeText = 'Alerta (<30%)';
    badgeClass = 'bg-[#FFC94D] text-[#5C3D2E]';
  }

  return (
    <div className="w-full space-y-1.5">
      {showDetails && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-baloo">
          <span className="font-bold text-[#5C3D2E]">
            {usedPercent}% Ocupado
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#5C3D2E] font-mono ${badgeClass}`}>
              {badgeText}
            </span>
            <span className="text-[#5C3D2E]/70 font-mono text-xs">
              {availableKg.toLocaleString()} / {totalKg.toLocaleString()} {unit}
            </span>
          </div>
        </div>
      )}

      {/* Comic Progress Bar */}
      <div
        className={`w-full overflow-hidden rounded-full bg-white border-2 border-[#5C3D2E] shadow-comic-sm ${
          compact ? 'h-2.5' : 'h-3.5'
        }`}
        role="progressbar"
        aria-valuenow={usedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Ocupación de bodega: ${usedPercent}%`}
      >
        <div
          className={`h-full transition-all duration-500 rounded-full border-r border-[#5C3D2E] ${statusColor}`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityProgressBar;
