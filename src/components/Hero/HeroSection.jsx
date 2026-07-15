import { Button } from '../Common';
import HeroIllustration from './HeroIllustration';
import { RIFA_DETAILS } from '../../config/app.config';

/**
 * Portada principal de la plataforma.
 */
export default function HeroSection({ onBuyClick, onViewNumbersClick }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <span className="inline-block bg-secondary/10 text-secondary font-semibold text-xs tracking-wide uppercase px-3 py-1 rounded-full mb-4">
            🎟️ Gran Rifa Solidaria
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-900 mb-4 leading-tight">
            Ayúdame a Culminar
            <br />
            mis Estudios Universitarios
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Premio principal:{' '}
            <strong className="text-secondary">
              {RIFA_DETAILS.PRIZE_DESCRIPTION}
            </strong>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Se juega con los últimos dos dígitos de la {RIFA_DETAILS.LOTTERY_NAME}{' '}
            — {RIFA_DETAILS.DRAW_DATE}
          </p>
          <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
            <Button variant="primary" size="lg" onClick={onBuyClick}>
              Comprar Número
            </Button>
            <Button variant="secondary" size="lg" onClick={onViewNumbersClick}>
              Ver Números Disponibles
            </Button>
          </div>
        </div>

        {/* Ilustración */}
        <div className="max-w-sm mx-auto lg:max-w-none">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
