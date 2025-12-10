package my.busbookingsystem.Service;

import my.busbookingsystem.Entity.Bus;
import my.busbookingsystem.Repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

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
    public List<Bus> filterBuses(String depLoc, String dest, LocalDateTime depTime, LocalDateTime destTime) {
        // This relies on the Repository method we created earlier
        return busRepository.findByDepartureLocationAndDestinationAndDepartureTimeAndDestinationTime(
                depLoc, dest, depTime, destTime
        );
    }


}
