import React, { useState } from 'react';
import { Producto, DeliveryRequest } from '../../types/agrotrack';

interface NewDeliveryModalProps {
  readonly isOpen: boolean;
  readonly products: readonly Producto[];
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (request: DeliveryRequest) => Promise<boolean>;
}

export const NewDeliveryModal: React.FC<NewDeliveryModalProps> = ({
  isOpen,
  products,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [rut, setRut] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [productoId, setProductoId] = useState<number>(products[0]?.id || 1);
  const [cantidadKg, setCantidadKg] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedProduct = products.find((p) => p.id === productoId);
  const requestedKg = parseFloat(cantidadKg) || 0;
  const hasExceededCapacity = selectedProduct
    ? requestedKg > selectedProduct.capacidadDisponibleKg
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!rut.trim() || !nombre.trim()) {
      setFormError('Por favor complete el RUT y Nombre del productor.');
      return;
    }

    if (requestedKg <= 0) {
      setFormError('La cantidad en kg debe ser un valor positivo.');
      return;
    }

    if (hasExceededCapacity) {
      setFormError(
        `Capacidad insuficiente: El producto "${selectedProduct?.nombre}" solo tiene ${selectedProduct?.capacidadDisponibleKg.toLocaleString()} kg disponibles.`
      );
      return;
    }

    const payload: DeliveryRequest = {
      productorRut: rut.trim(),
      productorNombre: nombre.trim(),
      productoId: productoId,
      cantidadKg: requestedKg,
    };

    const success = await onSubmit(payload);
    if (success) {
      setRut('');
      setNombre('');
      setCantidadKg('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-delivery-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 id="new-delivery-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Recepción de Nueva Carga
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registrar pesaje inicial de entrega en romana (Estado: REGISTRADA)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          {/* Productor RUT */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              RUT del Productor Agrícola
            </label>
            <input
              type="text"
              required
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="Ej: 12.345.678-9"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Productor Nombre */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nombre / Razón Social del Productor
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Agrícola El Roble SpA"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Selector de Producto */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Variedad / Producto en Catálogo
            </label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (Disponible: {p.capacidadDisponibleKg.toLocaleString()} {p.unidad})
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad en kg */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Peso Neto Declarado (kg)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={cantidadKg}
              onChange={(e) => setCantidadKg(e.target.value)}
              placeholder="Ej: 3500"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
            />
            {selectedProduct && (
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Capacidad disponible en bodega para esta fruta:{' '}
                <strong className={hasExceededCapacity ? 'text-rose-500 font-mono' : 'text-emerald-600 font-mono'}>
                  {selectedProduct.capacidadDisponibleKg.toLocaleString()} kg
                </strong>
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasExceededCapacity}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting ? 'Registrando...' : 'Ingresar a Romana'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDeliveryModal;
