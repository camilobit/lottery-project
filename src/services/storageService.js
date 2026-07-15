/**
 * Servicio de Almacenamiento
 * Gestiona persistencia de datos en:
 * - localStorage (frontend)
 * - Posteriormente: Backend/Base de datos
 */

import { STORAGE_KEYS, RIFA_CONFIG } from '../config/app.config';
import RifaService from './rifaService';

class StorageService {
  /**
   * Inicializa el estado global de la rifa
   * Si no existe, crea uno nuevo
   * @returns {Object} Estado inicial de rifa
   */
  static initializeRifaData() {
    const existingData = this.getRifaData();

    if (existingData && this.isValidRifaData(existingData)) {
      return existingData;
    }

    // Crear datos iniciales
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

    this.setRifaData(initialData);
    return initialData;
  }

  /**
   * Obtiene todos los datos de rifa
   * @returns {Object|null} Datos de rifa o null si no existe
   */
  static getRifaData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RIFA_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al leer datos de rifa:', error);
      return null;
    }
  }

  /**
   * Guarda datos de rifa
   * @param {Object} data - Datos a guardar
   * @returns {boolean} Éxito de la operación
   */
  static setRifaData(data) {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        STORAGE_KEYS.RIFA_DATA,
        JSON.stringify(dataToSave)
      );
      return true;
    } catch (error) {
      console.error('Error al guardar datos de rifa:', error);
      return false;
    }
  }

  /**
   * Obtiene solo el array de números
   * @returns {Array} Array de números
   */
  static getNumbers() {
    const data = this.getRifaData();
    return data?.numbers || [];
  }

  /**
   * Actualiza el array de números
   * @param {Array} numbers - Nuevo array de números
   * @returns {boolean} Éxito de la operación
   */
  static setNumbers(numbers) {
    const data = this.getRifaData() || this.initializeRifaData();
    data.numbers = numbers;

    // Recalcular estadísticas
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
   * @returns {boolean} Éxito de la operación
   */
  static updateNumber(number, updates) {
    const numbers = this.getNumbers();
    const updatedNumbers = RifaService.updateNumber(numbers, number, updates);

    if (updatedNumbers.length === numbers.length) {
      return this.setNumbers(updatedNumbers);
    }

    return false;
  }

  /**
   * Obtiene datos de un número específico
   * @param {string} number - Número a buscar
   * @returns {Object|null} Datos del número
   */
  static getNumber(number) {
    const numbers = this.getNumbers();
    return RifaService.getNumberData(numbers, number);
  }

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

      // Verificar si expiró
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
   * Exporta todos los datos
   * @returns {Object} Datos completos
   */
  static exportAllData() {
    return {
      rifaData: this.getRifaData(),
      userPreferences: this.getUserPreferences(),
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Importa datos desde JSON
   * @param {Object} importedData - Datos a importar
   * @returns {boolean} Éxito
   */
  static importData(importedData) {
    try {
      if (importedData.rifaData) {
        if (!this.isValidRifaData(importedData.rifaData)) {
          console.error('Datos de rifa inválidos');
          return false;
        }
        this.setRifaData(importedData.rifaData);
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
   * Limpia todos los datos (cuidado con esto)
   * @returns {boolean} Éxito
   */
  static clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.RIFA_DATA);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      localStorage.removeItem(STORAGE_KEYS.PURCHASE_DRAFT);
      return true;
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      return false;
    }
  }

  /**
   * Obtiene tamaño usado en localStorage
   * @returns {number} Bytes usados
   */
  static getStorageSize() {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }

  /**
   * Crea un backup automático
   * @returns {string} URL del backup descargable
   */
  static createBackup() {
    const backup = this.exportAllData();
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

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const success = this.importData(data);
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

  /**
   * Sincroniza datos con servidor (preparado para futuro)
   * @param {Object} data - Datos a sincronizar
   * @returns {Promise<boolean>} Éxito
   */
  static async syncWithServer(data) {
    // TODO: Implementar cuando haya servidor backend
    console.warn(
      'Sincronización con servidor no implementada aún',
      data
    );
    return Promise.resolve(true);
  }
}

export default StorageService;
