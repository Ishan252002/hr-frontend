import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      window.location.reload();
    });
  };

  return (
    <motion.div
      className="topbar"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search employees, departments..." />
      </div>
      <div className="topbar-right">
        <button className="icon-btn">🔔</button>
        <div className="user-chip">
          <div className="user-avatar">{(user.name || 'U').slice(0, 2).toUpperCase()}</div>
          <span>{user.name || 'User'}</span>
        </div>
        <button className="icon-btn" onClick={handleLogout} title="Logout">🚪</button>
      </div>
    </motion.div>
  );
}

export default Topbar;
