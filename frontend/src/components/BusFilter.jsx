import React, { useState } from 'react';
import BusService from '../services/BusService';
import '../App.css';

const LOCATIONS = [
  'Colombo', 'Kandy', 'Galle', 'Matara',
  'Jaffna', 'Trincomalee', 'Kurunegala', 'Anuradhapura',
];

/**
 * BusFilter — Modern Travel Route Search Module
 */
const BusFilter = ({ onFilterResults, onReset }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await BusService.filterBuses(from, to);
      onFilterResults(res.data);
    } catch {
      onFilterResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFrom('');
    setTo('');
    if (onReset) onReset();
  };

  return (
    <div className="search-box">
      <div className="search-box-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <span>Plan Your Journey</span>
      </div>

      <form onSubmit={handleSearch}>
        <div className="search-row">
          {/* Departure Field */}
          <div className="search-field">
            <label className="form-label" htmlFor="from-select">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="4" />
                </svg>
                From (Origin)
              </span>
            </label>
            <select
              id="from-select"
              className="form-select"
              value={from}
              onChange={e => setFrom(e.target.value)}
              required
            >
              <option value="">Select departure station</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Swap City Button */}
          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            aria-label="Swap departure and destination"
            title="Swap Origin and Destination"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m17 2 4 4-4 4" />
              <path d="M3 6h18" />
              <path d="m7 22-4-4 4-4" />
              <path d="M21 18H3" />
            </svg>
          </button>

          {/* Destination Field */}
          <div className="search-field">
            <label className="form-label" htmlFor="to-select">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                To (Destination)
              </span>
            </label>
            <select
              id="to-select"
              className="form-select"
              value={to}
              onChange={e => setTo(e.target.value)}
              required
            >
              <option value="">Select destination station</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ alignSelf: 'flex-end', minWidth: '170px' }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Find Routes</span>
              </>
            )}
          </button>
        </div>

        {/* Reset Trigger */}
        {(from || to) && (
          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>✕ Clear filter and view all active routes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BusFilter;