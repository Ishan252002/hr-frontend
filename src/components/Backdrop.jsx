import { motion } from 'framer-motion';

function Backdrop() {
  return (
    <div className="backdrop">
      <motion.div
        className="orb orb-1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-2"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default Backdrop;
