import { LAST_WINNER } from '../../config/app.config';

/**
 * Sección "Último Ganador". Mientras no exista un ganador registrado
 * (LAST_WINNER === null en app.config.js), muestra un mensaje de
 * transparencia. Cuando se defina LAST_WINNER, muestra sus datos.
 */
export default function WinnerSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-2">🏆 Último Ganador</h3>
        <p className="text-gray-500">Transparencia total en cada sorteo</p>
      </div>

      {LAST_WINNER ? (
        <div className="bg-white rounded-2xl shadow-lg border border-secondary/30 p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-secondary/40">
            {LAST_WINNER.photo ? (
              <img
                src={LAST_WINNER.photo}
                alt={LAST_WINNER.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl">🏅</span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-gray-900">{LAST_WINNER.name}</p>
            <p className="text-gray-600 mt-1">
              Número ganador: <strong className="text-primary-900">{LAST_WINNER.number}</strong>
            </p>
            <p className="text-gray-600">
              Premio entregado: <strong>{LAST_WINNER.prize}</strong>
            </p>
            <p className="text-sm text-gray-400 mt-2">{LAST_WINNER.date}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-secondary/30 rounded-2xl p-10 text-center">
          <p className="text-5xl mb-4">🏅</p>
          <p className="text-gray-700 max-w-md mx-auto">
            Aquí publicaremos al ganador de la próxima rifa para brindar total
            transparencia.
          </p>
        </div>
      )}
    </section>
  );
}
