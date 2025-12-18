import React, { useState, useEffect } from 'react';
import BusService from '../services/BusService';

const BusCard = ({ bus, role, onBook, onDelete, onEdit, refreshData }) => {

    const [availableConductors, setAvailableConductors] = useState([]);
    const [selectedConductor, setSelectedConductor] = useState("");

    // Load available conductors only if Admin and bus has no conductor
    useEffect(() => {
        if (role === 'ADMIN' && !bus.conductor) {
            BusService.getAvailableConductors().then(res => {
                setAvailableConductors(res.data);
            });
        }
    }, [role, bus.conductor]);

    const handleAssign = () => {
        if (!selectedConductor) return alert("Select a conductor first");
        BusService.assignConductor(bus.busId, selectedConductor)
            .then(() => {
                alert("Conductor Assigned!");
                if(refreshData) refreshData(); // Reload parent data
            });
    };

    const handleUnassign = () => {
        if(window.confirm("Remove this conductor from the bus?")) {
            BusService.unassignConductor(bus.busId)
                .then(() => {
                    alert("Conductor Removed!");
                    if(refreshData) refreshData();
                });
        }
    };

    const formatTime = (timeString) => {
        if(!timeString) return "";
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>{bus.departureLocation} ➝ {bus.destination}</h3>
            </div>

            <div style={styles.body}>
                <p><strong>Departs:</strong> {formatTime(bus.departureTime)}</p>
                <p><strong>Arrives:</strong> {formatTime(bus.destinationTime)}</p>
                <p><strong>Seats:</strong> {bus.seatCount}</p>

                {/* ADMIN ONLY: Conductor Management Section */}
                {role === 'ADMIN' && (
                    <div style={{marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '5px'}}>
                        <strong>Conductor: </strong>
                        {bus.conductor ? (
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span style={{color: 'green', fontWeight:'bold'}}>{bus.conductor.userName}</span>
                                <button onClick={handleUnassign} style={styles.smBtn}>X</button>
                            </div>
                        ) : (
                            <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                                <select
                                    style={styles.select}
                                    value={selectedConductor}
                                    onChange={(e) => setSelectedConductor(e.target.value)}
                                >
                                    <option value="">Select Conductor</option>
                                    {availableConductors.map(c => (
                                        <option key={c.conductorId} value={c.conductorId}>{c.userName}</option>
                                    ))}
                                </select>
                                <button onClick={handleAssign} style={styles.assignBtn}>Assign</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={styles.footer}>
                {role === 'PASSENGER' && (
                    <button onClick={() => onBook(bus.busId)} style={styles.bookBtn}>Book Now</button>
                )}
                {role === 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => onEdit(bus)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => onDelete(bus.busId)} style={styles.deleteBtn}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '20px', display: 'flex', flexDirection: 'column', borderLeft: '5px solid #007bff' },
    header: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
    title: { margin: 0, color: '#333', fontSize: '1.2rem' },
    body: { fontSize: '0.95rem', color: '#555', marginBottom: '15px' },
    footer: { marginTop: 'auto' },
    bookBtn: { width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    editBtn: { flex: 1, padding: '8px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    deleteBtn: { flex: 1, padding: '8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

    // New Styles for Conductor Section
    select: { flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    assignBtn: { padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    smBtn: { padding: '2px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '10px' }
};

export default BusCard;