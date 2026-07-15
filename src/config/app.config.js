/**
 * Configuración centralizada de la aplicación
 * Todos los valores constantes deben estar aquí
 */

// ========== CONFIGURACIÓN DE LA RIFA ==========
export const RIFA_CONFIG = {
  TOTAL_NUMBERS: 100,
  MIN_NUMBER: 0,
  MAX_NUMBER: 99,
  PADDING: 2, // Formato "00", "01", etc
  NUMBERS_PER_PAGE: 50, // Para paginación
  NUMBERS_PER_ROW: 10, // Para grilla
};

// ========== CONFIGURACIÓN DE PREMIOS Y FECHAS ==========
export const RIFA_DETAILS = {
  NAME: '🎟️ Gran Rifa Universitaria',
  DESCRIPTION: 'Gran rifa pro fondos Universitarios',            
  PRIZE_AMOUNT: 500000, // Valor en COP
  PRIZE_DESCRIPTION: '$500.000 COP en efectivo',
  DRAW_DATE: '19 de Agosto de 2026',
  DRAW_TIME: '14:00 (11:00 PM)',
  LOTTERY_NAME: 'Lotería del Meta',
  TICKET_PRICE: 20000, // Precio por número
  CURRENCY: 'COP',
  CURRENCY_SYMBOL: '$',
};

// ========== CONTACTO ==========
export const CONTACT_INFO = {
  PHONE: '3185776314',
  WHATSAPP: 'https://wa.me/573185776314',
  EMAIL: 'camiloacevedovargas@email.com',
  CITY: 'Villavicencio, Meta',
};

// ========== INFORMACIÓN DE PAGO ==========
export const PAYMENT_CONFIG = {
  METHOD: 'Nequi',
  NEQUI: {
    PHONE: '3185776314',
    HOLDER_NAME: 'Juan Camilo Acevedo',
    DOCUMENT_TYPE: 'CC',
    DOCUMENT: '1121939432',
    QR_CODE: '/assets/nequi-qr.png', // Reemplazar con URL de QR dinámico
  },
  // Configuración para futuros métodos de pago
  WOMPI: {
    PUBLIC_KEY: import.meta.env.VITE_WOMPI_PUBLIC_KEY || '',
    ENABLED: false,
  },
  STRIPE: {
    PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
    ENABLED: false,
  },
  MERCADOPAGO: {
    PUBLIC_KEY: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
    ENABLED: false,
  },
  PAYU: {
    API_KEY: import.meta.env.VITE_PAYU_API_KEY || '',
    ENABLED: false,
  },
  BOLD: {
    API_KEY: import.meta.env.VITE_BOLD_API_KEY || '',
    ENABLED: false,
  },
};

// ========== ÚLTIMO GANADOR ==========
// Mientras sea `null`, la sección de "Último Ganador" muestra el mensaje
// de transparencia. Cuando haya un sorteo, reemplaza este valor así:
// export const LAST_WINNER = {
//   name: 'Juan Pérez',
//   number: '42',
//   prize: '$500.000 COP',
//   date: '2026-08-19',
//   photo: null, // ruta a una imagen si tienes, ej: '/assets/winners/ganador1.jpg'
// };
export const LAST_WINNER = null;

// ========== ESTADOS DE NÚMEROS ==========
export const NUMBER_STATES = {
  AVAILABLE: {
    key: 'available',
    label: 'Disponible',
    color: '#10b981', // Verde
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    badge: '✓ Disponible',
    icon: '○',
  },
  RESERVED: {
    key: 'reserved',
    label: 'Reservado',
    color: '#fbbf24', // Amarillo
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    badge: '⏳ Reservado',
    icon: '◐',
  },
  PENDING: {
    key: 'pending',
    label: 'Pendiente',
    color: '#f97316', // Naranja
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    badge: '⌛ Pendiente de Validación',
    icon: '◔',
  },
  SOLD: {
    key: 'sold',
    label: 'Vendido',
    color: '#ef4444', // Rojo
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    badge: '✓ Vendido',
    icon: '●',
  },
};

// ========== PASOS DEL FLUJO DE COMPRA ==========
export const PURCHASE_STEPS = {
  FORM: {
    key: 'form',
    label: 'Tus Datos',
    description: 'Completa tus datos personales',
    icon: '📋',
  },
  PAYMENT: {
    key: 'payment',
    label: 'Realizar Pago',
    description: 'Realiza el pago por Nequi',
    icon: '💳',
  },
  CONFIRMATION: {
    key: 'confirmation',
    label: 'Confirmar Compra',
    description: 'Sube el comprobante de pago',
    icon: '✅',
  },
};

// ========== VALIDACIÓN DE FORMULARIOS ==========
export const VALIDATION_RULES = {
  NAME: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    message: 'Nombre debe tener entre 3 y 100 caracteres',
  },
  PHONE: {
    required: true,
    pattern: /^3\d{9}$/,
    message: 'Teléfono debe ser un número válido (ej: 3185776314)',
  },
  EMAIL: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email debe ser válido',
  },
  CITY: {
    required: false,
    minLength: 2,
    maxLength: 50,
    message: 'Ciudad debe tener entre 2 y 50 caracteres',
  },
};

// ========== MENSAJES DE LA APLICACIÓN ==========
export const MESSAGES = {
  SUCCESS: {
    FORM_SUBMITTED: '✅ Formulario enviado correctamente',
    PAYMENT_UPLOADED: '✅ Comprobante cargado correctamente',
    PURCHASE_COMPLETE: '✅ Compra completada. ¡Gracias por participar!',
  },
  ERROR: {
    INVALID_FORM: '❌ Por favor completa todos los campos correctamente',
    INVALID_FILE: '❌ El archivo debe ser una imagen (JPG, PNG, WebP)',
    FILE_TOO_LARGE: '❌ El archivo es muy grande (máximo 2MB)',
    NETWORK_ERROR: '❌ Error de conexión. Intenta nuevamente',
    UNKNOWN_ERROR: '❌ Error inesperado. Por favor intenta más tarde',
  },
  INFO: {
    PROCESSING: '⏳ Procesando tu solicitud...',
    VALIDATION_PENDING: '⌛ Tu solicitud está siendo validada',
    PAYMENT_CONFIRMED: '💚 Tu pago ha sido confirmado',
  },
};

// ========== CONFIGURACIÓN DE ADMIN ==========
export const ADMIN_CONFIG = {
  ADMIN_PASSWORD_HASH: '$2a$10$...', // Se genera en server
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
};

// ========== ALMACENAMIENTO ==========
export const STORAGE_KEYS = {
  RIFA_DATA: 'rifa_data',
  ADMIN_SESSION: 'admin_session',
  USER_PREFERENCES: 'user_preferences',
  PURCHASE_DRAFT: 'purchase_draft',
};

// ========== LÍMITES Y CONFIGURACIÓN DE USUARIO ==========
export const USER_CONFIG = {
  // 2MB: los comprobantes se guardan en localStorage del navegador (~5-10MB
  // de límite total), así que se mantiene un límite conservador para evitar
  // que el guardado falle silenciosamente al acumular varios comprobantes.
  // Si en el futuro se conecta un backend/almacenamiento real, este límite
  // puede subirse sin problema.
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  RESERVATION_TIMEOUT: 15 * 60 * 1000, // 15 minutos
};

// ========== ANIMACIONES ==========
export const ANIMATIONS = {
  TRANSITION_SPEED: 'duration-300',
  HOVER_SCALE: 'hover:scale-105',
  SHADOW_HOVER: 'hover:shadow-lg',
};

// ========== RUTAS (si se usa routing más adelante) ==========
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  NUMBERS: '/#numeros',
  INFO: '/#info',
  INSTRUCTIONS: '/#instrucciones',
};

// ========== ESTADÍSTICAS POR DEFECTO ==========
export const DEFAULT_STATS = {
  TOTAL_NUMBERS: RIFA_CONFIG.TOTAL_NUMBERS,
  SOLD_NUMBERS: 0,
  AVAILABLE_NUMBERS: RIFA_CONFIG.TOTAL_NUMBERS,
  PENDING_NUMBERS: 0,
  RESERVED_NUMBERS: 0,
  TOTAL_REVENUE: 0,
  CONVERSION_RATE: 0,
};

export default {
  RIFA_CONFIG,
  RIFA_DETAILS,
  CONTACT_INFO,
  PAYMENT_CONFIG,
  NUMBER_STATES,
  PURCHASE_STEPS,
  VALIDATION_RULES,
  MESSAGES,
  ADMIN_CONFIG,
  STORAGE_KEYS,
  USER_CONFIG,
  ANIMATIONS,
  ROUTES,
  DEFAULT_STATS,
  LAST_WINNER,
};
