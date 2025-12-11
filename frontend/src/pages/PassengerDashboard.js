import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BusFilter from '../components/BusFilter';
import BusCard from '../components/BusCard';
import BusService from '../services/BusService';
import BookingService from '../services/BookingService';

const PassengerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user")); // Get logged in user

    // --- NEW: Modal State ---
    const [showModal, setShowModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [seatCount, setSeatCount] = useState(1); // Default to 1 seat

    useEffect(() => {
        loadBuses();
    }, []);

    const loadBuses = () => {
        BusService.getAllBuses().then(res => setBuses(res.data));
    };

    const handleFilter = (filteredBuses) => {
        setBuses(filteredBuses);
    };

    // --- 1. OPEN THE FORM ---
    // This runs when "Book Now" is clicked on the card
    const handleBookClick = (busId) => {
        // Find the full bus object so we can show the name in the popup
        const bus = buses.find(b => b.busId === busId);
        setSelectedBus(bus);
        setSeatCount(1); // Reset seats to 1
        setShowModal(true); // Show the popup
    };

    // --- 2. SUBMIT THE FORM ---
    // This runs when "Confirm" is clicked inside the popup
    const submitBooking = () => {
        if (seatCount <= 0) {
            alert("Please enter a valid number of seats.");
            return;
        }

        const bookingData = {
            noOfSeatsWants: seatCount,
            location: "Online",     // You can add an input for this too if you want
            bookingDate: new Date(),
            bookingTime: new Date()
        };

        // Send IDs (Bus ID + Passenger ID) to Backend
        BookingService.createBooking(bookingData, selectedBus.busId, currentUser.id)
            .then(() => {
                alert("Booking Successful!");
                setShowModal(false); // Close popup
            })
            .catch(err => {
                console.error(err);
                alert("Booking Failed.");
            });
    };

    return (
        <div>
            <Navbar role="Passenger" />
            <div className="container">
                <h1>Find Your Journey</h1>
                <BusFilter onFilterResults={handleFilter} />

                <div className="card-grid">
                    {buses.map(bus => (
                        <BusCard
                            key={bus.busId}
                            bus={bus}
                            role="PASSENGER"
                            onBook={handleBookClick} // Calls the function to open modal
                        />
                    ))}
                </div>

                {/* --- 3. THE PROFESSIONAL MODAL UI --- */}
                {showModal && selectedBus && (
                    <div className="modal-overlay">
                        <div className="modal-content">

                            {/* Header */}
                            <div className="modal-header">
                                <h3>Confirm Your Booking</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>

                            {/* Body */}
                            <div className="modal-body">

                                {/* Row 1: Passenger & Route (Read Only) */}
                                <div className="form-group">
                                    <label>Passenger Name</label>
                                    <input type="text" value={currentUser.userName} readOnly />
                                </div>

                                <div className="form-group">
                                    <label>Bus Route</label>
                                    <input type="text" value={`${selectedBus.departureLocation} - ${selectedBus.destination}`} readOnly />
                                </div>

                                {/* Row 2: Full Width Description/Info */}
                                <div className="form-group full-width">
                                    <label>Bus Description</label>
                                    <input type="text" value={selectedBus.description || "Standard Service"} readOnly />
                                </div>

                                {/* Row 3: Seat Selection & Price (Price is just visual for now) */}
                                <div className="form-group">
                                    <label>Seats Required *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedBus.seatCount}
                                        value={seatCount}
                                        onChange={(e) => setSeatCount(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select>
                                        <option>Cash on Board</option>
                                        <option>Credit Card (Coming Soon)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn-confirm" onClick={submitBooking}>
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PassengerDashboard;