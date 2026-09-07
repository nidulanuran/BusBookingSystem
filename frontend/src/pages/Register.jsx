import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerService from '../services/PassengerService';
import { showToast } from '../components/Toast';
import '../App.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    phoneNo: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = 'Username is required';
    if (formData.userName.trim().length < 3) newErrors.userName = 'Username must be at least 3 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 4) newErrors.password = 'Password must be at least 4 characters';
    if (!/^\d{10}$/.test(formData.phoneNo)) newErrors.phoneNo = 'Phone number must be exactly 10 digits';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await PassengerService.register({
        ...formData,
        userName: formData.userName.trim(),
        address: formData.address.trim(),
      });
      showToast('Account created successfully! Welcome to BusGo! 🎉', 'success');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data;
      showToast(
        typeof msg === 'string' && msg.length < 120 ? msg : 'Registration failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const phoneDigits = formData.phoneNo.replace(/\D/g, '').length;
  const phoneProgress = (phoneDigits / 10) * 100;
  const phoneColor =
    phoneDigits === 0 ? 'var(--color-border)'
    : phoneDigits < 10 ? 'var(--color-warning)'
    : 'var(--color-success)';

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-badge" aria-hidden="true">
            ✨
          </div>
          <h1 className="auth-logo-title">Join BusGo</h1>
          <p className="auth-logo-subtitle">Create an account for seamless ticket booking</p>
        </div>

        <form onSubmit={handleRegister} noValidate>
          {/* Username */}
          <div className="form-group" style={{ marginBottom: '1.1rem' }}>
            <label className="form-label" htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              name="userName"
              type="text"
              className={`form-input ${errors.userName ? 'input-error' : ''}`}
              placeholder="e.g. nidula_perera"
              value={formData.userName}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
            {errors.userName && <p className="input-error-msg" style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errors.userName}</p>}
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '1.1rem' }}>
            <label className="form-label" htmlFor="reg-password">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="At least 4 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {errors.password && <p className="input-error-msg" style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errors.password}</p>}
          </div>

          {/* Phone Number with Progress Bar */}
          <div className="form-group" style={{ marginBottom: '1.1rem' }}>
            <label className="form-label" htmlFor="reg-phone">
              Mobile Phone Number
            </label>
            <input
              id="reg-phone"
              name="phoneNo"
              type="tel"
              className={`form-input ${errors.phoneNo ? 'input-error' : phoneDigits === 10 ? 'input-success' : ''}`}
              placeholder="10-digit number (e.g. 0771234567)"
              value={formData.phoneNo}
              onChange={handleChange}
              maxLength={10}
              autoComplete="tel"
            />
            <div className="phone-validation-bar">
              <div
                className="phone-validation-fill"
                style={{
                  width: `${phoneProgress}%`,
                  backgroundColor: phoneColor,
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {phoneDigits === 10 ? '✅ 10 digits complete!' : `${phoneDigits}/10 digits entered`}
            </p>
            {errors.phoneNo && <p className="input-error-msg" style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errors.phoneNo}</p>}
          </div>

          {/* Address */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="reg-address">
              Residential Address
            </label>
            <input
              id="reg-address"
              name="address"
              type="text"
              className={`form-input ${errors.address ? 'input-error' : ''}`}
              placeholder="City or Street Address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="street-address"
            />
            {errors.address && <p className="input-error-msg" style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {errors.address}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <span>Create Account ➔</span>}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} role="button" tabIndex={0}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;