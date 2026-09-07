package my.busbookingsystem.Service;

import my.busbookingsystem.Entity.Booking;
import my.busbookingsystem.Entity.Bus;
import my.busbookingsystem.Entity.Passenger;
import my.busbookingsystem.Repository.BookingRepository;
import my.busbookingsystem.Repository.BusRepository;
import my.busbookingsystem.Repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    // --- 1. Passenger: Create a New Booking ---
    public Booking createBooking(Booking booking, Long busId, Long passengerId) {
        if (booking == null) {
            throw new RuntimeException("Booking details cannot be null.");
        }

        // Validate passenger
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found with ID: " + passengerId));

        // Validate bus
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + busId));

        // Check if passenger already has an active booking
        if (hasActiveBooking(passengerId)) {
            throw new RuntimeException("Passenger already has an active booking. Please complete or cancel your ongoing trip first.");
        }

        // Validate travel date
        if (booking.getTravelDate() == null) {
            throw new RuntimeException("Travel date is required.");
        }

        if (booking.getTravelDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot book for a past date. Please pick today or a future date.");
        }

        // Validate seat count (1 to 6)
        if (booking.getNoOfSeatsWants() < 1 || booking.getNoOfSeatsWants() > 6) {
            throw new RuntimeException("You can book between 1 and 6 seats per reservation.");
        }

        // Setup booking object
        booking.setBus(bus);
        booking.setPassenger(passenger);
        booking.setBookingTimestamp(LocalDateTime.now());
        booking.setRequestmadeDate(LocalDateTime.now());
        booking.setRequestmadeTime(LocalDateTime.now());

        if (booking.getLocation() == null || booking.getLocation().trim().isEmpty()) {
            booking.setLocation("Online");
        }

        return bookingRepository.save(booking);
    }

    // --- Helper: Check for Active Booking ---
    // Active means: Travel Date is in future OR (Travel Date is Today AND Destination Time hasn't passed)
    private boolean hasActiveBooking(Long passengerId) {
        List<Booking> allBookings = bookingRepository.findByPassenger_PassengerId(passengerId);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        for (Booking b : allBookings) {
            if (b.getTravelDate() == null) continue;

            boolean isFutureDate = b.getTravelDate().isAfter(today);
            boolean isTodayAndNotExpired = b.getTravelDate().isEqual(today) &&
                    (b.getBus() != null && b.getBus().getDestinationTime() != null && b.getBus().getDestinationTime().isAfter(now));

            if (isFutureDate || isTodayAndNotExpired) {
                return true;
            }
        }
        return false;
    }

    // --- 2. Passenger: View My Own Bookings ---
    public List<Booking> getBookingsByPassenger(Long passengerId) {
        return bookingRepository.findByPassenger_PassengerId(passengerId);
    }

    // --- 3. Passenger: Cancel (Delete) Booking ---
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    // --- 4. Helper to see specific booking details ---
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
}