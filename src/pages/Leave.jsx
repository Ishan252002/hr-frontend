import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_id: '',
    from_date: '',
    to_date: '',
    type: 'casual',
    reason: '',
  });

  useEffect(() => {
    fetchLeaves();
    fetch(`${import.meta.env.VITE_API_URL}/api/employees`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, employee_id: data[0].id }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const fetchLeaves = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/leave-requests`)
      .then(res => res.json())
      .then(data => {
        setLeaves(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/api/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setLeaves([...leaves, data]);
        setFormData({ ...formData, from_date: '', to_date: '', type: 'casual', reason: '' });
      })
      .catch(err => console.error(err));
  };

  const handleApprove = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/leave-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    })
      .then(res => res.json())
      .then(data => {
        setLeaves(leaves.map(l => l.id === id ? data : l));
      })
      .catch(err => console.error(err));
  };

  const handleReject = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/leave-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    })
      .then(res => res.json())
      .then(data => {
        setLeaves(leaves.map(l => l.id === id ? data : l));
      })
      .catch(err => console.error(err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#20C997';
      case 'rejected': return '#FF6B6B';
      default: return '#FFA94D';
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const allLeaves = leaves;

  return (
    <div className="page-content">
      <motion.div className="hero" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Leave Requests</h1>
        <p>{pendingLeaves.length} pending • {allLeaves.length} total</p>
      </motion.div>

      <div className="form-card">
        <h3>Request Leave</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <select value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} required>
            {employees.length === 0 && <option value="">No employees found</option>}
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <input type="date" value={formData.from_date} onChange={(e) => setFormData({...formData, from_date: e.target.value})} required />
          <input type="date" value={formData.to_date} onChange={(e) => setFormData({...formData, to_date: e.target.value})} required />
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="emergency">Emergency</option>
          </select>
          <textarea placeholder="Reason..." value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
          <button type="submit" className="btn-primary">Submit Request</button>
        </form>
      </div>

      <h3 style={{ marginTop: '32px' }}>Pending Approvals</h3>
      {loading ? <p>Loading...</p> : (
        <div className="cards-grid">
          {pendingLeaves.map((leave, i) => (
            <motion.div key={leave.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ borderLeft: `4px solid ${getStatusColor(leave.status)}`, paddingLeft: '12px' }}>
                <h4>{leave.employee?.name}</h4>
                <p><strong>Dates:</strong> {leave.from_date} to {leave.to_date}</p>
                <p><strong>Type:</strong> {leave.type}</p>
                {leave.reason && <p><strong>Reason:</strong> {leave.reason}</p>}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn-approve" onClick={() => handleApprove(leave.id)}>✓ Approve</button>
                  <button className="btn-reject" onClick={() => handleReject(leave.id)}>✕ Reject</button>
                </div>
              </div>
            </motion.div>
          ))}
          {pendingLeaves.length === 0 && <p>No pending requests</p>}
        </div>
      )}

      <h3 style={{ marginTop: '32px' }}>All Requests</h3>
      <div className="cards-grid">
        {allLeaves.map((leave, i) => (
          <motion.div key={leave.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div style={{ borderLeft: `4px solid ${getStatusColor(leave.status)}`, paddingLeft: '12px' }}>
              <h4>{leave.employee?.name}</h4>
              <p>{leave.from_date} to {leave.to_date}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge" style={{ background: leave.type === 'casual' ? '#4DABF7' : leave.type === 'sick' ? '#FF6B6B' : '#FFA94D' }}>
                  {leave.type}
                </span>
                <span className="badge" style={{ background: getStatusColor(leave.status), color: 'white' }}>
                  {leave.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Leave;
