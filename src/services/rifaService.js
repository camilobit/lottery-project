/**
 * Servicio de Rifa
 * Lógica centralizada para:
 * - Generar números
 * - Obtener estado de números
 * - Gestionar vendidos
 * - Calcular estadísticas
 */

import {
  RIFA_CONFIG,
  NUMBER_STATES,
  RIFA_DETAILS,
  STORAGE_KEYS,
} from '../config/app.config';

class RifaService {
  /**
   * Genera el array de números disponibles
   * @returns {string[]} Array de números formateados (00, 01, ..., 99)
   */
  static generateNumbers() {
    return Array.from(
      { length: RIFA_CONFIG.TOTAL_NUMBERS },
      (_, i) => i.toString().padStart(RIFA_CONFIG.PADDING, '0')
    );
  }

  /**
   * Crea estructura inicial de un número
   * @param {string} number - Número a crear
   * @param {string} state - Estado inicial
   * @returns {Object} Objeto número con todos los datos
   */
  static createNumberData(number, state = NUMBER_STATES.AVAILABLE.key) {
    return {
      number,
      state,
      buyerName: null,
      buyerPhone: null,
      buyerEmail: null,
      buyerCity: null,
      reservedAt: null,
      purchasedAt: null,
      proof: null,
      proofUrl: null,
      observations: null,
      adminNotes: null,
      transactionId: null,
      paymentDate: null,
      confirmationDate: null,
    };
  }

  /**
   * Obtiene el estado de un número específico
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a buscar
   * @returns {Object|null} Objeto número o null si no existe
   */
  static getNumberData(numbers, number) {
    return numbers.find((n) => n.number === number) || null;
  }

  /**
   * Obtiene todos los números con un estado específico
   * @param {Array} numbers - Array de números
   * @param {string} state - Estado a filtrar
   * @returns {Array} Números con el estado especificado
   */
  static getNumbersByState(numbers, state) {
    return numbers.filter((n) => n.state === state);
  }

  /**
   * Actualiza el estado de un número
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a actualizar
   * @param {Object} data - Datos a actualizar
   * @returns {Array} Array actualizado
   */
  static updateNumber(numbers, number, data) {
    return numbers.map((n) =>
      n.number === number ? { ...n, ...data } : n
    );
  }

  /**
   * Reserva un número (cambiar a RESERVED)
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a reservar
   * @returns {Array} Array actualizado
   */
  static reserveNumber(numbers, number) {
    return this.updateNumber(numbers, number, {
      state: NUMBER_STATES.RESERVED.key,
      reservedAt: new Date().toISOString(),
    });
  }

  /**
   * Libera una reserva (vuelve a AVAILABLE)
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a liberar
   * @returns {Array} Array actualizado
   */
  static releaseReservation(numbers, number) {
    const numberData = this.getNumberData(numbers, number);
    if (!numberData) return numbers;

    // Solo liberar si está reservado o pendiente
    if (
      [
        NUMBER_STATES.RESERVED.key,
        NUMBER_STATES.PENDING.key,
      ].includes(numberData.state)
    ) {
      return this.updateNumber(numbers, number, {
        state: NUMBER_STATES.AVAILABLE.key,
        buyerName: null,
        buyerPhone: null,
        buyerEmail: null,
        buyerCity: null,
        reservedAt: null,
        paymentDate: null,
        proof: null,
        proofUrl: null,
        observations: null,
      });
    }

    return numbers;
  }

  /**
   * Libera un número SIN IMPORTAR su estado actual (uso exclusivo admin).
   * A diferencia de releaseReservation, esto funciona incluso si el número
   * ya está VENDIDO. Borra por completo los datos del comprador.
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a liberar
   * @returns {Array} Array actualizado
   */
  static adminReleaseNumber(numbers, number) {
    return this.updateNumber(numbers, number, {
      state: NUMBER_STATES.AVAILABLE.key,
      buyerName: null,
      buyerPhone: null,
      buyerEmail: null,
      buyerCity: null,
      reservedAt: null,
      purchasedAt: null,
      paymentDate: null,
      confirmationDate: null,
      proof: null,
      proofUrl: null,
      observations: null,
      adminNotes: null,
      transactionId: null,
    });
  }

  /**
   * Actualiza los datos del comprador de un número sin cambiar su estado
   * (uso admin, para corregir nombre, teléfono, email, ciudad, etc).
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a editar
   * @param {Object} buyerData - Nuevos datos { name, phone, email, city, observations }
   * @returns {Array} Array actualizado
   */
  static updateBuyerInfo(numbers, number, buyerData) {
    return this.updateNumber(numbers, number, {
      buyerName: buyerData.name ?? null,
      buyerPhone: buyerData.phone ?? null,
      buyerEmail: buyerData.email || null,
      buyerCity: buyerData.city || null,
      observations: buyerData.observations || null,
    });
  }

  /**
   * Cambia manualmente el estado de un número (uso admin).
   * Si el nuevo estado es VENDIDO, registra la fecha de confirmación.
   * Si el nuevo estado es DISPONIBLE, limpia los datos del comprador.
   * @param {Array} numbers - Array de números
   * @param {string} number - Número a modificar
   * @param {string} newState - Nuevo estado (available|reserved|pending|sold)
   * @returns {Array} Array actualizado
   */
  static setNumberState(numbers, number, newState) {
    if (newState === NUMBER_STATES.AVAILABLE.key) {
      return this.adminReleaseNumber(numbers, number);
    }

    const updates = { state: newState };

    if (newState === NUMBER_STATES.SOLD.key) {
      updates.purchasedAt = new Date().toISOString();
      updates.confirmationDate = new Date().toISOString();
    }

    return this.updateNumber(numbers, number, updates);
  }

  /**
   * Marca un número como pendiente de validación
   * @param {Array} numbers - Array de números
   * @param {string} number - Número
   * @param {Object} buyerData - Datos del comprador (incluye el comprobante en base64)
   * @returns {Array} Array actualizado
   */
  static markAsPending(numbers, number, buyerData) {
    return this.updateNumber(numbers, number, {
      state: NUMBER_STATES.PENDING.key,
      buyerName: buyerData.name,
      buyerPhone: buyerData.phone,
      buyerEmail: buyerData.email || null,
      buyerCity: buyerData.city || null,
      paymentDate: new Date().toISOString(),
      observations: buyerData.observations || null,
      proof: buyerData.proof || null,
      proofFileName: buyerData.proofFileName || null,
      proofFileType: buyerData.proofFileType || null,
    });
  }

  /**
   * Aprueba una compra (cambiar a SOLD)
   * @param {Array} numbers - Array de números
   * @param {string} number - Número
   * @param {Object} adminData - Datos del admin
   * @returns {Array} Array actualizado
   */
  static approvePurchase(numbers, number, adminData = {}) {
    return this.updateNumber(numbers, number, {
      state: NUMBER_STATES.SOLD.key,
      purchasedAt: new Date().toISOString(),
      confirmationDate: new Date().toISOString(),
      adminNotes: adminData.notes || null,
      transactionId: adminData.transactionId || null,
    });
  }

  /**
   * Rechaza una compra (vuelve a AVAILABLE)
   * @param {Array} numbers - Array de números
   * @param {string} number - Número
   * @param {string} reason - Razón del rechazo
   * @returns {Array} Array actualizado
   */
  static rejectPurchase(numbers, number, reason = '') {
    return this.updateNumber(numbers, number, {
      state: NUMBER_STATES.AVAILABLE.key,
      buyerName: null,
      buyerPhone: null,
      buyerEmail: null,
      buyerCity: null,
      reservedAt: null,
      paymentDate: null,
      proof: null,
      proofUrl: null,
      observations: null,
      adminNotes: reason,
    });
  }

  /**
   * Calcula estadísticas de la rifa
   * @param {Array} numbers - Array de números
   * @returns {Object} Estadísticas calculadas
   */
  static calculateStats(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
      return {
        total: RIFA_CONFIG.TOTAL_NUMBERS,
        available: RIFA_CONFIG.TOTAL_NUMBERS,
        reserved: 0,
        pending: 0,
        sold: 0,
        percentage: 0,
        revenue: 0,
      };
    }

    const available = numbers.filter(
      (n) => n.state === NUMBER_STATES.AVAILABLE.key
    ).length;
    const reserved = numbers.filter(
      (n) => n.state === NUMBER_STATES.RESERVED.key
    ).length;
    const pending = numbers.filter(
      (n) => n.state === NUMBER_STATES.PENDING.key
    ).length;
    const sold = numbers.filter(
      (n) => n.state === NUMBER_STATES.SOLD.key
    ).length;

    const total = numbers.length;
    const percentage = total > 0 ? (sold / total) * 100 : 0;
    const revenue = sold * RIFA_DETAILS.TICKET_PRICE;

    return {
      total,
      available,
      reserved,
      pending,
      sold,
      percentage: parseFloat(percentage.toFixed(2)),
      revenue,
      remainingTarget: Math.max(0, total - sold),
    };
  }

  /**
   * Busca números por criterio
   * @param {Array} numbers - Array de números
   * @param {string} query - Búsqueda (número, nombre de comprador)
   * @returns {Array} Números que coinciden
   */
  static searchNumbers(numbers, query) {
    const q = query.toLowerCase().trim();
    return numbers.filter(
      (n) =>
        n.number.includes(q) ||
        (n.buyerName && n.buyerName.toLowerCase().includes(q))
    );
  }

  /**
   * Filtra números por estado
   * @param {Array} numbers - Array de números
   * @param {Array} states - Array de estados a filtrar
   * @returns {Array} Números filtrados
   */
  static filterByStates(numbers, states = []) {
    if (states.length === 0) return numbers;
    return numbers.filter((n) => states.includes(n.state));
  }

  /**
   * Pagina un array de números
   * @param {Array} numbers - Array de números
   * @param {number} page - Número de página (0-based)
   * @param {number} pageSize - Tamaño de página
   * @returns {Object} { items, total, pages, currentPage }
   */
  static paginate(numbers, page = 0, pageSize = RIFA_CONFIG.NUMBERS_PER_PAGE) {
    const total = numbers.length;
    const pages = Math.ceil(total / pageSize);
    const validPage = Math.min(page, Math.max(0, pages - 1));

    return {
      items: numbers.slice(
        validPage * pageSize,
        (validPage + 1) * pageSize
      ),
      total,
      pages,
      currentPage: validPage,
      pageSize,
      hasNextPage: validPage < pages - 1,
      hasPrevPage: validPage > 0,
    };
  }

  /**
   * Exporta números a formato JSON
   * @param {Array} numbers - Array de números
   * @returns {string} JSON formateado
   */
  static exportAsJSON(numbers) {
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        data: numbers,
        stats: this.calculateStats(numbers),
      },
      null,
      2
    );
  }

  /**
   * Exporta números a formato CSV
   * @param {Array} numbers - Array de números
   * @returns {string} CSV formateado
   */
  static exportAsCSV(numbers) {
    const headers = [
      'Número',
      'Estado',
      'Nombre',
      'Teléfono',
      'Email',
      'Ciudad',
      'Fecha de Reserva',
      'Fecha de Pago',
      'Notas',
    ].join(',');

    const rows = numbers.map((n) =>
      [
        n.number,
        n.state,
        n.buyerName || '',
        n.buyerPhone || '',
        n.buyerEmail || '',
        n.buyerCity || '',
        n.reservedAt || '',
        n.paymentDate || '',
        n.adminNotes || '',
      ].join(',')
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * Obtiene historial de cambios (últimas compras)
   * @param {Array} numbers - Array de números
   * @param {number} limit - Cantidad de registros
   * @returns {Array} Últimas compras
   */
  static getHistory(numbers, limit = 10) {
    return numbers
      .filter(
        (n) =>
          n.state === NUMBER_STATES.SOLD.key || n.state === NUMBER_STATES.PENDING.key
      )
      .sort((a, b) => {
        const dateA = new Date(a.purchasedAt || a.paymentDate || 0);
        const dateB = new Date(b.purchasedAt || b.paymentDate || 0);
        return dateB - dateA;
      })
      .slice(0, limit)
      .map((n) => ({
        number: n.number,
        buyer: n.buyerName,
        state: n.state,
        date: n.purchasedAt || n.paymentDate,
        phone: n.buyerPhone,
      }));
  }

  /**
   * Valida integridad de datos de números
   * @param {Array} numbers - Array de números
   * @returns {Object} { isValid, errors }
   */
  static validateData(numbers) {
    const errors = [];

    if (!Array.isArray(numbers)) {
      errors.push('Los números no son un array válido');
    }

    if (numbers.length !== RIFA_CONFIG.TOTAL_NUMBERS) {
      errors.push(
        `Cantidad de números incorrecta. Esperado: ${RIFA_CONFIG.TOTAL_NUMBERS}, Recibido: ${numbers.length}`
      );
    }

    // Verificar duplicados
    const numberValues = numbers.map((n) => n.number);
    const duplicates = numberValues.filter(
      (v, i) => numberValues.indexOf(v) !== i
    );
    if (duplicates.length > 0) {
      errors.push(`Números duplicados encontrados: ${duplicates.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Obtiene datos para dashboard administrativo
   * @param {Array} numbers - Array de números
   * @returns {Object} Datos del dashboard
   */
  static getDashboardData(numbers) {
    const stats = this.calculateStats(numbers);
    const pendingRequests = this.getNumbersByState(
      numbers,
      NUMBER_STATES.PENDING.key
    );
    const lastSold = this.getHistory(numbers, 5);
    const conversionRate =
      stats.total > 0 ? ((stats.sold / stats.total) * 100).toFixed(2) : 0;

    return {
      summary: {
        totalNumbers: stats.total,
        sold: stats.sold,
        available: stats.available,
        pending: stats.pending,
        reserved: stats.reserved,
        conversionRate: parseFloat(conversionRate),
        totalRevenue: stats.revenue,
        averagePerNumber: stats.revenue / Math.max(stats.sold, 1),
      },
      pendingRequests: pendingRequests.map((n) => ({
        number: n.number,
        buyer: n.buyerName,
        phone: n.buyerPhone,
        dateSubmitted: n.paymentDate,
        proof: n.proofUrl,
      })),
      recentSales: lastSold,
      stats,
    };
  }
}

export default RifaService;
