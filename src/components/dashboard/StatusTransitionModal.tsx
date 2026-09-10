import React, { useState } from 'react';
import { Delivery, DeliveryStatus, VALID_TRANSITIONS } from '../../types/agrotrack';
import DeliveryStatusBadge from '../common/DeliveryStatusBadge';
import { statusConfigMap } from '../../data/mockData';

interface StatusTransitionModalProps {
  readonly delivery: Delivery | null;
  readonly isOpen: boolean;
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly onClose: () => void;
  readonly onConfirmTransition: (
    deliveryId: number,
    currentStatus: DeliveryStatus,
    targetStatus: DeliveryStatus
  ) => Promise<boolean>;
}

export const StatusTransitionModal: React.FC<StatusTransitionModalProps> = ({
  delivery,
  isOpen,
  isSubmitting,
  error,
  onClose,
  onConfirmTransition,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<DeliveryStatus | null>(null);

  if (!isOpen || !delivery) return null;

  const validNextStates = VALID_TRANSITIONS[delivery.status] || [];
  const isTerminalState = validNextStates.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;

    const success = await onConfirmTransition(delivery.id, delivery.status, selectedTarget);
    if (success) {
      setSelectedTarget(null);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transition-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 id="transition-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Transición de Estado del Lote
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lote #{delivery.id} &bull; {delivery.productorNombre}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Card */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                Estado Actual en Planta
              </span>
              <div className="mt-1">
                <DeliveryStatusBadge status={delivery.status} size="md" />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                Carga Declarada
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {delivery.cantidadKg.toLocaleString()} kg
              </span>
            </div>
          </div>

          {/* Mensaje de Error (si el backend responde 409 Conflict) */}
          {error && (
            <div
              className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
              role="alert"
            >
              <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Selector de nuevo estado */}
          {isTerminalState ? (
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Este lote se encuentra en un estado terminal (<strong>{delivery.status}</strong>). No permite transiciones posteriores.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Selecciona la Siguiente Etapa Válida:
              </label>

              <div className="space-y-2">
                {validNextStates.map((nextStatus) => {
                  const config = statusConfigMap[nextStatus];
                  const isSelected = selectedTarget === nextStatus;
                  const isRejection = nextStatus === 'RECHAZADA';

                  return (
                    <label
                      key={nextStatus}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? isRejection
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-500/20'
                            : 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="nextStatus"
                        value={nextStatus}
                        checked={isSelected}
                        onChange={() => setSelectedTarget(nextStatus)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${isRejection ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-white'}`}>
                            {config.label}
                          </span>
                          <DeliveryStatusBadge status={nextStatus} size="sm" showDot={false} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {config.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Nota de negocio */}
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                Regla de negocio: La máquina de estados bloquea saltos directos a etapas no consecutivas (ej. no se puede saltar directo a despacho sin clasificar).
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            {!isTerminalState && (
              <button
                type="submit"
                disabled={!selectedTarget || isSubmitting}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                Confirmar Transición
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusTransitionModal;
