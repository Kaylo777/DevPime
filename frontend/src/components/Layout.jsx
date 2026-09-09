import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../api';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: '🏠' },
  { to: '/app/ejecutivos', label: 'Ejecutivos', rol: 'ejecutivo', icon: '👤' },
  { to: '/app/clientes', label: 'Clientes', rol: 'ejecutivo', icon: '🤝' },
  { to: '/app/reuniones', label: 'Reuniones', rol: 'ejecutivo', icon: '📅' },
  { to: '/app/propuestas', label: 'Propuestas', icon: '📋' },
  { to: '/app/proyectos', label: 'Proyectos', icon: '🚀' },
];

export default function Layout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const esCliente = user?.rol === 'cliente';
  const visibleItems = navItems.filter((item) => !item.rol || item.rol === user?.rol);

  const handleLogout = async () => {
    try { await auth.logout(); } catch (e) { /* ignore */ }
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside className="d-flex flex-column text-white" style={{ width: '240px', background: '#1a1a2e', flexShrink: 0 }}>
        <div className="px-3 pt-4 pb-3">
          <h2 className="mb-1 fw-bold fs-4">DevPime</h2>
          <div className="fs-6 text-white-50">
            {user ? `${user.first_name} ${user.last_name}` : 'Cargando...'}
            <span className="badge ms-1" style={{ background: esCliente ? '#0f3460' : '#e94560' }}>
              {esCliente ? 'Cliente' : 'Ejecutivo'}
            </span>
          </div>
        </div>

        <nav className="flex-grow-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none ${isActive ? 'text-white' : 'text-white-50'}`
              }
              style={({ isActive }) => ({
                background: isActive ? '#16213e' : 'transparent',
                borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
              })}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <button onClick={handleLogout} className="btn w-100 text-white fw-semibold" style={{ background: '#e94560' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4 bg-body-tertiary">
        <Outlet />
      </main>
    </div>
  );
}