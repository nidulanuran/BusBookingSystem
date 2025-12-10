import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ConductorService from '../services/ConductorService';

const ConductorDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user")); // Assumes user has conductorId

    useEffect(() => {
        // Fetch bookings for this conductor's bus
        ConductorService.getAssignedBusBookings(currentUser.id)
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    }, []);

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
                    {bookings.length === 0 ? <tr><td colSpan="4" style={{padding:'20px'}}>No bookings yet.</td></tr> : null}
                    {bookings.map(b => (
                        <tr key={b.bookingId} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>{b.passenger.userName}</td>
                            <td>{b.passenger.phoneNo}</td>
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