package my.busbookingsystem.Controller;

import my.busbookingsystem.Entity.Booking;
import my.busbookingsystem.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // --- 1. Create Booking (Passenger Actions) ---
    // URL: /api/bookings/create?busId=1&passengerId=5
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking,
            @RequestParam Long busId,
            @RequestParam Long passengerId) {

        try {
            Booking newBooking = bookingService.createBooking(booking, busId, passengerId);
            return ResponseEntity.ok(newBooking);
        } catch (RuntimeException e) {
            // Return 400 Bad Request with the error message (e.g., "Already has active booking")
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    // --- 2. View My Bookings (Passenger History) ---
    @GetMapping("/passenger/{passengerId}")
    public List<Booking> getPassengerBookings(@PathVariable Long passengerId) {
        return bookingService.getBookingsByPassenger(passengerId);
    }

    // --- 3. Cancel Booking (Passenger Actions) ---
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}