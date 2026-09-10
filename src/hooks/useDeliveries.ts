import { useState, useEffect, useCallback, useMemo } from 'react';
import { Delivery, DeliveryStatus } from '../types/agrotrack';
import { mockDeliveries } from '../data/mockData';

export interface UseDeliveriesResult {
  readonly deliveries: readonly Delivery[];
  readonly filteredDeliveries: readonly Delivery[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly selectedStatus: DeliveryStatus | 'ALL';
  readonly searchQuery: string;
  readonly setSelectedStatus: (status: DeliveryStatus | 'ALL') => void;
  readonly setSearchQuery: (query: string) => void;
  readonly refetch: () => Promise<void>;
  readonly updateDeliveryLocally: (id: number, nuevoEstado: DeliveryStatus) => void;
}

/**
 * Hook para listar y filtrar entregas
 * Consume endpoint BFF: GET /api/deliveries?status={status}
 */
export function useDeliveries(initialStatus: DeliveryStatus | 'ALL' = 'ALL'): UseDeliveriesResult {
  const [deliveries, setDeliveries] = useState<readonly Delivery[]>(mockDeliveries);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | 'ALL'>(initialStatus);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Intenta conectar con el BFF en puerto 8080 si está arriba
      const url = selectedStatus === 'ALL'
        ? '/api/deliveries'
        : `/api/deliveries?status=${selectedStatus}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDeliveries(data);
      } else {
        // Fallback elegante a mockData cuando el backend se corre en local sin token
        setDeliveries(mockDeliveries);
      }
    } catch {
      // Fallback offline/mock
      setDeliveries(mockDeliveries);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const updateDeliveryLocally = useCallback((id: number, nuevoEstado: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nuevoEstado,
              fechaUltimoCambio: new Date().toISOString(),
            }
          : item
      )
    );
  }, []);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      const matchStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        d.productorNombre.toLowerCase().includes(query) ||
        d.productorRut.toLowerCase().includes(query) ||
        d.id.toString().includes(query) ||
        (d.productoNombre && d.productoNombre.toLowerCase().includes(query));
      return matchStatus && matchSearch;
    });
  }, [deliveries, selectedStatus, searchQuery]);

  return {
    deliveries,
    filteredDeliveries,
    isLoading,
    error,
    selectedStatus,
    searchQuery,
    setSelectedStatus,
    setSearchQuery,
    refetch: fetchDeliveries,
    updateDeliveryLocally,
  };
}
