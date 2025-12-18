import axios from 'axios';

const API_URL = "http://localhost:8080/api/buses";

class BusService {

    // --- 1. Get All Buses (For Dashboards) ---
    getAllBuses() {
        return axios.get(`${API_URL}/all`);
    }

    // --- 2. Add New Bus (Admin) ---
    createBus(bus) {
        return axios.post(`${API_URL}/add`, bus);
    }

    // --- 3. Update Bus (Admin) ---
    updateBus(busId, busDetails) {
        return axios.put(`${API_URL}/update/${busId}`, busDetails);
    }

    // --- 4. Delete Bus (Admin) ---
    deleteBus(busId) {
        return axios.delete(`${API_URL}/delete/${busId}`);
    }

    // --- 5. Filter Buses (The 4 Dropdowns) ---
    // Note: React params must match Java @RequestParam names exactly
    filterBuses(departureLocation, destination) {
        return axios.get(`${API_URL}/filter`, {
            params: {
                departureLocation: departureLocation,
                destination: destination,

            }
        });
    }

    getAvailableConductors() {
        return axios.get(`${API_URL}/available-conductors`);
    }

    assignConductor(busId, conductorId) {
        return axios.put(`${API_URL}/${busId}/assign-conductor/${conductorId}`);
    }

    unassignConductor(busId) {
        return axios.put(`${API_URL}/${busId}/unassign-conductor`);
    }

}

export default new BusService();