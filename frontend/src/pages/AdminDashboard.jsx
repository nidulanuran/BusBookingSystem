import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import BusCard from '../components/BusCard';
import BusService from '../services/BusService';
import PassengerService from '../services/PassengerService';
import ConductorService from '../services/ConductorService';
import { showToast } from '../components/Toast';
import '../App.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('buses');

  const [buses, setBuses] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search queries
  const [passengerSearch, setPassengerSearch] = useState('');
  const [conductorSearch, setConductorSearch] = useState('');

  // Bus Form State
  const [showBusForm, setShowBusForm] = useState(false);
  const [isEditingBus, setIsEditingBus] = useState(false);
  const [currentBusId, setCurrentBusId] = useState(null);
  const [busFormData, setBusFormData] = useState({
    departureLocation: '',
    destination: '',
    departureTime: '',
    destinationTime: '',
    seatCount: 40,
    description: '',
  });

  // Conductor Form State
  const [showConductorForm, setShowConductorForm] = useState(false);
  const [conductorFormData, setConductorFormData] = useState({
    userName: '',
    password: '',
    phoneNo: '',
    address: '',
  });

  const loadBuses = useCallback(() => {
    BusService.getAllBuses()
      .then(res => setBuses(res.data))
      .catch(() => showToast('Failed to load buses.', 'error'));
  }, []);

  const loadPassengers = useCallback(() => {
    PassengerService.getAllPassengers()
      .then(res => setPassengers(res.data))
      .catch(() => showToast('Failed to load passengers.', 'error'));
  }, []);

  const loadConductors = useCallback(() => {
    ConductorService.getAllConductors()
      .then(res => setConductors(res.data))
      .catch(() => showToast('Failed to load conductors.', 'error'));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      BusService.getAllBuses().then(res => setBuses(res.data)),
      PassengerService.getAllPassengers().then(res => setPassengers(res.data)),
      ConductorService.getAllConductors().then(res => setConductors(res.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // --- Bus Handlers ---
  const handleBusInputChange = (e) => {
    setBusFormData({ ...busFormData, [e.target.name]: e.target.value });
  };

  const handleEditBus = (bus) => {
    setBusFormData({
      departureLocation: bus.departureLocation,
      destination: bus.destination,
      departureTime: bus.departureTime?.slice(0, 5) || '',
      destinationTime: bus.destinationTime?.slice(0, 5) || '',
      seatCount: bus.seatCount,
      description: bus.description || '',
    });
    setCurrentBusId(bus.busId);
    setIsEditingBus(true);
    setShowBusForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetBusForm = () => {
    setShowBusForm(false);
    setIsEditingBus(false);
    setCurrentBusId(null);
    setBusFormData({
      departureLocation: '',
      destination: '',
      departureTime: '',
      destinationTime: '',
      seatCount: 40,
      description: '',
    });
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    try {
      if (isEditingBus) {
        await BusService.updateBus(currentBusId, busFormData);
        showToast('Bus details updated successfully! ✅', 'success');
      } else {
        await BusService.createBus(busFormData);
        showToast('New bus added to fleet! 🎉', 'success');
      }
      resetBusForm();
      loadBuses();
    } catch {
      showToast('Operation failed. Check input details.', 'error');
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;
    try {
      await BusService.deleteBus(id);
      showToast('Bus removed from fleet.', 'success');
      loadBuses();
    } catch {
      showToast('Failed to delete bus.', 'error');
    }
  };

  // --- Conductor Handlers ---
  const handleCreateConductor = async (e) => {
    e.preventDefault();
    if (conductorFormData.phoneNo.length !== 10) {
      showToast('Phone number must be exactly 10 digits.', 'warning');
      return;
    }
    try {
      await ConductorService.createConductor(conductorFormData);
      showToast('Conductor hired successfully! 🎉', 'success');
      setShowConductorForm(false);
      setConductorFormData({ userName: '', password: '', phoneNo: '', address: '' });
      loadConductors();
    } catch {
      showToast('Failed to add conductor. Username might already exist.', 'error');
    }
  };

  const handleDeleteConductor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conductor?')) return;
    try {
      await ConductorService.deleteConductor(id);
      showToast('Conductor record removed.', 'success');
      loadConductors();
      loadBuses();
    } catch {
      showToast('Failed to delete conductor.', 'error');
    }
  };

  const handleConductorSearch = async (e) => {
    const val = e.target.value;
    setConductorSearch(val);
    if (!val.trim()) {
      loadConductors();
      return;
    }
    try {
      const res = await ConductorService.searchConductors(val);
      setConductors(res.data);
    } catch {
      showToast('Search failed.', 'error');
    }
  };

  // --- Passenger Handlers ---
  const handleDeletePassenger = async (id) => {
    if (!window.confirm('Are you sure you want to delete this passenger account?')) return;
    try {
      await PassengerService.deletePassenger(id);
      showToast('Passenger account deleted.', 'success');
      loadPassengers();
    } catch {
      showToast('Failed to delete passenger.', 'error');
    }
  };

  const handlePassengerSearch = async (e) => {
    const val = e.target.value;
    setPassengerSearch(val);
    if (!val.trim()) {
      loadPassengers();
      return;
    }
    try {
      const res = await PassengerService.searchPassengers(val);
      setPassengers(res.data);
    } catch {
      showToast('Search failed.', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar role="Admin" />

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Fleet Command</div>
          <button
            type="button"
            className={`admin-sidebar-item ${activeTab === 'buses' ? 'active' : ''}`}
            onClick={() => setActiveTab('buses')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="16" x="4" y="4" rx="2" />
              <path d="M4 10h16" />
              <path d="M10 4v16" />
            </svg>
            <span>Fleet & Routes</span>
          </button>
          <button
            type="button"
            className={`admin-sidebar-item ${activeTab === 'passengers' ? 'active' : ''}`}
            onClick={() => setActiveTab('passengers')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Passenger Accounts</span>
          </button>
          <button
            type="button"
            className={`admin-sidebar-item ${activeTab === 'conductors' ? 'active' : ''}`}
            onClick={() => setActiveTab('conductors')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <polyline points="17 11 19 13 23 9" />
            </svg>
            <span>Conductor Workforce</span>
          </button>
        </aside>

        {/* Main Workspace */}
        <main className="admin-main">
          {/* Top Metric Cards */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon stat-icon-buses">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div>
                <div className="stat-number">{buses.length}</div>
                <div className="stat-label">Active Buses in Fleet</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-passengers">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="stat-number">{passengers.length}</div>
                <div className="stat-label">Registered Travelers</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-conductors">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="stat-number">{conductors.length}</div>
                <div className="stat-label">Verified Bus Crew</div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="loading-overlay">
              <span className="spinner" /> Synchronizing fleet data...
            </div>
          )}

          {/* TAB 1: FLEET & BUSES */}
          {activeTab === 'buses' && (
            <div>
              <div className="section-header">
                <h2 className="section-title">
                  <span>Fleet & Schedule Dispatch</span>
                </h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (showBusForm && isEditingBus) resetBusForm();
                    else setShowBusForm(v => !v);
                  }}
                >
                  {showBusForm ? '✕ Close Form' : '+ Add New Bus'}
                </button>
              </div>

              {/* Form Panel */}
              {showBusForm && (
                <div className="admin-form-panel">
                  <h3 className="admin-form-title">
                    {isEditingBus ? '✏️ Modify Bus Details' : '➕ Register New Bus Route'}
                  </h3>
                  <form onSubmit={handleSaveBus}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Departure City (Origin)</label>
                        <input
                          name="departureLocation"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Colombo"
                          value={busFormData.departureLocation}
                          onChange={handleBusInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Destination City</label>
                        <input
                          name="destination"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Kandy"
                          value={busFormData.destination}
                          onChange={handleBusInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Departure Time</label>
                        <input
                          name="departureTime"
                          type="time"
                          className="form-input"
                          value={busFormData.departureTime}
                          onChange={handleBusInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Arrival Time</label>
                        <input
                          name="destinationTime"
                          type="time"
                          className="form-input"
                          value={busFormData.destinationTime}
                          onChange={handleBusInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Total Seating Capacity</label>
                        <input
                          name="seatCount"
                          type="number"
                          min="10"
                          max="70"
                          className="form-input"
                          value={busFormData.seatCount}
                          onChange={handleBusInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Service Description</label>
                        <input
                          name="description"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Express Air-Conditioned Superline"
                          value={busFormData.description}
                          onChange={handleBusInputChange}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                      <button type="submit" className="btn btn-primary">
                        {isEditingBus ? 'Save Changes' : 'Register Bus'}
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={resetBusForm}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Buses Grid */}
              <div className="card-grid">
                {buses.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <span className="empty-state-icon">🚌</span>
                    <div className="empty-state-title">No buses in fleet yet</div>
                    <p className="empty-state-text">Click "+ Add New Bus" to add your first coach.</p>
                  </div>
                ) : (
                  buses.map(bus => (
                    <BusCard
                      key={bus.busId}
                      bus={bus}
                      role="ADMIN"
                      onDelete={handleDeleteBus}
                      onEdit={handleEditBus}
                      refreshData={loadBuses}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PASSENGERS */}
          {activeTab === 'passengers' && (
            <div>
              <div className="section-header">
                <h2 className="section-title">
                  <span>Passenger Directory</span>
                </h2>
                <input
                  type="text"
                  className="form-input"
                  style={{ maxWidth: '300px' }}
                  placeholder="🔍 Search passenger name..."
                  value={passengerSearch}
                  onChange={handlePassengerSearch}
                />
              </div>

              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Passenger</th>
                      <th>Phone Number</th>
                      <th>Address</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passengers.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                          No passengers registered.
                        </td>
                      </tr>
                    ) : (
                      passengers.map(p => (
                        <tr key={p.passengerId}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div className="table-avatar">
                                {p.userName?.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text-title)' }}>{p.userName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID #{p.passengerId}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{p.phoneNo}</td>
                          <td>{p.address}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeletePassenger(p.passengerId)}
                            >
                              🗑️ Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONDUCTORS */}
          {activeTab === 'conductors' && (
            <div>
              <div className="section-header">
                <h2 className="section-title">
                  <span>Conductor Crew</span>
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ maxWidth: '240px' }}
                    placeholder="🔍 Search conductor..."
                    value={conductorSearch}
                    onChange={handleConductorSearch}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowConductorForm(v => !v)}
                  >
                    {showConductorForm ? '✕ Close Form' : '+ Hire Crew'}
                  </button>
                </div>
              </div>

              {showConductorForm && (
                <div className="admin-form-panel">
                  <h3 className="admin-form-title">👷 Hire New Conductor</h3>
                  <form onSubmit={handleCreateConductor}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Conductor Username</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. kamal_gunaratne"
                          value={conductorFormData.userName}
                          onChange={e => setConductorFormData({ ...conductorFormData, userName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Initial Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Password for account"
                          value={conductorFormData.password}
                          onChange={e => setConductorFormData({ ...conductorFormData, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number (10 digits)</label>
                        <input
                          type="tel"
                          maxLength={10}
                          className="form-input"
                          placeholder="0771234567"
                          value={conductorFormData.phoneNo}
                          onChange={e => setConductorFormData({ ...conductorFormData, phoneNo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Residential Address</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Current residential city"
                          value={conductorFormData.address}
                          onChange={e => setConductorFormData({ ...conductorFormData, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                      <button type="submit" className="btn btn-primary">
                        Confirm & Hire
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => setShowConductorForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Crew Member</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Assigned Route</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conductors.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                          No conductors hired yet.
                        </td>
                      </tr>
                    ) : (
                      conductors.map(c => {
                        const assignedBus = buses.find(b => b.conductor?.conductorId === c.conductorId);
                        return (
                          <tr key={c.conductorId}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="table-avatar" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                                  {c.userName?.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--color-text-title)' }}>{c.userName}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID #{c.conductorId}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 600 }}>{c.phoneNO || c.phoneNo}</td>
                            <td>{c.address}</td>
                            <td>
                              {assignedBus ? (
                                <span className="badge badge-success">
                                  🚌 {assignedBus.departureLocation} ➜ {assignedBus.destination}
                                </span>
                              ) : (
                                <span className="badge badge-muted">Unassigned</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteConductor(c.conductorId)}
                              >
                                🗑️ Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;