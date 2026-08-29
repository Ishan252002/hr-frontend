cat > src/App.jsx << 'EOF'
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Backdrop from './components/Backdrop';
import Feed from './pages/Feed';
import Employees from './pages/Employees';
import Leave from './pages/Leave';
import Attendance from './pages/Attendance';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Backdrop />
      <Sidebar />
      <div className="content-area">
        <Topbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
EOF
