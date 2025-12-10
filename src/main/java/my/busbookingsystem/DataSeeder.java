package my.busbookingsystem;

import my.busbookingsystem.Entity.Admin;
import my.busbookingsystem.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if the table is empty
        if (adminRepository.count() == 0) {

            Admin admin = new Admin();
            admin.setUserName("admin");
            admin.setPassword("admin123"); // You can change this
            admin.setPhoneNO("0773568851");
            admin.setAddress("Head Office, Colombo");
            admin.setPosition("Super Admin");

            adminRepository.save(admin);

            System.out.println("---------------------------------------------");
            System.out.println("DEFAULT ADMIN CREATED: User: admin | Pass: admin123");
            System.out.println("---------------------------------------------");
        }
    }
}
