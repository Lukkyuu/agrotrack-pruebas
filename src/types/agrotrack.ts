/**
 * Tipos de dominio para AgroTrack
 * Sincronizados con los microservicios Spring Boot:
 * - ms-agrotrack-deliveries (Delivery, DeliveryStatus)
 * - ms-agrotrack-catalog (Producto)
 * - ms-agrotrack-bff (Roles y Autenticación Azure AD)
 */

export type DeliveryStatus =
  | 'REGISTRADA'
  | 'RECIBIDA'
  | 'EN_CLASIFICACION'
  | 'EN_DESPACHO'
  | 'DESPACHADA'
  | 'RECHAZADA';

/**
 * Matriz de transiciones válidas idéntica a DeliveryStatus.java
 * Regla de negocio crítica: no se puede saltar directo a EN_DESPACHO sin RECIBIDA
 */
export const VALID_TRANSITIONS: Readonly<Record<DeliveryStatus, readonly DeliveryStatus[]>> = {
  REGISTRADA: ['RECIBIDA', 'RECHAZADA'],
  RECIBIDA: ['EN_CLASIFICACION', 'RECHAZADA'],
  EN_CLASIFICACION: ['EN_DESPACHO', 'RECHAZADA'],
  EN_DESPACHO: ['DESPACHADA'],
  DESPACHADA: [],
  RECHAZADA: [],
};

export type AppRole = 'ADMIN' | 'OPERADOR' | 'PRODUCTOR' | 'AUDITOR';

export interface Delivery {
  readonly id: number;
  readonly productorRut: string;
  readonly productorNombre: string;
  readonly productoId: number;
  readonly productoNombre?: string;
  readonly cantidadKg: number;
  readonly status: DeliveryStatus;
  readonly fechaCreacion: string;
  readonly fechaUltimoCambio: string;
}

export interface Producto {
  readonly id: number;
  readonly nombre: string;
  readonly unidad: string; // ej: "kg", "caja"
  readonly capacidadTotalKg: number;
  readonly capacidadDisponibleKg: number;
}

export interface DeliveryRequest {
  readonly productorRut: string;
  readonly productorNombre: string;
  readonly productoId: number;
  readonly cantidadKg: number;
}

export interface DeliveryStatusUpdateRequest {
  readonly nuevoEstado: DeliveryStatus;
}

export interface AuthUser {
  readonly sub: string;
  readonly name: string;
  readonly email: string;
  readonly rut?: string;
  readonly roles: readonly AppRole[];
}

export interface DashboardMetrics {
  readonly totalKilosHoy: number;
  readonly entregasActivas: number;
  readonly capacidadOcupadaPorcentaje: number;
  readonly tasaRechazoPorcentaje: number;
}
