package my.busbookingsystem.Controller;

import my.busbookingsystem.Entity.Admin;
import my.busbookingsystem.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin("http://localhost:3000") // Allow React to access this
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    // --- ADMIN LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin loginData) {
        // This requires the method we added to AdminRepository earlier:
        // Optional<Admin> findByUserNameAndPassword(String userName, String password);

        Optional<Admin> admin = adminRepository.findByUserNameAndPassword(
                loginData.getUserName(),
                loginData.getPassword()
        );

        if (admin.isPresent()) {
            return ResponseEntity.ok(admin.get());
        } else {
            return ResponseEntity.status(401).body("Invalid Admin Credentials");
        }
    }
}