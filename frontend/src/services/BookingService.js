import axios from 'axios';

const API_URL = "http://localhost:8080/api/bookings";

class BookingService {

    // --- 1. Create Booking (Passenger "Book Now" Button) ---
    // Sends the Booking object (Body) AND the IDs (Query Params)
    createBooking(bookingData, busId, passengerId) {
        return axios.post(`${API_URL}/create`, bookingData, {
            params: {
                busId: busId,
                passengerId: passengerId
            }
        });
    }

    // --- 2. Get My Bookings (Passenger History) ---
    getMyBookings(passengerId) {
        return axios.get(`${API_URL}/passenger/${passengerId}`);
    }

    // --- 3. Cancel Booking (Passenger Action) ---
    cancelBooking(bookingId) {
        return axios.delete(`${API_URL}/cancel/${bookingId}`);
    }
}

export default new BookingService();