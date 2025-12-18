import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BusFilter from '../components/BusFilter';
import BusCard from '../components/BusCard';
import BusService from '../services/BusService';
import BookingService from '../services/BookingService';

const PassengerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [activeTab, setActiveTab] = useState("dashboard");
    const [myBookings, setMyBookings] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [seatCount, setSeatCount] = useState(1);

    // NEW: Travel Date State
    const [travelDate, setTravelDate] = useState('');

    useEffect(() => {
        if(activeTab === 'dashboard') loadBuses();
        else if(activeTab === 'myBookings') loadBookings();
    }, [activeTab]);

    const loadBuses = () => BusService.getAllBuses().then(res => setBuses(res.data));
    const loadBookings = () => BookingService.getMyBookings(currentUser.passengerId).then(res => setMyBookings(res.data));
    const handleFilter = (filteredBuses) => setBuses(filteredBuses);

    const handleBookClick = (busId) => {
        const bus = buses.find(b => b.busId === busId);
        setSelectedBus(bus);
        setSeatCount(1);
        setTravelDate(''); // Reset date
        setShowModal(true);
    };

    const submitBooking = () => {
        if (!travelDate) {
            alert("Please select a travel date.");
            return;
        }

        const bookingData = {
            noOfSeatsWants: seatCount,
            location: "Online",
            travelDate: travelDate // Send the specific date
        };

        BookingService.createBooking(bookingData, selectedBus.busId, currentUser.passengerId)
            .then(() => {
                alert("Booking Successful!");
                setShowModal(false);
                if (activeTab === 'myBookings') loadBookings();
            })
            .catch(err => {
                // Display the error message from backend (e.g. "Passenger already has an active booking")
                alert(err.response?.data || "Booking Failed.");
            });
    };

    // Helper to check expiry for UI display
    const isExpired = (booking) => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toLocaleTimeString('en-GB'); // HH:MM:SS

        // Simple logic: if booking date < today, it's expired
        if (booking.travelDate < today) return true;

        // If booking date is today, check time
        if (booking.travelDate === today && booking.bus.destinationTime < now) return true;

        return false;
    };

    return (
        <div>
            <Navbar role="Passenger" />
            <div className="container">
                <div style={styles.tabs}>
                    <button style={activeTab === "dashboard" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                    <button style={activeTab === "myBookings" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("myBookings")}>My Bookings</button>
                </div>

                {activeTab === "dashboard" && (
                    <div>
                        <h1>Find Your Journey</h1>
                        <BusFilter onFilterResults={handleFilter} />
                        <div className="card-grid">
                            {buses.map(bus => (
                                <BusCard key={bus.busId} bus={bus} role="PASSENGER" onBook={handleBookClick} />
                            ))}
                        </div>

                        {showModal && selectedBus && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3>Confirm Your Booking</h3>
                                        <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group full-width">
                                            <label>Route</label>
                                            <input type="text" value={`${selectedBus.departureLocation} ➝ ${selectedBus.destination}`} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Departure Time (Daily)</label>
                                            <input type="text" value={selectedBus.departureTime} readOnly />
                                        </div>
                                        {/* NEW DATE PICKER */}
                                        <div className="form-group">
                                            <label>Select Travel Date *</label>
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]} // Disable past dates
                                                value={travelDate}
                                                onChange={(e) => setTravelDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Seats Required</label>
                                            <input type="number" min="1" max="6" value={seatCount} onChange={(e) => setSeatCount(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button className="btn-confirm" onClick={submitBooking}>Confirm Booking</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "myBookings" && (
                    <div>
                        <h1>My Bookings</h1>
                        <div className="card-grid">
                            {myBookings.map(booking => (
                                <div key={booking.bookingId} className="booking-card" style={isExpired(booking) ? {opacity: 0.6, border: '1px solid gray'} : {}}>
                                    <h3>Booking #{booking.bookingId} {isExpired(booking) && <span style={{color:'red', fontSize:'0.8rem'}}>(EXPIRED)</span>}</h3>
                                    <p><strong>Date:</strong> {booking.travelDate}</p>
                                    <p><strong>Route:</strong> {booking.bus.departureLocation} - {booking.bus.destination}</p>
                                    <p><strong>Time:</strong> {booking.bus.departureTime} - {booking.bus.destinationTime}</p>
                                    <p><strong>Seats:</strong> {booking.noOfSeatsWants}</p>
                                    {!isExpired(booking) && (
                                        <button className="btn-cancel-booking" onClick={() => {
                                            BookingService.cancelBooking(booking.bookingId).then(() => {
                                                alert("Booking Cancelled");
                                                loadBookings();
                                            });
                                        }}>Cancel Booking</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
    tab: { padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: '#666' },
    activeTab: { padding: '10px 20px', border: 'none', background: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' },
};

export default PassengerDashboard;