import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BusCard from '../components/BusCard';
import BusService from '../services/BusService';
import PassengerService from '../services/PassengerService';
import ConductorService from '../services/ConductorService';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('buses');

    const [buses, setBuses] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [conductors, setConductors] = useState([]);

    const [showBusForm, setShowBusForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBusId, setCurrentBusId] = useState(null);

    // Updated Form Data: time fields start as empty strings
    const [busFormData, setBusFormData] = useState({
        departureLocation: '',
        destination: '',
        departureTime: '',
        destinationTime: '',
        seatCount: 40,
        description: ''
    });

    const [showConductorForm, setShowConductorForm] = useState(false);
    const [conductorFormData, setConductorFormData] = useState({
        userName: '',
        password: '',
        phoneNo: '',
        address: ''
    });

    useEffect(() => {
        if (activeTab === 'buses') loadBuses();
        if (activeTab === 'passengers') loadPassengers();
        if (activeTab === 'conductors') loadConductors();
    }, [activeTab]);

    const loadBuses = () => BusService.getAllBuses().then(res => setBuses(res.data));
    const loadPassengers = () => PassengerService.getAllPassengers().then(res => setPassengers(res.data));
    const loadConductors = () => ConductorService.getAllConductors().then(res => setConductors(res.data));

    const handleBusInputChange = (e) => {
        setBusFormData({ ...busFormData, [e.target.name]: e.target.value });
    };

    const handleEditBus = (bus) => {
        setBusFormData({
            departureLocation: bus.departureLocation,
            destination: bus.destination,
            departureTime: bus.departureTime, // Expecting "HH:mm:ss"
            destinationTime: bus.destinationTime,
            seatCount: bus.seatCount,
            description: bus.description
        });
        setCurrentBusId(bus.busId);
        setIsEditing(true);
        setShowBusForm(true);
    };

    const handleCreateOrUpdateBus = (e) => {
        e.preventDefault();
        const apiCall = isEditing
            ? BusService.updateBus(currentBusId, busFormData)
            : BusService.createBus(busFormData);

        apiCall.then(() => {
            alert(isEditing ? "Bus Updated!" : "Bus Created!");
            resetBusForm();
            loadBuses();
        }).catch(err => {
            console.error(err);
            alert("Operation Failed. Check console for details.");
        });
    };

    const handleDeleteBus = (id) => {
        if (window.confirm("Are you sure you want to delete this bus?")) {
            BusService.deleteBus(id).then(loadBuses);
        }
    };

    const handleCreateConductor = (e) => {
        e.preventDefault();
        ConductorService.createConductor(conductorFormData).then(() => {
            alert("Conductor Hired Successfully!");
            setShowConductorForm(false);
            setConductorFormData({ userName: '', password: '', phoneNo: '', address: '' });
            loadConductors();
        }).catch(err => alert("Error adding conductor"));
    };

    const resetBusForm = () => {
        setShowBusForm(false);
        setIsEditing(false);
        setBusFormData({
            departureLocation: '', destination: '', departureTime: '',
            destinationTime: '', seatCount: 40, description: ''
        });
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <Navbar role="Admin" />
            <div className="container" style={{ padding: '20px' }}>

                <div style={styles.tabs}>
                    <button style={activeTab === 'buses' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('buses')}>Manage Buses</button>
                    <button style={activeTab === 'passengers' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('passengers')}>Manage Passengers</button>
                    <button style={activeTab === 'conductors' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('conductors')}>Manage Conductors</button>
                </div>

                {activeTab === 'buses' && (
                    <div>
                        <button onClick={() => setShowBusForm(!showBusForm)} style={styles.addButton}>
                            {showBusForm ? "Close Form" : "+ Add New Bus"}
                        </button>

                        {showBusForm && (
                            <form onSubmit={handleCreateOrUpdateBus} style={styles.formContainer}>
                                <h3>{isEditing ? "Edit Bus" : "Create New Bus"}</h3>
                                <div style={styles.gridForm}>
                                    <input name="departureLocation" placeholder="From (Location)" value={busFormData.departureLocation} onChange={handleBusInputChange} style={styles.input} required />
                                    <input name="destination" placeholder="To (Destination)" value={busFormData.destination} onChange={handleBusInputChange} style={styles.input} required />

                                    {/* UPDATED: Uses type="time" for Daily Schedules */}
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <label style={{fontSize:'0.8rem'}}>Departure Time</label>
                                        <input name="departureTime" type="time" value={busFormData.departureTime} onChange={handleBusInputChange} style={styles.input} required />
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <label style={{fontSize:'0.8rem'}}>Arrival Time</label>
                                        <input name="destinationTime" type="time" value={busFormData.destinationTime} onChange={handleBusInputChange} style={styles.input} required />
                                    </div>

                                    <input name="seatCount" type="number" placeholder="Seats" value={busFormData.seatCount} onChange={handleBusInputChange} style={styles.input} required />
                                    <input name="description" placeholder="Description" value={busFormData.description} onChange={handleBusInputChange} style={styles.input} />
                                </div>
                                <button type="submit" style={styles.submitBtn}>{isEditing ? "Update Bus" : "Save Bus"}</button>
                            </form>
                        )}

                        <div style={styles.cardGrid}>
                            {buses.length === 0 && <p>No buses found. Add one!</p>}
                            {buses.map(bus => (
                                <BusCard
                                    key={bus.busId}
                                    bus={bus}
                                    role="ADMIN"
                                    onDelete={handleDeleteBus}
                                    onEdit={handleEditBus}
                                    refreshData={loadBuses}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'passengers' && (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                            <tr style={styles.thRow}><th>ID</th><th>Name</th><th>Phone</th><th>Address</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                            {passengers.map(p => (
                                <tr key={p.passengerId} style={styles.tr}>
                                    <td>{p.passengerId}</td>
                                    <td>{p.userName}</td>
                                    <td>{p.phoneNo}</td>
                                    <td>{p.address}</td>
                                    <td>
                                        <button onClick={() => {
                                            if(window.confirm("Delete Passenger?")) PassengerService.deletePassenger(p.passengerId).then(loadPassengers);
                                        }} style={styles.deleteBadge}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'conductors' && (
                    <div>
                        <button onClick={() => setShowConductorForm(!showConductorForm)} style={styles.addButton}>
                            {showConductorForm ? "Close Form" : "+ Hire New Conductor"}
                        </button>

                        {showConductorForm && (
                            <form onSubmit={handleCreateConductor} style={styles.formContainer}>
                                <h3>Hire New Conductor</h3>
                                <div style={styles.gridForm}>
                                    <input placeholder="Username" value={conductorFormData.userName} onChange={(e) => setConductorFormData({...conductorFormData, userName: e.target.value})} style={styles.input} required />
                                    <input placeholder="Set Password" value={conductorFormData.password} onChange={(e) => setConductorFormData({...conductorFormData, password: e.target.value})} style={styles.input} required />
                                    <input placeholder="Phone Number" value={conductorFormData.phoneNo} onChange={(e) => setConductorFormData({...conductorFormData, phoneNo: e.target.value})} style={styles.input} required />
                                    <input placeholder="Address" value={conductorFormData.address} onChange={(e) => setConductorFormData({...conductorFormData, address: e.target.value})} style={styles.input} required />
                                </div>
                                <button type="submit" style={styles.submitBtn}>Save Conductor</button>
                            </form>
                        )}

                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                <tr style={styles.thRow}><th>ID</th><th>Name</th><th>Phone</th><th>Bus Assigned</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                {conductors.map(c => (
                                    <tr key={c.conductorId} style={styles.tr}>
                                        <td>{c.conductorId}</td>
                                        <td>{c.userName}</td>
                                        <td>{c.phoneNo || c.phoneNO}</td>
                                        <td>{c.bus ? `Bus #${c.bus.busId}` : 'None'}</td>
                                        <td>
                                            <button onClick={() => {
                                                if(window.confirm("Fire Conductor?")) ConductorService.deleteConductor(c.conductorId).then(loadConductors);
                                            }} style={styles.deleteBadge}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
    addButton: { padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
    formContainer: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' },
    gridForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    submitBtn: { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    tableContainer: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thRow: { background: '#f8f9fa', textAlign: 'left' },
    tr: { borderBottom: '1px solid #eee' },
    deleteBadge: { padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }
};

export default AdminDashboard;