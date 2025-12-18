package my.busbookingsystem.Repository;

import my.busbookingsystem.Entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByDepartureLocationAndDestination(
            String departureLocation,
            String destination
    );


}
