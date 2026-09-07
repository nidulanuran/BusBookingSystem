package my.busbookingsystem.Controller;

import jakarta.validation.Valid;
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

    // --- 5. REGISTER (Public Endpoint) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerPassenger(@Valid @RequestBody Passenger passenger) {
        if (passengerRepository.findByUserName(passenger.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken. Please choose another one.");
        }
        Passenger saved = passengerService.savePassenger(passenger);
        return ResponseEntity.ok(saved);
    }

    // --- 6. LOGIN (Public Endpoint) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Passenger loginData) {
        Optional<Passenger> passenger = passengerRepository.findByUserNameAndPassword(
                loginData.getUserName(),
                loginData.getPassword()
        );

        if (passenger.isPresent()) {
            return ResponseEntity.ok(passenger.get());
        } else {
            return ResponseEntity.status(401).body("Invalid Username or Password");
        }
    }
}