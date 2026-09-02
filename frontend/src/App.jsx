import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Ejecutivos from './pages/Ejecutivos';
import Clientes from './pages/Clientes';
import Reuniones from './pages/Reuniones';
import Propuestas from './pages/Propuestas';
import Proyectos from './pages/Proyectos';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="ejecutivos" element={<Ejecutivos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="reuniones" element={<Reuniones />} />
          <Route path="propuestas" element={<Propuestas />} />
          <Route path="proyectos" element={<Proyectos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
