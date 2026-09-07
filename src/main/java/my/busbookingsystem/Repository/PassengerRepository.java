package my.busbookingsystem.Repository;

import my.busbookingsystem.Entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByUserNameContainingIgnoreCase(String userName);

    Optional<Passenger> findByUserName(String userName);

    Optional<Passenger> findByUserNameAndPassword(String userName, String password);
}
