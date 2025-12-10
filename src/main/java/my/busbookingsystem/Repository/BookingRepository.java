package my.busbookingsystem.Repository;

import my.busbookingsystem.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // 1. Get all bookings made by a specific passenger (history)
    List<Booking> findByPassenger_PassengerId(Long passengerId);

    // 2. Get all bookings for a specific bus (for conductor/admin view)
    List<Booking> findByBus_BusId(Long busId);
}
