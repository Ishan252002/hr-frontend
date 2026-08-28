import { motion } from 'framer-motion';

function Topbar() {
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
          <div className="user-avatar">IS</div>
          <span>Ishan</span>
        </div>
      </div>
    </motion.div>
  );
}

export default Topbar;
