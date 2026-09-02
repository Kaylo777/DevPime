import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../api';

const navItems = [
  { to: '/app', label: 'Dashboard' },
  { to: '/app/ejecutivos', label: 'Ejecutivos', rol: 'ejecutivo' },
  { to: '/app/clientes', label: 'Clientes', rol: 'ejecutivo' },
  { to: '/app/reuniones', label: 'Reuniones', rol: 'ejecutivo' },
  { to: '/app/propuestas', label: 'Propuestas' },
  { to: '/app/proyectos', label: 'Proyectos' },
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '240px',
        background: '#1a1a2e',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 20px 30px' }}>
          <h2 style={{ marginBottom: '4px', fontSize: '20px' }}>
            DevPime
          </h2>
          <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>
            {user ? `${user.first_name} ${user.last_name} (${esCliente ? 'Cliente' : 'Ejecutivo'})` : 'Cargando...'}
          </p>
        </div>
        <nav style={{ flex: 1 }}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              style={({ isActive }) => ({
                display: 'block',
                padding: '12px 20px',
                color: isActive ? '#fff' : '#aaa',
                background: isActive ? '#16213e' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '15px 20px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '30px', background: '#f5f5f5' }}>
        <Outlet />
      </main>
    </div>
  );
}
