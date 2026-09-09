import { useState, useEffect } from 'react';
import CrudPage from './CrudPage';
import { proyectos, clientes, propuestas } from '../api';

const columns = [
  { key: 'id_proyecto', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'nombre_cliente', label: 'Cliente' },
  { key: 'titulo_propuesta', label: 'Propuesta' },
  { key: 'estado', label: 'Estado', render: (v) => (
    <span style={{
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      background: v === 'completado' ? '#d4edda' : v === 'cancelado' ? '#f8d7da' : v === 'en_curso' ? '#cce5ff' : v === 'pausado' ? '#fff3cd' : '#e2e3e5',
      color: v === 'completado' ? '#155724' : v === 'cancelado' ? '#721c24' : v === 'en_curso' ? '#004085' : v === 'pausado' ? '#856404' : '#383d41',
    }}>{v.replace('_', ' ')}</span>
  )},
  { key: 'fecha_inicio', label: 'Inicio' },
  { key: 'fecha_fin', label: 'Fin' },
  { key: 'presupuesto', label: 'Presupuesto', render: (v) => v ? `$${Number(v).toLocaleString('es-CO')}` : '-' },
];

function ProyectoForm({ initialData, onSave, onCancel }) {
  const [clientesList, setClientesList] = useState([]);
  const [propuestasList, setPropuestasList] = useState([]);
  const [formData, setFormData] = useState(() => ({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    estado: initialData?.estado || 'planificacion',
    fecha_inicio: initialData?.fecha_inicio || '',
    fecha_fin: initialData?.fecha_fin || '',
    presupuesto: initialData?.presupuesto || '',
    id_cliente: initialData?.id_cliente || '',
    id_propuesta: initialData?.id_propuesta || '',
  }));

  useEffect(() => {
    clientes.getAll().then((res) => setClientesList(res.data));
    propuestas.getAll().then((res) => setPropuestasList(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const processed = {
      ...formData,
      id_cliente: Number(formData.id_cliente),
      id_propuesta: formData.id_propuesta ? Number(formData.id_propuesta) : null,
      presupuesto: formData.presupuesto ? Number(formData.presupuesto) : null,
    };
    onSave(processed);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label className="form-label fw-semibold">Nombre del Proyecto</label>
        <input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="form-control" required />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Cliente</label>
        <select value={formData.id_cliente} onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })} className="form-select" required>
          <option value="">Seleccionar...</option>
          {clientesList.map((c) => (
            <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Propuesta (opcional)</label>
        <select value={formData.id_propuesta} onChange={(e) => setFormData({ ...formData, id_propuesta: e.target.value })} className="form-select">
          <option value="">Ninguna</option>
          {propuestasList.map((p) => (
            <option key={p.id_propuesta} value={p.id_propuesta}>{p.titulo}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Estado</label>
        <select value={formData.estado} className="form-select" onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
          <option value="planificacion">Planificacion</option>
          <option value="en_curso">En Curso</option>
          <option value="pausado">Pausado</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Presupuesto ($)</label>
        <input type="number" step="0.01" className="form-control" value={formData.presupuesto} onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })} />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Fecha Inicio</label>
        <input type="date" className="form-control" value={formData.fecha_inicio} onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Fecha Fin</label>
        <input type="date" className="form-control" value={formData.fecha_fin} onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })} />
      </div>
      <div className="col-12">
        <label className="form-label fw-semibold">Descripcion</label>
        <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="form-control" style={{ minHeight: '60px' }} />
      </div>
      <div className="col-12 d-flex gap-2">
        <button type="submit" className="btn px-4 text-white fw-semibold" style={{ background: '#1a535c' }}>Guardar</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary px-4">Cancelar</button>
      </div>
    </form>
  );
}

export default function Proyectos() {
  return <CrudPage title="Proyectos" api={proyectos} columns={columns} renderForm={(props) => <ProyectoForm {...props} />} canEdit idKey="id_proyecto" />;
}
