import axios from 'axios';

const API_URL = "http://localhost:8080/api/admins";

class AdminService {

    // Matches @PostMapping("/login") in AdminController
    login(credentials) {
        return axios.post(API_URL + "/login", credentials);
    }
}

export default new AdminService();