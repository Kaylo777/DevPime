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
    setLoading(true);
    try {
      const res = await auth.register(form);
      setUser(res.data);
      navigate('/app');
    } catch (err) {
      const data = err.response?.data;
      const msg = data
        ? Object.values(data).flat().join(' ')
        : 'Error al registrarse. Intente nuevamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#333',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '440px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1a1a2e' }}>
          Crear cuenta
        </h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '28px' }}>
          Regístrate para comenzar
        </p>

        {error && (
          <div style={{
            background: '#fdecea',
            color: '#c0392b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Rol</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            {[
              { value: 'cliente', label: 'Cliente' },
              { value: 'ejecutivo', label: 'Ejecutivo' },
            ].map((r) => (
              <label
                key={r.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  border: `2px solid ${form.rol === r.value ? '#e94560' : '#ddd'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: form.rol === r.value ? '#e94560' : '#888',
                  background: form.rol === r.value ? '#fdecef' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name="rol"
                  value={r.value}
                  checked={form.rol === r.value}
                  onChange={handleChange}
                  style={{ marginRight: '6px' }}
                />
                {r.label}
              </label>
            ))}
          </div>

          <label style={labelStyle}>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Confirmar contraseña</label>
          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            placeholder="••••••••"
            style={{ ...inputStyle, marginBottom: '22px' }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#e94560',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
