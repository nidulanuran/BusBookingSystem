import axios from 'axios';

const API_URL = "http://localhost:8080/api/passengers";

class PassengerService {

    // --- 1. Get All Passengers (Admin) ---
    getAllPassengers() {
        return axios.get(`${API_URL}/all`);
    }

    // --- 2. Search Passengers (Admin Search Bar) ---
    searchPassengers(name) {
        return axios.get(`${API_URL}/search`, {
            params: { name: name }
        });
    }

    // --- 3. Update Passenger (Admin) ---
    updatePassenger(passengerId, passengerData) {
        return axios.put(`${API_URL}/update/${passengerId}`, passengerData);
    }

    // --- 4. Delete Passenger (Admin) ---
    deletePassenger(passengerId) {
        return axios.delete(`${API_URL}/delete/${passengerId}`);
    }

    // Inside src/services/PassengerService.js

    // ... existing methods ...

    // --- 5. Register (Sign Up) ---
    register(passengerData) {
        return axios.post(`${API_URL}/register`, passengerData);
    }


    login(credentials) {
        return axios.post(`${API_URL}/login`, credentials);
    }

}

export default new PassengerService();