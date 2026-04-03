
## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK):** Java 17 or higher
- **Node.js & npm:** Latest LTS version
- **PostgreSQL:** Version 12 or higher
- **Git:** For cloning the repository
- **Maven:** (Included as wrapper - mvnw)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nidulanuran/BusBookingSystem.git
cd BusBookingSystem
```

## 2. Database Setup

Create a PostgreSQL database for the application:


- **CREATE DATABASE** bus_booking_system;
-**Configure database connection in** src/main/resources/application.properties:

# properties

-**spring.datasource.url=**jdbc:postgresql://localhost:5432/bus_booking_system
-**spring.datasource.username=**your_postgres_username
-**spring.datasource.password=**your_postgres_password
-**spring.datasource.driver-class-name=**org.postgresql.Driver

-**spring.jpa.database-platform=**org.hibernate.dialect.PostgreSQLDialect
-**spring.jpa.hibernate.ddl-auto=**update
-**spring.jpa.show-sql=**false

## 3. Backend Setup

# Navigate to backend directory (root)
cd BusBookingSystem
# Install dependencies and build
./mvnw clean install
# Or on Windows
mvnw.cmd clean install

## 4. Frontend Setup

# Navigate to frontend directory
cd frontend
# Install npm dependencies
npm install


## ▶️ Running the Application
Start Backend Server

# From project root
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
Backend will start at: http://localhost:8080

Start Frontend Development Server

# From frontend directory
npm start
Frontend will open at: http://localhost:3000