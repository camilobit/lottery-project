/**
 * Servicio de Pagos — Arquitectura abstracta
 *
 * Objetivo: que agregar un nuevo proveedor de pago en el futuro
 * (Wompi, Mercado Pago, PayU, Bold) NO requiera tocar componentes de UI,
 * solo implementar una nueva clase aquí y activarla en la configuración.
 *
 * Actualmente el único proveedor ACTIVO es Nequi (proceso manual/semiautomático:
 * el usuario transfiere y sube un comprobante que el admin valida).
 */

import { PAYMENT_CONFIG, RIFA_DETAILS } from '../config/app.config';

/**
 * Clase base — todo proveedor de pago debe extenderla e implementar sus métodos.
 */
class PaymentProvider {
  /** Nombre visible para el usuario */
  getDisplayName() {
    throw new Error('getDisplayName() no implementado');
  }

  /**
   * Retorna los datos necesarios para que el usuario pueda pagar
   * (cuenta, llave, QR, instrucciones, etc)
   */
  getPaymentDetails(amount) {
    throw new Error('getPaymentDetails() no implementado');
  }

  /**
   * Valida el comprobante/pago enviado por el usuario.
   * En proveedores automáticos (Wompi, etc) esto llamaría a su API.
   * En Nequi (manual) simplemente valida que exista un comprobante adjunto,
   * ya que la aprobación final la hace el admin.
   */
  validatePayment(proofData) {
    throw new Error('validatePayment() no implementado');
  }

  /** Indica si este proveedor está disponible para usarse */
  isEnabled() {
    return false;
  }
}

/**
 * Proveedor activo: Nequi (transferencia manual + comprobante)
 */
class NequiPayment extends PaymentProvider {
  getDisplayName() {
    return 'Nequi';
  }

  getPaymentDetails(amount = RIFA_DETAILS.TICKET_PRICE) {
    return {
      method: this.getDisplayName(),
      phone: PAYMENT_CONFIG.NEQUI.PHONE,
      holderName: PAYMENT_CONFIG.NEQUI.HOLDER_NAME,
      documentType: PAYMENT_CONFIG.NEQUI.DOCUMENT_TYPE,
      document: PAYMENT_CONFIG.NEQUI.DOCUMENT,
      qrCode: PAYMENT_CONFIG.NEQUI.QR_CODE,
      amount,
      currency: RIFA_DETAILS.CURRENCY,
      instructions: [
        'Abre tu app de Nequi',
        `Envía $${amount.toLocaleString('es-CO')} al número ${PAYMENT_CONFIG.NEQUI.PHONE}`,
        'Toma una captura o guarda el comprobante',
        'Envíalo para confirmar tu aporte. GRACIAS',
      ],
    };
  }

  validatePayment(proofData) {
    if (!proofData || !proofData.proof) {
      return { isValid: false, message: 'Debes adjuntar un comprobante de pago' };
    }
    return {
      isValid: true,
      message: 'Comprobante recibido. Tu número quedará en estado Pendiente hasta que el administrador lo valide.',
    };
  }

  isEnabled() {
    return true;
  }
}

/**
 * Proveedores futuros — listos para implementar cuando se necesiten.
 * Cada uno solo requiere:
 *  1) Implementar getPaymentDetails() y validatePayment() con la API real
 *  2) Activar ENABLED: true en PAYMENT_CONFIG (app.config.js)
 *  3) Retornarlo desde getActivePaymentProvider()
 * El resto de la aplicación (PurchaseFlow, etc) no necesita cambios.
 */
class WompiPayment extends PaymentProvider {
  getDisplayName() {
    return 'Wompi';
  }
  getPaymentDetails() {
    throw new Error('Integración con Wompi pendiente de configurar.');
  }
  validatePayment() {
    throw new Error('Integración con Wompi pendiente de configurar.');
  }
  isEnabled() {
    return PAYMENT_CONFIG.WOMPI?.ENABLED || false;
  }
}

class MercadoPagoPayment extends PaymentProvider {
  getDisplayName() {
    return 'Mercado Pago';
  }
  getPaymentDetails() {
    throw new Error('Integración con Mercado Pago pendiente de configurar.');
  }
  validatePayment() {
    throw new Error('Integración con Mercado Pago pendiente de configurar.');
  }
  isEnabled() {
    return PAYMENT_CONFIG.MERCADOPAGO?.ENABLED || false;
  }
}

class PayUPayment extends PaymentProvider {
  getDisplayName() {
    return 'PayU';
  }
  getPaymentDetails() {
    throw new Error('Integración con PayU pendiente de configurar.');
  }
  validatePayment() {
    throw new Error('Integración con PayU pendiente de configurar.');
  }
  isEnabled() {
    return PAYMENT_CONFIG.PAYU?.ENABLED || false;
  }
}

class BoldPayment extends PaymentProvider {
  getDisplayName() {
    return 'Bold';
  }
  getPaymentDetails() {
    throw new Error('Integración con Bold pendiente de configurar.');
  }
  validatePayment() {
    throw new Error('Integración con Bold pendiente de configurar.');
  }
  isEnabled() {
    return PAYMENT_CONFIG.BOLD?.ENABLED || false;
  }
}

const PROVIDERS = {
  nequi: new NequiPayment(),
  wompi: new WompiPayment(),
  mercadopago: new MercadoPagoPayment(),
  payu: new PayUPayment(),
  bold: new BoldPayment(),
};

/**
 * Retorna el proveedor de pago activo actualmente.
 * Hoy siempre es Nequi; cuando se active otro proveedor en
 * PAYMENT_CONFIG, este es el único lugar que hay que tocar.
 */
export function getActivePaymentProvider() {
  return PROVIDERS.nequi;
}

/**
 * Retorna todos los proveedores actualmente habilitados
 * (útil el día que se quiera dejar elegir método de pago al usuario)
 */
export function getAvailableProviders() {
  return Object.entries(PROVIDERS)
    .filter(([, provider]) => provider.isEnabled())
    .map(([key, provider]) => ({ key, name: provider.getDisplayName() }));
}

export default {
  getActivePaymentProvider,
  getAvailableProviders,
};
