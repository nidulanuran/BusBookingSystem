import React, { useState } from 'react';
import BusService from '../services/BusService';
import './BusFilter.css'; // Import the CSS we just wrote

const BusFilter = ({ onFilterResults }) => {

    // State for the 4 filter fields
    const [depLocation, setDepLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [depTime, setDepTime] = useState('');
    const [destTime, setDestTime] = useState('');

    // Hardcoded list of locations (You could also fetch this from DB)
    const locations = ["Colombo", "Kandy", "Galle", "Matara", "Jaffna", "Trincomalee", "Kurunegala", "Anuradhapura"];

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            // Call the Service we wrote earlier
            const response = await BusService.filterBuses(depLocation, destination, depTime, destTime);

            // Send the results BACK to the Parent Dashboard (Admin or Passenger)
            onFilterResults(response.data);
        } catch (error) {
            console.error("Error filtering buses:", error);
            alert("Something went wrong while searching.");
        }
    };

    return (
        <form className="filter-container" onSubmit={handleSearch}>

            {/* 1. Departure Location Dropdown */}
            <div className="input-group">
                <label>From</label>
                <select
                    className="form-select"
                    value={depLocation}
                    onChange={(e) => setDepLocation(e.target.value)}
                    required
                >
                    <option value="">Select Location</option>
                    {locations.map((loc, index) => (
                        <option key={index} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* 2. Destination Dropdown */}
            <div className="input-group">
                <label>To</label>
                <select
                    className="form-select"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                >
                    <option value="">Select Destination</option>
                    {locations.map((loc, index) => (
                        <option key={index} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* 3. Departure Time Picker (Calendar Dropdown) */}
            <div className="input-group">
                <label>Departure Date & Time</label>
                <input
                    type="datetime-local"
                    className="form-input"
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    required
                />
            </div>

            {/* 4. Destination Time Picker (Calendar Dropdown) */}
            <div className="input-group">
                <label>Arrival Date & Time</label>
                <input
                    type="datetime-local"
                    className="form-input"
                    value={destTime}
                    onChange={(e) => setDestTime(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="search-btn">Find Buses</button>
        </form>
    );
};

export default BusFilter;