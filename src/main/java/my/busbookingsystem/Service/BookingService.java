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

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    // --- 1. Passenger: Create a New Booking ---
    // We take the booking object, plus the IDs of the Bus and Passenger to link them
    public Booking createBooking(Booking booking, Long busId, Long passengerId) {

        // Find the specific Bus and Passenger from the database
        Optional<Bus> busOpt = busRepository.findById(busId);
        Optional<Passenger> passengerOpt = passengerRepository.findById(passengerId);

        if (busOpt.isPresent() && passengerOpt.isPresent()) {
            Booking newBooking = booking;

            // Link them together
            newBooking.setBus(busOpt.get());
            newBooking.setPassenger(passengerOpt.get());

            // Automatically set the "Request Made" time to right now
            newBooking.setRequestmadeDate(LocalDateTime.now());
            newBooking.setRequestmadeTime(LocalDateTime.now());

            return bookingRepository.save(newBooking);
        }

        return null; // Return null if bus or passenger ID is invalid
    }

    // --- 2. Passenger: View My Own Bookings ---
    public List<Booking> getBookingsByPassenger(Long passengerId) {
        return bookingRepository.findByPassenger_PassengerId(passengerId);
    }

    // --- 3. Passenger: Cancel (Delete) Booking ---
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    // --- 4. Admin/Conductor: Helper to see specific booking details ---
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
}