import { useState, useEffect } from 'react';
import CrudPage from './CrudPage';
import { propuestas, clientes } from '../api';

const columns = [
  { key: 'id_propuesta', label: 'ID' },
  { key: 'titulo', label: 'Titulo' },
  { key: 'nombre_cliente', label: 'Cliente' },
  { key: 'monto', label: 'Monto', render: (v) => `$${Number(v).toLocaleString('es-CO')}` },
  { key: 'estado', label: 'Estado', render: (v) => (
    <span style={{
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      background: v === 'aceptada' ? '#d4edda' : v === 'rechazada' ? '#f8d7da' : v === 'enviada' ? '#fff3cd' : '#e2e3e5',
      color: v === 'aceptada' ? '#155724' : v === 'rechazada' ? '#721c24' : v === 'enviada' ? '#856404' : '#383d41',
    }}>{v}</span>
  )},
  { key: 'fecha_creacion', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString('es-CO') : '' },
];

function PropuestaForm({ initialData, onSave, onCancel }) {
  const [clientesList, setClientesList] = useState([]);
  const [formData, setFormData] = useState(() => ({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    monto: initialData?.monto || '',
    estado: initialData?.estado || 'borrador',
    id_cliente: initialData?.id_cliente || '',
  }));

  useEffect(() => {
    clientes.getAll().then((res) => setClientesList(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id_cliente: Number(formData.id_cliente), monto: Number(formData.monto) });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label className="form-label fw-semibold">Titulo</label>
        <input value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="form-control" required />
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
        <label className="form-label fw-semibold">Monto ($)</label>
        <input type="number" step="0.01" className="form-control" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })} required />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Estado</label>
        <select value={formData.estado} className="form-select" onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
          <option value="borrador">Borrador</option>
          <option value="enviada">Enviada</option>
          <option value="aceptada">Aceptada</option>
          <option value="rechazada">Rechazada</option>
        </select>
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

export default function Propuestas() {
  return <CrudPage title="Propuestas" api={propuestas} columns={columns} renderForm={(props) => <PropuestaForm {...props} />} canEdit idKey="id_propuesta" />;
}
