import { RIFA_DETAILS } from '../../config/app.config';

/**
 * Sección "Próximo Sorteo": fecha, premio, lotería utilizada.
 */
export default function NextDrawSection() {
  return (
    <section className="bg-gradient-to-br from-primary-900 to-blue-800 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="uppercase tracking-widest text-secondary text-sm font-semibold mb-2">
          Próximo Sorteo
        </p>
        <h3 className="text-4xl font-bold mb-8">{RIFA_DETAILS.DRAW_DATE}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
            <p className="text-secondary text-sm mb-1">Premio</p>
            <p className="text-2xl font-bold">
              ${RIFA_DETAILS.PRIZE_AMOUNT.toLocaleString('es-CO')}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
            <p className="text-secondary text-sm mb-1">Lotería</p>
            <p className="text-lg font-bold">{RIFA_DETAILS.LOTTERY_NAME}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
            <p className="text-secondary text-sm mb-1">Se juega con</p>
            <p className="text-lg font-bold">Últimos 2 dígitos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
