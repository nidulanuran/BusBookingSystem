package my.busbookingsystem.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
public class Conductor {

    //-----------------------------Columns--------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conductorId;

    @Column(nullable = false,length = 30)
    private String userName;

    @Column(nullable = false,length = 10)
    private String password;

    @Column(nullable = false)
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits") // Strict Rule
    private String phoneNO;

    @Column(nullable = false,length = 40)
    private String address;


    //-----------------------------Relationships--------------------------------------
    @ManyToOne
    @JoinColumn(name = "adminId")
    @JsonIgnore
    private Admin admin;

    @OneToOne(mappedBy = "conductor")
    @JsonIgnoreProperties("conductor")
    private Bus bus;

    // --- Constructors ---
    public Conductor() {
    }

    // --- Getters and Setters ---

    public Long getConductorId() {
        return conductorId;
    }

    public void setConductorId(Long conductorId) {
        this.conductorId = conductorId;
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


}

