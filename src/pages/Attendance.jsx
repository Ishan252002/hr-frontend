import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
    fetch(`${import.meta.env.VITE_API_URL}/api/employees`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        if (data.length > 0) setSelectedEmp(data[0].id);
      });
  }, []);

  const fetchRecords = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/attendances`)
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const handleCheckIn = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/attendances/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ employee_id: selectedEmp }),
    })
      .then(res => res.json())
      .then(() => fetchRecords())
      .catch(err => console.error(err));
  };

  const handleCheckOut = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/attendances/check-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ employee_id: selectedEmp }),
    })
      .then(res => res.json())
      .then(() => fetchRecords())
      .catch(err => console.error(err));
  };

  return (
    <div className="page-content">
      <motion.div className="hero" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Attendance</h1>
        <p>{records.length} records tracked</p>
      </motion.div>

      <div className="form-card">
        <h3>Check In / Check Out</h3>
        <div className="form-grid">
          <select value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={handleCheckIn}>Check In</button>
          <button className="btn-primary" onClick={handleCheckOut} style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF5C5C)' }}>Check Out</button>
        </div>
      </div>

      <h3 style={{ marginTop: '32px' }}>Recent Records</h3>
      {loading ? <p>Loading...</p> : (
        <div className="cards-grid">
          {records.map((rec, i) => (
            <motion.div key={rec.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <h4>{rec.employee?.name}</h4>
              <p><strong>Date:</strong> {rec.date}</p>
              <p><strong>In:</strong> {rec.check_in || '—'} <strong>Out:</strong> {rec.check_out || '—'}</p>
              <span className="badge" style={{ background: rec.status === 'present' ? '#16C784' : '#FFA94D' }}>{rec.status}</span>
            </motion.div>
          ))}
          {records.length === 0 && <p>No attendance records yet</p>}
        </div>
      )}
    </div>
  );
}

export default Attendance;
