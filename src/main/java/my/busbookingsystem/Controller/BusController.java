package my.busbookingsystem.Controller;

import jakarta.validation.Valid;
import my.busbookingsystem.Entity.Bus;
import my.busbookingsystem.Entity.Conductor;
import my.busbookingsystem.Service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin("http://localhost:3000")
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
    public ResponseEntity<Bus> addBus(@Valid @RequestBody Bus bus) {
        Bus created = busService.saveBus(bus);
        return ResponseEntity.ok(created);
    }

    // --- 3. Update Bus (Admin Only) ---
    @PutMapping("/update/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @Valid @RequestBody Bus bus) {
        Bus updated = busService.updateBus(id, bus);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // --- 4. Delete Bus (Admin Only) ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    // --- 5. Filter by Route ---
    @GetMapping("/filter")
    public List<Bus> filterBuses(@RequestParam String departureLocation, @RequestParam String destination) {
        return busService.filterBuses(departureLocation, destination);
    }

    // --- 6. Assign Conductor to Bus ---
    @PutMapping("/{busId}/assign-conductor/{conductorId}")
    public ResponseEntity<?> assignConductor(@PathVariable Long busId, @PathVariable Long conductorId) {
        try {
            Bus updated = busService.assignConductor(busId, conductorId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 7. Unassign Conductor from Bus ---
    @PutMapping("/{busId}/unassign-conductor")
    public ResponseEntity<?> unassignConductor(@PathVariable Long busId) {
        try {
            Bus updated = busService.unassignConductor(busId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 8. Available Conductors Pool ---
    @GetMapping("/available-conductors")
    public List<Conductor> getAvailableConductors() {
        return busService.getAvailableConductors();
    }
}