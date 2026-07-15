/**
 * Servicio de Almacenamiento
 *
 * IMPORTANTE: Los datos DE LA RIFA (números, compradores, comprobantes)
 * viven en Firestore (nube, compartido entre todos los dispositivos).
 * Antes vivían en localStorage, que es exclusivo de cada navegador — por
 * eso un comprador y el admin, en dispositivos distintos, nunca se veían
 * entre sí. Con Firestore, ambos leen y escriben la MISMA fuente de datos.
 *
 * Lo que sigue en localStorage (a propósito, porque tiene sentido que sea
 * por-dispositivo): la sesión del admin, preferencias de UI y borradores
 * de formularios en progreso.
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';
import { STORAGE_KEYS, RIFA_CONFIG } from '../config/app.config';
import RifaService from './rifaService';

// Un único documento contiene todo el estado de la rifa.
// Si en el futuro se quiere manejar varias rifas, esto se puede convertir
// en una colección con un doc por rifa (ej: doc(db, 'rifas', rifaId)).
// Si Firebase no está configurado (faltan variables de entorno), esta
// referencia queda en null y cada método lo detecta antes de usarla,
// mostrando un error claro en vez de una excepción sin controlar.
const RIFA_DOC_REF = isFirebaseConfigured ? doc(db, 'rifa', 'main') : null;

const FIREBASE_NOT_CONFIGURED_MSG =
  'Firebase no está configurado. Completa las variables VITE_FIREBASE_* en tu archivo .env (ver .env.example) y en las variables de entorno de Vercel, luego vuelve a desplegar.';

class StorageService {
  /**
   * Inicializa el estado global de la rifa en Firestore.
   * Si no existe, crea uno nuevo con los 100 números disponibles.
   * @returns {Promise<Object>} Estado inicial de rifa
   */
  static async initializeRifaData() {
    if (!RIFA_DOC_REF) {
      throw new Error(FIREBASE_NOT_CONFIGURED_MSG);
    }

    const existingData = await this.getRifaData();

    if (existingData && this.isValidRifaData(existingData)) {
      return existingData;
    }

    const initialData = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      numbers: RifaService.generateNumbers().map((num) =>
        RifaService.createNumberData(num)
      ),
      metadata: {
        totalNumbers: RIFA_CONFIG.TOTAL_NUMBERS,
        totalSold: 0,
        totalRevenue: 0,
      },
    };

    const saved = await this.setRifaData(initialData);
    if (!saved) {
      throw new Error(
        'No se pudo inicializar la base de datos de la rifa. Verifica tu conexión a internet y la configuración de Firebase.'
      );
    }

    return initialData;
  }

  /**
   * Obtiene todos los datos de rifa desde Firestore (lectura única)
   * @returns {Promise<Object|null>} Datos de rifa o null si no existe
   */
  static async getRifaData() {
    if (!RIFA_DOC_REF) {
      console.error(FIREBASE_NOT_CONFIGURED_MSG);
      return null;
    }
    try {
      const snapshot = await getDoc(RIFA_DOC_REF);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      console.error('Error al leer datos de rifa (Firestore):', error);
      return null;
    }
  }

  /**
   * Guarda datos de rifa en Firestore
   * @param {Object} data - Datos a guardar
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async setRifaData(data) {
    if (!RIFA_DOC_REF) {
      console.error(FIREBASE_NOT_CONFIGURED_MSG);
      return false;
    }
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      await setDoc(RIFA_DOC_REF, dataToSave);
      return true;
    } catch (error) {
      console.error('Error al guardar datos de rifa (Firestore):', error);
      return false;
    }
  }

  /**
   * Se suscribe a cambios en tiempo real del documento de la rifa.
   * Así, si el admin aprueba una solicitud, el cliente lo ve reflejado
   * sin recargar la página (y viceversa).
   * @param {(data: Object) => void} callback - Se llama con los datos actualizados
   * @returns {() => void} Función para cancelar la suscripción
   */
  static subscribeToRifaData(callback) {
    if (!RIFA_DOC_REF) {
      console.error(FIREBASE_NOT_CONFIGURED_MSG);
      return () => {};
    }
    return onSnapshot(
      RIFA_DOC_REF,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data());
        }
      },
      (error) => {
        console.error('Error en la suscripción de rifa (Firestore):', error);
      }
    );
  }

  /**
   * Obtiene solo el array de números
   * @returns {Promise<Array>} Array de números
   */
  static async getNumbers() {
    const data = await this.getRifaData();
    return data?.numbers || [];
  }

  /**
   * Actualiza el array de números en Firestore
   * @param {Array} numbers - Nuevo array de números
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async setNumbers(numbers) {
    const data = (await this.getRifaData()) || (await this.initializeRifaData());
    data.numbers = numbers;

    const stats = RifaService.calculateStats(numbers);
    data.metadata = {
      totalNumbers: stats.total,
      totalSold: stats.sold,
      totalRevenue: stats.revenue,
    };

    return this.setRifaData(data);
  }

  /**
   * Actualiza un número específico
   * @param {string} number - Número a actualizar
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async updateNumber(number, updates) {
    const numbers = await this.getNumbers();
    const updatedNumbers = RifaService.updateNumber(numbers, number, updates);

    if (updatedNumbers.length === numbers.length) {
      return this.setNumbers(updatedNumbers);
    }

    return false;
  }

  /**
   * Obtiene datos de un número específico
   * @param {string} number - Número a buscar
   * @returns {Promise<Object|null>} Datos del número
   */
  static async getNumber(number) {
    const numbers = await this.getNumbers();
    return RifaService.getNumberData(numbers, number);
  }

  // ============================================================
  // Lo siguiente queda en localStorage a propósito: son datos
  // que tiene sentido que sean específicos de cada dispositivo/
  // navegador (sesión de admin, preferencias, borradores).
  // ============================================================

  /**
   * Guarda una sesión de admin
   * @param {Object} session - Datos de sesión
   * @returns {boolean} Éxito
   */
  static setAdminSession(session) {
    try {
      const sessionData = {
        ...session,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(
        STORAGE_KEYS.ADMIN_SESSION,
        JSON.stringify(sessionData)
      );
      return true;
    } catch (error) {
      console.error('Error al guardar sesión admin:', error);
      return false;
    }
  }

  /**
   * Obtiene sesión de admin
   * @returns {Object|null} Sesión o null si no existe/expiró
   */
  static getAdminSession() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!session) return null;

      const data = JSON.parse(session);
      const now = new Date();
      const expiresAt = new Date(data.expiresAt);

      if (now > expiresAt) {
        this.clearAdminSession();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error al leer sesión admin:', error);
      return null;
    }
  }

  /**
   * Elimina sesión de admin
   * @returns {boolean} Éxito
   */
  static clearAdminSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      return true;
    } catch (error) {
      console.error('Error al limpiar sesión admin:', error);
      return false;
    }
  }

  /**
   * Guarda preferencias del usuario
   * @param {Object} preferences - Preferencias
   * @returns {boolean} Éxito
   */
  static setUserPreferences(preferences) {
    try {
      const prefs = {
        ...this.getUserPreferences(),
        ...preferences,
      };
      localStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(prefs)
      );
      return true;
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      return false;
    }
  }

  /**
   * Obtiene preferencias del usuario
   * @returns {Object} Preferencias
   */
  static getUserPreferences() {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return prefs
        ? JSON.parse(prefs)
        : {
            theme: 'light',
            language: 'es',
            notifications: true,
          };
    } catch (error) {
      console.error('Error al leer preferencias:', error);
      return {};
    }
  }

  /**
   * Guarda un borrador de compra en progreso
   * @param {Object} draft - Datos del borrador
   * @returns {boolean} Éxito
   */
  static savePurchaseDraft(draft) {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PURCHASE_DRAFT,
        JSON.stringify(draft)
      );
      return true;
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      return false;
    }
  }

  /**
   * Obtiene borrador de compra
   * @returns {Object|null} Borrador
   */
  static getPurchaseDraft() {
    try {
      const draft = localStorage.getItem(STORAGE_KEYS.PURCHASE_DRAFT);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error al leer borrador:', error);
      return null;
    }
  }

  /**
   * Elimina borrador de compra
   * @returns {boolean} Éxito
   */
  static clearPurchaseDraft() {
    try {
      localStorage.removeItem(STORAGE_KEYS.PURCHASE_DRAFT);
      return true;
    } catch (error) {
      console.error('Error al limpiar borrador:', error);
      return false;
    }
  }

  /**
   * Exporta todos los datos (rifa desde Firestore + preferencias locales)
   * @returns {Promise<Object>} Datos completos
   */
  static async exportAllData() {
    return {
      rifaData: await this.getRifaData(),
      userPreferences: this.getUserPreferences(),
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Importa datos desde JSON hacia Firestore
   * @param {Object} importedData - Datos a importar
   * @returns {Promise<boolean>} Éxito
   */
  static async importData(importedData) {
    try {
      if (importedData.rifaData) {
        if (!this.isValidRifaData(importedData.rifaData)) {
          console.error('Datos de rifa inválidos');
          return false;
        }
        await this.setRifaData(importedData.rifaData);
      }

      if (importedData.userPreferences) {
        this.setUserPreferences(importedData.userPreferences);
      }

      return true;
    } catch (error) {
      console.error('Error al importar datos:', error);
      return false;
    }
  }

  /**
   * Valida que los datos de rifa sean correctos
   * @param {Object} data - Datos a validar
   * @returns {boolean} Es válido
   */
  static isValidRifaData(data) {
    return (
      data &&
      Array.isArray(data.numbers) &&
      data.numbers.length === RIFA_CONFIG.TOTAL_NUMBERS &&
      data.metadata &&
      typeof data.metadata === 'object'
    );
  }

  /**
   * Limpia los datos locales del dispositivo (sesión admin, borradores).
   * NO borra los datos de la rifa en Firestore (eso se hace desde la
   * consola de Firebase, para evitar borrados accidentales).
   * @returns {boolean} Éxito
   */
  static clearLocalData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      localStorage.removeItem(STORAGE_KEYS.PURCHASE_DRAFT);
      return true;
    } catch (error) {
      console.error('Error al limpiar datos locales:', error);
      return false;
    }
  }

  /**
   * Crea un backup descargable de los datos de la rifa
   * @returns {Promise<string>} URL del backup descargable
   */
  static async createBackup() {
    const backup = await this.exportAllData();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    return URL.createObjectURL(blob);
  }

  /**
   * Restaura desde backup
   * @param {File} backupFile - Archivo de backup
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async restoreFromBackup(backupFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const success = await this.importData(data);
          resolve(success);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsText(backupFile);
    });
  }
}

export default StorageService;
