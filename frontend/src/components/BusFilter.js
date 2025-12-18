import React, { useState } from 'react';
import BusService from '../services/BusService';
import './BusFilter.css';

const BusFilter = ({ onFilterResults }) => {

    // Only Location and Destination are needed for filtering routes
    const [depLocation, setDepLocation] = useState('');
    const [destination, setDestination] = useState('');

    // Hardcoded list of locations
    const locations = ["Colombo", "Kandy", "Galle", "Matara", "Jaffna", "Trincomalee", "Kurunegala", "Anuradhapura"];

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            // Call the Service with only 2 arguments
            const response = await BusService.filterBuses(depLocation, destination);
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

            <button type="submit" className="search-btn">Find Routes</button>
        </form>
    );
};

export default BusFilter;