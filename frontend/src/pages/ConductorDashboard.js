import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ConductorService from '../services/ConductorService';

const ConductorDashboard = () => {
    const [bookings, setBookings] = useState([]);

    // 1. Get the logged-in user
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // FIX: Check if currentUser exists and use .conductorId instead of .id
        if (currentUser && currentUser.conductorId) {
            ConductorService.getAssignedBusBookings(currentUser.conductorId)
                .then(res => setBookings(res.data))
                .catch(err => console.error("Error fetching bookings:", err));
        } else {
            console.error("No conductor ID found. User might not be logged in properly.");
        }
    }, [currentUser.conductorId]); // dfgerhehr

    return (
        <div>
            <Navbar role="Conductor" />
            <div className="container">
                <h2>My Bus Bookings</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px' }}>
                    <thead>
                    <tr style={{ background: '#007bff', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Passenger Name</th>
                        <th>Phone</th>
                        <th>Seats</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.length === 0 ? <tr><td colSpan="4" style={{padding:'20px'}}>No bookings yet or no bus assigned.</td></tr> : null}
                    {bookings.map(b => (
                        <tr key={b.bookingId} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>{b.passenger ? b.passenger.userName : "Unknown"}</td>
                            <td>{b.passenger ? b.passenger.phoneNo : "N/A"}</td>
                            <td>{b.noOfSeatsWants}</td>
                            <td>{b.location}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConductorDashboard;