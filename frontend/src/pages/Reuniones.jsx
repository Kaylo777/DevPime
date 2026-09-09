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
        <label className="form-label fw-semibold">Fecha y Hora</label>
        <input type="datetime-local" className="form-control" value={formData.fecha_reunion} onChange={(e) => setFormData({ ...formData, fecha_reunion: e.target.value })} required />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Duracion (minutos)</label>
        <input type="number" className="form-control" value={formData.duracion_minutos} onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })} />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-semibold">Lugar</label>
        <input value={formData.lugar} onChange={(e) => setFormData({ ...formData, lugar: e.target.value })} className="form-control" />
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

export default function Reuniones() {
  const { user } = useAuth();
  const canEdit = user?.rol === 'ejecutivo';
  return <CrudPage title="Reuniones" api={reuniones} columns={columns} renderForm={(props) => <ReunionForm {...props} />} canEdit={canEdit} idKey="id_reunion" />;
}
