import CrudPage from './CrudPage';
import { ejecutivos } from '../api';

const columns = [
  { key: 'id_ejecutivo', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Telefono' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'total_clientes', label: 'Clientes' },
];

const formFields = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'apellido', label: 'Apellido', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'telefono', label: 'Telefono', type: 'text' },
  { key: 'cargo', label: 'Cargo', type: 'text' },
];

export default function Ejecutivos() {
  return <CrudPage title="Ejecutivos" api={ejecutivos} columns={columns} formFields={formFields} />;
}
