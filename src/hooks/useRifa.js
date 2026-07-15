/**
 * Hook useRifa
 * Estado global centralizado de la rifa
 * Combina RifaService y StorageService
 */

import { useState, useEffect, useCallback } from 'react';
import RifaService from '../services/rifaService';
import StorageService from '../services/storageService';
import { RIFA_DETAILS } from '../config/app.config';

/**
 * @typedef {Object} RifaState
 * @property {Array} numbers - Array de números con estados
 * @property {Object} stats - Estadísticas calculadas
 * @property {boolean} isLoading - Indicador de carga
 * @property {string|null} error - Mensaje de error
 */

/**
 * Hook personalizado para gestionar estado de rifa
 * @returns {RifaState & Object} Estado y funciones
 */
export const useRifa = () => {
  const [numbers, setNumbers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga datos iniciales desde Firestore y se suscribe a cambios en
   * tiempo real: si otro dispositivo (comprador o admin) modifica algo,
   * este hook lo refleja automáticamente sin necesidad de recargar.
   */
  useEffect(() => {
    let unsubscribe;
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await StorageService.initializeRifaData();

        if (!data) {
          throw new Error('No se pudieron cargar datos de rifa');
        }

        if (!isMounted) return;

        setNumbers(data.numbers || []);
        setStats(RifaService.calculateStats(data.numbers || []));

        // Suscripción en tiempo real: refleja cambios hechos desde
        // cualquier otro dispositivo (compra de un cliente, aprobación
        // del admin, etc) sin recargar la página.
        unsubscribe = StorageService.subscribeToRifaData((liveData) => {
          if (!isMounted) return;
          setNumbers(liveData.numbers || []);
          setStats(RifaService.calculateStats(liveData.numbers || []));
        });
      } catch (err) {
        setError(
          err.message ||
            'Error al cargar datos. Verifica tu conexión a internet.'
        );
        console.error('Error en useRifa:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /**
   * Actualiza estado local (optimista, respuesta instantánea en UI) y
   * persiste en Firestore. Si el guardado falla (por ejemplo, sin
   * conexión a internet), se informa mediante `error` en lugar de
   * fallar en silencio.
   */
  const updateNumbers = useCallback((newNumbers) => {
    setNumbers(newNumbers);
    setStats(RifaService.calculateStats(newNumbers));

    StorageService.setNumbers(newNumbers).then((saved) => {
      if (!saved) {
        setError(
          'No se pudo guardar el cambio. Verifica tu conexión a internet e intenta nuevamente.'
        );
      }
    });
  }, []);

  /**
   * Reserva un número
   */
  const reserveNumber = useCallback(
    (number) => {
      try {
        const updated = RifaService.reserveNumber(numbers, number);
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al reservar número');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Libera una reserva
   */
  const releaseReservation = useCallback(
    (number) => {
      try {
        const updated = RifaService.releaseReservation(numbers, number);
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al liberar reserva');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Marca un número como pendiente
   */
  const submitPurchase = useCallback(
    (number, buyerData) => {
      try {
        const updated = RifaService.markAsPending(
          numbers,
          number,
          buyerData
        );
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al enviar compra');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Aprueba una compra (admin)
   */
  const approvePurchase = useCallback(
    (number, adminData) => {
      try {
        const updated = RifaService.approvePurchase(
          numbers,
          number,
          adminData
        );
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al aprobar compra');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Rechaza una compra (admin)
   */
  const rejectPurchase = useCallback(
    (number, reason) => {
      try {
        const updated = RifaService.rejectPurchase(
          numbers,
          number,
          reason
        );
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al rechazar compra');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Libera un número SIN IMPORTAR su estado actual (uso admin).
   * Funciona incluso si ya está VENDIDO.
   */
  const releaseNumberAdmin = useCallback(
    (number) => {
      try {
        const updated = RifaService.adminReleaseNumber(numbers, number);
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al liberar número');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Edita los datos del comprador de un número sin cambiar su estado (uso admin)
   */
  const updateBuyerInfo = useCallback(
    (number, buyerData) => {
      try {
        const updated = RifaService.updateBuyerInfo(numbers, number, buyerData);
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al editar datos del comprador');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Cambia manualmente el estado de un número (uso admin)
   */
  const setNumberState = useCallback(
    (number, newState) => {
      try {
        const updated = RifaService.setNumberState(numbers, number, newState);
        updateNumbers(updated);
        return true;
      } catch (err) {
        setError('Error al cambiar estado del número');
        return false;
      }
    },
    [numbers, updateNumbers]
  );

  /**
   * Obtiene datos de un número
   */
  const getNumber = useCallback(
    (number) => {
      return RifaService.getNumberData(numbers, number);
    },
    [numbers]
  );

  /**
   * Obtiene números por estado
   */
  const getNumbersByState = useCallback(
    (state) => {
      return RifaService.getNumbersByState(numbers, state);
    },
    [numbers]
  );

  /**
   * Busca números
   */
  const searchNumbers = useCallback(
    (query) => {
      return RifaService.searchNumbers(numbers, query);
    },
    [numbers]
  );

  /**
   * Filtra números por estados
   */
  const filterByStates = useCallback(
    (states) => {
      return RifaService.filterByStates(numbers, states);
    },
    [numbers]
  );

  /**
   * Pagina números
   */
  const paginateNumbers = useCallback(
    (page, pageSize) => {
      return RifaService.paginate(numbers, page, pageSize);
    },
    [numbers]
  );

  /**
   * Obtiene historial
   */
  const getHistory = useCallback(
    (limit) => {
      return RifaService.getHistory(numbers, limit);
    },
    [numbers]
  );

  /**
   * Obtiene datos del dashboard admin
   */
  const getDashboardData = useCallback(() => {
    return RifaService.getDashboardData(numbers);
  }, [numbers]);

  /**
   * Exporta números como JSON
   */
  const exportAsJSON = useCallback(() => {
    return RifaService.exportAsJSON(numbers);
  }, [numbers]);

  /**
   * Exporta números como CSV
   */
  const exportAsCSV = useCallback(() => {
    return RifaService.exportAsCSV(numbers);
  }, [numbers]);

  /**
   * Limpia error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    numbers,
    stats,
    isLoading,
    error,
    rifaDetails: RIFA_DETAILS,

    // Funciones de compra
    reserveNumber,
    releaseReservation,
    submitPurchase,
    approvePurchase,
    rejectPurchase,

    // Funciones admin avanzadas
    releaseNumberAdmin,
    updateBuyerInfo,
    setNumberState,

    // Funciones de consulta
    getNumber,
    getNumbersByState,
    searchNumbers,
    filterByStates,
    paginateNumbers,
    getHistory,
    getDashboardData,

    // Funciones de exportación
    exportAsJSON,
    exportAsCSV,

    // Utilidades
    clearError,
    updateNumbers,
  };
};

export default useRifa;
