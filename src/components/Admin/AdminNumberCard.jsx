import { useState, memo } from 'react';
import { Button, Badge, Input } from '../Common';
import { NUMBER_STATES } from '../../config/app.config';

const STATE_BADGE_VARIANT = {
  [NUMBER_STATES.AVAILABLE.key]: 'green',
  [NUMBER_STATES.RESERVED.key]: 'yellow',
  [NUMBER_STATES.PENDING.key]: 'orange',
  [NUMBER_STATES.SOLD.key]: 'red',
};

/**
 * Tarjeta de gestión de un número (uso exclusivo del panel admin).
 * Permite: ver comprobante, aprobar/rechazar (si está pendiente),
 * editar los datos del comprador, cambiar el estado manualmente
 * y liberar el número por completo, sin importar su estado actual.
 */
function AdminNumberCard({
  numberData,
  onApprove,
  onReject,
  onRelease,
  onSaveEdit,
  onChangeState,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: numberData.buyerName || '',
    phone: numberData.buyerPhone || '',
    email: numberData.buyerEmail || '',
    city: numberData.buyerCity || '',
    observations: numberData.observations || '',
  });

  const stateInfo = NUMBER_STATES[numberData.state.toUpperCase()];
  const badgeVariant = STATE_BADGE_VARIANT[numberData.state] || 'gray';

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSaveEdit(numberData.number, form);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setForm({
      name: numberData.buyerName || '',
      phone: numberData.buyerPhone || '',
      email: numberData.buyerEmail || '',
      city: numberData.buyerCity || '',
      observations: numberData.observations || '',
    });
    setIsEditing(false);
  };

  const handleRelease = () => {
    const confirmed = window.confirm(
      `¿Seguro que quieres liberar el número ${numberData.number}?\n\nEsto eliminará todos los datos del comprador y lo dejará DISPONIBLE nuevamente. Esta acción no se puede deshacer.`
    );
    if (confirmed) {
      onRelease(numberData.number);
    }
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    if (newState === numberData.state) return;

    const confirmed = window.confirm(
      `¿Cambiar el número ${numberData.number} de "${stateInfo.label}" a "${NUMBER_STATES[newState.toUpperCase()].label}"?`
    );
    if (confirmed) {
      onChangeState(numberData.number, newState);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <div>
          <p className="font-bold text-lg">
            Número {numberData.number}
            {numberData.buyerName && !isEditing && ` — ${numberData.buyerName}`}
          </p>
          {!isEditing && (
            <>
              {numberData.buyerPhone && (
                <p className="text-sm text-gray-600">{numberData.buyerPhone}</p>
              )}
              {numberData.buyerEmail && (
                <p className="text-xs text-gray-500">{numberData.buyerEmail}</p>
              )}
              {numberData.buyerCity && (
                <p className="text-xs text-gray-500">{numberData.buyerCity}</p>
              )}
              {numberData.observations && (
                <p className="text-xs text-gray-500 italic mt-1">
                  "{numberData.observations}"
                </p>
              )}
            </>
          )}
        </div>
        <Badge variant={badgeVariant} size="sm">
          {stateInfo?.label || numberData.state}
        </Badge>
      </div>

      {/* Comprobante */}
      {numberData.proof && !isEditing && (
        <img
          src={numberData.proof}
          alt="Comprobante"
          className="w-full max-h-48 object-contain rounded bg-gray-50 mb-3"
        />
      )}

      {/* Modo edición */}
      {isEditing ? (
        <div className="space-y-3 mb-3">
          <Input
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleFieldChange}
          />
          <Input
            label="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleFieldChange}
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleFieldChange}
          />
          <Input
            label="Ciudad"
            name="city"
            value={form.city}
            onChange={handleFieldChange}
          />
          <Input
            label="Observaciones"
            name="observations"
            value={form.observations}
            onChange={handleFieldChange}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={handleSave}>
              💾 Guardar
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {numberData.state === NUMBER_STATES.PENDING.key && (
            <>
              <Button size="sm" variant="success" onClick={() => onApprove(numberData.number)}>
                ✓ Aprobar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onReject(numberData.number, 'Rechazado por admin')}
              >
                ✗ Rechazar
              </Button>
            </>
          )}
          <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
            ✏️ Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={handleRelease}>
            🗑️ Liberar Número
          </Button>
        </div>
      )}

      {/* Cambiar estado manualmente */}
      {!isEditing && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <label className="text-xs text-gray-500">Cambiar estado:</label>
          <select
            value={numberData.state}
            onChange={handleStateChange}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value={NUMBER_STATES.AVAILABLE.key}>Disponible</option>
            <option value={NUMBER_STATES.RESERVED.key}>Reservado</option>
            <option value={NUMBER_STATES.PENDING.key}>Pendiente</option>
            <option value={NUMBER_STATES.SOLD.key}>Vendido</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default memo(AdminNumberCard);
