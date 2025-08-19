export default function Inicio({ onAbrirModal }) {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      {/* Fondo decorativo superior */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem]
          -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] 
          to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Contenido central */}
      <div className="mx-auto max-w-2xl py-32 sm:py-40 lg:py-48 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#ccd6f6] sm:text-6xl">
          🎟️ Bienvenidos a la Gran Rifa
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-200">
          Aquí podrás consultar los números disponibles, elegir tu favorito 
          y participar. 
          <br></br>¡Así de sencillo es entrar en la rifa.  
        </p>

        {/* Sección de instrucciones */}
        <div className="mt-16 bg-white/10 p-6 rounded-xl shadow-md text-left">
          <h2 className="text-2xl font-bold text-[#ccd6f6] mb-4 text-center">
            📋 Instrucciones para participar
          </h2>
          <ul className="space-y-4 text-gray-200 text-lg">
            <li>
              ✅ Escoge el número de tu preferencia en el talonario.
            </li>
            <li>
              ✅ Realiza tu pago a través de <span className="font-semibold text-indigo-300">Nequi</span> con el número que quieras separar.
            </li>
            <li>
              ✅ Envía el comprobante de pago, con tu nombre y número escogido al teléfono{" "}
              <span className="font-bold text-green-300">318 577 6314</span>.
            </li>
            <li>
              🎉 ¡Y listo! Estarás participando en la rifa.
            </li>
          </ul>
        </div>
      </div>

      {/* Fondo decorativo inferior */}
      <div
  aria-hidden="true"
  className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 pointer-events-none transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
>
  <div
    style={{
      clipPath:
        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
    }}
    className="relative left-[calc(50%+3rem)] aspect-[1155/678] 
    w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] 
    to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
  />
</div>

    </div>
  );
}
