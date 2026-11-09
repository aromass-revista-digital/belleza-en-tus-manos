import { TrainingModule } from '../types';

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 1,
    title: '1. Registro e Ingreso a la Plataforma',
    duration: '5 min',
    category: 'Inducción',
    summary: 'Aprende cómo funciona tu cuenta individual, identificación segura y acceso multirrol.',
    content: [
      'Tu cuenta en Belleza en tus Manos es individual e intransferible. Cada revendedor posee un identificador único (ej: REV-2026-1042).',
      'Es fundamental mantener actualizados tu domicilio real, referencias de entrega y persona autorizada para recibir la mercadería.',
      'El acceso está protegido por capas de seguridad: nunca compartas tu contraseña ni tu enlace personal de acceso.'
    ],
    tips: [
      'Guarda la PWA en tu pantalla principal de Android o iPhone para ingresar en 1 toque.',
      'Verifica que tu número de WhatsApp esté bien escrito para recibir alertas de estado.'
    ],
    quizQuestion: '¿Por qué cada revendedor cuenta con un identificador único (ID)?',
    quizOptions: [
      'Solo para fines decorativos en la pantalla.',
      'Para aislar tu información privada, pedidos, comisiones y domicilios de otros revendedores.',
      'Para que cualquier revendedor pueda editar tus pedidos.',
      'Para que el cliente final vea tu DNI.'
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    title: '2. Uso de Catálogos y Ciclos Comerciales',
    duration: '6 min',
    category: 'Catálogos',
    summary: 'Cómo navegar los catálogos digitales multimarca (Natura y AVON) y comprender los ciclos de 15 días.',
    content: [
      'Los ciclos comerciales duran exactamente 15 días. Cada ciclo cuenta con fecha de inicio y fecha de cierre estricta.',
      'Al cerrar el ciclo, la distribuidora consolida todos los pedidos para la compra mayorista con los proveedores.',
      'Los precios de tus pedidos confirmados quedan congelados y protegidos, sin importar futuros aumentos.'
    ],
    tips: [
      'No dejes tus pedidos para la última hora del cierre de ciclo para evitar cortes de stock.',
      'Puedes navegar productos de Natura y AVON en una única plataforma unificada.'
    ],
    quizQuestion: '¿Cuánto dura cada ciclo comercial y qué ocurre con los precios al confirmar un pedido?',
    quizOptions: [
      'Dura 6 meses y los precios suben todas las semanas.',
      'Dura 15 días y los precios quedan congelados en el pedido confirmado según el ciclo vigente.',
      'No hay ciclos fijos, los precios cambian diariamente.',
      'Dura 30 días pero los pedidos viejos se recalculan con precios nuevos.'
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    title: '3. Búsqueda Inteligente de Productos',
    duration: '4 min',
    category: 'Ventas',
    summary: 'Filtros rápidos por marca, categoría, código, aroma o beneficio para responder a tus clientas al instante.',
    content: [
      'Utiliza la barra de búsqueda en tiempo real escribiendo el nombre (ej: "Kaiak", "Far Away", "Chronos") o el código del producto.',
      'Filtra por categorías: Perfumería, Maquillaje, Cuidado Facial, Corporal, Higiene, Cabello, Hogar y Ofertas destacadas.',
      'En cada ficha de producto encuentras la foto en alta calidad, presentación (ml, gramos) y descripción comercial.'
    ],
    tips: [
      'Toca en "Ver en 3D" para inspeccionar frascos y texturas en el Showroom Espacial.',
      'Usa el filtro "Ofertas" para ofrecer los productos con mayor margen y promociones a tus clientes.'
    ],
    quizQuestion: '¿Qué información encuentras en la ficha individual de cada producto?',
    quizOptions: [
      'El costo del proveedor y márgenes privados de la distribuidora.',
      'Nombre, fotografía, código, presentación, precio público y tu ganancia neta estimada del 10%.',
      'La dirección de otros revendedores.',
      'Solamente el nombre sin precio.'
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    title: '4. Precios, Ganancias y Fórmulas Claras',
    duration: '7 min',
    category: 'Finanzas',
    summary: 'Comprende exactamente cómo ganas tu 10% neto sobre el precio de referencia sin deducciones sorpresa.',
    content: [
      'En Belleza en tus Manos la fórmula es transparente y obligatoria:',
      '• Precio Público = P × 1.30 (lo que cobra tu clienta).',
      '• Tu Comisión de Revendedor = P × 0.10 (tu dinero en mano).',
      '• Margen de la Distribuidora = P × 0.20.',
      '• Importe a entregar a la Distribuidora = P × 1.20.',
      'Ejemplo práctico: Un perfume con precio base $10.000 se vende al público a $13.000. Tú entregas $12.000 a la distribuidora y te quedas con $1.000 limpios de ganancia.'
    ],
    tips: [
      'Tu ganancia está respaldada matemáticamente en cada renglón de tu pedido.',
      'Nunca debes cobrar de más ni de menos del precio público establecido para preservar la seriedad comercial.'
    ],
    quizQuestion: 'Si un producto tiene un valor de referencia P de $20.000, ¿cuál es el precio público y tu ganancia?',
    quizOptions: [
      'Precio público $20.000 y ganancia $0.',
      'Precio público $26.000 ($20.000 × 1.30) y tu ganancia $2.000 ($20.000 × 0.10).',
      'Precio público $30.000 y ganancia $5.000.',
      'Precio público $22.000 y ganancia $1.000.'
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    title: '5. Armado Eficiente del Carrito Multimarca',
    duration: '5 min',
    category: 'Operativa',
    summary: 'Aprende a combinar productos de Natura y AVON en un solo pedido consolidado sin costos adicionales.',
    content: [
      'Puedes agregar a tu carrito productos de Natura y AVON sin necesidad de hacer pedidos por separado.',
      'A medida que agregas artículos, la plataforma actualiza en tiempo real: total a precio público, tu comisión acumulada y el neto a pagar.',
      'Puedes ajustar cantidades (+ / -) o eliminar artículos antes de pasar a la etapa de confirmación.'
    ],
    tips: [
      'Agrupa los encargos de tus clientas en tu bloc de notas y cárgalos juntos para optimizar la entrega a tu domicilio.',
      'Revisa dos veces los códigos y presentaciones antes de avanzar.'
    ],
    quizQuestion: '¿Es posible encargar productos de Natura y AVON en el mismo carrito?',
    quizOptions: [
      'No, hay que hacer dos cuentas distintas.',
      'Sí, el sistema unifica ambas marcas en un único pedido facilitando la logística y el cobro.',
      'Solo si compras más de 100 unidades.',
      'Solo los días domingos.'
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    title: '6. Confirmación de Pedidos y Aceptación Expresa',
    duration: '5 min',
    category: 'Legal y Operativa',
    summary: 'Pasos para congelar precios, validar datos de envío y confirmar tu compromiso comercial.',
    content: [
      'Antes de confirmar el pedido, el sistema exige revisar la lista detallada y aceptar expresamente las condiciones comerciales.',
      'Al hacer clic en "Confirmar Pedido", se genera un número único (ej: PED-2026-4019) con fecha y hora exacta.',
      'Se congelan los precios del ciclo vigente y se registra el domicilio y disponibilidad horaria para el reparto posterior.'
    ],
    tips: [
      'Una vez confirmado, tu pedido entra en estado "Pendiente de Pago" listo para la transferencia.',
      'Recibirás notificación inmediata de confirmación con el detalle para tu control.'
    ],
    quizQuestion: '¿Qué sucede inmediatamente al confirmar tu pedido con aceptación expresa?',
    quizOptions: [
      'Se cancela automáticamente.',
      'Se genera un número único, se congelan los precios según el ciclo y queda registrado en tu historial.',
      'El pedido se borra del sistema.',
      'Se le cobra directamente a tu clienta final.'
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    title: '7. Pagos, Transferencias y Carga de Comprobantes',
    duration: '6 min',
    category: 'Cobranzas',
    summary: 'Cómo realizar la transferencia a la cuenta oficial de la distribuidora y adjuntar tu comprobante.',
    content: [
      'La distribuidora opera mediante CBU / Alias bancario oficial verificado.',
      'Debes transferir el "Importe a Entregar" (P × 1.20) descontando previamente tu ganancia.',
      'Luego, subes la foto o captura del comprobante desde tu celular en la sección "Mis Pedidos".',
      'Importante: El comprobante pasa a estado "Comprobante Recibido" y debe ser verificado por administración para quedar "Acreditado".'
    ],
    tips: [
      'Asegúrate de que en la foto del comprobante se vean claramente el número de operación, fecha, monto e importe exacto.',
      'No envíes comprobantes borrosos o cortados.'
    ],
    quizQuestion: '¿El envío de la foto de un comprobante significa que el pago ya está acreditado inmediatamente?',
    quizOptions: [
      'Sí, se acredita mágicamente sin revisión.',
      'No, el comprobante entra en estado "Comprobante recibido / En revisión" hasta la validación administrativa real.',
      'Significa que el pedido ya fue entregado.',
      'No hace falta enviar comprobantes.'
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    title: '8. Seguimiento de Pedidos y Estados del Sistema',
    duration: '5 min',
    category: 'Logística',
    summary: 'Conoce los 10 estados que atraviesa tu mercadería desde la compra mayorista hasta tu puerta.',
    content: [
      'Tu pedido tiene una línea de tiempo transparente:',
      '1. Confirmado → 2. Pago acreditado → 3. Compra consolidada al proveedor → 4. Mercadería recibida en depósito.',
      '5. En preparación → 6. Caja lista con etiqueta → 7. En reparto a tu domicilio → 8. Entregado con conformidad.'
    ],
    tips: [
      'Puedes consultar el estado de tu pedido las 24 horas desde tu panel móvil.',
      'Si un estado cambia a "Reprogramado", revisa las notas del chofer para coordinar el nuevo horario.'
    ],
    quizQuestion: '¿Dónde puedes verificar el estado de tus pedidos en cualquier momento?',
    quizOptions: [
      'Solo yendo personalmente a una sucursal física.',
      'En tu panel de revendedor en la sección "Mis Pedidos", con fecha y hora de cada movimiento.',
      'En las redes sociales públicas.',
      'Llamando a las marcas Natura o AVON.'
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    title: '9. Entregas a Domicilio y Recepción Segura',
    duration: '5 min',
    category: 'Logística',
    summary: 'Políticas de entrega exclusiva a domicilio en los 5 días posteriores al cierre del ciclo.',
    content: [
      'Las entregas se realizan exclusivamente en el domicilio registrado dentro de un plazo de hasta 5 días hábiles tras el cierre del ciclo.',
      'El chofer respetará los días y horarios que declaraste en tu ficha (ej: tardes de 14 a 18 hs).',
      'Si no estás tú personalmente, solo podrá recibir la persona que hayas autorizado formalmente con DNI.'
    ],
    tips: [
      'Revisa que la caja venga precintada y con la etiqueta oficial que contiene tu nombre y número de pedido.',
      'Verifica el contenido antes de firmar la planilla de entrega.'
    ],
    quizQuestion: '¿Cuál es el plazo estipulado para las entregas a domicilio tras el cierre del ciclo?',
    quizOptions: [
      '60 días después.',
      'Hasta 5 días posteriores al cierre del ciclo comercial en tu franja horaria declarada.',
      'No hay entregas a domicilio, hay que viajar a buscarlas.',
      'El mismo día en que abres la app.'
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    title: '10. Compartir Productos, Enlaces y Herramientas de Venta',
    duration: '6 min',
    category: 'Marketing y Ventas',
    summary: 'Aprende a usar "Mi Herramienta de Ventas" con IA para generar publicaciones atractivas en WhatsApp, Instagram y redes.',
    content: [
      'La sección "Mi Herramienta de Ventas" te permite crear textos persuasivos con Inteligencia Artificial para tus clientas.',
      'Con un solo toque puedes enviar fichas de productos y catálogos directamente a WhatsApp o compartirlos en Instagram, Facebook y TikTok.',
      'Seguridad: Los enlaces que compartes muestran únicamente fotos, descripciones y precios públicos. Tu comisión y datos privados jamás se revelan.'
    ],
    tips: [
      'Personaliza los mensajes de IA agregando el nombre de tu clienta antes de enviar.',
      'Publica en tus estados de WhatsApp 2 o 3 productos por día para mantenerte activa.'
    ],
    quizQuestion: '¿Qué información ve tu clienta cuando le compartes un enlace de catálogo o producto?',
    quizOptions: [
      'Tu dirección particular y el costo mayorista.',
      'Únicamente fotografía, nombre, descripción y el precio público oficial.',
      'El panel de control administrativo.',
      'Los pedidos de tus vecinas.'
    ],
    correctAnswer: 1
  }
];
