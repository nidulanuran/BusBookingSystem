package my.busbookingsystem.Controller;

import my.busbookingsystem.Entity.Passenger;
import my.busbookingsystem.Repository.PassengerRepository;
import my.busbookingsystem.Service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin("http://localhost:3000")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;
    @Autowired
    private PassengerRepository passengerRepository;

    // --- 1. Get All Passengers (Admin View) ---
    @GetMapping("/all")
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    // --- 2. Search Passengers (Admin Search Bar) ---
    // URL: /api/passengers/search?name=john
    @GetMapping("/search")
    public List<Passenger> searchPassengers(@RequestParam String name) {
        return passengerService.searchPassengers(name);
    }

    // --- 3. Update Passenger (Admin Only) ---
    @PutMapping("/update/{id}")
    public ResponseEntity<Passenger> updatePassenger(@PathVariable Long id, @RequestBody Passenger passenger) {
        Passenger updated = passengerService.updatePassenger(id, passenger);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // --- 4. Delete Passenger (Admin Only) ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePassenger(@PathVariable Long id) {
        passengerService.deletePassenger(id);
        return ResponseEntity.noContent().build();
    }

    // Inside PassengerController.java

    // --- 5. REGISTER (Public Endpoint) ---
    // URL: /api/passengers/register
    @PostMapping("/register")
    public Passenger registerPassenger(@RequestBody Passenger passenger) {
        // In a real app, you would encrypt the password here before saving
        return passengerService.savePassenger(passenger);
    }

    // --- 6. LOGIN (Public Endpoint) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Passenger loginData) {
        // Use the Repository directly or via Service to check credentials
        // Note: In a real app, use a Service for this. Here we use Repository for simplicity.
        Optional<Passenger> passenger = passengerRepository.findByUserNameAndPassword(
                loginData.getUserName(),
                loginData.getPassword()
        );

        if (passenger.isPresent()) {
            return ResponseEntity.ok(passenger.get());
        } else {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }
    }

}