import { useState, useEffect } from 'react';
import CrudPage from './CrudPage';
import { reuniones, clientes } from '../api';
import { useAuth } from '../context/AuthContext';

const columns = [
  { key: 'id_reunion', label: 'ID' },
  { key: 'titulo', label: 'Titulo' },
  { key: 'nombre_cliente', label: 'Cliente' },
  { key: 'fecha_reunion', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleString('es-CO') : '' },
  { key: 'duracion_minutos', label: 'Duracion (min)' },
  { key: 'lugar', label: 'Lugar' },
];

function ReunionForm({ initialData, onSave, onCancel }) {
  const [clientesList, setClientesList] = useState([]);
  const [formData, setFormData] = useState(() => ({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    fecha_reunion: initialData?.fecha_reunion ? initialData.fecha_reunion.slice(0, 16) : '',
    duracion_minutos: initialData?.duracion_minutos || 60,
    lugar: initialData?.lugar || '',
    id_cliente: initialData?.id_cliente || '',
  }));

  useEffect(() => {
    clientes.getAll().then((res) => setClientesList(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id_cliente: Number(formData.id_cliente), duracion_minutos: Number(formData.duracion_minutos) });
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
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha y Hora</label>
        <input type="datetime-local" value={formData.fecha_reunion} onChange={(e) => setFormData({ ...formData, fecha_reunion: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duracion (minutos)</label>
        <input type="number" value={formData.duracion_minutos} onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lugar</label>
        <input value={formData.lugar} onChange={(e) => setFormData({ ...formData, lugar: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
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

export default function Reuniones() {
  const { user } = useAuth();
  const canEdit = user?.rol === 'ejecutivo';
  return <CrudPage title="Reuniones" api={reuniones} columns={columns} renderForm={(props) => <ReunionForm {...props} />} canEdit={canEdit} />;
}
