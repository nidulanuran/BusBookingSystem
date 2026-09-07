package my.busbookingsystem.Controller;

import jakarta.validation.Valid;
import my.busbookingsystem.Entity.Booking;
import my.busbookingsystem.Entity.Conductor;
import my.busbookingsystem.Repository.ConductorRepository;
import my.busbookingsystem.Service.ConductorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/conductors")
@CrossOrigin("http://localhost:3000")
public class ConductorController {

    @Autowired
    private ConductorService conductorService;
    @Autowired
    private ConductorRepository conductorRepository;

    // --- 1. Get All Conductors (Admin View) ---
    @GetMapping("/all")
    public List<Conductor> getAllConductors() {
        return conductorService.getAllConductors();
    }

    // --- 2. Search Conductors (Admin Search Bar) ---
    @GetMapping("/search")
    public List<Conductor> searchConductors(@RequestParam String name) {
        return conductorService.searchConductors(name);
    }

    // --- 3. Update Conductor (Admin Only) ---
    @PutMapping("/update/{id}")
    public ResponseEntity<Conductor> updateConductor(@PathVariable Long id, @RequestBody Conductor conductor) {
        Conductor updated = conductorService.updateConductor(id, conductor);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // --- 4. Delete Conductor (Admin Only) ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteConductor(@PathVariable Long id) {
        conductorService.deleteConductor(id);
        return ResponseEntity.noContent().build();
    }

    // --- 5. View Bus Bookings (Conductor View) ---
    @GetMapping("/{id}/bookings")
    public List<Booking> getMyBusBookings(@PathVariable Long id) {
        return conductorService.getBookingsForConductor(id);
    }

    // --- 6. LOGIN (Public Endpoint) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Conductor loginData) {
        Optional<Conductor> conductor = conductorRepository.findByUserNameAndPassword(
                loginData.getUserName(),
                loginData.getPassword()
        );

        if (conductor.isPresent()) {
            return ResponseEntity.ok(conductor.get());
        } else {
            return ResponseEntity.status(401).body("Invalid Username or Password");
        }
    }

    // --- 7. ADD NEW CONDUCTOR (Admin Feature) ---
    @PostMapping("/add")
    public ResponseEntity<?> addConductor(@Valid @RequestBody Conductor conductor) {
        if (conductorRepository.findByUserName(conductor.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken by another conductor.");
        }
        Conductor saved = conductorRepository.save(conductor);
        return ResponseEntity.ok(saved);
    }
}