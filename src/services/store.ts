import { 
  User, Product, CommercialCycle, Order, OrderItem, 
  PaymentStatus, DeliveryStatus, PickingStatus, AuditLogItem, 
  BoxPreparation, ConsolidatedPurchaseItem, PointsRulesConfig,
  ShippingRateConfig, ShippingCalculation
} from '../types';
import { calculatePrices } from './pricingEngine';

const STORAGE_KEYS = {
  USERS: 'bem_users_v2',
  CURRENT_USER: 'bem_current_user_v2',
  PRODUCTS: 'bem_products_v2',
  CYCLES: 'bem_cycles_v2',
  ORDERS: 'bem_orders_v2',
  CART: 'bem_cart_v2',
  AUDIT_LOGS: 'bem_audit_logs_v2',
  BANK_INFO: 'bem_bank_info_v2',
  PDF_JOBS: 'bem_pdf_jobs_v2',
  POINTS_RULES: 'bem_points_rules_v2',
  SHIPPING_CONFIG: 'bem_shipping_config_v2'
};

// Two Principal Administrators
export const ADMIN_CONTACTS = [
  {
    id: 'ADMIN-DIEGO',
    name: 'Diego',
    roleTitle: 'Administrador Principal',
    phone: '1133868669', // Strictly internal for API routing
    fullPhoneInt: '5491133868669'
  },
  {
    id: 'ADMIN-MARIA',
    name: 'María',
    roleTitle: 'Administradora Principal',
    phone: '1170833071', // Strictly internal for API routing
    fullPhoneInt: '5491170833071'
  }
];

// Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'ADMIN-DIEGO',
    role: 'admin',
    fullName: 'Diego (Administrador)',
    dni: '28.450.912',
    phone: '1133868669',
    whatsapp: '1133868669',
    email: 'diego@bellezaentusmanos.com.ar',
    province: 'Buenos Aires',
    locality: 'Morón',
    postalCode: '1708',
    street: 'Av. Rivadavia',
    streetNumber: '17400',
    floorApt: 'Piso 3',
    neighborhood: 'Centro Morón',
    fullAddress: 'Av. Rivadavia 17400, Piso 3',
    references: 'Sede Central Distribuidora',
    authorizedReceiver: 'Gerencia General',
    deliveryDaysAndHours: 'Lunes a Viernes 09:00 a 18:00',
    status: 'activo',
    trainingCompleted: true,
    trainingProgress: 10,
    createdAt: '2026-01-10T10:00:00Z',
    lastActivityAt: new Date().toISOString(),
    pointsBalance: 1000,
    pointsHistory: []
  },
  {
    id: 'ADMIN-MARIA',
    role: 'admin',
    fullName: 'María (Administradora)',
    dni: '29.771.304',
    phone: '1170833071',
    whatsapp: '1170833071',
    email: 'maria@bellezaentusmanos.com.ar',
    province: 'Buenos Aires',
    locality: 'Morón',
    postalCode: '1708',
    street: 'Av. Rivadavia',
    streetNumber: '17400',
    floorApt: 'Piso 3',
    neighborhood: 'Centro Morón',
    fullAddress: 'Av. Rivadavia 17400, Piso 3',
    references: 'Sede Central Distribuidora',
    authorizedReceiver: 'Gerencia General',
    deliveryDaysAndHours: 'Lunes a Viernes 09:00 a 18:00',
    status: 'activo',
    trainingCompleted: true,
    trainingProgress: 10,
    createdAt: '2026-01-10T10:00:00Z',
    lastActivityAt: new Date().toISOString(),
    pointsBalance: 1000,
    pointsHistory: []
  },
  {
    id: 'REV-2026-1042',
    role: 'revendedor',
    fullName: 'Mariana González',
    dni: '35.882.104',
    birthDate: '1990-05-14',
    phone: '+54 11 6542-8819',
    whatsapp: '+54 9 11 6542-8819',
    email: 'mariana.revendedora@gmail.com',
    province: 'Buenos Aires',
    locality: 'Castelar',
    postalCode: '1712',
    street: 'Calle Bartolomé Mitre',
    streetNumber: '2340',
    floorApt: '',
    neighborhood: 'Castelar Sur',
    fullAddress: 'Calle Bartolomé Mitre 2340, Castelar',
    references: 'Casa de rejas blancas, frente a la plaza',
    authorizedReceiver: 'Lucas González (Hermano)',
    receiverPhone: '+54 11 4410-9921',
    deliveryDaysAndHours: 'Martes y Jueves 14:00 a 18:00',
    deliveryInstructions: 'Tocar timbre largo. Si no atiende, dejar con el encargado del local de enfrente.',
    geolocation: { lat: -34.6612, lng: -58.6385 },
    status: 'activo',
    trainingCompleted: true,
    trainingProgress: 10,
    createdAt: '2026-02-01T14:30:00Z',
    lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    pointsBalance: 85,
    pointsHistory: [
      {
        id: 'PTS-INIT-01',
        timestamp: '2026-02-01T14:30:00Z',
        type: 'acreditacion',
        amount: 50,
        balanceAfter: 50,
        reason: 'Puntos de bienvenida por registro'
      },
      {
        id: 'PTS-INIT-02',
        timestamp: '2026-02-15T11:00:00Z',
        type: 'acreditacion',
        amount: 35,
        balanceAfter: 85,
        reason: 'Acreditación por ventas acumuladas Ciclo 04'
      }
    ]
  },
  {
    id: 'REV-2026-1043',
    role: 'revendedor',
    fullName: 'Camila Benítez',
    dni: '39.401.882',
    birthDate: '1995-10-22',
    phone: '+54 11 5510-9923',
    whatsapp: '+54 9 11 5510-9923',
    email: 'camila.belleza@hotmail.com',
    province: 'Buenos Aires',
    locality: 'Ituzaingó',
    postalCode: '1714',
    street: 'Soler',
    streetNumber: '840',
    floorApt: 'Depto 2B',
    neighborhood: 'Ituzaingó Norte',
    fullAddress: 'Soler 840, Depto 2B, Ituzaingó',
    references: 'Timbre 2B, portón negro',
    authorizedReceiver: 'Camila Benítez',
    receiverPhone: '+54 11 5510-9923',
    deliveryDaysAndHours: 'Lunes a Viernes 16:00 a 20:00',
    deliveryInstructions: 'Llamar antes de llegar al celular',
    geolocation: { lat: -34.6582, lng: -58.6721 },
    status: 'pendiente',
    trainingCompleted: false,
    trainingProgress: 3,
    createdAt: '2026-11-05T09:15:00Z',
    lastActivityAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    pointsBalance: 50,
    pointsHistory: [
      {
        id: 'PTS-INIT-03',
        timestamp: '2026-11-05T09:15:00Z',
        type: 'acreditacion',
        amount: 50,
        balanceAfter: 50,
        reason: 'Puntos de bienvenida por registro inicial'
      }
    ]
  },
  // Inactive reseller sample for testing the 4-month rule
  {
    id: 'REV-2026-1044',
    role: 'revendedor',
    fullName: 'Verónica Albarracín (Inactiva)',
    dni: '32.110.450',
    birthDate: '1987-03-11',
    phone: '+54 11 4402-1190',
    whatsapp: '+54 9 11 4402-1190',
    email: 'veronica.albarracin@gmail.com',
    province: 'Buenos Aires',
    locality: 'Merlo',
    postalCode: '1722',
    street: 'Av. Libertador',
    streetNumber: '450',
    fullAddress: 'Av. Libertador 450, Merlo',
    references: 'Frente a la estación',
    authorizedReceiver: 'Verónica Albarracín',
    deliveryDaysAndHours: 'Sábados 09:00 a 13:00',
    status: 'suspendido',
    inactivitySuspended: true,
    trainingCompleted: true,
    trainingProgress: 10,
    createdAt: '2025-10-01T10:00:00Z',
    lastActivityAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(), // > 120 days ago (4 months)
    pointsBalance: 20,
    pointsHistory: []
  }
];

// Seed Cycles
const INITIAL_CYCLES: CommercialCycle[] = [
  {
    id: 'CICLO-2026-05',
    name: 'Ciclo 05 (Otoño-Invierno)',
    brand: 'Multimarca',
    startDate: '2026-11-01',
    endDate: '2026-11-15',
    status: 'publicado',
    notes: 'Ciclo comercial vigente de 15 días con promociones especiales de día de la madre y perfumes.',
    catalogCount: 2
  },
  {
    id: 'CICLO-2026-04',
    name: 'Ciclo 04 (Lanzamientos)',
    brand: 'Multimarca',
    startDate: '2026-10-16',
    endDate: '2026-10-31',
    status: 'cerrado',
    notes: 'Ciclo finalizado. Pedidos consolidados y entregas concluidas al 100%.',
    catalogCount: 2
  }
];

// Helper to create products with exact formula
function makeProduct(
  id: string,
  code: string,
  name: string,
  brand: 'Natura' | 'AVON',
  category: any,
  presentation: string,
  referencePrice: number,
  description: string,
  image: string,
  options: { isPromotion?: boolean; status?: 'aprobado' | 'dudoso_revision'; uncertaintyReason?: string } = {}
): Product {
  const prices = calculatePrices(referencePrice);
  return {
    id,
    code,
    name,
    brand,
    category,
    presentation,
    description,
    image,
    referencePrice: prices.referencePrice,
    publicPrice: prices.publicPrice,
    resellerGain: prices.resellerGain,
    distributorMargin: prices.distributorMargin,
    distributorAmount: prices.distributorAmount,
    cycleId: 'CICLO-2026-05',
    inStock: true,
    isPromotion: options.isPromotion || false,
    status: options.status || 'aprobado',
    uncertaintyReason: options.uncertaintyReason
  };
}

const INITIAL_PRODUCTS: Product[] = [
  makeProduct('PROD-001', 'NAT-7281', 'Kaiak Clásico Eau de Toilette Masculino', 'Natura', 'Perfumería', 'Frasco 100 ml', 18000, 'Aromático acuoso con notas de bergamota, albahaca y musgo. La fragancia emblemática de máxima frescura y fijación.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80', { isPromotion: true }),
  makeProduct('PROD-002', 'NAT-8190', 'Essencial Exclusivo Eau de Parfum Femenino', 'Natura', 'Perfumería', 'Frasco 100 ml', 24000, 'Floral envolvente con notas de magnolia, cassis y ámbar. Sofisticación y elegancia duradera para momentos inolvidables.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-003', 'NAT-3412', 'Chronos Suero Reductor de Arrugas Intensivo', 'Natura', 'Cuidado facial', 'Dosificador 30 ml', 16500, 'Tratamiento intensivo con triple ácido hialurónico y prebiótico de jatobá. Rellena arrugas profundas en 14 días.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-004', 'NAT-9902', 'Tododia Crema Corporal Nutritiva Nuez Pecán y Cacao', 'Natura', 'Cuidado corporal', 'Pote 400 ml', 8200, 'Fórmula prebiótica inteligente que se adapta a las necesidades de tu piel, dejándola 4 veces más hidratada.', 'https://images.unsplash.com/photo-1608248597359-3e34b9d5a624?auto=format&fit=crop&w=600&q=80', { isPromotion: true }),
  makeProduct('PROD-005', 'NAT-4120', 'Ekos Pulpa Hidratante de Manos Castaña', 'Natura', 'Cuidado corporal', 'Tubo 75 g', 5500, 'Nutrición profunda antirrozaduras con óleo bruto de castaña de la Amazonia. Piel sedosa y uñas fortalecidas.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-006', 'AVN-1104', 'Far Away Glamour Eau de Parfum', 'AVON', 'Perfumería', 'Frasco 50 ml', 14500, 'Oriental amaderado con grosella negra, flor de naranja de Madagascar y almizcle negro. El glamour en tu piel.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-007', 'AVN-3290', 'Anew Renewal Power Sérum Facial con Protinol™', 'AVON', 'Cuidado facial', 'Gotero 30 ml', 15800, 'Tecnología galardonada de Protinol™ que ayuda a restaurar el colágeno dual para una piel notablemente más firme.', 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', { isPromotion: true }),
  makeProduct('PROD-008', 'AVN-5402', 'Power Stay Labial Líquido Mate 16 Horas', 'AVON', 'Maquillaje', 'Tubo con aplicador 7 ml', 6200, 'Color mate intransferible de larga duración que no se corre ni se cuartea durante todo el día. Tono Resilient Red.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-009', 'AVN-7731', 'Encanto Loción Corporal Seda y Algodón', 'AVON', 'Cuidado corporal', 'Dosificador 400 ml', 7400, 'Fragancia suave y textura aterciopelada de rápida absorción con aceites preciosos que hidratan por 48 horas.', 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-010', 'NAT-5561', 'Humor Propio Eau de Toilette Femenino', 'Natura', 'Perfumería', 'Frasco 75 ml', 17200, 'Dulce frutal con cereza en almíbar, ámbar y vainilla. Una explosión de alegría y frescura contagiosa.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-011', 'NAT-9040', 'Shampoo Lumina Reparación de Cabello Dañado', 'Natura', 'Cabello', 'Envase 300 ml', 5900, 'Biotecnología pró-teia para la reconstrucción profunda de hebras quebradizas o químicamente tratadas.', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'),
  makeProduct('PROD-012', 'AVN-8812', 'Máscara de Pestañas Legendary Extension', 'AVON', 'Maquillaje', 'Tubo 10 g', 6800, 'Fórmula con polímeros alargadores que extienden las pestañas hasta un 50% más sin grumos.', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80')
];

// Initial Order with Picking Number PICK-001
const INITIAL_ORDERS: Order[] = [
  {
    id: 'PED-2026-4019',
    pickingNumber: 'PICK-001',
    resellerId: 'REV-2026-1042',
    resellerName: 'Mariana González',
    resellerPhone: '+54 11 6542-8819',
    cycleId: 'CICLO-2026-05',
    items: [
      {
        productId: 'PROD-001',
        code: 'NAT-7281',
        name: 'Kaiak Clásico Eau de Toilette Masculino',
        brand: 'Natura',
        presentation: 'Frasco 100 ml',
        quantity: 2,
        unitReferencePrice: 18000,
        unitPublicPrice: 23400,
        unitResellerGain: 1800,
        totalPublicPrice: 46800,
        totalResellerGain: 3600
      },
      {
        productId: 'PROD-006',
        code: 'AVN-1104',
        name: 'Far Away Glamour Eau de Parfum',
        brand: 'AVON',
        presentation: 'Frasco 50 ml',
        quantity: 1,
        unitReferencePrice: 14500,
        unitPublicPrice: 18850,
        unitResellerGain: 1450,
        totalPublicPrice: 18850,
        totalResellerGain: 1450
      },
      {
        productId: 'PROD-004',
        code: 'NAT-9902',
        name: 'Tododia Crema Corporal Nuez Pecán',
        brand: 'Natura',
        presentation: 'Pote 400 ml',
        quantity: 2,
        unitReferencePrice: 8200,
        unitPublicPrice: 10660,
        unitResellerGain: 820,
        totalPublicPrice: 21320,
        totalResellerGain: 1640
      }
    ],
    totalPublicPrice: 86970,
    totalResellerGain: 6690,
    distributorAmountDue: 80280, // P * 1.20
    shippingCost: 4300, // Castelar is within 10 km (3.5 km) -> 1 tramo
    shippingDistanceKm: 3.5,
    shippingTramos: 1,
    totalWithShipping: 84580,
    pointsRequired: 20,
    pointsDeducted: true,
    deliveryAddress: 'Calle Bartolomé Mitre 2340, Castelar',
    locality: 'Castelar',
    neighborhood: 'Castelar Sur',
    deliveryZone: 'Zona Oeste - Castelar / Morón',
    deliverySchedule: 'Martes y Jueves 14:00 a 18:00',
    authorizedReceiver: 'Lucas González (Hermano)',
    receiverPhone: '+54 11 4410-9921',
    deliveryInstructions: 'Tocar timbre largo. Dejar con encargado del local si no atiende.',
    paymentStatus: 'Acreditado',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    paymentProofNotes: 'Transferencia Bancaria Galicia #992813 - Monto exacto $84.580',
    paymentVerifiedAt: '2026-11-04T16:20:00Z',
    paymentProofDestinationAdmin: 'Diego',
    deliveryStatus: 'En preparación',
    pickingStatus: 'En picking',
    createdAt: '2026-11-03T11:00:00Z',
    confirmedAt: '2026-11-03T11:05:00Z',
    history: [
      {
        id: 'LOG-001',
        timestamp: '2026-11-03T11:05:00Z',
        userId: 'REV-2026-1042',
        userName: 'Mariana González',
        action: 'CONFIRMACION_PEDIDO',
        entityId: 'PED-2026-4019',
        newState: 'Confirmado',
        reason: 'Revendedora confirmó pedido con aceptación expresa. Asignado picking PICK-001.'
      },
      {
        id: 'LOG-002',
        timestamp: '2026-11-04T14:10:00Z',
        userId: 'REV-2026-1042',
        userName: 'Mariana González',
        action: 'CARGA_COMPROBANTE',
        entityId: 'PED-2026-4019',
        previousState: 'Pendiente',
        newState: 'Comprobante recibido',
        reason: 'Carga de comprobante de transferencia bancaria'
      },
      {
        id: 'LOG-003',
        timestamp: '2026-11-04T16:20:00Z',
        userId: 'ADMIN-DIEGO',
        userName: 'Diego (Administrador)',
        action: 'ACREDITACION_PAGO',
        entityId: 'PED-2026-4019',
        previousState: 'Comprobante recibido',
        newState: 'Acreditado',
        reason: 'Verificación de acreditación en cuenta bancaria oficial'
      }
    ]
  }
];

export const INITIAL_BANK_INFO = {
  alias: 'BELLEZA.MANOS.OFICIAL',
  cbu: '0070142930004019283711',
  cvu: '0000003100024866086187', // Official Mercado Pago / CVU as explicitly requested
  titular: 'Distribuidora Belleza en tus Manos S.R.L.',
  cuit: '30-71890214-8',
  banco: 'Banco Galicia / Mercado Pago',
  whatsappNotificaciones: '+54 9 11 4982-3310'
};

export const INITIAL_POINTS_RULES: PointsRulesConfig = {
  enabled: true,
  pointsRequiredPerOrder: 20, // Requires 20 points per order
  pointsEarnedPerThousandPesos: 5, // Earns 5 points per $1000 public price
  initialWelcomePoints: 50, // Welcome points
  lastConfiguredAt: '2026-11-09T10:00:00Z',
  lastConfiguredBy: 'Diego (Administrador)',
  notes: 'Regla activa: 20 pts fijos requeridos por orden. Acreditación de 5 pts por cada $1.000 vendidos.'
};

export const INITIAL_SHIPPING_CONFIG: ShippingRateConfig = {
  pricePer10Km: 4300, // $4.300 cada 10 km
  distributionCenterAddress: 'Av. Rivadavia 17400, Morón, Buenos Aires',
  distributionCenterCoords: { lat: -34.6534, lng: -58.6198 },
  lastConfiguredAt: '2026-11-09T10:00:00Z'
};

// Known approximate distances from Morón distribution center (km)
const KNOWN_LOCALITY_DISTANCES: Record<string, number> = {
  'morón': 2.0,
  'moron': 2.0,
  'castelar': 3.5,
  'haedo': 4.0,
  'ituzaingó': 7.2,
  'ituzaingo': 7.2,
  'ramos mejía': 8.5,
  'ramos mejia': 8.5,
  'san justo': 11.5,
  'merlo': 14.5,
  'hurlingham': 8.8,
  'el palomar': 6.0,
  'ciudadela': 12.0,
  'padua': 10.5,
  'san antonio de padua': 10.5,
  'paso del rey': 18.0,
  'moreno': 22.0,
  'caba': 21.0,
  'capital federal': 21.0,
  'flores': 17.5,
  'palermo': 24.0,
  'belgrano': 25.0,
  'vicente lópez': 26.0,
  'san isidro': 29.0,
  'avellaneda': 27.0,
  'lanús': 26.0,
  'quilmes': 38.0,
  'la plata': 72.0
};

class Store {
  private users: User[] = [];
  private currentUser: User = INITIAL_USERS[0];
  private products: Product[] = [];
  private cycles: CommercialCycle[] = [];
  private orders: Order[] = [];
  private cart: { productId: string; quantity: number }[] = [];
  private auditLogs: AuditLogItem[] = [];
  private bankInfo = INITIAL_BANK_INFO;
  private pdfJobs: any[] = [];
  private pointsRules: PointsRulesConfig = INITIAL_POINTS_RULES;
  private shippingConfig: ShippingRateConfig = INITIAL_SHIPPING_CONFIG;

  constructor() {
    this.loadFromStorage();
    this.checkInactivitySuspensions();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      this.currentUser = storedUser ? JSON.parse(storedUser) : this.users[0];

      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;

      const storedCycles = localStorage.getItem(STORAGE_KEYS.CYCLES);
      this.cycles = storedCycles ? JSON.parse(storedCycles) : INITIAL_CYCLES;

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      this.cart = storedCart ? JSON.parse(storedCart) : [];

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [];

      const storedBank = localStorage.getItem(STORAGE_KEYS.BANK_INFO);
      this.bankInfo = storedBank ? JSON.parse(storedBank) : INITIAL_BANK_INFO;

      const storedPdf = localStorage.getItem(STORAGE_KEYS.PDF_JOBS);
      this.pdfJobs = storedPdf ? JSON.parse(storedPdf) : [
        {
          id: 'JOB-PDF-01',
          filename: 'Catalogo_Natura_Ciclo05_Oficial.pdf',
          brand: 'Natura',
          cycle: 'Ciclo 05',
          uploadedAt: '2026-11-01T08:30:00Z',
          pagesCount: 124,
          extractedProductsCount: 88,
          status: 'aprobado',
          manualReviewNeededCount: 0
        }
      ];

      const storedPoints = localStorage.getItem(STORAGE_KEYS.POINTS_RULES);
      this.pointsRules = storedPoints ? JSON.parse(storedPoints) : INITIAL_POINTS_RULES;

      const storedShip = localStorage.getItem(STORAGE_KEYS.SHIPPING_CONFIG);
      this.shippingConfig = storedShip ? JSON.parse(storedShip) : INITIAL_SHIPPING_CONFIG;
    } catch (e) {
      console.warn('Store fallback to seed data', e);
      this.users = INITIAL_USERS;
      this.currentUser = INITIAL_USERS[0];
      this.products = INITIAL_PRODUCTS;
      this.cycles = INITIAL_CYCLES;
      this.orders = INITIAL_ORDERS;
      this.cart = [];
      this.auditLogs = [];
      this.bankInfo = INITIAL_BANK_INFO;
      this.pointsRules = INITIAL_POINTS_RULES;
      this.shippingConfig = INITIAL_SHIPPING_CONFIG;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(this.cycles));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEYS.BANK_INFO, JSON.stringify(this.bankInfo));
      localStorage.setItem(STORAGE_KEYS.PDF_JOBS, JSON.stringify(this.pdfJobs));
      localStorage.setItem(STORAGE_KEYS.POINTS_RULES, JSON.stringify(this.pointsRules));
      localStorage.setItem(STORAGE_KEYS.SHIPPING_CONFIG, JSON.stringify(this.shippingConfig));
    } catch (e) {
      console.error('Storage save failed:', e);
    }
  }

  // --- Inactivity Tracking & Auto-Suspension (Section 2) ---
  // 4 months = 120 days
  checkInactivitySuspensions(): number {
    const FOUR_MONTHS_MS = 120 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let suspendedCount = 0;

    for (const user of this.users) {
      if (user.role === 'revendedor' && user.status === 'activo') {
        const lastActivityTime = new Date(user.lastActivityAt || user.createdAt).getTime();
        const diff = now - lastActivityTime;
        if (diff >= FOUR_MONTHS_MS) {
          user.status = 'suspendido';
          user.inactivitySuspended = true;
          suspendedCount++;
          this.logAudit(
            'SISTEMA_BACKEND',
            'Vencimiento Automático',
            'SUSPENSION_INACTIVIDAD',
            user.id,
            `Suspensión automática tras 4 meses consecutivos (120 días) sin actividad válida. Historial de pedidos y comisiones conservado íntegro.`
          );
        }
      }
    }

    if (suspendedCount > 0) {
      this.saveToStorage();
    }
    return suspendedCount;
  }

  recordUserActivity(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user && user.status === 'activo') {
      user.lastActivityAt = new Date().toISOString();
      if (this.currentUser.id === userId) {
        this.currentUser.lastActivityAt = user.lastActivityAt;
      }
      this.saveToStorage();
    }
  }

  getInactivityNotice(user: User): {
    hasWarning: boolean;
    daysRemaining: number;
    suspensionDateStr: string;
    message: string;
  } {
    if (user.role !== 'revendedor') {
      return { hasWarning: false, daysRemaining: 120, suspensionDateStr: '', message: '' };
    }
    const FOUR_MONTHS_MS = 120 * 24 * 60 * 60 * 1000;
    const lastActivityTime = new Date(user.lastActivityAt || user.createdAt).getTime();
    const suspensionTimestamp = lastActivityTime + FOUR_MONTHS_MS;
    const now = Date.now();
    const msRemaining = suspensionTimestamp - now;
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
    const suspensionDateStr = new Date(suspensionTimestamp).toLocaleDateString('es-AR');

    if (user.status === 'suspendido' && user.inactivitySuspended) {
      return {
        hasWarning: true,
        daysRemaining: 0,
        suspensionDateStr,
        message: `Tu cuenta ha sido suspendida automáticamente por cumplir 4 meses sin actividad. Todo tu historial está guardado. Solicitá a Administración la reactivación para volver a realizar pedidos.`
      };
    }

    // Warnings at 15 days or less
    const hasWarning = daysRemaining <= 15 && user.status === 'activo';
    const message = hasWarning
      ? `Aviso preventivo: Tu cuenta se suspenderá el ${suspensionDateStr} por inactividad (faltan ${daysRemaining} días). Para mantenerla activa, realizá un pedido, compartí un producto o actualizá tus datos.`
      : '';

    return { hasWarning, daysRemaining, suspensionDateStr, message };
  }

  reactivateVendor(userId: string, reason: string): boolean {
    if (this.currentUser.role !== 'admin') throw new Error('Solo los administradores pueden reactivar cuentas');
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;
    user.status = 'activo';
    user.inactivitySuspended = false;
    user.lastActivityAt = new Date().toISOString();
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'REACTIVACION_CUENTA', userId, reason || 'Reactivación manual por administrador');
    return true;
  }

  // --- Shipping Cost by Distance (Section 4) ---
  calculateShippingCost(deliveryAddress: string, locality: string, coords?: { lat: number; lng: number }): ShippingCalculation {
    const ratePer10Km = this.shippingConfig.pricePer10Km || 4300;
    let distanceKm = 5.0; // default local estimate
    let isEstimated = true;

    if (coords && coords.lat && coords.lng) {
      // Calculate Haversine from distribution center
      const center = this.shippingConfig.distributionCenterCoords;
      distanceKm = this.calculateHaversine(center.lat, center.lng, coords.lat, coords.lng);
      isEstimated = false;
    } else {
      // Lookup known locality database
      const locKey = locality.toLowerCase().trim();
      let matchedDist = KNOWN_LOCALITY_DISTANCES[locKey];
      if (matchedDist === undefined) {
        // Try substring search
        for (const [key, dist] of Object.entries(KNOWN_LOCALITY_DISTANCES)) {
          if (locKey.includes(key) || deliveryAddress.toLowerCase().includes(key)) {
            matchedDist = dist;
            break;
          }
        }
      }
      distanceKm = matchedDist !== undefined ? matchedDist : 15.0; // conservative default if unknown
    }

    // Tramos completos o iniciados de 10 km (ej: hasta 10km = 1 tramo; >10 a 20km = 2 tramos, etc.)
    const tramos10Km = Math.max(1, Math.ceil(distanceKm / 10));
    const cost = tramos10Km * ratePer10Km;

    return {
      distanceKm: Math.round(distanceKm * 10) / 10,
      tramos10Km,
      cost,
      isEstimated
    };
  }

  private calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  getShippingConfig(): ShippingRateConfig {
    return { ...this.shippingConfig };
  }

  updateShippingRate(newPricePer10Km: number, distributionCenterAddress?: string): void {
    if (this.currentUser.role !== 'admin') throw new Error('Solo el administrador configura tarifas de envío');
    this.shippingConfig.pricePer10Km = Number(newPricePer10Km) || 4300;
    if (distributionCenterAddress) {
      this.shippingConfig.distributionCenterAddress = distributionCenterAddress;
    }
    this.shippingConfig.lastConfiguredAt = new Date().toISOString();
    this.saveToStorage();
    this.logAudit(
      this.currentUser.id,
      this.currentUser.fullName,
      'ACTUALIZACION_TARIFA_ENVIO',
      'CONFIG_LOGISTICA',
      `Nueva tarifa de envío configurada: $${this.shippingConfig.pricePer10Km} cada 10 km`
    );
  }

  // --- Points System (Section 3) ---
  getPointsRules(): PointsRulesConfig {
    return { ...this.pointsRules };
  }

  updatePointsRules(config: Partial<PointsRulesConfig>): void {
    if (this.currentUser.role !== 'admin') throw new Error('Solo el administrador puede configurar las reglas de puntos');
    this.pointsRules = {
      ...this.pointsRules,
      ...config,
      lastConfiguredAt: new Date().toISOString(),
      lastConfiguredBy: this.currentUser.fullName
    };
    this.saveToStorage();
    this.logAudit(
      this.currentUser.id,
      this.currentUser.fullName,
      'CONFIGURACION_REGLAS_PUNTOS',
      'REGLAS_COMERCIALES',
      `Reglas de puntos actualizadas por ${this.currentUser.fullName}. Puntos requeridos: ${this.pointsRules.pointsRequiredPerOrder}, Estado: ${this.pointsRules.enabled ? 'Activo' : 'Pausado'}`
    );
  }

  adjustVendorPoints(userId: string, amount: number, type: 'acreditacion' | 'ajuste' | 'devolucion', reason: string): boolean {
    if (this.currentUser.role !== 'admin') throw new Error('Solo el administrador puede ajustar puntos manualmente');
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.pointsBalance = Math.max(0, user.pointsBalance + amount);
    const item = {
      id: `PTS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      amount,
      balanceAfter: user.pointsBalance,
      reason,
      adminId: this.currentUser.id
    };
    if (!user.pointsHistory) user.pointsHistory = [];
    user.pointsHistory.unshift(item);
    this.saveToStorage();

    this.logAudit(
      this.currentUser.id,
      this.currentUser.fullName,
      'AJUSTE_PUNTOS_VENDEDOR',
      userId,
      `${type.toUpperCase()} de ${amount > 0 ? '+' : ''}${amount} pts para ${user.fullName}. Motivo: ${reason}`
    );
    return true;
  }

  // --- Correlative Picking Number Generator (Section 7) ---
  getNextPickingNumber(): string {
    // Calculates correlative sequential number based on total orders
    const count = this.orders.length + 1;
    return `PICK-${String(count).padStart(3, '0')}`;
  }

  // --- Protected WhatsApp Admin Dispatch (Section 1 & 6) ---
  // Returns formatted WhatsApp intent URLs without leaking phone numbers into the UI!
  getAdminWhatsAppDispatch(adminTarget: 'Diego' | 'María', messageText: string): string {
    const admin = ADMIN_CONTACTS.find(a => a.name === adminTarget) || ADMIN_CONTACTS[0];
    return `https://api.whatsapp.com/send?phone=${admin.fullPhoneInt}&text=${encodeURIComponent(messageText)}`;
  }

  // --- Auth & Users ---
  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(userId: string): boolean {
    const found = this.users.find(u => u.id === userId);
    if (found) {
      this.currentUser = found;
      this.recordUserActivity(found.id);
      this.saveToStorage();
      this.logAudit(this.currentUser.id, this.currentUser.fullName, 'CAMBIO_SESION', this.currentUser.id, `Sesión activa como ${this.currentUser.role}: ${this.currentUser.fullName}`);
      return true;
    }
    return false;
  }

  getUsers(): User[] {
    this.checkInactivitySuspensions();
    if (this.currentUser.role !== 'admin') {
      return [this.currentUser];
    }
    return [...this.users];
  }

  registerUser(userData: Omit<User, 'id' | 'role' | 'status' | 'trainingCompleted' | 'trainingProgress' | 'createdAt' | 'lastActivityAt' | 'pointsBalance' | 'pointsHistory'>): User {
    const newId = `REV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const welcomePoints = this.pointsRules.initialWelcomePoints || 50;

    const newUser: User = {
      ...userData,
      id: newId,
      role: 'revendedor',
      status: 'pendiente', // requires admin approval
      trainingCompleted: false,
      trainingProgress: 0,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      pointsBalance: welcomePoints,
      pointsHistory: [
        {
          id: `PTS-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'acreditacion',
          amount: welcomePoints,
          balanceAfter: welcomePoints,
          reason: 'Puntos de bienvenida por registro oficial'
        }
      ]
    };

    this.users.push(newUser);
    this.saveToStorage();
    this.logAudit(newId, newUser.fullName, 'REGISTRO_REVENDEDOR', newId, `Nuevo revendedor registrado con solicitud pendiente y ${welcomePoints} puntos de bienvenida`);
    return newUser;
  }

  updateUserProfile(userId: string, updates: Partial<User>): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;
    // Security check: only user themselves or admin can edit
    if (this.currentUser.role !== 'admin' && this.currentUser.id !== userId) {
      throw new Error('Aislamiento de seguridad: No podés modificar datos de otro vendedor.');
    }

    const previousData = `${user.fullAddress}, ${user.locality}, ${user.phone}`;
    Object.assign(user, updates);
    user.lastActivityAt = new Date().toISOString();
    if (this.currentUser.id === userId) {
      this.currentUser = { ...user };
    }
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'ACTUALIZACION_PERFIL', userId, `Datos actualizados. Antes: ${previousData}`);
    return true;
  }

  updateUserStatus(userId: string, newStatus: 'activo' | 'suspendido' | 'baja'): boolean {
    if (this.currentUser.role !== 'admin') {
      throw new Error('Seguridad: Solo el administrador puede modificar el estado de revendedores.');
    }
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;
    const oldStatus = user.status;
    user.status = newStatus;
    if (newStatus === 'activo') {
      user.inactivitySuspended = false;
      user.lastActivityAt = new Date().toISOString();
    }
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'MODIFICACION_USUARIO', userId, `Estado modificado de ${oldStatus} a ${newStatus}`);
    return true;
  }

  updateTrainingProgress(userId: string, completedStep: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.trainingProgress = Math.max(user.trainingProgress, completedStep);
      if (user.trainingProgress >= 10) {
        user.trainingCompleted = true;
      }
      user.lastActivityAt = new Date().toISOString();
      if (this.currentUser.id === userId) {
        this.currentUser = { ...user };
      }
      this.saveToStorage();
    }
  }

  // --- Strict Price & Catalog Privacy (Security) ---
  getProducts(): Product[] {
    const role = this.currentUser.role;
    if (role === 'admin') {
      return [...this.products];
    }

    // Stripping sensitive wholesale prices
    return this.products
      .filter(p => p.status === 'aprobado' || p.status === 'borrador')
      .map(p => ({
        ...p,
        referencePrice: 0,        // HIDDEN
        distributorMargin: 0,     // HIDDEN
        distributorAmount: 0      // HIDDEN
      }));
  }

  addProduct(productData: Omit<Product, 'id' | 'publicPrice' | 'resellerGain' | 'distributorMargin' | 'distributorAmount'>): Product {
    if (this.currentUser.role !== 'admin') {
      throw new Error('Solo el administrador puede incorporar productos al catálogo.');
    }
    const prices = calculatePrices(productData.referencePrice);
    const newProduct: Product = {
      ...productData,
      id: `PROD-${Date.now().toString().slice(-6)}`,
      publicPrice: prices.publicPrice,
      resellerGain: prices.resellerGain,
      distributorMargin: prices.distributorMargin,
      distributorAmount: prices.distributorAmount
    };
    this.products.unshift(newProduct);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'ALTA_PRODUCTO', newProduct.id, `Alta de ${newProduct.name} - Ref $${prices.referencePrice} / Público $${prices.publicPrice}`);
    return newProduct;
  }

  updateProductPrice(productId: string, newReferencePrice: number): boolean {
    if (this.currentUser.role !== 'admin') {
      throw new Error('Solo el administrador puede actualizar precios.');
    }
    const prod = this.products.find(p => p.id === productId);
    if (!prod) return false;
    const oldRef = prod.referencePrice;
    const oldPub = prod.publicPrice;
    const prices = calculatePrices(newReferencePrice);

    prod.referencePrice = prices.referencePrice;
    prod.publicPrice = prices.publicPrice;
    prod.resellerGain = prices.resellerGain;
    prod.distributorMargin = prices.distributorMargin;
    prod.distributorAmount = prices.distributorAmount;
    prod.status = 'aprobado';
    delete prod.uncertaintyReason;

    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'ACTUALIZACION_PRECIO', productId, `Precio actualizado: Ref $${oldRef} -> $${prices.referencePrice} (Público $${oldPub} -> $${prices.publicPrice})`);
    return true;
  }

  // --- Cycles ---
  getCycles(): CommercialCycle[] {
    return [...this.cycles];
  }

  createCycle(name: string, brand: any, startDate: string, endDate: string, notes: string): CommercialCycle {
    if (this.currentUser.role !== 'admin') throw new Error('Operación restringida al administrador');
    const newCycle: CommercialCycle = {
      id: `CICLO-2026-${String(this.cycles.length + 1).padStart(2, '0')}`,
      name,
      brand,
      startDate,
      endDate,
      status: 'publicado',
      notes,
      catalogCount: 1
    };
    this.cycles.unshift(newCycle);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'CREACION_CICLO', newCycle.id, `Nuevo ciclo comercial: ${name}`);
    return newCycle;
  }

  closeCycle(cycleId: string): boolean {
    if (this.currentUser.role !== 'admin') throw new Error('Operación restringida');
    const cycle = this.cycles.find(c => c.id === cycleId);
    if (!cycle) return false;
    cycle.status = 'cerrado';
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'CIERRE_CICLO', cycleId, `Cierre del ciclo comercial ${cycle.name}`);
    return true;
  }

  // --- Cart & Orders ---
  getCart(): { product: Product; quantity: number }[] {
    const list: { product: Product; quantity: number }[] = [];
    const roleProducts = this.getProducts();
    for (const item of this.cart) {
      const prod = roleProducts.find(p => p.id === item.productId);
      if (prod) {
        list.push({ product: prod, quantity: item.quantity });
      }
    }
    return list;
  }

  addToCart(productId: string, quantity: number = 1): void {
    const existing = this.cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ productId, quantity });
    }
    this.recordUserActivity(this.currentUser.id);
    this.saveToStorage();
  }

  updateCartQuantity(productId: string, delta: number): void {
    const index = this.cart.findIndex(item => item.productId === productId);
    if (index >= 0) {
      this.cart[index].quantity += delta;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
      this.recordUserActivity(this.currentUser.id);
      this.saveToStorage();
    }
  }

  clearCart(): void {
    this.cart = [];
    this.saveToStorage();
  }

  // Confirm order with strict price freezing, legal acceptance, distance shipping calculation, points deduction, and correlative picking number
  confirmOrder(
    deliveryAddress: string, 
    locality: string, 
    schedule: string, 
    receiver: string, 
    extraDetails?: {
      neighborhood?: string;
      receiverPhone?: string;
      deliveryInstructions?: string;
      coords?: { lat: number; lng: number };
    }
  ): Order {
    if (this.cart.length === 0) throw new Error('El carrito está vacío.');
    this.checkInactivitySuspensions();

    // Inactivity block check
    const user = this.users.find(u => u.id === this.currentUser.id);
    if (user && user.status === 'suspendido') {
      throw new Error('Cuenta suspendida: No podés realizar pedidos. Comunicate con Administración para reactivar tu cuenta.');
    }

    const activeCycle = this.cycles.find(c => c.status === 'publicado') || this.cycles[0];
    const orderItems: OrderItem[] = [];
    let totalPublic = 0;
    let totalGain = 0;
    let totalDue = 0;

    for (const cartItem of this.cart) {
      const rawProduct = this.products.find(p => p.id === cartItem.productId);
      if (!rawProduct) continue;
      const prices = calculatePrices(rawProduct.referencePrice);
      const subtotalPublic = prices.publicPrice * cartItem.quantity;
      const subtotalGain = prices.resellerGain * cartItem.quantity;
      const subtotalDue = prices.distributorAmount * cartItem.quantity;

      orderItems.push({
        productId: rawProduct.id,
        code: rawProduct.code,
        name: rawProduct.name,
        brand: rawProduct.brand,
        presentation: rawProduct.presentation,
        quantity: cartItem.quantity,
        unitReferencePrice: rawProduct.referencePrice, // saved internally for consolidation
        unitPublicPrice: prices.publicPrice,
        unitResellerGain: prices.resellerGain,
        totalPublicPrice: subtotalPublic,
        totalResellerGain: subtotalGain
      });

      totalPublic += subtotalPublic;
      totalGain += subtotalGain;
      totalDue += subtotalDue;
    }

    // Points system enforcement (Section 3)
    let pointsRequired = 0;
    if (this.pointsRules.enabled) {
      pointsRequired = this.pointsRules.pointsRequiredPerOrder || 20;
      const userBalance = user ? user.pointsBalance : 0;
      if (userBalance < pointsRequired) {
        const missing = pointsRequired - userBalance;
        throw new Error(
          `Puntos insuficientes para confirmar el pedido. Tu saldo actual es de ${userBalance} puntos y este pedido requiere ${pointsRequired} puntos (te faltan ${missing} puntos para poder confirmarlo).`
        );
      }
    }

    // Shipping cost calculation by distance (Section 4)
    const shipping = this.calculateShippingCost(deliveryAddress, locality, extraDetails?.coords);
    const totalWithShipping = totalDue + shipping.cost;

    // Deduct points from user
    if (user && this.pointsRules.enabled && pointsRequired > 0) {
      user.pointsBalance -= pointsRequired;
      user.pointsHistory.unshift({
        id: `PTS-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'consumo',
        amount: -pointsRequired,
        balanceAfter: user.pointsBalance,
        reason: `Consumo de puntos para confirmación de pedido`
      });
    }

    const orderId = `PED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const pickingNumber = this.getNextPickingNumber();
    const deliveryZone = `Zona Oeste - ${locality}`;

    const newOrder: Order = {
      id: orderId,
      pickingNumber,
      resellerId: this.currentUser.id,
      resellerName: this.currentUser.fullName,
      resellerPhone: this.currentUser.phone,
      cycleId: activeCycle.id,
      items: orderItems,
      totalPublicPrice: totalPublic,
      totalResellerGain: totalGain,
      distributorAmountDue: totalDue,
      shippingCost: shipping.cost,
      shippingDistanceKm: shipping.distanceKm,
      shippingTramos: shipping.tramos10Km,
      totalWithShipping,
      pointsRequired,
      pointsDeducted: pointsRequired > 0,
      deliveryAddress,
      locality,
      neighborhood: extraDetails?.neighborhood || user?.neighborhood,
      deliveryZone,
      deliverySchedule: schedule,
      authorizedReceiver: receiver,
      receiverPhone: extraDetails?.receiverPhone || user?.receiverPhone,
      deliveryInstructions: extraDetails?.deliveryInstructions || user?.deliveryInstructions,
      paymentStatus: 'Pendiente',
      deliveryStatus: 'Confirmado',
      pickingStatus: 'Pendiente de picking',
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      history: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: this.currentUser.id,
          userName: this.currentUser.fullName,
          action: 'CONFIRMACION_PEDIDO',
          entityId: orderId,
          newState: 'Confirmado',
          reason: `Pedido confirmado con aceptación expresa. Asignado picking correlativo ${pickingNumber}. Envío: ${shipping.distanceKm}km (${shipping.tramos10Km} tramos) = $${shipping.cost}.`
        }
      ]
    };

    this.orders.unshift(newOrder);
    this.recordUserActivity(this.currentUser.id);
    this.clearCart();
    this.saveToStorage();
    this.logAudit(
      this.currentUser.id, 
      this.currentUser.fullName, 
      'CONFIRMACION_PEDIDO', 
      orderId, 
      `Nuevo pedido ${orderId} (${pickingNumber}) por $${totalPublic} (Ganancia: $${totalGain}, Envío: $${shipping.cost})`
    );
    return newOrder;
  }

  // --- Order Isolation (Security) ---
  getOrders(): Order[] {
    const role = this.currentUser.role;
    if (role === 'admin') {
      return [...this.orders];
    }
    // Reseller can ONLY see their own orders
    return this.orders
      .filter(o => o.resellerId === this.currentUser.id)
      .map(o => ({
        ...o,
        items: o.items.map(item => ({
          ...item,
          unitReferencePrice: undefined // Hide wholesale cost from reseller
        }))
      }));
  }

  uploadPaymentProof(orderId: string, proofUrl: string, notes: string, destinationAdmin: 'Diego' | 'María' | 'Ambos' = 'Ambos'): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;
    // Security check
    if (this.currentUser.role !== 'admin' && order.resellerId !== this.currentUser.id) {
      throw new Error('Aislamiento de seguridad: No tiene autorización para modificar este pedido.');
    }
    order.paymentProofUrl = proofUrl;
    order.paymentProofNotes = notes;
    order.paymentStatus = 'Comprobante recibido'; // "PAGO PENDIENTE DE VERIFICACIÓN"
    order.paymentProofDestinationAdmin = destinationAdmin;

    const logEntry: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      action: 'CARGA_COMPROBANTE',
      entityId: orderId,
      previousState: 'Pendiente',
      newState: 'Comprobante recibido (Pendiente de verificación)',
      reason: notes || `Comprobante de transferencia adjuntado y remitido a ${destinationAdmin}`
    };
    order.history.push(logEntry);
    this.recordUserActivity(this.currentUser.id);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'CARGA_COMPROBANTE', orderId, `Comprobante de pago subido para verificación de ${destinationAdmin}`);
    return true;
  }

  verifyPayment(orderId: string, approved: boolean, reason: string): boolean {
    if (this.currentUser.role !== 'admin') throw new Error('Solo el administrador puede acreditar pagos');
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;
    const oldState = order.paymentStatus;
    order.paymentStatus = approved ? 'Acreditado' : 'Rechazado';
    if (approved) {
      order.paymentVerifiedAt = new Date().toISOString();
      order.deliveryStatus = 'Pago acreditado';

      // Accrue points on confirmed sale if points rules configured
      if (this.pointsRules.enabled && this.pointsRules.pointsEarnedPerThousandPesos > 0) {
        const vendor = this.users.find(u => u.id === order.resellerId);
        if (vendor) {
          const pointsEarned = Math.floor((order.totalPublicPrice / 1000) * this.pointsRules.pointsEarnedPerThousandPesos);
          if (pointsEarned > 0) {
            vendor.pointsBalance += pointsEarned;
            vendor.pointsHistory.unshift({
              id: `PTS-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'acreditacion',
              amount: pointsEarned,
              balanceAfter: vendor.pointsBalance,
              reason: `Acreditación por venta confirmada pedido ${order.id} (${pointsEarned} pts)`
            });
          }
        }
      }
    }

    const logEntry: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      action: approved ? 'ACREDITACION_PAGO' : 'RECHAZO_PAGO',
      entityId: orderId,
      previousState: oldState,
      newState: order.paymentStatus,
      reason: reason || (approved ? 'Verificación confirmada en cuenta oficial Galicia / Mercado Pago' : 'Comprobante no coincide o ilegible')
    };
    order.history.push(logEntry);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, logEntry.action, orderId, logEntry.reason);
    return true;
  }

  updateDeliveryStatus(orderId: string, newStatus: DeliveryStatus, notes?: string): boolean {
    if (this.currentUser.role !== 'admin') throw new Error('Operación restringida al administrador');
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;
    const oldStatus = order.deliveryStatus;
    order.deliveryStatus = newStatus;
    if (notes) order.deliveryNotes = notes;

    const logEntry: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      action: 'CAMBIO_ESTADO_ENTREGA',
      entityId: orderId,
      previousState: oldStatus,
      newState: newStatus,
      reason: notes || `Actualización logística a ${newStatus}`
    };
    order.history.push(logEntry);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'CAMBIO_ESTADO_ENTREGA', orderId, `${oldStatus} -> ${newStatus}`);
    return true;
  }

  // --- Picking & Preparation Management (Section 7) ---
  updatePickingStatus(orderId: string, newStatus: PickingStatus, notes?: string): boolean {
    if (this.currentUser.role !== 'admin') throw new Error('Operación restringida al administrador');
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;
    const oldStatus = order.pickingStatus;
    order.pickingStatus = newStatus;
    if (newStatus === 'Caja completa') {
      order.pickingCompletedAt = new Date().toISOString();
      order.deliveryStatus = 'Caja lista';
    }

    const logEntry: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      action: 'ACTUALIZACION_PICKING',
      entityId: orderId,
      previousState: oldStatus,
      newState: newStatus,
      reason: notes || `Picking de pedido ${order.pickingNumber}: ${newStatus}`
    };
    order.history.push(logEntry);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'ACTUALIZACION_PICKING', orderId, `${oldStatus} -> ${newStatus}`);
    return true;
  }

  // --- Consolidador de Compras Mayoristas (Admin Only) ---
  getConsolidatedPurchases(cycleId?: string): { natura: ConsolidatedPurchaseItem[]; avon: ConsolidatedPurchaseItem[]; totalWholesale: number } {
    if (this.currentUser.role !== 'admin') throw new Error('Acceso denegado: solo el administrador puede consolidar compras mayoristas.');
    const targetOrders = cycleId ? this.orders.filter(o => o.cycleId === cycleId) : this.orders;
    const naturaMap = new Map<string, ConsolidatedPurchaseItem>();
    const avonMap = new Map<string, ConsolidatedPurchaseItem>();
    let grandTotal = 0;

    for (const order of targetOrders) {
      for (const item of order.items) {
        const rawProduct = this.products.find(p => p.id === item.productId);
        const refPrice = rawProduct ? rawProduct.referencePrice : (item.unitReferencePrice || 0);
        const map = item.brand === 'Natura' ? naturaMap : avonMap;
        const existing = map.get(item.code);

        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalWholesaleAmount += refPrice * item.quantity;
          existing.orderBreakdown.push({
            orderId: order.id,
            pickingNumber: order.pickingNumber,
            resellerName: order.resellerName,
            quantity: item.quantity
          });
        } else {
          map.set(item.code, {
            code: item.code,
            name: item.name,
            brand: item.brand,
            totalQuantity: item.quantity,
            unitWholesalePrice: refPrice,
            totalWholesaleAmount: refPrice * item.quantity,
            orderBreakdown: [{
              orderId: order.id,
              pickingNumber: order.pickingNumber,
              resellerName: order.resellerName,
              quantity: item.quantity
            }]
          });
        }
        grandTotal += refPrice * item.quantity;
      }
    }

    return {
      natura: Array.from(naturaMap.values()),
      avon: Array.from(avonMap.values()),
      totalWholesale: grandTotal
    };
  }

  // --- Preparación de Cajas (Admin Only) ---
  getBoxPreparations(): BoxPreparation[] {
    if (this.currentUser.role !== 'admin') throw new Error('Solo el administrador prepara cajas');
    return this.orders.map(order => ({
      orderId: order.id,
      pickingNumber: order.pickingNumber || 'PICK-000',
      resellerName: order.resellerName,
      deliveryAddress: order.deliveryAddress,
      deliveryZone: order.deliveryZone || `Zona Oeste - ${order.locality}`,
      phone: order.resellerPhone,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.name,
        code: item.code,
        quantity: item.quantity,
        prepared: order.pickingStatus === 'Caja completa' || order.deliveryStatus === 'Caja lista' || order.deliveryStatus === 'En reparto' || order.deliveryStatus === 'Entregado'
      })),
      isComplete: order.pickingStatus === 'Caja completa' || order.deliveryStatus === 'Caja lista' || order.deliveryStatus === 'En reparto' || order.deliveryStatus === 'Entregado',
      boxLabelGenerated: order.deliveryStatus !== 'Confirmado'
    }));
  }

  // --- PDF Catalog Center Jobs ---
  getPdfJobs(): any[] {
    return [...this.pdfJobs];
  }

  addPdfJob(job: any): void {
    this.pdfJobs.unshift(job);
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'SUBIDA_CATALOGO_PDF', job.id, `Subida de catálogo ${job.filename} (${job.brand})`);
  }

  // --- Audit Trail ---
  logAudit(userId: string, userName: string, action: string, entityId: string, reason?: string) {
    const entry: AuditLogItem = {
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      action,
      entityId,
      reason
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) this.auditLogs.pop(); // keep last 500
    this.saveToStorage();
  }

  getAuditLogs(): AuditLogItem[] {
    if (this.currentUser.role !== 'admin') throw new Error('Acceso restringido a la bitácora de auditoría');
    return [...this.auditLogs];
  }

  getBankInfo() {
    return { ...this.bankInfo };
  }

  updateBankInfo(info: typeof INITIAL_BANK_INFO) {
    if (this.currentUser.role !== 'admin') throw new Error('Solo el administrador configura datos bancarios');
    this.bankInfo = { ...info };
    this.saveToStorage();
    this.logAudit(this.currentUser.id, this.currentUser.fullName, 'ACTUALIZACION_BANCO', 'SISTEMA', `Datos bancarios actualizados. CVU: ${this.bankInfo.cvu}`);
  }
}

export const store = new Store();
