package my.busbookingsystem.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnore;


import java.util.List;


@Entity
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long passengerId;


    @Column(nullable = false,length = 30,unique = true)
    private String userName;

    @Column(nullable = false,length = 10)
    private String password;

    @Column(nullable = false)
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits") // Strict Rule
    private String phoneNO;

    @Column(nullable = false,length = 40)
    private String address;


    // --- Relationships ---

    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin admin;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @OneToMany(mappedBy = "passenger")
    @JsonIgnore
    private List<Booking> bookings;

    // --- Constructors ---
    public Passenger() {
    }

    // --- Getters and Setters ---

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNo() {
        return phoneNO;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNO = phoneNo;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}