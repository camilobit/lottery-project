/**
 * Helpers y Utilidades
 * Funciones reutilizables para toda la aplicación
 */

import { RIFA_DETAILS, USER_CONFIG } from '../config/app.config';

// ========== FORMATEO DE DINERO ==========

/**
 * Formatea número como dinero
 * @param {number} amount - Cantidad
 * @param {string} currency - Moneda (COP, USD, etc)
 * @returns {string} Dinero formateado
 */
export const formatMoney = (amount, currency = 'COP') => {
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
};

/**
 * Formatea dinero simple sin símbolo
 * @param {number} amount - Cantidad
 * @returns {string} Número formateado
 */
export const formatNumberSimple = (amount) => {
  return new Intl.NumberFormat('es-CO').format(amount);
};

// ========== FORMATEO DE FECHAS ==========

/**
 * Formatea fecha corta
 * @param {Date|string} date - Fecha
 * @returns {string} Formato: DD/MM/YYYY
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formatea fecha y hora
 * @param {Date|string} date - Fecha
 * @returns {string} Formato: DD/MM/YYYY HH:MM
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formatea fecha relativa (hace 2 horas, hace 3 días)
 * @param {Date|string} date - Fecha
 * @returns {string} Fecha relativa
 */
export const formatDateRelative = (date) => {
  if (!date) return '';

  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'Hace unos segundos';
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
  if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;

  return formatDateShort(date);
};

/**
 * Obtiene diferencia de días hasta cierta fecha
 * @param {Date|string} targetDate - Fecha destino
 * @returns {number} Días restantes
 */
export const getDaysUntil = (targetDate) => {
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ========== FORMATEO DE TELÉFONO ==========

/**
 * Formatea número telefónico colombiano
 * @param {string} phone - Teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length !== 10) return phone;

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

/**
 * Valida formato de teléfono colombiano
 * @param {string} phone - Teléfono
 * @returns {boolean} Es válido
 */
export const isValidPhone = (phone) => {
  const pattern = /^3\d{9}$/;
  return pattern.test(phone);
};

/**
 * Genera enlace WhatsApp
 * @param {string} phone - Teléfono
 * @param {string} message - Mensaje (opcional)
 * @returns {string} URL de WhatsApp
 */
export const getWhatsAppLink = (phone, message = '') => {
  const cleaned = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleaned}${message ? `?text=${encodedMessage}` : ''}`;
};

// ========== VALIDACIÓN ==========

/**
 * Valida email
 * @param {string} email - Email
 * @returns {boolean} Es válido
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Valida nombre
 * @param {string} name - Nombre
 * @returns {boolean} Es válido
 */
export const isValidName = (name) => {
  const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,100}$/;
  return pattern.test(name);
};

/**
 * Valida archivo de imagen
 * @param {File} file - Archivo
 * @returns {boolean} Es válido
 */
export const isValidImageFile = (file) => {
  return (
    USER_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type) &&
    file.size <= USER_CONFIG.MAX_FILE_SIZE
  );
};

// ========== CONVERSIÓN DE ARCHIVOS ==========

/**
 * Convierte archivo a Base64
 * @param {File} file - Archivo
 * @returns {Promise<string>} Base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Descarga contenido como archivo
 * @param {string} content - Contenido
 * @param {string} filename - Nombre del archivo
 * @param {string} type - Tipo MIME
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ========== MANIPULACIÓN DE NÚMEROS ==========

/**
 * Formatea número para mostrar (00, 01, ..., 99)
 * @param {string|number} num - Número
 * @returns {string} Número formateado
 */
export const formatNumber = (num) => {
  return String(num).padStart(2, '0');
};

/**
 * Convierte porcentaje a string
 * @param {number} percentage - Porcentaje
 * @param {number} decimals - Decimales
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (percentage, decimals = 1) => {
  return `${percentage.toFixed(decimals)}%`;
};

// ========== UTILIDADES DE OBJETO Y ARRAY ==========

/**
 * Elimina propiedades vacías de un objeto
 * @param {Object} obj - Objeto
 * @returns {Object} Objeto limpio
 */
export const removeEmptyProps = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**
 * Debounce para funciones
 * @param {Function} func - Función
 * @param {number} wait - Milisegundos
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle para funciones
 * @param {Function} func - Función
 * @param {number} limit - Milisegundos
 * @returns {Function} Función throttled
 */
export const throttle = (func, limit = 300) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/**
 * Clona objeto profundamente
 * @param {Object} obj - Objeto
 * @returns {Object} Copia profunda
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merges dos objetos
 * @param {Object} obj1 - Primer objeto
 * @param {Object} obj2 - Segundo objeto
 * @returns {Object} Objeto combinado
 */
export const mergeObjects = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};

// ========== UTILIDADES DE GENERACIÓN ==========

/**
 * Genera ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Genera número aleatorio entre min y max
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {number} Número aleatorio
 */
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ========== UTILIDADES DE LOCALES ==========

/**
 * Obtiene nombre del estado en español
 * @param {string} state - Estado de número
 * @returns {string} Nombre en español
 */
export const getStateLabel = (state) => {
  const labels = {
    available: 'Disponible',
    reserved: 'Reservado',
    pending: 'Pendiente',
    sold: 'Vendido',
  };
  return labels[state] || state;
};

/**
 * Obtiene ícono del estado
 * @param {string} state - Estado de número
 * @returns {string} Ícono
 */
export const getStateIcon = (state) => {
  const icons = {
    available: '✓',
    reserved: '⏳',
    pending: '⌛',
    sold: '●',
  };
  return icons[state] || '?';
};

/**
 * Obtiene color del estado
 * @param {string} state - Estado de número
 * @returns {string} Color Tailwind
 */
export const getStateColor = (state) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    sold: 'bg-red-100 text-red-800',
  };
  return colors[state] || 'bg-gray-100 text-gray-800';
};

// ========== LOCALIZACIÓN ==========

/**
 * Obtiene información de contacto
 * @returns {Object} Información de contacto
 */
export const getContactInfo = () => {
  return {
    phone: '3185776314',
    whatsapp: 'https://wa.me/573185776314',
    email: 'ejemplo@email.com',
    city: 'Villavicencio, Meta',
  };
};

/**
 * Obtiene detalles de rifa
 * @returns {Object} Detalles de rifa
 */
export const getRifaDetails = () => {
  return RIFA_DETAILS;
};

// ========== DEBUG ==========

/**
 * Log con timestamp
 * @param {*} args - Argumentos
 */
export const debugLog = (...args) => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}]`, ...args);
  }
};

/**
 * Log de error con detalle
 * @param {Error} error - Error
 * @param {string} context - Contexto
 */
export const debugError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`[ERROR] ${context}:`, error);
  }
};

export default {
  formatMoney,
  formatNumberSimple,
  formatDateShort,
  formatDateTime,
  formatDateRelative,
  getDaysUntil,
  formatPhone,
  isValidPhone,
  getWhatsAppLink,
  isValidEmail,
  isValidName,
  isValidImageFile,
  fileToBase64,
  downloadFile,
  formatNumber,
  formatPercentage,
  removeEmptyProps,
  debounce,
  throttle,
  deepClone,
  mergeObjects,
  generateId,
  randomBetween,
  getStateLabel,
  getStateIcon,
  getStateColor,
  getContactInfo,
  getRifaDetails,
  debugLog,
  debugError,
};
