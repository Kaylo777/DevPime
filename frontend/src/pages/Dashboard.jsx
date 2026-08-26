import { useState, useEffect } from 'react';
import { dashboard } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboard.get().then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Cargando...</p>;

  const tarjetas = [
    { label: 'Ejecutivos', value: data.total_ejecutivos, color: '#e94560' },
    { label: 'Clientes', value: data.total_clientes, color: '#0f3460' },
    { label: 'Reuniones', value: data.total_reuniones, color: '#16213e' },
    { label: 'Propuestas', value: data.total_propuestas, color: '#533483' },
    { label: 'Proyectos', value: data.total_proyectos, color: '#1a535c' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {tarjetas.map((t) => (
          <div key={t.label} style={{
            background: t.color,
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}>
            <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{t.label}</h3>
            <p style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: 'bold' }}>{t.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>Propuestas por Estado</h3>
          {data.propuestas_por_estado.length === 0 && <p>No hay propuestas</p>}
          {data.propuestas_por_estado.map((p) => (
            <div key={p.estado} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>{p.estado}</span>
              <strong>{p.total}</strong>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>Proyectos por Estado</h3>
          {data.proyectos_por_estado.length === 0 && <p>No hay proyectos</p>}
          {data.proyectos_por_estado.map((p) => (
            <div key={p.estado} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>{p.estado}</span>
              <strong>{p.total}</strong>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>Monto Total Propuestas</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#533483' }}>
            ${Number(data.monto_total_propuestas).toLocaleString('es-CO')}
          </p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>Presupuesto Total Proyectos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a535c' }}>
            ${Number(data.monto_total_proyectos).toLocaleString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  );
}
