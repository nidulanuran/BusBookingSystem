import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BusFilter from '../components/BusFilter';
import BusCard from '../components/BusCard';
import BusService from '../services/BusService';
import BookingService from '../services/BookingService';

const PassengerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user")); // Get logged in user

    useEffect(() => {
        loadBuses();
    }, []);

    const loadBuses = () => {
        BusService.getAllBuses().then(res => setBuses(res.data));
    };

    const handleFilter = (filteredBuses) => {
        setBuses(filteredBuses);
    };

    const handleBook = (busId) => {
        const bookingData = {
            noOfSeatsWants: 1, // Defaulting to 1 for simplicity
            location: "Online",
            bookingDate: new Date(),
            bookingTime: new Date()
        };

        // Call Booking Service
        BookingService.createBooking(bookingData, busId, currentUser.id)
            .then(() => {
                alert("Booking Successful!");
            })
            .catch(() => alert("Booking Failed."));
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
                            onBook={handleBook}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;