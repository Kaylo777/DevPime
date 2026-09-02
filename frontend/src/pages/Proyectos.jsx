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
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Proyecto</label>
        <input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cliente</label>
        <select value={formData.id_cliente} onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required>
          <option value="">Seleccionar...</option>
          {clientesList.map((c) => (
            <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Propuesta (opcional)</label>
        <select value={formData.id_propuesta} onChange={(e) => setFormData({ ...formData, id_propuesta: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <option value="">Ninguna</option>
          {propuestasList.map((p) => (
            <option key={p.id_propuesta} value={p.id_propuesta}>{p.titulo}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Estado</label>
        <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <option value="planificacion">Planificacion</option>
          <option value="en_curso">En Curso</option>
          <option value="pausado">Pausado</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Presupuesto ($)</label>
        <input type="number" step="0.01" value={formData.presupuesto} onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha Inicio</label>
        <input type="date" value={formData.fecha_inicio} onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha Fin</label>
        <input type="date" value={formData.fecha_fin} onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripcion</label>
        <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '60px' }} />
      </div>
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px 20px', background: '#1a535c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Guardar</button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
      </div>
    </form>
  );
}

export default function Proyectos() {
  return <CrudPage title="Proyectos" api={proyectos} columns={columns} renderForm={(props) => <ProyectoForm {...props} />} canEdit />;
}
