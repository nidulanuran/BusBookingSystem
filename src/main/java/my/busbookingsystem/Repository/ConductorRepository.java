package my.busbookingsystem.Repository;

import my.busbookingsystem.Entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {

    List<Conductor> findByUserNameContainingIgnoreCase(String userName);

    Optional<Conductor> findByUserName(String userName);

    Optional<Conductor> findByUserNameAndPassword(String userName, String password);

    // Find all conductors whose IDs are NOT present in the Bus table
    @Query("SELECT c FROM Conductor c WHERE c.conductorId NOT IN (SELECT b.conductor.conductorId FROM Bus b WHERE b.conductor IS NOT NULL)")
    List<Conductor> findAvailableConductors();
}
