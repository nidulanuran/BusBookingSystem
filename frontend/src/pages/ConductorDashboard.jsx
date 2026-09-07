import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ConductorService from '../services/ConductorService';
import { showToast } from '../components/Toast';
import '../App.css';

const ConductorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [assignedBus, setAssignedBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedInIds, setCheckedInIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const loadAssignedBusBookings = useCallback(() => {
    if (!currentUser.conductorId) {
      showToast('Conductor credentials not found. Please sign in again.', 'error');
      return;
    }
    setLoading(true);
    ConductorService.getAssignedBusBookings(currentUser.conductorId)
      .then(res => {
        setBookings(res.data);
        if (res.data.length > 0 && res.data[0].bus) {
          setAssignedBus(res.data[0].bus);
        }
      })
      .catch(() => {
        showToast('Failed to load bus passenger list.', 'error');
      })
      .finally(() => setLoading(false));
  }, [currentUser.conductorId]);

  useEffect(() => {
    loadAssignedBusBookings();
  }, [loadAssignedBusBookings]);

  const toggleCheckIn = (bookingId) => {
    setCheckedInIds(prev => {
      const next = new Set(prev);
      if (next.has(bookingId)) {
        next.delete(bookingId);
        showToast(`Passenger #${bookingId} check-in undone.`, 'warning');
      } else {
        next.add(bookingId);
        showToast(`Passenger #${bookingId} checked in! 🎫`, 'success');
      }
      return next;
    });
  };

  const totalBookedSeats = bookings.reduce((sum, b) => sum + (b.noOfSeatsWants || 0), 0);
  const busTotalSeats = assignedBus?.seatCount || 40;
  const remainingSeats = Math.max(0, busTotalSeats - totalBookedSeats);
  const checkedInCount = checkedInIds.size;

  const filteredBookings = bookings.filter(b => {
    const name = b.passenger?.userName?.toLowerCase() || '';
    const phone = b.passenger?.phoneNo || b.passenger?.phoneNO || '';
    const q = searchTerm.toLowerCase();
    return name.includes(q) || phone.includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar role="Conductor" />

      <main className="page-content" style={{ flex: 1 }}>
        {/* Transit Command Hero */}
        <div className="conductor-hero">
          <div className="conductor-hero-icon" aria-hidden="true">
            🚍
          </div>
          <div style={{ flex: 1 }}>
            <div className="conductor-hero-title">Dispatch & Onboard Console</div>
            <h1 className="conductor-hero-route">
              {assignedBus
                ? `${assignedBus.departureLocation} ➜ ${assignedBus.destination}`
                : 'No Bus Assigned Yet'}
            </h1>

            {assignedBus ? (
              <div className="conductor-hero-meta">
                <div className="conductor-hero-meta-item">
                  <span>⏰</span> {assignedBus.departureTime} - {assignedBus.destinationTime}
                </div>
                <div className="conductor-hero-meta-item">
                  <span>💺</span> {totalBookedSeats} of {busTotalSeats} Seats Reserved
                </div>
                <div className="conductor-hero-meta-item">
                  <span>✅</span> {remainingSeats} Available Seats
                </div>
                <div className="conductor-hero-meta-item" style={{ background: 'rgba(16, 185, 129, 0.25)' }}>
                  <span>🎫</span> {checkedInCount} of {bookings.length} Passengers Boarded
                </div>
              </div>
            ) : (
              <p style={{ marginTop: '0.5rem', opacity: 0.85 }}>
                No active route assigned to your profile. Please contact the fleet administrator.
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {assignedBus && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon stat-icon-buses">👥</div>
              <div>
                <div className="stat-number">{bookings.length}</div>
                <div className="stat-label">Total Reservations</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-passengers">💺</div>
              <div>
                <div className="stat-number">{totalBookedSeats}</div>
                <div className="stat-label">Passenger Seats</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-conductors">✨</div>
              <div>
                <div className="stat-number">{remainingSeats}</div>
                <div className="stat-label">Available Capacity</div>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Manifest Header */}
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span>Passenger Manifest</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Verify identity and check in passengers as they board.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '280px' }}
              placeholder="🔍 Filter passenger or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadAssignedBusBookings}
              title="Refresh manifest"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <span className="spinner" /> Loading passenger manifest...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🎟️</span>
            <div className="empty-state-title">
              {bookings.length === 0 ? 'No bookings on this bus yet' : 'No matching travelers found'}
            </div>
            <p className="empty-state-text">
              {bookings.length === 0
                ? 'When travelers reserve seats on your bus route, their details will synchronize here in real time.'
                : 'Check your search query.'}
            </p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Contact Number</th>
                  <th>Travel Date</th>
                  <th>Seats Reserved</th>
                  <th>Booking Mode</th>
                  <th style={{ textAlign: 'right' }}>Boarding Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => {
                  const isCheckedIn = checkedInIds.has(b.bookingId);
                  return (
                    <tr key={b.bookingId} style={isCheckedIn ? { background: '#F0FDF4' } : {}}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            className="table-avatar"
                            style={isCheckedIn ? { background: 'var(--color-success)', color: '#fff' } : {}}
                          >
                            {isCheckedIn ? '✓' : b.passenger?.userName?.slice(0, 2).toUpperCase() || 'P'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-text-title)' }}>
                              {b.passenger?.userName || 'Passenger'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Ticket #{b.bookingId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.passenger?.phoneNo || b.passenger?.phoneNO || '—'}</td>
                      <td>{b.travelDate || 'Today'}</td>
                      <td>
                        <span className="badge badge-primary">
                          💺 {b.noOfSeatsWants} Seat{b.noOfSeatsWants > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-muted">{b.location || 'Online'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${isCheckedIn ? 'btn-success' : 'btn-ghost'}`}
                          onClick={() => toggleCheckIn(b.bookingId)}
                        >
                          {isCheckedIn ? '✓ Boarded' : 'Check In'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConductorDashboard;