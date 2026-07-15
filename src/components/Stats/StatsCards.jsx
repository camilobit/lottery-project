import { RIFA_DETAILS } from '../../config/app.config';

/**
 * Tarjetas de estadísticas: premio, total de números, vendidos,
 * disponibles, fecha del sorteo y lotería utilizada — todo calculado
 * dinámicamente a partir de `stats` (nunca hardcodeado).
 */
export default function StatsCards({ stats }) {
  if (!stats) return null;

  const items = [
    {
      label: 'Premio Principal',
      value: `$${RIFA_DETAILS.PRIZE_AMOUNT.toLocaleString('es-CO')}`,
      color: 'border-secondary text-secondary',
    },
    {
      label: 'Total de Números',
      value: stats.total,
      color: 'border-primary-600 text-primary-600',
    },
    {
      label: 'Disponibles',
      value: stats.available,
      color: 'border-green-600 text-green-600',
    },
    {
      label: 'Vendidos',
      value: stats.sold,
      color: 'border-red-500 text-red-500',
    },
    {
      label: 'Fecha del Sorteo',
      value: RIFA_DETAILS.DRAW_DATE,
      color: 'border-blue-400 text-blue-500',
      small: true,
    },
    {
      label: 'Lotería Utilizada',
      value: RIFA_DETAILS.LOTTERY_NAME,
      color: 'border-amber-400 text-amber-600',
      small: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 text-center border-l-4 ${item.color.split(' ')[0]}`}
        >
          <p className="text-gray-500 text-xs sm:text-sm mb-2">{item.label}</p>
          <p
            className={`font-bold ${item.color.split(' ')[1]} ${
              item.small ? 'text-base sm:text-lg' : 'text-2xl sm:text-3xl'
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
