package my.busbookingsystem.Controller;

import my.busbookingsystem.Entity.Bus;
import my.busbookingsystem.Entity.Conductor;
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
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        Bus updated = busService.updateBus(id, bus);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // --- 4. Delete Bus (Admin Only) ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    // Filter only by Route
    @GetMapping("/filter")
    public List<Bus> filterBuses(@RequestParam String departureLocation, @RequestParam String destination) {
        return busService.filterBuses(departureLocation, destination);
    }

    @PutMapping("/{busId}/assign-conductor/{conductorId}")
    public ResponseEntity<Bus> assignConductor(@PathVariable Long busId, @PathVariable Long conductorId) {
        return ResponseEntity.ok(busService.assignConductor(busId, conductorId));
    }

    @PutMapping("/{busId}/unassign-conductor")
    public ResponseEntity<Bus> unassignConductor(@PathVariable Long busId) {
        return ResponseEntity.ok(busService.unassignConductor(busId));
    }

    @GetMapping("/available-conductors")
    public List<Conductor> getAvailableConductors() {
        return busService.getAvailableConductors();
    }
}