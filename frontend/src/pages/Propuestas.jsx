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
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Titulo</label>
        <input value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
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
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Monto ($)</label>
        <input type="number" step="0.01" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Estado</label>
        <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <option value="borrador">Borrador</option>
          <option value="enviada">Enviada</option>
          <option value="aceptada">Aceptada</option>
          <option value="rechazada">Rechazada</option>
        </select>
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

export default function Propuestas() {
  return <CrudPage title="Propuestas" api={propuestas} columns={columns} renderForm={(props) => <PropuestaForm {...props} />} canEdit />;
}
