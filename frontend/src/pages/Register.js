import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerService from '../services/PassengerService';
import backgroundimg from '../assets/Gemini_Generated_Image_f9k9prf9k9prf9k9.png';

const Register = () => {
    const navigate = useNavigate();

    // State to hold form data
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        phoneNo: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();

        // Basic Validation
        if (formData.phoneNo.length !== 10) {
            alert("Phone number must be exactly 10 digits");
            return;
        }

        // Call Backend
        PassengerService.register(formData)
            .then(() => {
                alert("Registration Successful! Please Login.");
                navigate('/login'); // Redirect to Login Page
            })
            .catch(error => {
                console.error("Error registering:", error);
                alert("Registration Failed. Try again.");
            });
    };

    return (
        // 1. MAIN WRAPPER
        <div style={styles.wrapper}>

            {/* 2. BACKGROUND LAYER (Blurred) */}
            <div style={styles.backgroundLayer}></div>

            {/* 3. CONTENT LAYER (Sharp) */}
            <div style={styles.contentLayer}>
                <form onSubmit={handleRegister} style={styles.form}>
                    <h2 style={{ textAlign: 'center' }}>Create Account</h2>

                    <div style={styles.inputGroup}>
                        <label>Username</label>
                        <input name="userName" type="text" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input name="password" type="password" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input name="phoneNo" type="text" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Address</label>
                        <input name="address" type="text" onChange={handleChange} style={styles.input} required />
                    </div>

                    <button type="submit" style={styles.button}>Register</button>

                    <p style={{textAlign: 'center', marginTop: '10px'}}>
                        Already have an account? <span onClick={() => navigate('/login')} style={{color: 'blue', cursor: 'pointer'}}>Login here</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

// Updated Styles
const styles = {
    // 1. The Wrapper holds everything together
    wrapper: {
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden', // Stops scrollbars from scale effect
    },

    // 2. The Background Image & Blur
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
        zIndex: -1, // Pushes it to the back
        filter: 'blur(5px)', // Blurs ONLY this layer
        transform: 'scale(1.1)', // Removes white edges caused by blur
    },

    // 3. The Content Layer (Centers the form)
    contentLayer: {
        position: 'relative',
        zIndex: 1, // Sits on top
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    form: {
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '350px'
    },
    inputGroup: { marginBottom: '15px' },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        boxSizing: 'border-box' // Ensures padding doesn't break width
    },
    button: {
        width: '100%',
        padding: '12px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem'
    }
};

export default Register;