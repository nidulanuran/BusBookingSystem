package my.busbookingsystem.Service;

import my.busbookingsystem.Entity.Passenger;
import my.busbookingsystem.Repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    // --- Admin: View All ---
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    // --- Admin: Search by Username (Case Insensitive) ---
    public List<Passenger> searchPassengers(String keyword) {
        return passengerRepository.findByUserNameContainingIgnoreCase(keyword);
    }

    // --- Admin: Update Passenger (e.g. if they forgot password or need details changed) ---
    public Passenger updatePassenger(Long id, Passenger updatedInfo) {
        return passengerRepository.findById(id).map(passenger -> {
            passenger.setUserName(updatedInfo.getUserName());
            passenger.setPhoneNo(updatedInfo.getPhoneNo());
            passenger.setAddress(updatedInfo.getAddress());
            // Note: Password usually requires encoding, handled separately
            return passengerRepository.save(passenger);
        }).orElse(null);
    }

    // --- Admin: Delete Passenger ---
    public void deletePassenger(Long id) {
        passengerRepository.deleteById(id);
    }

    //Helper for other services
    public Optional<Passenger> getPassengerById(Long id){
        return passengerRepository.findById(id);
    }

    // Inside PassengerService.java
    public Passenger savePassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

}
