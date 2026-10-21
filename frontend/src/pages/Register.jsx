import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    password2: '',
    rol: 'cliente',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica de contraseñas coincidentes antes de enviar
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await auth.register(form);
      setUser(res.data);
      navigate('/app');
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Error al registrarse. Intente nuevamente.';

      if (data) {
        if (typeof data === 'string') {
          msg = data;
        } else if (data.detail) {
          msg = data.detail;
        } else if (typeof data === 'object') {
          // Extrae texto legible evitando convertirlos a [object Object]
          msg = Object.entries(data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ');
        }
      } else if (err.message) {
        msg = err.message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '20px' }}>
      <div className="card border-0 shadow-lg rounded-4" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-1 fw-bold text-dark">Crear cuenta</h2>
          <p className="text-center text-secondary mb-4">Regístrate para comenzar</p>

          {error && (
            <div className="alert alert-danger py-2" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nombre</label>
                <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Apellido</label>
                <input name="apellido" className="form-control" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="tucorreo@ejemplo.com" required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Rol</label>
              <div className="d-flex gap-2">
                {[
                  { value: 'cliente', label: 'Cliente' },
                  { value: 'ejecutivo', label: 'Ejecutivo' },
                ].map((r) => (
                  <label
                    key={r.value}
                    className="flex-fill d-flex align-items-center justify-content-center rounded-3 fw-semibold py-2"
                    style={{
                      border: `2px solid ${form.rol === r.value ? '#e94560' : '#ddd'}`,
                      color: form.rol === r.value ? '#e94560' : '#888',
                      background: form.rol === r.value ? '#fdecef' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="rol"
                      value={r.value}
                      checked={form.rol === r.value}
                      onChange={handleChange}
                      className="me-1"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirmar contraseña</label>
              <input type="password" name="password2" className="form-control" value={form.password2} onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 text-white fw-bold"
              style={{ background: '#e94560' }}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center mt-4 text-secondary">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#e94560' }}>
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
