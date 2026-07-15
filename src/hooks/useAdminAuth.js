/**
 * Hook useAdminAuth
 * Gestiona autenticación y sesión del administrador
 * Nota: Esto es simple para desarrollo
 * En producción, implementar en servidor con JWT
 */

import { useState, useCallback, useEffect } from 'react';
import StorageService from '../services/storageService';
import { ADMIN_CONFIG, MESSAGES } from '../config/app.config';

// En producción, esto vendría del servidor
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin123!';

/**
 * Hash simple de contraseña (solo para desarrollo)
 * En producción: usar bcrypt en backend
 */
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32-bit integer
  }
  return hash.toString();
};

/**
 * Hook para autenticación de admin
 */
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  /**
   * Inicializa sesión: verifica si hay sesión activa
   */
  useEffect(() => {
    const initSession = () => {
      try {
        setIsLoading(true);

        const session = StorageService.getAdminSession();

        if (session) {
          setIsAuthenticated(true);
          setSessionData(session);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error al inicializar sesión:', err);
        setError('Error al verificar sesión');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  /**
   * Verifica si está bloqueado por intentos fallidos
   */
  useEffect(() => {
    if (!isLocked || !lockoutTime) return;

    const now = new Date();
    const lockedUntil = new Date(lockoutTime);

    if (now >= lockedUntil) {
      // Desbloquear
      setIsLocked(false);
      setLockoutTime(null);
      setLoginAttempts(0);
    }
  }, [isLocked, lockoutTime]);

  /**
   * Intenta login
   */
  const login = useCallback(
    (password) => {
      try {
        setError(null);

        // Verificar bloqueo
        if (isLocked) {
          setError('Demasiados intentos. Intenta más tarde.');
          return false;
        }

        // Verificar contraseña
        if (password !== ADMIN_PASSWORD) {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);

          if (newAttempts >= ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS) {
            setIsLocked(true);
            const lockoutEnd = new Date(
              Date.now() + ADMIN_CONFIG.LOCKOUT_DURATION
            );
            setLockoutTime(lockoutEnd.toISOString());
            setError('Demasiados intentos fallidos. Intenta más tarde.');
            return false;
          }

          setError('Contraseña incorrecta');
          return false;
        }

        // Login exitoso
        const session = {
          isAdmin: true,
          loginTime: new Date().toISOString(),
        };

        StorageService.setAdminSession(session);
        setIsAuthenticated(true);
        setSessionData(session);
        setLoginAttempts(0);

        return true;
      } catch (err) {
        setError(err.message || 'Error en login');
        return false;
      }
    },
    [isLocked, loginAttempts]
  );

  /**
   * Logout
   */
  const logout = useCallback(() => {
    try {
      StorageService.clearAdminSession();
      setIsAuthenticated(false);
      setSessionData(null);
      setError(null);
      return true;
    } catch (err) {
      setError('Error al cerrar sesión');
      return false;
    }
  }, []);

  /**
   * Verifica si sesión está activa
   */
  const isSessionActive = useCallback(() => {
    return isAuthenticated && sessionData !== null;
  }, [isAuthenticated, sessionData]);

  /**
   * Obtiene tiempo restante de sesión
   */
  const getSessionTimeRemaining = useCallback(() => {
    if (!sessionData) return null;

    const session = StorageService.getAdminSession();
    if (!session) return null;

    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const remaining = expiresAt - now;

    if (remaining <= 0) {
      logout();
      return null;
    }

    return remaining;
  }, [sessionData, logout]);

  /**
   * Extiende sesión
   */
  const extendSession = useCallback(() => {
    if (!isAuthenticated) return false;

    try {
      const newSession = {
        ...sessionData,
        loginTime: new Date().toISOString(),
      };

      StorageService.setAdminSession(newSession);
      setSessionData(newSession);
      return true;
    } catch (err) {
      setError('Error al extender sesión');
      return false;
    }
  }, [isAuthenticated, sessionData]);

  /**
   * Cambia la contraseña del admin
   * En producción, esto debe ser en servidor
   */
  const changePassword = useCallback((currentPassword, newPassword) => {
    try {
      if (currentPassword !== ADMIN_PASSWORD) {
        setError('Contraseña actual incorrecta');
        return false;
      }

      if (newPassword.length < 6) {
        setError('Nueva contraseña debe tener al menos 6 caracteres');
        return false;
      }

      // En producción: enviar al servidor
      console.warn(
        'En producción, cambiar contraseña en servidor seguro'
      );

      setError(null);
      return true;
    } catch (err) {
      setError('Error al cambiar contraseña');
      return false;
    }
  }, []);

  /**
   * Reset contraseña (solo para development)
   */
  const resetPassword = useCallback(() => {
    console.warn('Función de reset solo para desarrollo');
    // En producción: enviar email de recuperación
  }, []);

  /**
   * Obtiene información de sesión
   */
  const getSessionInfo = useCallback(() => {
    if (!isAuthenticated) return null;

    const session = StorageService.getAdminSession();
    if (!session) return null;

    return {
      isAuthenticated: true,
      loginTime: new Date(session.loginTime),
      expiresAt: new Date(session.expiresAt),
      timeRemaining: getSessionTimeRemaining(),
    };
  }, [isAuthenticated, getSessionTimeRemaining]);

  return {
    // Estado
    isAuthenticated,
    isLoading,
    error,
    isLocked,
    lockoutTime,
    loginAttempts,
    sessionData,

    // Funciones
    login,
    logout,
    extendSession,
    changePassword,
    resetPassword,

    // Consultas
    isSessionActive,
    getSessionTimeRemaining,
    getSessionInfo,

    // Utilidades
    setError,
  };
};

export default useAdminAuth;
