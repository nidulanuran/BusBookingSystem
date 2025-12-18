package my.busbookingsystem.Entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Bus {


    //-----------------------------Columns--------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long busId;

    @Column(nullable = false)
    private int seatCount;

    private String description;

    @Column(nullable = false)
    private String departureLocation;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private LocalTime destinationTime;

    //-----------------------------Relationships--------------------------------------
    @ManyToOne
    @JoinColumn(name = "adminId")
    @JsonIgnore
    private Admin admin;

    @OneToOne
    @JoinColumn(name = "conductorId", unique = true)
    private Conductor conductor;

    @OneToMany(mappedBy = "bus")
    @JsonIgnore
    private List<Booking> bookings;

    @OneToMany(mappedBy = "bus")
    @JsonIgnore
    private List<Passenger> passengers;

    // --- Constructors ---
    public Bus() {
    }

    // --- Getters and Setters ---

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(int seatCount) {
        this.seatCount = seatCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartureLocation() {
        return departureLocation;
    }

    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalTime getDestinationTime() {
        return destinationTime;
    }

    public void setDestinationTime(LocalTime destinationTime) {
        this.destinationTime = destinationTime;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public Conductor getConductor() {
        return conductor;
    }

    public void setConductor(Conductor conductor) {
        this.conductor = conductor;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

}
