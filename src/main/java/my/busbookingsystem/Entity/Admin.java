package my.busbookingsystem.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import java.util.List;


@Entity
public class Admin {


    //-----------------------------Columns--------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long adminId;

    @Column(nullable = false,length = 30)
    private String userName;

    @Column(nullable = false,length = 10)
    private String password;

    @Column(nullable = false)
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits") // Strict Rule
    private String phoneNO;

    @Column(nullable = false,length = 40)
    private String address;

    private String position;

    //-----------------------------Relationships--------------------------------------

    @OneToMany(mappedBy = "admin")
    private List<Conductor> conductors;

    @OneToMany(mappedBy = "admin")
    private List<Passenger> passengers;

    @OneToMany(mappedBy = "admin")
    private List<Bus> buses;

    //-----------------------------Constructor--------------------------------------
    public Admin() {

    }

    //-----------------------------Getters and Setters---------------------------------


    public long getAdminId() {
        return adminId;
    }

    public void setAdminId(long adminId) {
        this.adminId = adminId;
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

    public String getPhoneNO() {
        return phoneNO;
    }

    public void setPhoneNO(String phoneNO) {
        this.phoneNO = phoneNO;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public List<Conductor> getConductors() {
        return conductors;
    }

    public void setConductors(List<Conductor> conductors) {
        this.conductors = conductors;
    }

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

    public List<Bus> getBuses() {
        return buses;
    }

    public void setBuses(List<Bus> buses) {
        this.buses = buses;
    }

}
