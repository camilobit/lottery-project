import { useState } from "react";
import "./NumerosRifa.css";

export default function Rifa() {
  const numeros = Array.from({ length: 1000 }, (_, i) =>
    i.toString().padStart(3, "0")
  );


  const vendidos = ["029","343","251","521","037","972","045","298"];















  const [isOpen, setIsOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const numerosPorPagina = 200; // 10x10 grid

  const totalPaginas = Math.ceil(numeros.length / numerosPorPagina);
  const numerosPagina = numeros.slice(
    pagina * numerosPorPagina,
    (pagina + 1) * numerosPorPagina
  );

  return (
    <div className="text-center">
      {/* Botón para abrir modal */}
     <button
  onClick={() => setIsOpen(true)}
  className="relative px-6 py-3 font-bold text-white rounded-full overflow-hidden group bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
>
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
  <span className="relative flex items-center gap-2 text-lg tracking-wide">
    🎟️ Ver Números Disponibles
  </span>
</button>



      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
            <h2 className="text-xl font-bold mb-4">Talonario de Números</h2>
            <h3 className="text-xl mb-4">Aquí ves los números disponibles, una vez pagada la boleta marcaremos tu número en rojo</h3>

            {/* Parrilla */}
            <div className="grid grid-cols-8 gap-2 max-h-[400px] overflow-y-auto">
              {numerosPagina.map((numero) => (
                <div
                  key={numero}
                  className={`p-2 text-center rounded-md cursor-pointer ${
                    vendidos.includes(numero)
                      ? "bg-red-400 text-white"
                      : "bg-green-200 hover:bg-green-300"
                  }`}
                >
                  {numero}
                </div>
              ))}
            </div>

            {/* Navegación de páginas */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPagina((p) => Math.max(p - 1, 0))}
                disabled={pagina === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {pagina + 1} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPagina((p) => Math.min(p + 1, totalPaginas - 1))
                }
                disabled={pagina === totalPaginas - 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
