package my.busbookingsystem.Service;

import my.busbookingsystem.Entity.Bus;
import my.busbookingsystem.Entity.Conductor;
import my.busbookingsystem.Repository.BusRepository;
import my.busbookingsystem.Repository.ConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    // --- Admin: Create / Update Bus ---
    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }

    // --- Admin & Passenger: Read All Buses ---
    public List<Bus> getAllBuses() {
        return busRepository.findAll();

    }

    // --- Admin: Read Single Bus ---
    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    // --- Admin: Delete Bus ---
    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }

    // --- Admin & Passenger: Filter Buses (The 4 Dropdowns) ---
    public List<Bus> filterBuses(String depLoc, String dest) {
        // This relies on the Repository method we created earlier
        return busRepository.findByDepartureLocationAndDestination(
                depLoc, dest
        );
    }

    // Update logic for Admin dashboard
    public Bus updateBus(Long id, Bus updatedBus) {
        return busRepository.findById(id).map(bus -> {
            bus.setDepartureLocation(updatedBus.getDepartureLocation());
            bus.setDestination(updatedBus.getDestination());
            bus.setDepartureTime(updatedBus.getDepartureTime());
            bus.setDestinationTime(updatedBus.getDestinationTime());
            bus.setSeatCount(updatedBus.getSeatCount());
            bus.setDescription(updatedBus.getDescription());
            return busRepository.save(bus);
        }).orElse(null);
    }

    // NEW: Assign Conductor
    public Bus assignConductor(Long busId, Long conductorId) {
        Bus bus = busRepository.findById(busId).orElseThrow(() -> new RuntimeException("Bus not found"));
        Conductor conductor = conductorRepository.findById(conductorId).orElseThrow(() -> new RuntimeException("Conductor not found"));

        // Check if conductor is already assigned elsewhere (Double check)
        // Ideally, the frontend filters this, but backend safety is good.

        bus.setConductor(conductor);
        return busRepository.save(bus);
    }

    // NEW: Unassign Conductor
    public Bus unassignConductor(Long busId) {
        Bus bus = busRepository.findById(busId).orElseThrow(() -> new RuntimeException("Bus not found"));
        bus.setConductor(null);
        return busRepository.save(bus);
    }

    // NEW: Get Available Conductors
    public List<Conductor> getAvailableConductors() {
        return conductorRepository.findAvailableConductors();
    }


}
