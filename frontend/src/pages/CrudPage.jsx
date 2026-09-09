import { useState, useEffect } from 'react';

export default function CrudPage({ title, api, columns, formFields, renderForm, canEdit = true, idKey = 'id' }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.getAll().then((res) => setItems(res.data));

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await api.update(editing[idKey], data);
    } else {
      await api.create(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (confirm('Estas seguro de eliminar?')) {
      await api.delete(id);
      load();
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h4 mb-0 fw-bold">{title}</h1>
          {canEdit && (
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="btn text-white fw-semibold"
              style={{ background: '#e94560' }}
            >
              + Nuevo
            </button>
          )}
        </div>

        {showForm && (
          <div className="card mb-4 border-0 shadow-sm" style={{ background: '#f8f9fa' }}>
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3">{editing ? 'Editar' : 'Crear'} {title}</h3>
              {renderForm ? (
                renderForm({ initialData: editing, onSave: handleSave, onCancel: () => { setShowForm(false); setEditing(null); } })
              ) : (
                <GenericForm fields={formFields} initialData={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
              )}
            </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col">{col.label}</th>
                ))}
                {canEdit && (
                  <th scope="col" style={{ width: '150px' }}>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className="text-center text-secondary py-4">
                    No hay registros
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item[idKey]}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {canEdit && (
                    <td>
                      <button onClick={() => handleEdit(item)} className="btn btn-sm text-white me-1" style={{ background: '#0f3460' }}>Editar</button>
                      <button onClick={() => handleDelete(item[idKey])} className="btn btn-sm btn-danger">Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericForm({ fields, initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => {
    const data = {};
    fields.forEach((f) => { data[f.key] = initialData ? initialData[f.key] || '' : f.default || ''; });
    return data;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processed = {};
    fields.forEach((f) => {
      let val = formData[f.key];
      if (f.type === 'number') val = val ? Number(val) : null;
      if (f.type === 'select' && f.empty) val = val || null;
      processed[f.key] = val;
    });
    onSave(processed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {fields.map((field) => (
          <div className="col-md-6" key={field.key}>
            <label className="form-label fw-semibold">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="form-select"
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className="form-control"
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            ) : (
              <input
                type={field.type || 'text'}
                className="form-control"
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            )}
          </div>
        ))}
        <div className="col-12 d-flex gap-2 mt-4">
          <button type="submit" className="btn px-4 text-white fw-semibold" style={{ background: '#1a535c' }}>Guardar</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary px-4">Cancelar</button>
        </div>
      </div>
    </form>
  );
}