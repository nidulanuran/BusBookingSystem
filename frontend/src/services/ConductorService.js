import axios from 'axios';

const API_URL = "http://localhost:8080/api/conductors";

class ConductorService {

    // --- 1. Get All Conductors (Admin) ---
    getAllConductors() {
        return axios.get(`${API_URL}/all`);
    }

    // --- 2. Search Conductors (Admin Search Bar) ---
    searchConductors(name) {
        return axios.get(`${API_URL}/search`, {
            params: { name: name }
        });
    }

    // --- 3. Update Conductor (Admin) ---
    updateConductor(conductorId, conductorData) {
        return axios.put(`${API_URL}/update/${conductorId}`, conductorData);
    }

    // --- 4. Delete Conductor (Admin) ---
    deleteConductor(conductorId) {
        return axios.delete(`${API_URL}/delete/${conductorId}`);
    }

    // --- 5. VIEW MY BUS BOOKINGS (Conductor Dashboard Feature) ---
    // This fetches the bookings for the bus assigned to this specific conductor
    getAssignedBusBookings(conductorId) {
        return axios.get(`${API_URL}/${conductorId}/bookings`);
    }

    login(credentials) {
        return axios.post(`${API_URL}/login`, credentials);
    }

    createConductor(conductor) {
        return axios.post(`${API_URL}/add`, conductor);
    }

}

export default new ConductorService();