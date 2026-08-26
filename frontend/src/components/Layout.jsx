import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/ejecutivos', label: 'Ejecutivos' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/reuniones', label: 'Reuniones' },
  { to: '/propuestas', label: 'Propuestas' },
  { to: '/proyectos', label: 'Proyectos' },
];

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '240px',
        background: '#1a1a2e',
        color: 'white',
        padding: '20px 0',
      }}>
        <h2 style={{ padding: '0 20px', marginBottom: '30px', fontSize: '20px' }}>
          DevPime
        </h2>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
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
      </aside>
      <main style={{ flex: 1, padding: '30px', background: '#f5f5f5' }}>
        <Outlet />
      </main>
    </div>
  );
}
