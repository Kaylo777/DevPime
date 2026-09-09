import { useState, useEffect } from 'react';
import { dashboard } from '../api';

const colores = {
  ejecutivos: '#e94560',
  clientes: '#0f3460',
  reuniones: '#16213e',
  propuestas: '#533483',
  proyectos: '#1a535c',
};

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboard.get().then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="text-center py-5">Cargando...</div>;

  const tarjetas = [
    { label: 'Ejecutivos', value: data.total_ejecutivos, color: colores.ejecutivos },
    { label: 'Clientes', value: data.total_clientes, color: colores.clientes },
    { label: 'Reuniones', value: data.total_reuniones, color: colores.reuniones },
    { label: 'Propuestas', value: data.total_propuestas, color: colores.propuestas },
    { label: 'Proyectos', value: data.total_proyectos, color: colores.proyectos },
  ];

  return (
    <div>
      <h1 className="h3 fw-bold mb-4">Dashboard</h1>

      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-6 col-md-4 col-xl" key={t.label}>
            <div className="card border-0 text-white shadow-sm" style={{ background: t.color }}>
              <div className="card-body">
                <h3 className="fs-6 fw-normal opacity-75 mb-1">{t.label}</h3>
                <p className="fw-bold mb-0" style={{ fontSize: '2rem' }}>{t.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6 fw-bold">Propuestas por Estado</h3>
              {data.propuestas_por_estado.length === 0 && <p className="text-secondary mb-0">No hay propuestas</p>}
              {data.propuestas_por_estado.map((p) => (
                <div key={p.estado} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span>{p.estado}</span>
                  <span className="badge rounded-pill text-bg-light">{p.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6 fw-bold">Proyectos por Estado</h3>
              {data.proyectos_por_estado.length === 0 && <p className="text-secondary mb-0">No hay proyectos</p>}
              {data.proyectos_por_estado.map((p) => (
                <div key={p.estado} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span>{p.estado}</span>
                  <span className="badge rounded-pill text-bg-light">{p.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h6 fw-bold text-secondary">Monto Total Propuestas</h3>
              <p className="fw-bold mb-0" style={{ fontSize: '1.5rem', color: colores.propuestas }}>
                ${Number(data.monto_total_propuestas).toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h6 fw-bold text-secondary">Presupuesto Total Proyectos</h3>
              <p className="fw-bold mb-0" style={{ fontSize: '1.5rem', color: colores.proyectos }}>
                ${Number(data.monto_total_proyectos).toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}