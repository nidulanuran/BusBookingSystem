import React, { useState } from 'react';
import BusService from '../services/BusService';


const BusFilter = ({ onFilterResults }) => {

    // Only Location and Destination are needed for filtering routes
    const [depLocation, setDepLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [isHovered, setIsHovered] = useState(false);

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
        <form style={styles.filterContainer} onSubmit={handleSearch}>

            {/* 1. Departure Location Dropdown */}
            <div style={styles.inputGroup}>
                <label style={styles.inputGroupLabel}>From</label>
                <select
                    style={styles.formSelect}
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
            <div style={styles.inputGroup}>
                <label style={styles.inputGroupLabel}>To</label>
                <select
                    style={styles.formSelect}
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

            <button type="submit" style={{
                background:isHovered? '#0056b3' : '#fff'
            }}
            onMouseEnter={()=> setIsHovered(true)}
            onMouseLeave={()=> setIsHovered(false)}
            >Find Routes</button>
        </form>
    );
};

const styles = {
    
    filterContainer:{
    background:'#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    alignItems: 'flex-end',
    marginBottom: '30px',
    border: '1px solid #e0e0e0',
},

inputGroup:{
    flex: 1,
    minmaxwidth: '200px',
    display: 'flex',
    flexDirection: 'column',
},

inputGroupLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#555',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',

},

formSelect: {
    padding: '10px 12px',
    border: '2px solid #eee',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9f9f9',
    outline: 'none',
},



searchBtn: {
    padding: '12px 25px',
    backgroundColor: '#007bff', 
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    height: '46px',
},


}
export default BusFilter;