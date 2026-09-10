import React from 'react';
import { DeliveryStatus } from '../../types/agrotrack';
import { statusConfigMap } from '../../data/mockData';

interface DeliveryStatusBadgeProps {
  readonly status: DeliveryStatus;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly showDot?: boolean;
  readonly className?: string;
}

export const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const config = statusConfigMap[status] || {
    label: status,
    colorClass: 'text-slate-600 dark:text-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
    dotClass: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${sizeClasses} ${config.bgClass} ${config.colorClass} ${className}`}
      title={`Estado: ${config.label}`}
    >
      {showDot && (
        <span
          className={`inline-block h-2 w-2 rounded-full ${config.dotClass} shrink-0 animate-pulse`}
          aria-hidden="true"
        />
      )}
      <span className="font-semibold tracking-wide">{config.label}</span>
    </span>
  );
};

export default DeliveryStatusBadge;
