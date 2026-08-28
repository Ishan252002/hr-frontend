import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import vortexMark from '../assets/vortex-mark.svg';
import vortexWordmark from '../assets/vortex-wordmark.svg';

const links = [
  { to: '/', label: 'Feed', icon: '🏠' },
  { to: '/employees', label: 'Employees', icon: '👥' },
  { to: '/leave', label: 'Leave', icon: '📋' },
];

function Sidebar() {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="sidebar-brand">
        <img src={vortexMark} alt="VortexWeb" className="brand-mark" />
        <img src={vortexWordmark} alt="VortexWeb" className="brand-wordmark" />
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}

export default Sidebar;
