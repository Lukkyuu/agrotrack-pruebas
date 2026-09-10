import React from 'react';
import { DeliveryStatus } from '../../types/agrotrack';

interface DeliveryStatusBadgeProps {
  readonly status: DeliveryStatus;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly showDot?: boolean;
  readonly className?: string;
}

export const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = false,
  className = '',
}) => {
  const config = {
    REGISTRADA: {
      label: 'Registrada',
      bgClass: 'bg-white text-[#5C3D2E]',
      dotClass: 'bg-slate-400',
    },
    RECIBIDA: {
      label: 'Recibida',
      bgClass: 'bg-[#FFC94D] text-[#5C3D2E]',
      dotClass: 'bg-[#5C3D2E]',
    },
    EN_CLASIFICACION: {
      label: 'En Clasificación',
      bgClass: 'bg-[#8ED8F8] text-[#5C3D2E]',
      dotClass: 'bg-blue-600',
    },
    EN_DESPACHO: {
      label: 'En Despacho',
      bgClass: 'bg-[#C8F0D9] text-[#3F9E67]',
      dotClass: 'bg-[#3F9E67]',
    },
    DESPACHADA: {
      label: 'Despachada',
      bgClass: 'bg-[#3F9E67] text-white',
      dotClass: 'bg-emerald-300',
    },
    RECHAZADA: {
      label: 'Rechazada',
      bgClass: 'bg-[#E8543E] text-white',
      dotClass: 'bg-rose-200',
    },
  }[status] || {
    label: status,
    bgClass: 'bg-white text-[#5C3D2E]',
    dotClass: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-[#5C3D2E] font-baloo font-bold whitespace-nowrap shadow-comic-sm ${sizeClasses} ${config.bgClass} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default DeliveryStatusBadge;
