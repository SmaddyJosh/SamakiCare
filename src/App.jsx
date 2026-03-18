import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, History, Bell, Fish, LayoutDashboard } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Metric from './pages/Metric';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-container">


      <aside className="left-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Fish size={32} strokeWidth={2.5} color="var(--primary)" />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              Samaki Care
            </span>
          </div>
        </div>

        <div className="scanner-wrapper">

          <Scanner />
        </div>
      </aside>


      <div className="content-area">
        <header className="top-bar">

          <nav style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <LayoutDashboard size={20} /> <span>Dashboard</span>
            </Link>
            <Link to="/metrics" className={`nav-item ${location.pathname === '/metrics' ? 'active' : ''}`}>
              <Activity size={20} /> <span>Pond Metrics</span>
            </Link>
            <Link to="/history" className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
              <History size={20} /> <span>Treatment Logs</span>
            </Link>
          </nav>

          <button className="notification-btn">
            <Bell size={24} />
            <span className="notification-dot"></span>
          </button>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>

            <Route path="/" element={<Dashboard />} />
            <Route path="/metrics" element={<Metric />} />
            <Route path="/history" element={<div className="p-4 text-center" style={{ padding: '2rem' }}>History Log Coming Soon</div>} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}