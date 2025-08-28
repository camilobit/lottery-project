// src/components/RifaInfo/RifaInfo.jsx
import { Gift, CalendarDays, Ticket, Trophy, DollarSign, Info } from "lucide-react"

export default function RifaInfo() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Información de la Rifa</h2>
        <p className="text-lg text-gray-600 mb-10">
          Participa en esta gran oportunidad. Escoge tu número, envía el pago y conserva tu comprobante.
          ¡Así de sencillo es entrar en la rifa!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fecha */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <CalendarDays className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fecha del sorteo</h3>
            <p className="text-gray-600">Miércoles, 1 de Octubre de 2025</p>
          </div>

          {/* Premio */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <Trophy className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Premio</h3>
            <p className="text-gray-600">$1,000,000 COP en efectivo</p>
          </div>

          {/* Valor */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <DollarSign className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Valor de la boleta</h3>
            <p className="text-gray-600">$10,000 COP</p>
          </div>

          {/* Números disponibles */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <Ticket className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Números disponibles</h3>
            <p className="text-gray-600">Del 000 al 999</p>
          </div>

          {/* Lotería guía */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <Gift className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lotería guía</h3>
            <p className="text-gray-600">Se juega con la Lotería del Meta</p>
          </div>

          {/* Nota extra */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <Info className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Importante</h3>
            <p className="text-gray-600">Conserva tu comprobante de pago hasta el día del sorteo.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
