import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', position: '', department_id: 1 });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/employees`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId 
      ? `${import.meta.env.VITE_API_URL}/api/employees/${editId}`
      : `${import.meta.env.VITE_API_URL}/api/employees`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (editId) {
          setEmployees(employees.map(e => e.id === editId ? data : e));
          setEditId(null);
        } else {
          setEmployees([...employees, data]);
        }
        setFormData({ name: '', email: '', position: '', department_id: 1 });
        setShowForm(false);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      fetch(`${import.meta.env.VITE_API_URL}/api/employees/${id}`, { method: 'DELETE' })
        .then(() => {
          setEmployees(employees.filter(e => e.id !== id));
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setFormData({ name: emp.name, email: emp.email, position: emp.position, department_id: emp.department_id });
    setShowForm(true);
  };

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <motion.div className="hero" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Your Team</h1>
        <p>{employees.length} employees • {employees.length > 0 ? 'All active' : 'No one yet'}</p>
        <button className="btn-primary" onClick={() => {
          setShowForm(!showForm);
          setEditId(null);
          setFormData({ name: '', email: '', position: '', department_id: 1 });
        }}>
          {showForm ? '✕ Cancel' : '+ Add Employee'}
        </button>
      </motion.div>

      {showForm && (
        <motion.div className="form-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>{editId ? 'Edit Employee' : 'Add New Employee'}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="text" placeholder="Position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
            <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'} Employee</button>
          </form>
        </motion.div>
      )}

      <div className="search-bar">
        <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="result-count">{filtered.length} found</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="cards-grid">
          {filtered.map((emp, i) => (
            <div key={emp.id} style={{ position: 'relative' }}>
              <TiltCard index={i}>
                <h4>{emp.name}</h4>
                <p>{emp.email}</p>
                <p className="position">{emp.position || 'Role TBD'}</p>
                <span className="dept-badge">{emp.department?.name}</span>
              </TiltCard>
              <div className="card-actions">
                <button className="btn-icon" onClick={() => handleEdit(emp)} title="Edit">✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(emp.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Employees;
