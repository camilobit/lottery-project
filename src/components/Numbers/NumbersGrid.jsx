import { useState, useMemo, memo } from 'react';
import { NUMBER_STATES } from '../../config/app.config';

/**
 * Grilla de números de la rifa
 * Muestra los 100 números (00-99) con su estado actual
 * y permite hacer click en un número disponible para comprarlo
 */
function NumbersGrid({ numbers, onSelectNumber }) {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');

  const filteredNumbers = useMemo(() => {
    let result = numbers;

    if (filterState !== 'all') {
      result = result.filter((n) => n.state === filterState);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.number.includes(q) ||
          (n.buyerName && n.buyerName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [numbers, search, filterState]);

  const getStateStyles = (state) => {
    switch (state) {
      case NUMBER_STATES.AVAILABLE.key:
        return 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 hover:border-green-500 hover:scale-105 cursor-pointer';
      case NUMBER_STATES.RESERVED.key:
        return 'bg-yellow-50 text-yellow-700 border-yellow-300 cursor-not-allowed opacity-80';
      case NUMBER_STATES.PENDING.key:
        return 'bg-orange-50 text-orange-700 border-orange-300 cursor-not-allowed opacity-80';
      case NUMBER_STATES.SOLD.key:
        return 'bg-red-50 text-red-700 border-red-300 cursor-not-allowed opacity-70';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const handleClick = (numberData) => {
    if (numberData.state !== NUMBER_STATES.AVAILABLE.key) return;
    onSelectNumber(numberData.number);
  };

  return (
    <div>
      {/* Controles de búsqueda y filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar número o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">Todos los estados</option>
          <option value={NUMBER_STATES.AVAILABLE.key}>Disponibles</option>
          <option value={NUMBER_STATES.RESERVED.key}>Reservados</option>
          <option value={NUMBER_STATES.PENDING.key}>Pendientes</option>
          <option value={NUMBER_STATES.SOLD.key}>Vendidos</option>
        </select>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400" /> Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-400" /> Reservado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-400" /> Pendiente
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" /> Vendido
        </span>
      </div>

      {/* Grilla */}
      {filteredNumbers.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No se encontraron números con ese criterio.
        </p>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredNumbers.map((numberData) => (
            <button
              key={numberData.number}
              onClick={() => handleClick(numberData)}
              disabled={numberData.state !== NUMBER_STATES.AVAILABLE.key}
              title={
                numberData.state === NUMBER_STATES.AVAILABLE.key
                  ? `Comprar número ${numberData.number}`
                  : `${numberData.number} — ${NUMBER_STATES[numberData.state.toUpperCase()]?.label || numberData.state}`
              }
              className={`aspect-square rounded-lg border-2 font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-200 ${getStateStyles(
                numberData.state
              )}`}
            >
              {numberData.number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(NumbersGrid);
