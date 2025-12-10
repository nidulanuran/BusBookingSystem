// src/components/BusCard.js
import React from 'react';

const BusCard = ({ bus, role, onBook, onDelete, onEdit }) => {

    const formatDate = (dateString) => {
        if(!dateString) return "";
        return new Date(dateString).toLocaleString();
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>{bus.departureLocation} ➝ {bus.destination}</h3>
            </div>

            <div style={styles.body}>
                <p><strong>Departure:</strong> {formatDate(bus.departureTime)}</p>
                <p><strong>Arrival:</strong> {formatDate(bus.destinationTime)}</p>
                <p><strong>Seats:</strong> {bus.seatCount}</p>
                <p style={styles.desc}>{bus.description}</p>
            </div>

            <div style={styles.footer}>
                {role === 'PASSENGER' && (
                    <button onClick={() => onBook(bus.busId)} style={styles.bookBtn}>
                        Book Now
                    </button>
                )}

                {role === 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => onEdit(bus)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => onDelete(bus.busId)} style={styles.deleteBtn}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal CSS for the card
const styles = {
    card: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: '5px solid #007bff'
    },
    header: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
    title: { margin: 0, color: '#333', fontSize: '1.2rem' },
    body: { fontSize: '0.95rem', color: '#555', marginBottom: '15px' },
    desc: { fontStyle: 'italic', color: '#777', fontSize: '0.85rem', marginTop: '5px' },
    footer: { marginTop: 'auto' },
    bookBtn: { width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    editBtn: { flex: 1, padding: '8px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    deleteBtn: { flex: 1, padding: '8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default BusCard;