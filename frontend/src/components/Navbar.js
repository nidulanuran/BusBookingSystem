import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user session/local storage
        localStorage.removeItem("user");
        navigate('/login');
    };

    return (
        <nav style={{
            background: '#00afd6',
            color: '#e3e3e3',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h2>Bus Booking System</h2>
            <div>
                <span style={{ marginRight: '15px' }}>Logged in as: <strong>{role}</strong></span>
                <button
                    onClick={handleLogout}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;