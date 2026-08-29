import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Payroll() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    employee_id: '',
    month: '',
    base_salary: '',
    deductions: '',
    bonus: '',
  });

  const fetchSalaries = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/salaries`)
      .then((res) => res.json())
      .then((data) => setSalaries(data))
      .catch(() => setError('Failed to load salaries.'))
      .finally(() => setLoading(false));
  };

  const fetchEmployees = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/employees`)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setForm({ employee_id: '', month: '', base_salary: '', deductions: '', bonus: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    fetch(`${import.meta.env.VITE_API_URL}/api/salaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchSalaries();
      })
      .catch(() => setError('Save failed — please check the form values.'));
  };

  const handleMarkPaid = (salary) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/salaries/${salary.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        fetchSalaries();
      })
      .catch(() => setError('Status update failed.'));
  };

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/salaries/${id}`, { method: 'DELETE' })
      .then(() => fetchSalaries())
      .catch(() => setError('Delete failed.'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}
    >
      <h2>Payroll</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}
      >
        <select
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
        <input
          type="month"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Base Salary"
          value={form.base_salary}
          onChange={(e) => setForm({ ...form, base_salary: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Deductions"
          value={form.deductions}
          onChange={(e) => setForm({ ...form, deductions: e.target.value })}
        />
        <input
          type="number"
          placeholder="Bonus"
          value={form.bonus}
          onChange={(e) => setForm({ ...form, bonus: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Loading...
        </motion.p>
      ) : salaries.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ fontStyle: 'italic', color: '#888' }}
        >
          No salary entries yet — add one above to get started.
        </motion.p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Base</th>
              <th>Deductions</th>
              <th>Bonus</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s.id}>
                <td>{s.employee?.name || s.employee_id}</td>
                <td>{s.month}</td>
                <td>{s.base_salary}</td>
                <td>{s.deductions}</td>
                <td>{s.bonus}</td>
                <td>{s.net_pay}</td>
                <td>{s.status}</td>
                <td>
                  {s.status !== 'paid' && (
                    <button onClick={() => handleMarkPaid(s)}>Mark Paid</button>
                  )}
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

export default Payroll;
