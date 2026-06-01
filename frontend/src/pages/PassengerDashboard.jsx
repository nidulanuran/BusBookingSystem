import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BusFilter from '../components/BusFilter';
import BusCard from '../components/BusCard';
import BusService from '../services/BusService';
import BookingService from '../services/BookingService';
import '../App.css';




const PassengerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [activeTab, setActiveTab] = useState("dashboard");
    const [myBookings, setMyBookings] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [seatCount, setSeatCount] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);

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

    const handleSeatClick = (seatNo) => {
        setSelectedSeats((prev) => {
            const updatedSeats = prev.includes(seatNo)
                ? prev.filter((s) => s !== seatNo) // unselect
                : [...prev, seatNo];               // select         
                setSeatCount(updatedSeats.length); 
                return updatedSeats;
            
        });
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

    const handleCancel=()=>{
        setSelectedSeats([]);
        setShowModal(false);

    }

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

                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <div style={{background: 'rgba(111,138,137,0.77)',width:'40%',display:'flex',flexDirection: 'row',justifyContent: 'center',alignItems: 'center', }} >

                                        <div className="seating-demo" style= {{ padding: '10px',  height: '300px', width:'200px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center',alignItems: 'flex-end', margin: '0 auto', flexDirection: 'column'}}>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(1) ? "selected" : ""}
                                                                      ${selectedSeats.length >=6 && !selectedSeats.includes(1) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(1)}
                                                >1</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(2) ? "selected" : ""}
                                                                   ${selectedSeats.length >=6 && !selectedSeats.includes(2) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(2)}
                                                >2</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(3) ? "selected" : ""}
                                                                   ${selectedSeats.length >=6 && !selectedSeats.includes(3) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(3)}
                                                >3</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(4) ? "selected" : ""}
                                                                   ${selectedSeats.length >=6 && !selectedSeats.includes(4) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(4)}
                                                >4</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(5) ? "selected" : ""}
                                                                   ${selectedSeats.length >=6 && !selectedSeats.includes(5) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(5)}
                                                >5</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(6) ? "selected" : ""}
                                                                   ${selectedSeats.length >=6 && !selectedSeats.includes(6) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(6)}
                                                >6</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(7) ? "selected" : ""}
                                                                   ${selectedSeats.length >=6 && !selectedSeats.includes(7) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(7)}
                                                >7</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(8) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(8) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(8)}
                                                >8</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(9) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(9) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(9)}
                                                >9</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(10) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(10) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(10)}
                                                >10</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(11) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(11) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(11)}
                                                >11</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(12) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(12) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(12)}
                                                >12</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(13) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(13) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(13)}
                                                >13</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(14) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(14) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(14)}
                                                >14</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(15) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(15) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(15)}
                                                >15</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(16) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(16) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(16)}
                                                >16</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(17) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(17) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(17)}
                                                >17</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(18) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(18) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(18)}
                                                >18</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(19) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(19) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(19)}
                                                >19</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(20) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(20) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(20)}
                                                >20</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(21) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(21) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(21)}
                                                >21</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(22) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(22) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(22)}
                                                >22</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(23) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(23) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(23)}
                                                >23</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(24) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(24) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(24)}
                                                >24</button>
                                            </div>


                                        </div>

                                        <div className="seating-demo" style= {{  height: '300px', width:'50px', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end',alignItems: 'center', margin: '0 auto', flexDirection: 'column'}}>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end',}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(45) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(45) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(45)}
                                                >45</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(46) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(46) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(46)}
                                                >46</button>
                                            </div>

                                        </div>

                                        <div className="seating-demo" style= {{ padding: '10px', height: '300px', width:'200px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center',alignItems: 'flex-start', margin: '0 auto', flexDirection: 'column'}}>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(25) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(25) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(25)}
                                                >25</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(26) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(26) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(26)}
                                                >26</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(27) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(27) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(27)}
                                                >27</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(28) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(28) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(28)}
                                                >28</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(29) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(29) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(29)}
                                                >29</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(30) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(30) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(30)}
                                                >30</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(31) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(31) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(31)}
                                                >31</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(32) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(32) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(32)}
                                                >32</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(33) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(33) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(33)}
                                                >33</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(34) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(34) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(34)}
                                                >34</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(35) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(35) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(35)}
                                                >35</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(36) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(36) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(36)}
                                                >36</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(37) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(37) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(37)}
                                                >37</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(38) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(38) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(38)}
                                                >38</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(39) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(39) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(39)}
                                                >39</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(40) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(40) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(40)}
                                                >40</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(41) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(41) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(41)}
                                                >41</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(42) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(42) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(42)}
                                                >42</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(43) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(43) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(43)}
                                                >43</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(44) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(44) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(44)}
                                                >44</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(45) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(45) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(45)}
                                                >45</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(46) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(46) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(46)}
                                                >46</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button
                                                    className={`seats ${selectedSeats.includes(47) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(47) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(47)}
                                                >47</button>

                                                <button
                                                    className={`seats ${selectedSeats.includes(48) ? "selected" : ""}
                                                           ${selectedSeats.length >=6 && !selectedSeats.includes(48) ? "disabled" : ""}`}
                                                    onClick={() => handleSeatClick(48)}
                                                >48</button>
                                            </div>


                                        </div>

                                    </div>
                                    </div>


                                    <div className="modal-footer">
                                        <button  className="btn-cancel" onClick={() =>handleCancel() }>Cancel</button>
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