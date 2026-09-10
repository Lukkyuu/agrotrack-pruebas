import { useState, useEffect, useCallback, useMemo } from 'react';
import { Producto } from '../types/agrotrack';
import { mockCatalogProducts } from '../data/mockData';

export interface UseCatalogResult {
  readonly products: readonly Producto[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly totalCapacidadKg: number;
  readonly totalDisponibleKg: number;
  readonly porcentajeOcupacion: number;
  readonly refetch: () => Promise<void>;
}

/**
 * Hook para catálogo de productos y capacidad de almacenamiento
 * Consume endpoint BFF: GET /api/catalog/products
 */
export function useCatalog(): UseCatalogResult {
  const [products, setProducts] = useState<readonly Producto[]>(mockCatalogProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/catalog/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setProducts(mockCatalogProducts);
      }
    } catch {
      setProducts(mockCatalogProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const { totalCapacidadKg, totalDisponibleKg, porcentajeOcupacion } = useMemo(() => {
    const totalCap = products.reduce((acc, p) => acc + p.capacidadTotalKg, 0);
    const totalDisp = products.reduce((acc, p) => acc + p.capacidadDisponibleKg, 0);
    const ocupado = totalCap - totalDisp;
    const porcentaje = totalCap > 0 ? Math.round((ocupado / totalCap) * 100) : 0;

    return {
      totalCapacidadKg: totalCap,
      totalDisponibleKg: totalDisp,
      porcentajeOcupacion: porcentaje,
    };
  }, [products]);

  return {
    products,
    isLoading,
    error,
    totalCapacidadKg,
    totalDisponibleKg,
    porcentajeOcupacion,
    refetch: fetchCatalog,
  };
}
