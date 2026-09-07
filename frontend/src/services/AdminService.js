import axios from 'axios';

const API_URL = "http://localhost:8080/api/admins";

class AdminService {

    // Matches @PostMapping("/login") in AdminController
    login(credentials) {
        return axios.post(API_URL + "/login", credentials);
    }
}

const adminService = new AdminService();
export default adminService;