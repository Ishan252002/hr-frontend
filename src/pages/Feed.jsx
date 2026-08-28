import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const posts = [
  { id: 1, emoji: '🎉', title: 'Welcome, new joiners!', body: 'Say hi to the newest members of the team this week.', time: '2h ago' },
  { id: 2, emoji: '👏', title: 'Great work, everyone', body: 'Another strong month wrapped up — thank you for the effort.', time: '1d ago' },
  { id: 3, emoji: '📋', title: 'Policy update', body: 'Remote-work guidelines have been refreshed. Take a look.', time: '3d ago' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Feed() {
  const [stats, setStats] = useState({ total: 0, departments: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/api/employees')
      .then((res) => res.json())
      .then((data) => {
        const depts = new Set(data.map((e) => e.department_id).filter(Boolean));
        setStats({ total: data.length, departments: depts.size });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <motion.div
        className="page-banner"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">GOOD TO SEE YOU</span>
        <h1>Welcome back, Ishan</h1>
        <p>Here's what's happening across the team today.</p>
      </motion.div>

      <motion.div className="stat-row" variants={container} initial="hidden" animate="show">
        <motion.div className="stat-card" variants={item}>
          <span className="stat-icon">👥</span>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={item}>
          <span className="stat-icon">🏢</span>
          <div>
            <div className="stat-value">{stats.departments}</div>
            <div className="stat-label">Departments</div>
          </div>
        </motion.div>
        <motion.div className="stat-card" variants={item}>
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-value">0</div>
            <div className="stat-label">Pending Leave</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="section-label">RECENT ACTIVITY</div>

      <motion.div className="feed-list" variants={container} initial="hidden" animate="show">
        {posts.map((post) => (
          <motion.div className="feed-card" key={post.id} variants={item}>
            <div className="feed-emoji">{post.emoji}</div>
            <div className="feed-body">
              <div className="feed-top">
                <h3>{post.title}</h3>
                <span className="feed-time">{post.time}</span>
              </div>
              <p>{post.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Feed;
