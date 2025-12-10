package my.busbookingsystem.Repository;

import my.busbookingsystem.Entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByUserNameContainingIgnoreCase(String userName);

    // This creates a query: SELECT * FROM table WHERE user_name = ? AND password = ?
    Optional<Passenger> findByUserNameAndPassword(String userName, String password);
}
