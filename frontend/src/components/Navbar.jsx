import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

/**
 * Navbar — Floating Glassmorphism Navigation Bar
 * Props:
 *   role: string — "Passenger" | "Conductor" | "Admin"
 */
const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.userName || role;
  const initials = userName.slice(0, 2).toUpperCase();

  const roleMeta = {
    Passenger: { icon: '🧍', label: 'Passenger', color: 'badge-primary' },
    Conductor: { icon: '🚌', label: 'Bus Crew', color: 'badge-warning' },
    Admin: { icon: '🛡️', label: 'Fleet Admin', color: 'badge-success' },
  };

  const currentRole = roleMeta[role] || { icon: '👤', label: role, color: 'badge-primary' };

  return (
    <header className="navbar">
      {/* Brand Identity */}
      <div className="navbar-brand">
        <div className="navbar-brand-badge" aria-hidden="true">
          🚌
        </div>
        <div className="navbar-brand-text">
          <span>BusGo</span>
          <span className="navbar-brand-tag">Express</span>
        </div>
      </div>

      {/* Right Side Info & Profile */}
      <div className="navbar-right">
        {/* Live System Indicator */}
        <div className="navbar-status-pill">
          <span className="status-dot" aria-hidden="true" />
          <span>Fleet Active</span>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="navbar-avatar" aria-hidden="true">
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-title)', lineHeight: 1.1 }}>
              {userName}
            </div>
            <span className={`badge ${currentRole.color}`} style={{ marginTop: '2px', fontSize: '0.675rem', padding: '1px 6px' }}>
              {currentRole.icon} {currentRole.label}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="navbar-logout-btn"
          onClick={handleLogout}
          aria-label="Sign out of BusGo"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;