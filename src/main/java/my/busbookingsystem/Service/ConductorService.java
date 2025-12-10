package my.busbookingsystem.Service;

import my.busbookingsystem.Entity.Booking;
import my.busbookingsystem.Entity.Conductor;
import my.busbookingsystem.Repository.BookingRepository;
import my.busbookingsystem.Repository.ConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConductorService {

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // --- Admin: View All ---
    public List<Conductor> getAllConductors() {
        return conductorRepository.findAll();
    }

    // --- Admin: Search by Username ---
    public List<Conductor> searchConductors(String keyword) {
        return conductorRepository.findByUserNameContainingIgnoreCase(keyword);
    }

    // --- Admin: Update Conductor ---
    public Conductor updateConductor(Long id, Conductor updatedInfo) {
        return conductorRepository.findById(id).map(conductor -> {
            conductor.setUserName(updatedInfo.getUserName());
            conductor.setPhoneNo(updatedInfo.getPhoneNO());
            conductor.setAddress(updatedInfo.getAddress());
            return conductorRepository.save(conductor);
        }).orElse(null);
    }

    // --- Admin: Delete Conductor ---
    public void deleteConductor(Long id) {
        conductorRepository.deleteById(id);
    }

    // --- CONDUCTOR FEATURE: View Bookings for Assigned Bus ---
    public List<Booking> getBookingsForConductor(Long conductorId) {
        // 1. Find the conductor
        Optional<Conductor> conductorOpt = conductorRepository.findById(conductorId);

        if (conductorOpt.isPresent()) {
            Conductor conductor = conductorOpt.get();

            // 2. Check if conductor has a bus assigned
            if (conductor.getBus() != null) {
                Long busId = conductor.getBus().getBusId();

                // 3. Return bookings for that bus (Using the repo method we made earlier)
                return bookingRepository.findByBus_BusId(busId);
            }
        }
        return List.of(); // Return empty list if conductor or bus not found
    }
}