import { useState, useEffect } from 'react';
import CrudPage from './CrudPage';
import { clientes, ejecutivos } from '../api';
import { useAuth } from '../context/AuthContext';

const columns = [
  { key: 'id_cliente', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Telefono' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'nombre_ejecutivo', label: 'Ejecutivo' },
  { key: 'total_reuniones', label: 'Reuniones' },
  { key: 'total_propuestas', label: 'Propuestas' },
  { key: 'total_proyectos', label: 'Proyectos' },
];

function ClienteForm({ initialData, onSave, onCancel }) {
  const [ejecutivosList, setEjecutivosList] = useState([]);
  const [formData, setFormData] = useState(() => ({
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    email: initialData?.email || '',
    telefono: initialData?.telefono || '',
    empresa: initialData?.empresa || '',
    direccion: initialData?.direccion || '',
    id_ejecutivo: initialData?.id_ejecutivo || '',
  }));

  useEffect(() => {
    ejecutivos.getAll().then((res) => setEjecutivosList(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id_ejecutivo: Number(formData.id_ejecutivo) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre</label>
        <input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Apellido</label>
        <input value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefono</label>
        <input value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Empresa</label>
        <input value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ejecutivo</label>
        <select value={formData.id_ejecutivo} onChange={(e) => setFormData({ ...formData, id_ejecutivo: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} required>
          <option value="">Seleccionar...</option>
          {ejecutivosList.map((e) => (
            <option key={e.id_ejecutivo} value={e.id_ejecutivo}>{e.nombre} {e.apellido}</option>
          ))}
        </select>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Direccion</label>
        <textarea value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '60px' }} />
      </div>
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px 20px', background: '#1a535c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Guardar</button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
      </div>
    </form>
  );
}

export default function Clientes() {
  const { user } = useAuth();
  const canEdit = user?.rol === 'ejecutivo';
  return <CrudPage title="Clientes" api={clientes} columns={columns} renderForm={(props) => <ClienteForm {...props} />} canEdit={canEdit} />;
}
