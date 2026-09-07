import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import BusFilter from '../components/BusFilter';
import BusCard from '../components/BusCard';
import BookingCard from '../components/BookingCard';
import BusService from '../services/BusService';
import BookingService from '../services/BookingService';
import { showToast } from '../components/Toast';
import '../App.css';

const PassengerDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Booking Wizard Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [wizardStep, setWizardStep] = useState(1); // 1: Date, 2: Seats, 3: Confirm
  const [travelDate, setTravelDate] = useState('');
  const [seatCount, setSeatCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const loadBuses = useCallback(() => {
    setLoading(true);
    BusService.getAllBuses()
      .then(res => {
        setBuses(res.data);
      })
      .catch(() => {
        showToast('Failed to load bus schedules.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const loadBookings = useCallback(() => {
    if (!currentUser.passengerId) return;
    setLoading(true);
    BookingService.getMyBookings(currentUser.passengerId)
      .then(res => {
        setMyBookings(res.data);
      })
      .catch(() => {
        showToast('Failed to load your reservations.', 'error');
      })
      .finally(() => setLoading(false));
  }, [currentUser.passengerId]);

  useEffect(() => {
    if (activeTab === 'dashboard') loadBuses();
    else if (activeTab === 'myBookings') loadBookings();
  }, [activeTab, loadBuses, loadBookings]);

  const handleBookClick = (busId) => {
    const bus = (filteredBuses || buses).find(b => b.busId === busId);
    if (!bus) return;
    setSelectedBus(bus);
    setWizardStep(1);
    setTravelDate(new Date().toISOString().split('T')[0]);
    setSeatCount(1);
    setShowModal(true);
  };

  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setTravelDate(d.toISOString().split('T')[0]);
  };

  const handleSeatsChanged = (count) => {
    setSeatCount(count > 0 ? count : 1);
  };

  const submitBooking = async () => {
    if (!travelDate) {
      showToast('Please select a travel date first!', 'warning');
      return;
    }

    setSubmitting(true);
    const bookingData = {
      noOfSeatsWants: seatCount,
      location: 'Online',
      travelDate: travelDate,
    };

    try {
      await BookingService.createBooking(bookingData, selectedBus.busId, currentUser.passengerId);
      showToast('🎉 Reservation Confirmed! Have a wonderful trip!', 'success');
      setShowModal(false);
      setActiveTab('myBookings');
      loadBookings();
    } catch (err) {
      const msg = err.response?.data;
      showToast(
        typeof msg === 'string' && msg.length < 150
          ? msg
          : 'Could not complete reservation. You may already have an active journey running.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this bus reservation?')) return;
    try {
      await BookingService.cancelBooking(bookingId);
      showToast('Reservation cancelled successfully.', 'success');
      loadBookings();
    } catch {
      showToast('Failed to cancel reservation.', 'error');
    }
  };

  const isExpired = (booking) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-GB');
    if (booking.travelDate < today) return true;
    if (booking.travelDate === today && booking.bus?.destinationTime < now) return true;
    return false;
  };

  const displayBuses = filteredBuses !== null ? filteredBuses : buses;
  const activeBookingsCount = myBookings.filter(b => !isExpired(b)).length;
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar role="Passenger" />

      <main className="page-content" style={{ flex: 1 }}>
        {/* Welcome Header */}
        <div className="page-hero">
          <h1 className="page-hero-title">
            Hello, {currentUser.userName || 'Explorer'}! 👋
          </h1>
          <p className="page-hero-subtitle">
            Search intercity bus routes and book your seat in three simple steps.
          </p>
        </div>

        {/* Segmented Tab Navigation */}
        <div className="tab-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search & Book Buses</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'myBookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('myBookings')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            <span>My Reservations</span>
            {activeBookingsCount > 0 && (
              <span className="badge badge-success" style={{ marginLeft: '4px' }}>
                {activeBookingsCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: DASHBOARD & BUS SEARCH */}
        {activeTab === 'dashboard' && (
          <div>
            <BusFilter
              onFilterResults={results => setFilteredBuses(results)}
              onReset={() => setFilteredBuses(null)}
            />

            {loading ? (
              <div className="loading-overlay">
                <span className="spinner" /> Searching scheduled departures...
              </div>
            ) : displayBuses.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🚌</span>
                <div className="empty-state-title">No bus routes found</div>
                <p className="empty-state-text">
                  We currently do not have a bus matching these stations. Try picking different cities or clear your filter.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-title)', letterSpacing: '-0.02em' }}>
                    Scheduled Departures ({displayBuses.length})
                  </h2>
                  {filteredBuses !== null && (
                    <span className="badge badge-primary">Filtered Route</span>
                  )}
                </div>

                <div className="card-grid">
                  {displayBuses.map(bus => (
                    <BusCard
                      key={bus.busId}
                      bus={bus}
                      role="PASSENGER"
                      onBook={handleBookClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'myBookings' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
                </svg>
                <span>My Travel Itinerary</span>
              </h2>
            </div>

            {loading ? (
              <div className="loading-overlay">
                <span className="spinner" /> Loading your travel history...
              </div>
            ) : myBookings.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🎟️</span>
                <div className="empty-state-title">No tickets booked yet</div>
                <p className="empty-state-text">
                  You haven't reserved any bus seats. Explore routes and plan your next journey!
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setActiveTab('dashboard')}
                >
                  🚀 Find A Bus
                </button>
              </div>
            ) : (
              <div className="card-grid">
                {myBookings.map(booking => {
                  const expired = isExpired(booking);
                  return (
                    <article
                      key={booking.bookingId}
                      className={`bus-card ${expired ? 'expired' : ''}`}
                      style={expired ? { opacity: 0.72 } : {}}
                    >
                      <header className="bus-card-header" style={expired ? { background: '#475569' } : {}}>
                        <div>
                          <span className="bus-card-badge">
                            Ticket #{booking.bookingId}
                          </span>
                        </div>
                        <span className={`badge ${expired ? 'badge-muted' : 'badge-success'}`}>
                          {expired ? '🕒 Expired' : '🟢 Confirmed'}
                        </span>
                      </header>

                      <div className="bus-card-body">
                        {/* Route display */}
                        <div className="bus-route-visual">
                          <div className="route-stop">
                            <div className="stop-time">{booking.bus?.departureTime || '--:--'}</div>
                            <div className="stop-city">{booking.bus?.departureLocation}</div>
                          </div>
                          <div className="route-track">
                            <span className="track-icon">🚍</span>
                            <div className="track-line" />
                            <span className="track-tag">{booking.travelDate}</span>
                          </div>
                          <div className="route-stop destination">
                            <div className="stop-time">{booking.bus?.destinationTime || '--:--'}</div>
                            <div className="stop-city">{booking.bus?.destination}</div>
                          </div>
                        </div>

                        <div className="bus-info-row">
                          <div className="bus-info-pill">
                            <span>💺</span>
                            <span>{booking.noOfSeatsWants} Seat{booking.noOfSeatsWants > 1 ? 's' : ''}</span>
                          </div>
                          <div className="bus-info-pill">
                            <span>📍</span>
                            <span>{booking.location || 'Online'}</span>
                          </div>
                        </div>
                      </div>

                      {!expired && (
                        <footer className="bus-card-footer">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ width: '100%' }}
                            onClick={() => handleCancelBooking(booking.bookingId)}
                          >
                            ✕ Cancel Ticket
                          </button>
                        </footer>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BOOKING MODAL WIZARD */}
        {showModal && selectedBus && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Reserve Seats</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {selectedBus.departureLocation} ➜ {selectedBus.destination}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              {/* Wizard Steps */}
              <div style={{ padding: '1.25rem 1.75rem 0' }}>
                <div className="wizard-steps">
                  <div className={`wizard-step ${wizardStep === 1 ? 'active' : wizardStep > 1 ? 'done' : ''}`}>
                    <div className="wizard-step-circle">1</div>
                    <div className="wizard-step-label">Travel Date</div>
                  </div>
                  <div className={`wizard-step ${wizardStep === 2 ? 'active' : wizardStep > 2 ? 'done' : ''}`}>
                    <div className="wizard-step-circle">2</div>
                    <div className="wizard-step-label">Choose Seats</div>
                  </div>
                  <div className={`wizard-step ${wizardStep === 3 ? 'active' : ''}`}>
                    <div className="wizard-step-circle">3</div>
                    <div className="wizard-step-label">Review</div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* STEP 1: DATE */}
                {wizardStep === 1 && (
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center', color: 'var(--color-text-title)' }}>
                      Select Your Travel Date
                    </h4>

                    {/* Quick date buttons */}
                    <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => setQuickDate(0)}
                      >
                        ⚡ Today
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => setQuickDate(1)}
                      >
                        🌅 Tomorrow
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => setQuickDate(2)}
                      >
                        📅 In 2 Days
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="travel-date-picker">
                        Or Pick Specific Date
                      </label>
                      <input
                        id="travel-date-picker"
                        type="date"
                        className="form-input"
                        min={todayStr}
                        value={travelDate}
                        onChange={e => setTravelDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: SEATS */}
                {wizardStep === 2 && (
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', textAlign: 'center', color: 'var(--color-text-title)' }}>
                      Select Your Seats
                    </h4>
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Tap seat boxes inside the cabin to select (max 6 seats).
                    </p>

                    <BookingCard
                      onSeatsChange={handleSeatsChanged}
                      maxSeats={6}
                      totalSeats={selectedBus.seatCount || 40}
                    />
                  </div>
                )}

                {/* STEP 3: SUMMARY */}
                {wizardStep === 3 && (
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center', color: 'var(--color-text-title)' }}>
                      Trip Summary & Confirmation
                    </h4>

                    <div className="booking-summary-box">
                      <div className="booking-summary-title">
                        <span>🚌</span> Itinerary Overview
                      </div>
                      <div className="booking-summary-row">
                        <span className="booking-summary-key">Route</span>
                        <span className="booking-summary-value">{selectedBus.departureLocation} ➜ {selectedBus.destination}</span>
                      </div>
                      <div className="booking-summary-row">
                        <span className="booking-summary-key">Travel Date</span>
                        <span className="booking-summary-value">{travelDate}</span>
                      </div>
                      <div className="booking-summary-row">
                        <span className="booking-summary-key">Scheduled Departure</span>
                        <span className="booking-summary-value">{selectedBus.departureTime}</span>
                      </div>
                      <div className="booking-summary-row">
                        <span className="booking-summary-key">Scheduled Arrival</span>
                        <span className="booking-summary-value">{selectedBus.destinationTime}</span>
                      </div>
                      <div className="booking-summary-row">
                        <span className="booking-summary-key">Reserved Seats</span>
                        <span className="booking-summary-value" style={{ color: 'var(--color-primary)', fontWeight: 800 }}>
                          {seatCount} Seat{seatCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="booking-summary-row">
                        <span className="booking-summary-key">Passenger</span>
                        <span className="booking-summary-value">{currentUser.userName || 'Passenger'}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                      Ticket confirmation is instant. You can cancel your booking anytime before the bus departs.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                {wizardStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setWizardStep(s => s - 1)}
                  >
                    ⬅️ Back
                  </button>
                )}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (wizardStep === 1 && !travelDate) {
                        showToast('Please select a travel date.', 'warning');
                        return;
                      }
                      setWizardStep(s => s + 1);
                    }}
                  >
                    Continue ➡️
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={submitBooking}
                    disabled={submitting}
                  >
                    {submitting ? <span className="spinner" /> : '🎉 Confirm Ticket'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PassengerDashboard;