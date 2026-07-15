/**
 * Hook usePurchaseForm
 * Gestiona estado y validación del formulario de compra
 */

import { useState, useCallback } from 'react';
import { VALIDATION_RULES, MESSAGES, USER_CONFIG } from '../config/app.config';

/**
 * Valida un campo individual
 * @param {string} fieldName - Nombre del campo
 * @param {*} value - Valor a validar
 * @returns {string|null} Mensaje de error o null si es válido
 */
const validateField = (fieldName, value) => {
  const rule = VALIDATION_RULES[fieldName.toUpperCase()];

  if (!rule) return null;

  // Validación requerida
  if (rule.required && (!value || value.trim() === '')) {
    return `${fieldName} es requerido`;
  }

  if (!value) return null; // Si no es requerido y está vacío, ok

  // Validación de longitud mínima
  if (rule.minLength && value.length < rule.minLength) {
    return rule.message || `${fieldName} debe tener al menos ${rule.minLength} caracteres`;
  }

  // Validación de longitud máxima
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.message || `${fieldName} no puede exceder ${rule.maxLength} caracteres`;
  }

  // Validación de patrón
  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message || `${fieldName} tiene un formato inválido`;
  }

  return null;
};

/**
 * Valida archivo de imagen
 * @param {File} file - Archivo a validar
 * @returns {Object} { isValid, error }
 */
const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'Debes seleccionar un archivo' };
  }

  // Verificar tamaño
  if (file.size > USER_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: MESSAGES.ERROR.FILE_TOO_LARGE,
    };
  }

  // Verificar tipo
  if (!USER_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: MESSAGES.ERROR.INVALID_FILE,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Convierte archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} Base64 del archivo
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
};

/**
 * Hook para gestionar formulario de compra
 * @returns {Object} Estado y funciones del formulario
 */
export const usePurchaseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  /**
   * Actualiza un campo del formulario
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar en tiempo real si el campo fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched]);

  /**
   * Marca un campo como "tocado"
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Maneja selección de archivo de comprobante
   */
  const handleProofFileChange = useCallback((e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validar archivo
    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        proof: validation.error,
      }));
      setProofFile(null);
      setProofPreview(null);
      return;
    }

    setProofFile(file);
    setErrors((prev) => ({
      ...prev,
      proof: null,
    }));

    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      setProofPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * Elimina archivo seleccionado
   */
  const removeProofFile = useCallback(() => {
    setProofFile(null);
    setProofPreview(null);
    setErrors((prev) => ({
      ...prev,
      proof: null,
    }));
  }, []);

  /**
   * Valida todo el formulario
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    const fieldsToValidate = ['name', 'phone', 'email', 'city'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Valida formulario de confirmación (con comprobante)
   */
  const validateConfirmationForm = useCallback(() => {
    const isFormValid = validateForm();

    if (!proofFile) {
      setErrors((prev) => ({
        ...prev,
        proof: 'Debes subir un comprobante de pago',
      }));
      return false;
    }

    return isFormValid;
  }, [proofFile, validateForm]);

  /**
   * Obtiene datos del formulario listos para enviar
   */
  const getFormData = useCallback(async () => {
    if (!validateForm()) {
      throw new Error(MESSAGES.ERROR.INVALID_FORM);
    }

    return {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      city: formData.city.trim() || null,
    };
  }, [formData, validateForm]);

  /**
   * Obtiene datos del formulario de confirmación
   */
  const getConfirmationData = useCallback(async () => {
    if (!validateConfirmationForm()) {
      throw new Error(MESSAGES.ERROR.INVALID_FORM);
    }

    setIsSubmitting(true);

    try {
      const proofBase64 = await fileToBase64(proofFile);

      return {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        city: formData.city.trim() || null,
        proof: proofBase64,
        proofFileName: proofFile.name,
        proofFileType: proofFile.type,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Error al procesar comprobante');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, proofFile, validateConfirmationForm]);

  /**
   * Reinicia el formulario
   */
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
    });
    setErrors({});
    setTouched({});
    setProofFile(null);
    setProofPreview(null);
    setIsSubmitting(false);
  }, []);

  /**
   * Establece datos en el formulario (pre-llenar)
   */
  const setFormValues = useCallback((values) => {
    setFormData((prev) => ({
      ...prev,
      ...values,
    }));
  }, []);

  /**
   * Obtiene el estado de un campo
   */
  const getFieldProps = useCallback(
    (fieldName) => ({
      name: fieldName,
      value: formData[fieldName] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: errors[fieldName],
      isTouched: touched[fieldName],
      className: errors[fieldName] && touched[fieldName] ? 'error' : '',
    }),
    [formData, errors, touched, handleChange, handleBlur]
  );

  /**
   * Indica si el formulario es válido para enviar
   */
  const isFormValid = useCallback(() => {
    return validateForm() && Object.keys(errors).length === 0;
  }, [validateForm, errors]);

  /**
   * Indica si el formulario de confirmación es válido
   */
  const isConfirmationValid = useCallback(() => {
    return validateConfirmationForm() && proofFile !== null;
  }, [validateConfirmationForm, proofFile]);

  return {
    // Estado
    formData,
    errors,
    touched,
    isSubmitting,
    proofFile,
    proofPreview,

    // Funciones de campo
    handleChange,
    handleBlur,
    getFieldProps,
    setFormValues,

    // Funciones de archivo
    handleProofFileChange,
    removeProofFile,

    // Validación
    validateForm,
    validateConfirmationForm,
    isFormValid,
    isConfirmationValid,

    // Obtener datos
    getFormData,
    getConfirmationData,

    // Utilidades
    resetForm,
    setErrors,
    setTouched,
  };
};

export default usePurchaseForm;
