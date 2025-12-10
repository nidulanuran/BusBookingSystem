package my.busbookingsystem.Controller;

import my.busbookingsystem.Entity.Bus;
import my.busbookingsystem.Service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin("http://localhost:3000") // Allows React to connect
public class BusController {

    @Autowired
    private BusService busService;

    // --- 1. Get All Buses (Dashboard) ---
    @GetMapping("/all")
    public List<Bus> getAllBuses() {
        return busService.getAllBuses();
    }

    // --- 2. Add New Bus (Admin Only) ---
    @PostMapping("/add")
    public Bus addBus(@RequestBody Bus bus) {
        return busService.saveBus(bus);
    }

    // --- 3. Update Bus (Admin Only) ---
    @PutMapping("/update/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus busDetails) {
        Optional<Bus> busData = busService.getBusById(id);

        if (busData.isPresent()) {
            Bus bus = busData.get();
            // Update fields
            bus.setSeatCount(busDetails.getSeatCount());
            bus.setDescription(busDetails.getDescription());
            bus.setDepartureLocation(busDetails.getDepartureLocation());
            bus.setDestination(busDetails.getDestination());
            bus.setDepartureTime(busDetails.getDepartureTime());
            bus.setDestinationTime(busDetails.getDestinationTime());

            return ResponseEntity.ok(busService.saveBus(bus));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- 4. Delete Bus (Admin Only) ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    // --- 5. Filter Buses (Admin & Passenger Dropdowns) ---
    // Example URL: /api/buses/filter?start=Colombo&end=Kandy&depTime=2025-11-30T10:00:00&destTime=...
    @GetMapping("/filter")
    public List<Bus> filterBuses(
            @RequestParam String departureLocation,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime destinationTime) {

        return busService.filterBuses(departureLocation, destination, departureTime, destinationTime);
    }
}