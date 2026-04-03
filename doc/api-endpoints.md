### 🔌 API Endpoints

## Authentication
POST /api/auth/login - User login
POST /api/auth/register - User registration
POST /api/auth/logout - User logout

## Buses
GET /api/buses - List all buses
GET /api/buses/{id} - Get bus details
POST /api/buses - Create bus (Admin only)
PUT /api/buses/{id} - Update bus (Admin only)
DELETE /api/buses/{id} - Delete bus (Admin only)

## Bookings
GET /api/bookings - Get user bookings
POST /api/bookings - Create booking
GET /api/bookings/{id} - Get booking details
DELETE /api/bookings/{id} - Cancel booking

## Trips
GET /api/trips - List all trips
GET /api/trips/search - Search trips with filters
GET /api/trips/{id} - Get trip details

## Passengers
GET /api/passengers/{id} - Get passenger profile
PUT /api/passengers/{id} - Update passenger profile

## Conductors
GET /api/conductors/{id} - Get conductor info
GET /api/conductors/{id}/trips - Get assigned trips

## Admin
GET /api/admin/dashboard - Get dashboard statistics
GET /api/admin/users - List all users
GET /api/admin/bookings - List all bookings