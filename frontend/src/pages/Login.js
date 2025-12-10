import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerService from '../services/PassengerService';
import ConductorService from '../services/ConductorService';
import AdminService from '../services/AdminService';
// 1. Import the image
import backgroundimg from '../assets/Gemini_Generated_Image_f9k9prf9k9prf9k9.png';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PASSENGER');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const credentials = { userName, password };

        try {
            let response;

            // 1. Call the correct API based on the Dropdown selection
            if (role === 'PASSENGER') {
                response = await PassengerService.login(credentials);
            } else if (role === 'CONDUCTOR') {
                response = await ConductorService.login(credentials);
            } else if (role === 'ADMIN') {
                response = await AdminService.login(credentials);
            }

            // 2. If successful (status 200), save user and redirect
            if (response.status === 200) {
                const user = response.data;

                // Add the role to the object so we know who they are later
                user.role = role;

                // Save to LocalStorage (This keeps them logged in "next time")
                localStorage.setItem("user", JSON.stringify(user));

                // Redirect
                if (role === 'ADMIN') navigate('/admin');
                else if (role === 'CONDUCTOR') navigate('/conductor');
                else navigate('/passenger');
            }

        } catch (err) {
            console.error(err);
            setError("Invalid Username or Password. Please try again.");
        }
    };

    return (
        // 2. Update JSX to use the 3-layer structure
        <div style={styles.wrapper}>
            {/* Layer B: Blurred Background */}
            <div style={styles.backgroundLayer}></div>

            {/* Layer C: Sharp Content centering */}
            <div style={styles.contentLayer}>
                <form onSubmit={handleLogin} style={styles.form}>
                    <h2 style={{ textAlign: 'center' }}>Login</h2>

                    {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                    <div style={styles.inputGroup}>
                        <label>Username</label>
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Login As:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
                            <option value="PASSENGER">Passenger</option>
                            <option value="CONDUCTOR">Conductor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>Login</button>

                    <p style={{textAlign: 'center', marginTop: '15px'}}>
                        New here? <span onClick={() => navigate('/Register')} style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold'}}>Register Account</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

// 3. Update Styles to handle layers
const styles = {
    // Main Frame
    wrapper: {
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
    },
    // The blurred image layer
    backgroundLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
        filter: 'blur(5px)',
        transform: 'scale(1.1)',
    },
    // The layer that centers the form
    contentLayer: {
        position: 'relative',
        zIndex: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Form styles remain mostly the same
    form: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '320px'
    },
    inputGroup: { marginBottom: '15px' },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '12px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default Login;