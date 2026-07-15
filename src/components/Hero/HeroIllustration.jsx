/**
 * Ilustración decorativa para el Hero — un boleto de rifa estilizado.
 * Se usa SVG inline (sin dependencias externas) para mantener la carga rápida.
 */
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-xl"
      role="img"
      aria-label="Ilustración de boleto de rifa"
    >
      {/* Fondo circular decorativo */}
      <circle cx="200" cy="150" r="140" fill="#dbeafe" opacity="0.6" />
      <circle cx="320" cy="60" r="24" fill="#fde68a" opacity="0.8" />
      <circle cx="60" cy="230" r="16" fill="#bbf7d0" opacity="0.8" />

      {/* Boleto principal */}
      <g transform="translate(70, 70) rotate(-6)">
        <rect
          x="0"
          y="0"
          width="240"
          height="130"
          rx="14"
          fill="#ffffff"
          stroke="#1e3a8a"
          strokeWidth="3"
        />
        {/* Línea perforada */}
        <line
          x1="185"
          y1="0"
          x2="185"
          y2="130"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        {/* Texto del boleto */}
        <text x="20" y="35" fontSize="14" fontWeight="700" fill="#1e3a8a">
          GRAN RIFA
        </text>
        <text x="20" y="55" fontSize="11" fill="#64748b">
          Solidaria
        </text>
        <text x="20" y="95" fontSize="30" fontWeight="800" fill="#d4af37">
          #42
        </text>
        <text x="20" y="115" fontSize="9" fill="#94a3b8">
          Lotería del Meta
        </text>
        {/* Sello dorado */}
        <circle cx="212" cy="65" r="30" fill="none" stroke="#d4af37" strokeWidth="2" />
        <text
          x="212"
          y="60"
          fontSize="9"
          fontWeight="700"
          fill="#d4af37"
          textAnchor="middle"
        >
          $500K
        </text>
        <text x="212" y="72" fontSize="7" fill="#d4af37" textAnchor="middle">
          PREMIO
        </text>
      </g>

      {/* Estrella decorativa */}
      <path
        d="M330 180 l6 14 15 2 -11 10 3 15 -13 -8 -13 8 3 -15 -11 -10 15 -2 z"
        fill="#d4af37"
        opacity="0.9"
      />
      <path
        d="M50 90 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1 z"
        fill="#10b981"
        opacity="0.8"
      />
    </svg>
  );
}
