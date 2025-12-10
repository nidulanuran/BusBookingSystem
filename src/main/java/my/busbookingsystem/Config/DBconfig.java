package my.busbookingsystem.Config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBconfig {
    private static final String URL="jdbc:postgresql://localhost:5432/BusBookingSystemDB";
    private static final String USER="postgres";
    private static final String PASSWORD="1234";

    public static Connection getConnection() {
        try {
            System.out.println("Connecting to database...");
            return DriverManager.getConnection(URL,USER,PASSWORD);
        } catch (SQLException e) {
            System.out.println("Database connection failed!" +e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        try(Connection con=getConnection()) {
            System.out.println("Connected to database...");
        }catch (SQLException e) {
            System.out.println("Database connection failed!" +e.getMessage());
        }

    }

}
