import { useState, useMemo } from 'react';
import { useRifa } from './hooks/useRifa';
import { useAdminAuth } from './hooks/useAdminAuth';
import { Spinner, Button } from './components/Common';
import HeroSection from './components/Hero/HeroSection';
import StatsCards from './components/Stats/StatsCards';
import NumbersGrid from './components/Numbers/NumbersGrid';
import PurchaseFlow from './components/Purchase/PurchaseFlow';
import WinnerSection from './components/Winner/WinnerSection';
import NextDrawSection from './components/NextDraw/NextDrawSection';
import HistorySection from './components/History/HistorySection';
import AdminNumberCard from './components/Admin/AdminNumberCard';
import { NUMBER_STATES } from './config/app.config';
import './App.css';

function App() {
  const {
    numbers,
    stats,
    isLoading,
    error,
    submitPurchase,
    approvePurchase,
    rejectPurchase,
    releaseNumberAdmin,
    updateBuyerInfo,
    setNumberState,
    filterByStates,
    searchNumbers,
    getHistory,
  } = useRifa();
  const { isAuthenticated, login, logout } = useAdminAuth();

  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);

  // ---- Handlers de los botones principales del Hero ----
  const scrollToNumbers = () => {
    document.getElementById('numeros')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectNumber = (number) => setSelectedNumber(number);
  const handleClosePurchase = () => setSelectedNumber(null);
  const handleSubmitPurchase = (number, buyerData) => submitPurchase(number, buyerData);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner label="Cargando plataforma de rifas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">Error</h1>
          <p className="text-red-700">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()} className="mt-4">
            Recargar página
          </Button>
        </div>
      </div>
    );
  }

  const salesHistory = getHistory(6);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎟️</span>
            <h1 className="text-xl font-bold text-primary-900">Gran Rifa Solidaria</h1>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            className="text-sm bg-primary-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔐 Admin
          </button>
        </div>
      </header>

      {/* Hero */}
      <HeroSection onBuyClick={scrollToNumbers} onViewNumbersClick={scrollToNumbers} />

      {/* Stats */}
      {stats && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <StatsCards stats={stats} />
        </section>
      )}

      {/* Barra de Progreso */}
      {stats && (
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Progreso de Ventas</h3>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-full flex items-center justify-center text-white font-bold text-sm transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(stats.percentage, 6)}%` }}
                >
                  {stats.percentage.toFixed(1)}%
                </div>
              </div>
              <p className="text-center text-gray-600">
                {stats.sold} de {stats.total} números vendidos
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Grilla de Números */}
      <section id="numeros" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-2">Elige tu Número</h3>
          <p className="text-gray-600">
            Haz clic en cualquier número disponible (en verde) para comprarlo
          </p>
        </div>
        <NumbersGrid numbers={numbers} onSelectNumber={handleSelectNumber} />
      </section>

      {/* Cómo Participar */}
      <section className="max-w-4xl mx-auto px-4 py-12 bg-gray-50 rounded-2xl">
        <h3 className="text-2xl font-bold mb-8 text-center">Cómo Participar</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">1️⃣</div>
            <h4 className="font-bold mb-2">Escoge tu Número</h4>
            <p className="text-gray-600 text-sm">Elige tu número favorito de 00 a 99</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">2️⃣</div>
            <h4 className="font-bold mb-2">Realiza el Pago</h4>
            <p className="text-gray-600 text-sm">Paga por Nequi: 3185776314</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">3️⃣</div>
            <h4 className="font-bold mb-2">Envía el Comprobante</h4>
            <p className="text-gray-600 text-sm">Sube la foto y tus datos</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">4️⃣</div>
            <h4 className="font-bold mb-2">Recibe Confirmación</h4>
            <p className="text-gray-600 text-sm">Te contactaremos en tu número</p>
          </div>
        </div>
      </section>

      {/* Último Ganador */}
      <WinnerSection />

      {/* Próximo Sorteo */}
      <NextDrawSection />

      {/* Historial público */}
      <HistorySection history={salesHistory} />

      {/* Modal de Compra */}
      {selectedNumber && (
        <PurchaseFlow
          selectedNumber={selectedNumber}
          onClose={handleClosePurchase}
          onSubmitPurchase={handleSubmitPurchase}
        />
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel
          isAuthenticated={isAuthenticated}
          onLogin={login}
          onLogout={logout}
          onClose={() => setShowAdmin(false)}
          stats={stats}
          filterByStates={filterByStates}
          searchNumbers={searchNumbers}
          onApprove={approvePurchase}
          onReject={rejectPurchase}
          onRelease={releaseNumberAdmin}
          onSaveEdit={updateBuyerInfo}
          onChangeState={setNumberState}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-2">📱 Contacto: 3185776314</p>
          <p className="text-gray-400 text-sm">
            © 2026 Gran Rifa Solidaria. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Panel administrativo completo:
 * - Ver solicitudes / ver comprobantes
 * - Aceptar / rechazar pago
 * - Liberar número (sin importar su estado)
 * - Editar datos del comprador
 * - Cambiar estado manualmente
 * - Ver estadísticas
 */
function AdminPanel({
  isAuthenticated,
  onLogin,
  onLogout,
  onClose,
  stats,
  filterByStates,
  searchNumbers,
  onApprove,
  onReject,
  onRelease,
  onSaveEdit,
  onChangeState,
}) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all'); // all | pending | reserved | sold

  const managedNumbers = useMemo(() => {
    if (!isAuthenticated) return [];

    let result = filterByStates([
      NUMBER_STATES.RESERVED.key,
      NUMBER_STATES.PENDING.key,
      NUMBER_STATES.SOLD.key,
    ]);

    if (tab !== 'all') {
      result = result.filter((n) => n.state === tab);
    }

    if (search.trim()) {
      const searched = searchNumbers(search.trim());
      const searchedNumbers = new Set(searched.map((n) => n.number));
      result = result.filter((n) => searchedNumbers.has(n.number));
    }

    // Pendientes primero, luego reservados, luego vendidos (más recientes primero)
    const order = {
      [NUMBER_STATES.PENDING.key]: 0,
      [NUMBER_STATES.RESERVED.key]: 1,
      [NUMBER_STATES.SOLD.key]: 2,
    };
    return [...result].sort((a, b) => (order[a.state] ?? 9) - (order[b.state] ?? 9));
  }, [isAuthenticated, filterByStates, searchNumbers, tab, search]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-3xl w-full relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
        >
          ✕
        </button>

        {!isAuthenticated ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">🔐 Panel Admin</h2>
            <AdminLoginForm onLogin={onLogin} />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>

            {/* Stats resumidas */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl font-bold">{stats?.total}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">Vendidos</p>
                <p className="text-xl font-bold">{stats?.sold}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">Ingresos</p>
                <p className="text-xl font-bold">
                  ${(stats?.revenue || 0).toLocaleString('es-CO')}
                </p>
              </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="🔍 Buscar número o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tab}
                onChange={(e) => setTab(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">Todas las solicitudes</option>
                <option value={NUMBER_STATES.PENDING.key}>Pendientes</option>
                <option value={NUMBER_STATES.RESERVED.key}>Reservados</option>
                <option value={NUMBER_STATES.SOLD.key}>Vendidos</option>
              </select>
            </div>

            {/* Lista de gestión */}
            <h3 className="font-bold text-lg mb-3">
              Solicitudes ({managedNumbers.length})
            </h3>
            {managedNumbers.length === 0 ? (
              <p className="text-gray-500 text-sm mb-6">
                No hay números que coincidan con este filtro.
              </p>
            ) : (
              <div className="space-y-3 mb-2">
                {managedNumbers.map((numberData) => (
                  <AdminNumberCard
                    key={numberData.number}
                    numberData={numberData}
                    onApprove={onApprove}
                    onReject={onReject}
                    onRelease={onRelease}
                    onSaveEdit={onSaveEdit}
                    onChangeState={onChangeState}
                  />
                ))}
              </div>
            )}

            <Button variant="ghost" fullWidth onClick={onLogout} className="mt-4">
              Cerrar Sesión
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Formulario de login del admin
 */
function AdminLoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const success = onLogin(password);
    if (!success) {
      setError('Contraseña incorrecta');
    }
    setPassword('');
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-sm">❌ {error}</div>
      )}
      <input
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button variant="primary" fullWidth onClick={handleSubmit}>
        Entrar
      </Button>
    </div>
  );
}

export default App;
