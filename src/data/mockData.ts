import { Delivery, Producto, AuthUser, DeliveryStatus } from '../types/agrotrack';

export const mockCurrentUser: AuthUser = {
  sub: 'usr-92834710',
  name: 'Lian Vásquez',
  email: 'l.vasquez@agrotrack.cl',
  rut: '16.482.910-K',
  roles: ['OPERADOR', 'ADMIN'],
};

export const mockCatalogProducts: readonly Producto[] = [
  {
    id: 1,
    nombre: 'Manzana Fuji (Exportación)',
    unidad: 'kg',
    capacidadTotalKg: 50000,
    capacidadDisponibleKg: 18500,
  },
  {
    id: 2,
    nombre: 'Pera Williams (Agroindustria)',
    unidad: 'kg',
    capacidadTotalKg: 35000,
    capacidadDisponibleKg: 4200, // Crítico (<15%)
  },
  {
    id: 3,
    nombre: 'Uva Red Globe (Mesa)',
    unidad: 'kg',
    capacidadTotalKg: 40000,
    capacidadDisponibleKg: 29000,
  },
  {
    id: 4,
    nombre: 'Cereza Bing (Cámara Frío 1)',
    unidad: 'kg',
    capacidadTotalKg: 20000,
    capacidadDisponibleKg: 14600,
  },
];

export const mockDeliveries: readonly Delivery[] = [
  {
    id: 101,
    productorRut: '12.345.678-9',
    productorNombre: 'Agrícola Los Olivos Spa',
    productoId: 1,
    productoNombre: 'Manzana Fuji (Exportación)',
    cantidadKg: 4200,
    status: 'REGISTRADA',
    fechaCreacion: '2026-09-10T14:15:00',
    fechaUltimoCambio: '2026-09-10T14:15:00',
  },
  {
    id: 102,
    productorRut: '15.890.123-4',
    productorNombre: 'Frutícola El Valle Limitada',
    productoId: 2,
    productoNombre: 'Pera Williams (Agroindustria)',
    cantidadKg: 3100,
    status: 'RECIBIDA',
    fechaCreacion: '2026-09-10T13:40:00',
    fechaUltimoCambio: '2026-09-10T14:05:22',
  },
  {
    id: 103,
    productorRut: '09.765.432-1',
    productorNombre: 'Cooperativa Campesina Cachapoal',
    productoId: 3,
    productoNombre: 'Uva Red Globe (Mesa)',
    cantidadKg: 5800,
    status: 'EN_CLASIFICACION',
    fechaCreacion: '2026-09-10T11:20:00',
    fechaUltimoCambio: '2026-09-10T13:10:45',
  },
  {
    id: 104,
    productorRut: '14.234.567-8',
    productorNombre: 'Hacienda Curicó Sur',
    productoId: 4,
    productoNombre: 'Cereza Bing (Cámara Frío 1)',
    cantidadKg: 1800,
    status: 'EN_DESPACHO',
    fechaCreacion: '2026-09-10T09:10:00',
    fechaUltimoCambio: '2026-09-10T14:20:00',
  },
  {
    id: 105,
    productorRut: '18.456.789-0',
    productorNombre: 'Fundo San Francisco',
    productoId: 1,
    productoNombre: 'Manzana Fuji (Exportación)',
    cantidadKg: 6500,
    status: 'DESPACHADA',
    fechaCreacion: '2026-09-10T08:00:00',
    fechaUltimoCambio: '2026-09-10T12:30:10',
  },
  {
    id: 106,
    productorRut: '11.222.333-4',
    productorNombre: 'Agrícola San Pedro',
    productoId: 2,
    productoNombre: 'Pera Williams (Agroindustria)',
    cantidadKg: 2200,
    status: 'RECHAZADA',
    fechaCreacion: '2026-09-10T07:45:00',
    fechaUltimoCambio: '2026-09-10T08:15:30',
  },
];

export const statusConfigMap: Readonly<
  Record<
    DeliveryStatus,
    {
      label: string;
      colorClass: string;
      bgClass: string;
      dotClass: string;
      description: string;
    }
  >
> = {
  REGISTRADA: {
    label: 'Registrada',
    colorClass: 'text-slate-700 dark:text-slate-300',
    bgClass: 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700',
    dotClass: 'bg-slate-400',
    description: 'Camión en portería / esperando entrada a báscula de pesaje.',
  },
  RECIBIDA: {
    label: 'Recibida',
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
    dotClass: 'bg-amber-500',
    description: 'Ingresada a patio de acopio y descontada de la capacidad del silo.',
  },
  EN_CLASIFICACION: {
    label: 'En Clasificación',
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800',
    dotClass: 'bg-blue-500',
    description: 'Muestreo de calidad, calibración por calibre y dulzor (Brix).',
  },
  EN_DESPACHO: {
    label: 'En Despacho',
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800',
    dotClass: 'bg-purple-500',
    description: 'Carga paletizada asignada a rampla o camión de distribución.',
  },
  DESPACHADA: {
    label: 'Despachada',
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
    description: 'Carga despachada exitosamente con guía de despacho timbrada.',
  },
  RECHAZADA: {
    label: 'Rechazada',
    colorClass: 'text-rose-700 dark:text-rose-300',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
    dotClass: 'bg-rose-500',
    description: 'Rechazada por control de calidad fitosanitario o rotura de cadena de frío.',
  },
};
