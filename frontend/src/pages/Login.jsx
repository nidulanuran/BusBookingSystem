import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerService from '../services/PassengerService';
import ConductorService from '../services/ConductorService';
import AdminService from '../services/AdminService';
import '../App.css';

const ROLES = [
  { key: 'PASSENGER', label: 'Passenger', icon: '🧍', desc: 'Book tickets' },
  { key: 'CONDUCTOR', label: 'Conductor', icon: '🚌', desc: 'Trip manifest' },
  { key: 'ADMIN', label: 'Admin', icon: '🛡️', desc: 'Fleet control' },
];

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PASSENGER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const credentials = { userName: userName.trim(), password };

    try {
      let response;
      if (role === 'PASSENGER') {
        response = await PassengerService.login(credentials);
      } else if (role === 'CONDUCTOR') {
        response = await ConductorService.login(credentials);
      } else if (role === 'ADMIN') {
        response = await AdminService.login(credentials);
      }

      if (response?.status === 200) {
        const user = { ...response.data, role };
        localStorage.setItem('user', JSON.stringify(user));

        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'CONDUCTOR') navigate('/conductor');
        else navigate('/passenger');
      }
    } catch (err) {
      const msg = err.response?.data;
      setError(
        typeof msg === 'string' && msg.length < 120
          ? msg
          : 'Invalid credentials. Please verify your username and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo Header */}
        <div className="auth-logo">
          <div className="auth-logo-badge" aria-hidden="true">
            🚌
          </div>
          <h1 className="auth-logo-title">Welcome to BusGo</h1>
          <p className="auth-logo-subtitle">Fast, smart & comfortable intercity travel</p>
        </div>

        {/* Role Segmented Selector */}
        <div>
          <label className="form-label" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            Choose Your Access Role
          </label>
          <div className="role-selector">
            {ROLES.map(r => (
              <button
                key={r.key}
                type="button"
                className={`role-btn ${role === r.key ? 'active' : ''}`}
                onClick={() => { setRole(r.key); setError(''); }}
                aria-pressed={role === r.key}
                title={r.desc}
              >
                <span className="role-btn-icon">{r.icon}</span>
                <span className="role-btn-label">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleLogin} noValidate>
          {/* Username */}
          <div className="form-group" style={{ marginBottom: '1.15rem' }}>
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter your registered username"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter account password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <span>Sign In to Dashboard ➔</span>
            )}
          </button>
        </form>

        {/* Registration Prompt */}
        <div className="auth-link">
          Need a passenger account?{' '}
          <span onClick={() => navigate('/register')} role="button" tabIndex={0}>
            Create an Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;