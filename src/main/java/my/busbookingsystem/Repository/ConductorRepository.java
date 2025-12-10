package my.busbookingsystem.Repository;

import my.busbookingsystem.Entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {

    List<Conductor> findByUserNameContainingIgnoreCase(String userName);

    // This creates a query: SELECT * FROM table WHERE user_name = ? AND password = ?
    Optional<Conductor> findByUserNameAndPassword(String userName, String password);
}
