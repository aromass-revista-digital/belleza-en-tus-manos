// Types for BELLEZA EN TUS MANOS Platform

export type Role = 'admin' | 'revendedor' | 'cliente_publico';

export type UserStatus = 'pendiente' | 'activo' | 'suspendido' | 'baja';

export interface PointsHistoryItem {
  id: string;
  timestamp: string;
  type: 'acreditacion' | 'consumo' | 'ajuste' | 'devolucion';
  amount: number;
  balanceAfter: number;
  reason: string;
  adminId?: string;
  orderId?: string;
}

export interface PointsRulesConfig {
  enabled: boolean;
  pointsRequiredPerOrder: number; // Puntos requeridos para confirmar un pedido
  pointsEarnedPerThousandPesos: number; // Puntos acreditados por cada $1.000 vendidos
  initialWelcomePoints: number; // Puntos de bienvenida para nuevos revendedores
  lastConfiguredAt?: string;
  lastConfiguredBy?: string;
  notes?: string;
}

export interface ShippingRateConfig {
  pricePer10Km: number; // $4.300 por tramo de 10 km
  distributionCenterAddress: string;
  distributionCenterCoords: { lat: number; lng: number };
  lastConfiguredAt?: string;
}

export interface ShippingCalculation {
  distanceKm: number;
  tramos10Km: number;
  cost: number;
  isEstimated: boolean;
  requiresAdminReview?: boolean;
}

export interface User {
  id: string; // e.g. REV-2026-1042
  role: Role;
  fullName: string;
  dni: string;
  birthDate?: string;
  phone: string; // Internal, not exposed to other vendors
  whatsapp: string;
  email: string;
  province: string;
  locality: string;
  postalCode: string;
  street?: string;
  streetNumber?: string;
  floorApt?: string;
  neighborhood?: string; // Barrio
  fullAddress: string;
  references: string;
  authorizedReceiver: string;
  receiverPhone?: string;
  deliveryDaysAndHours: string; // e.g. "Lunes a Viernes 14:00 a 18:00"
  deliveryInstructions?: string;
  geolocation?: { lat: number; lng: number };
  status: UserStatus;
  trainingCompleted: boolean;
  trainingProgress: number; // 0 to 10
  createdAt: string;
  lastActivityAt: string; // Updated on valid activity, triggers auto-suspension after 4 months (120 days)
  inactivitySuspended?: boolean;
  pointsBalance: number;
  pointsHistory: PointsHistoryItem[];
  adminNotes?: string;
}

export type Brand = 'Natura' | 'AVON' | 'Otras';

export type ProductCategory = 
  | 'Perfumería'
  | 'Maquillaje'
  | 'Cuidado facial'
  | 'Cuidado corporal'
  | 'Higiene'
  | 'Cabello'
  | 'Hogar'
  | 'Regalos'
  | 'Ofertas';

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: Brand;
  category: ProductCategory;
  presentation: string; // e.g. "100 ml", "50 g", "Barra 3.5g"
  description: string;
  image: string;
  referencePrice: number; // P (costo mayorista de referencia) - Solo visible para Admin
  publicPrice: number;    // P * 1.30 (precio venta público)
  resellerGain: number;   // P * 0.10 (ganancia para el revendedor)
  distributorMargin: number; // P * 0.20 (margen neto distribuidora)
  distributorAmount: number; // P * 1.20 (importe a entregar a distribuidora)
  cycleId: string;
  inStock: boolean;
  isPromotion?: boolean;
  status: 'aprobado' | 'dudoso_revision' | 'borrador';
  uncertaintyReason?: string;
}

export type CycleStatus = 'borrador' | 'revision' | 'publicado' | 'cerrado';

export interface CommercialCycle {
  id: string;
  name: string; // e.g. "Ciclo 05 - Otoño Elegante"
  brand: Brand | 'Multimarca';
  startDate: string;
  endDate: string; // 15 days period
  status: CycleStatus;
  notes: string;
  catalogCount: number;
}

export interface OrderItem {
  productId: string;
  code: string;
  name: string;
  brand: Brand;
  presentation: string;
  quantity: number;
  unitReferencePrice?: number; // Only admin
  unitPublicPrice: number;     // Frozen price
  unitResellerGain: number;    // Frozen gain
  totalPublicPrice: number;
  totalResellerGain: number;
}

export type PaymentStatus = 
  | 'Pendiente'
  | 'Comprobante recibido'
  | 'En revisión'
  | 'Acreditado'
  | 'Rechazado'
  | 'Reembolso pendiente'
  | 'Reembolsado';

export type DeliveryStatus =
  | 'Confirmado'
  | 'Pago acreditado'
  | 'Compra consolidada'
  | 'Mercadería recibida'
  | 'En preparación'
  | 'Caja lista'
  | 'En reparto'
  | 'Entregado'
  | 'Entrega fallida'
  | 'Reprogramado';

export type PickingStatus =
  | 'Pendiente de picking'
  | 'En picking'
  | 'Caja completa'
  | 'Con faltantes / incidencias';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
}

export interface Order {
  id: string; // e.g. PED-2026-4019
  pickingNumber: string; // e.g. PICK-001 (Correlativo inmutable para preparación física)
  resellerId: string;
  resellerName: string;
  resellerPhone: string;
  cycleId: string;
  items: OrderItem[];
  totalPublicPrice: number;
  totalResellerGain: number;
  distributorAmountDue: number; // P * 1.20
  // Distance-based shipping
  shippingCost: number; // $4.300 per 10km block
  shippingDistanceKm: number;
  shippingTramos: number;
  totalWithShipping: number; // distributorAmountDue + shippingCost
  // Points
  pointsRequired: number;
  pointsDeducted: boolean;
  // Delivery location & picking organization
  deliveryAddress: string;
  locality: string;
  neighborhood?: string;
  deliveryZone: string; // e.g. "Zona Oeste - Castelar / Morón"
  deliverySchedule: string;
  authorizedReceiver: string;
  receiverPhone?: string;
  deliveryInstructions?: string;
  // Statuses
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string;
  paymentProofNotes?: string;
  paymentVerifiedAt?: string;
  paymentProofDestinationAdmin?: string; // "Diego" | "María" | "Ambos"
  deliveryStatus: DeliveryStatus;
  pickingStatus: PickingStatus;
  pickingCompletedAt?: string;
  deliveryNotes?: string;
  createdAt: string;
  confirmedAt?: string;
  history: AuditLogItem[];
}

export interface BoxPreparation {
  orderId: string;
  pickingNumber: string;
  resellerName: string;
  deliveryAddress: string;
  deliveryZone: string;
  phone: string;
  items: {
    productId: string;
    productName: string;
    code: string;
    quantity: number;
    prepared: boolean;
  }[];
  isComplete: boolean;
  boxLabelGenerated: boolean;
  specialExceptionAuthorized?: boolean;
}

export interface ConsolidatedPurchaseItem {
  code: string;
  name: string;
  brand: Brand;
  totalQuantity: number;
  orderBreakdown: { orderId: string; pickingNumber?: string; resellerName: string; quantity: number }[];
  unitWholesalePrice: number;
  totalWholesaleAmount: number;
  receivedQuantity?: number;
  missingQuantity?: number;
  damagedQuantity?: number;
  replacementNotes?: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  duration: string;
  category: string;
  summary: string;
  content: string[];
  tips: string[];
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: number;
}

export interface NaturaImportProductItem {
  code: string;
  name: string;
  presentation: string;
  category: ProductCategory;
  referencePrice: number;
  officialPhotoUrl?: string;
  discountPercent?: number;
  isPromotion?: boolean;
  uncertaintyReason?: string;
  status: 'aprobado' | 'dudoso_revision' | 'excluido';
}

export interface NaturaImportRecord {
  id: string; // e.g. NAT-IMP-2026-05
  sourceType: 'enlace_privado' | 'archivo_pdf';
  sourceReferencePrivate: string; // Private official Natura URL or PDF filename (STRICTLY PRIVATE TO ADMINS DIEGO & MARÍA)
  extractedMagazineName: string; // e.g. "Revista Natura Cosméticos Argentina"
  extractedCycleNumber: string; // e.g. "Ciclo 05/2026" (CRITICAL: extracted from magazine, NEVER invented)
  cycleDetectionConfidence: 'alta' | 'requiere_confirmacion_admin';
  validityStartDate: string;
  validityEndDate: string;
  importedAt: string;
  importedByAdminId: 'ADMIN-DIEGO' | 'ADMIN-MARIA';
  importedByAdminName: 'Diego' | 'María';
  approvedAt?: string;
  approvedByAdminId?: 'ADMIN-DIEGO' | 'ADMIN-MARIA';
  status: 'borrador_revision' | 'aprobado' | 'publicado' | 'archivado';
  productsCount: number;
  extractedProducts: NaturaImportProductItem[];
  adminNotes?: string;
}

