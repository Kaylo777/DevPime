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
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-semibold">Nombre</label>
        <input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="form-control" required />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Apellido</label>
        <input value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="form-control" required />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Email</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-control" required />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Telefono</label>
        <input value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="form-control" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Empresa</label>
        <input value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} className="form-control" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Ejecutivo</label>
        <select value={formData.id_ejecutivo} onChange={(e) => setFormData({ ...formData, id_ejecutivo: e.target.value })} className="form-select" required>
          <option value="">Seleccionar...</option>
          {ejecutivosList.map((e) => (
            <option key={e.id_ejecutivo} value={e.id_ejecutivo}>{e.nombre} {e.apellido}</option>
          ))}
        </select>
      </div>
      <div className="col-12">
        <label className="form-label fw-semibold">Direccion</label>
        <textarea value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="form-control" style={{ minHeight: '60px' }} />
      </div>
      <div className="col-12 d-flex gap-2">
        <button type="submit" className="btn px-4 text-white fw-semibold" style={{ background: '#1a535c' }}>Guardar</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary px-4">Cancelar</button>
      </div>
    </form>
  );
}

export default function Clientes() {
  const { user } = useAuth();
  const canEdit = user?.rol === 'ejecutivo';
  return <CrudPage title="Clientes" api={clientes} columns={columns} renderForm={(props) => <ClienteForm {...props} />} canEdit={canEdit} idKey="id_cliente" />;
}
