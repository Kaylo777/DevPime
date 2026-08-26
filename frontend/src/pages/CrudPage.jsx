import { useState, useEffect } from 'react';

export default function CrudPage({ title, api, columns, formFields, renderForm }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.getAll().then((res) => setItems(res.data));

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await api.update(editing.id, data);
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{title}</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          style={{ padding: '10px 20px', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          + Nuevo
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>{editing ? 'Editar' : 'Crear'} {title}</h3>
          {renderForm ? (
            renderForm({ initialData: editing, onSave: handleSave, onCancel: () => { setShowForm(false); setEditing(null); } })
          ) : (
            <GenericForm fields={formFields} initialData={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
          )}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: 'white' }}>
              {columns.map((col) => (
                <th key={col.key} style={{ padding: '12px 15px', textAlign: 'left' }}>{col.label}</th>
              ))}
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No hay registros</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '12px 15px' }}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td style={{ padding: '12px 15px' }}>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: '8px', padding: '5px 10px', background: '#0f3460', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 10px', background: '#e94560', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      {fields.map((field) => (
        <div key={field.key}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.label}</label>
          {field.type === 'select' ? (
            <select
              value={formData[field.key] || ''}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="">Seleccionar...</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={formData[field.key] || ''}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }}
            />
          ) : (
            <input
              type={field.type || 'text'}
              value={formData[field.key] || ''}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          )}
        </div>
      ))}
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px 20px', background: '#1a535c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Guardar</button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
      </div>
    </form>
  );
}
