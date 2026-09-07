import React, { useState, useEffect } from 'react';
import BusService from '../services/BusService';
import { showToast } from './Toast';
import '../App.css';

/**
 * BusCard — High-Speed Transit Boarding Pass Component
 */
const BusCard = ({ bus, role, onBook, onEdit, onDelete, refreshData }) => {
  const [availableConductors, setAvailableConductors] = useState([]);
  const [selectedConductorId, setSelectedConductorId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (role === 'ADMIN' && !bus.conductor) {
      BusService.getAvailableConductors()
        .then(res => setAvailableConductors(res.data))
        .catch(() => {});
    }
  }, [role, bus.conductor]);

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h, 10));
    date.setMinutes(parseInt(m, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAssign = async () => {
    if (!selectedConductorId) {
      showToast('Please select a conductor first', 'warning');
      return;
    }
    setAssigning(true);
    try {
      await BusService.assignConductor(bus.busId, selectedConductorId);
      showToast('Conductor assigned successfully! 🎉', 'success');
      setSelectedConductorId('');
      if (refreshData) refreshData();
    } catch {
      showToast('Failed to assign conductor.', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    if (!window.confirm(`Remove ${bus.conductor?.userName} from this bus?`)) return;
    try {
      await BusService.unassignConductor(bus.busId);
      showToast('Conductor removed from bus.', 'success');
      if (refreshData) refreshData();
    } catch {
      showToast('Failed to remove conductor.', 'error');
    }
  };

  return (
    <article className="bus-card">
      {/* Top Banner */}
      <header className="bus-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="bus-card-badge">
            <span>Route #{bus.busId}</span>
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
            Daily Express
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: 700 }}>
          {bus.seatCount} Seats
        </div>
      </header>

      {/* Card Body */}
      <div className="bus-card-body">
        {/* Timeline Visual */}
        <div className="bus-route-visual">
          {/* Origin Stop */}
          <div className="route-stop">
            <div className="stop-time">{formatTime(bus.departureTime)}</div>
            <div className="stop-city">{bus.departureLocation}</div>
          </div>

          {/* Route Track with Bus */}
          <div className="route-track">
            <span className="track-icon" aria-hidden="true">🚍</span>
            <div className="track-line" />
            <span className="track-tag">Direct</span>
          </div>

          {/* Destination Stop */}
          <div className="route-stop destination">
            <div className="stop-time">{formatTime(bus.destinationTime)}</div>
            <div className="stop-city">{bus.destination}</div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="bus-info-row">
          <div className="bus-info-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>Express Coach</span>
          </div>
          {bus.description && (
            <div className="bus-info-pill" title={bus.description}>
              <span>ℹ️</span>
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bus.description}
              </span>
            </div>
          )}
        </div>

        {/* Admin Conductor Management */}
        {role === 'ADMIN' && (
          <div className="bus-conductor-section">
            <div className="conductor-label">Assigned Conductor</div>
            {bus.conductor ? (
              <div className="conductor-assigned">
                <span>👤 {bus.conductor.userName}</span>
                <button
                  type="button"
                  className="conductor-unassign-btn"
                  onClick={handleUnassign}
                  title="Remove conductor from this bus"
                  aria-label={`Remove ${bus.conductor.userName}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="conductor-assign-row">
                <select
                  className="conductor-select"
                  value={selectedConductorId}
                  onChange={e => setSelectedConductorId(e.target.value)}
                  aria-label="Select a conductor to assign"
                >
                  <option value="">Select Crew</option>
                  {availableConductors.map(c => (
                    <option key={c.conductorId} value={c.conductorId}>
                      {c.userName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="conductor-assign-btn"
                  onClick={handleAssign}
                  disabled={assigning || !selectedConductorId}
                >
                  {assigning ? '...' : 'Assign'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <footer className="bus-card-footer">
        {role === 'PASSENGER' && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => onBook(bus.busId)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2" />
              <path d="M13 17v2" />
              <path d="M13 11v2" />
            </svg>
            <span>Book Seats Now</span>
          </button>
        )}
        {role === 'ADMIN' && (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => onEdit(bus)}
            >
              ✏️ Edit
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{ flex: 1 }}
              onClick={() => onDelete(bus.busId)}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </footer>
    </article>
  );
};

export default BusCard;