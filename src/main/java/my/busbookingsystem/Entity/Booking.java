package my.busbookingsystem.Entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @Column(nullable = false)
    @Min(value = 1, message = "Must book at least 1 seat")
    @Max(value = 6, message = "Cannot book more than 6 seats")
    private int noOfSeatsWants;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    private LocalDateTime requestmadeDate;
    private LocalDateTime requestmadeTime;

    // --- Relationships ---

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    @ManyToOne
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    public Booking() {

    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public int getNoOfSeatsWants() {
        return noOfSeatsWants;
    }

    public void setNoOfSeatsWants(int noOfSeatsWants) {
        this.noOfSeatsWants = noOfSeatsWants;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;

    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }
    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }
    public LocalDateTime getBookingTime() {
        return bookingTime;
    }
    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }
    public LocalDateTime getRequestmadeDate() {
        return requestmadeDate;
    }
    public void setRequestmadeDate(LocalDateTime requestmadeDate) {
        this.requestmadeDate = requestmadeDate;
    }
    public LocalDateTime getRequestmadeTime() {
        return requestmadeTime;
    }
    public void setRequestmadeTime(LocalDateTime requestmadeTime) {
        this.requestmadeTime = requestmadeTime;
    }
    public Passenger getPassenger() {
        return passenger;
    }
    public void setPassenger(Passenger passenger) {
        this.passenger = passenger;
    }
    public Bus getBus() {
        return bus;
    }
    public void setBus(Bus bus) {
        this.bus = bus;
    }



}
