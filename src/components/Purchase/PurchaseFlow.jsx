import { useState } from 'react';
import { Modal, Button, Input, Alert } from '../Common';
import { usePurchaseForm } from '../../hooks/usePurchaseForm';
import { RIFA_DETAILS, PURCHASE_STEPS } from '../../config/app.config';
import { getActivePaymentProvider } from '../../services/paymentService';

const STEP_ORDER = [
  PURCHASE_STEPS.FORM.key,
  PURCHASE_STEPS.PAYMENT.key,
  PURCHASE_STEPS.CONFIRMATION.key,
];

/**
 * Modal con el flujo completo de compra de un número:
 * 1. Datos del comprador
 * 2. Pantalla de pago (Nequi)
 * 3. Confirmación + subida de comprobante
 */
export default function PurchaseFlow({ selectedNumber, onClose, onSubmitPurchase }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    proofPreview,
    handleChange,
    handleBlur,
    handleProofFileChange,
    removeProofFile,
    validateForm,
    getConfirmationData,
  } = usePurchaseForm();

  const currentStep = STEP_ORDER[stepIndex];
  const paymentProvider = getActivePaymentProvider();
  const payment = paymentProvider.getPaymentDetails(RIFA_DETAILS.TICKET_PRICE);

  const goNext = () => {
    if (currentStep === PURCHASE_STEPS.FORM.key) {
      if (!validateForm()) return;
    }
    setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleFinalSubmit = async () => {
    setSubmitError(null);
    try {
      const data = await getConfirmationData();
      const success = onSubmitPurchase(selectedNumber, data);
      if (success) {
        setIsDone(true);
      } else {
        setSubmitError('No se pudo registrar la compra. Intenta nuevamente.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Error al procesar tu comprobante.');
    }
  };

  if (isDone) {
    return (
      <Modal isOpen onClose={onClose} title="¡Compra Enviada!" size="md">
        <div className="text-center py-4">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Tu solicitud para el número <span className="text-blue-600">{selectedNumber}</span> fue enviada
          </p>
          <p className="text-gray-600 mb-6">
            Está pendiente de validación. Te contactaremos al {formData.phone} en cuanto sea confirmado.
          </p>
          <Button variant="primary" fullWidth onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Paso ${stepIndex + 1} de ${STEP_ORDER.length}: ${PURCHASE_STEPS[currentStep.toUpperCase()].label}`}
      subtitle={`Número seleccionado: ${selectedNumber}`}
      size="lg"
    >
      {/* Indicador de progreso */}
      <div className="flex gap-2 mb-6">
        {STEP_ORDER.map((step, idx) => (
          <div
            key={step}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              idx <= stepIndex ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* PASO 1: Formulario */}
      {currentStep === PURCHASE_STEPS.FORM.key && (
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            name="name"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : null}
            required
          />
          <Input
            label="Número celular"
            name="phone"
            placeholder="3185776314"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : null}
            required
          />
          <Input
            label="Email (opcional)"
            name="email"
            type="email"
            placeholder="ejemplo@email.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : null}
          />
          <Input
            label="Ciudad (opcional)"
            name="city"
            placeholder="Villavicencio"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.city ? errors.city : null}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" fullWidth onClick={goNext}>
              Continuar al Pago →
            </Button>
          </div>
        </div>
      )}

      {/* PASO 2: Pantalla de pago */}
      {currentStep === PURCHASE_STEPS.PAYMENT.key && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Número reservado</p>
              <p className="text-3xl font-bold text-blue-600">{selectedNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Valor a pagar</p>
              <p className="text-2xl font-bold text-gray-900">
                ${RIFA_DETAILS.TICKET_PRICE.toLocaleString('es-CO')} COP
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="font-semibold text-gray-900">Método de pago: {payment.method}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Número Nequi</p>
                <p className="font-mono font-bold text-lg">{payment.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Titular</p>
                <p className="font-bold">{payment.holderName}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Llave para transferir desde cualquier entidad</p>
                <p className="font-mono font-bold text-lg">{payment.document}</p>
              </div>
            </div>

            {/* QR */}
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
              <img
                src={payment.qrCode}
                alt="Código QR de pago"
                className="w-36 h-36 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <p className="text-gray-400 text-center text-sm hidden">
                📱 Aquí aparecerá el código QR
                <br />
                (agrega la imagen en public/assets/payment/nequi-qr.png)
              </p>
            </div>
          </div>

          <Alert
            variant="info"
            closeable={false}
            title="Instrucciones"
            message={payment.instructions.join(' → ')}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={goBack}>
              ← Atrás
            </Button>
            <Button variant="success" fullWidth onClick={goNext}>
              Ya pagué, continuar →
            </Button>
          </div>
        </div>
      )}

      {/* PASO 3: Confirmación */}
      {currentStep === PURCHASE_STEPS.CONFIRMATION.key && (
        <div className="space-y-4">
          {submitError && (
            <Alert variant="error" message={submitError} closeable={false} />
          )}

          {proofPreview ? (
            <div className="space-y-3">
              <img
                src={proofPreview}
                alt="Comprobante"
                className="w-full rounded-lg max-h-64 object-contain bg-gray-50"
              />
              <Button variant="danger" fullWidth onClick={removeProofFile}>
                Eliminar imagen
              </Button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <p className="text-3xl mb-2">📤</p>
              <p className="text-gray-700 font-medium">Haz clic para subir tu comprobante</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG o WebP (máximo 2MB)</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProofFileChange}
                className="hidden"
              />
            </label>
          )}

          {errors.proof && (
            <Alert variant="error" message={errors.proof} closeable={false} />
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={goBack} disabled={isSubmitting}>
              ← Atrás
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
            >
              Confirmar Compra
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
