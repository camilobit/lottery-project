/**
 * Sección pública de historial: últimas compras confirmadas,
 * para reforzar la transparencia de la rifa ante los usuarios.
 */
export default function HistorySection({ history }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Historial de Ventas</h3>
        <p className="text-gray-500">
          Así se han vendido los últimos números — total transparencia
        </p>
      </div>

      {history.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          Aún no hay ventas confirmadas. ¡Sé el primero en participar!
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {history.map((h) => (
            <div
              key={h.number}
              className="flex justify-between items-center px-6 py-3 text-sm"
            >
              <span className="font-bold text-primary-900">#{h.number}</span>
              <span className="text-gray-600">{h.buyer}</span>
              <span className="text-gray-400 text-xs">
                {h.date ? new Date(h.date).toLocaleDateString('es-CO') : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
