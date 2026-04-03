### 🏗️ Project Architecture
The application follows a 3-tier architecture pattern:

## 1. Presentation Layer (Frontend)
React components for user interface
Pages for different user roles
Service layer for API communication

## 2. Application Layer (Backend)
Spring Boot controllers handling HTTP requests
Business logic in service classes
Validation and error handling

## 3. Data Layer
JPA entities representing database tables
Repository interfaces for database operations
PostgreSQL for persistent storage

## Data Flow

User Action → React Component → Service → Axios HTTP Request → Spring Controller→ Spring Service → Repository → Database → Response JSON → React Component Update