# LIAS Laboratory Management System

A comprehensive Laboratory Information and Asset Management System built with modern web technologies.

## 🚀 Quick Start

### Prerequisites

- **Java 17** or higher
- **Node.js** (LTS version recommended)
- **PostgreSQL** (or Docker)

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd lias-backend
   ```

2. Configure the database:
   - Update `src/main/resources/application.properties`
   - Or set environment variables:
     ```bash
     DB_URL=jdbc:postgresql://localhost:5432/yourdb
     DB_USERNAME=youruser
     DB_PASSWORD=yourpassword
     ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8081` (default port).

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd lias-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

   The frontend will be available at `http://localhost:3000`.

## 📁 Project Structure

```
lias-laboratory-system/
├── lias-backend/         # Spring Boot Backend
│   ├── src/main/java/com/lias/lias_backend/
│   │   ├── controller/     # REST API Controllers
│   │   ├── service/        # Business Logic
│   │   ├── repository/     # Data Access (Spring Data JPA)
│   │   ├── model/          # JPA Entities
│   │   └── dto/            # Data Transfer Objects
│   └── pom.xml             # Maven Configuration
│
├── lias-frontend/        # React Frontend
│   ├── src/pages/          # Page Components
│   ├── src/components/     # Reusable Components
│   └── src/services/       # API Service
│
├── .gitignore
└── README.md
```

## 🛠️ Technologies

### Backend
- **Framework**: Spring Boot 3.2+
- **Language**: Java 17+
- **Database**: PostgreSQL (via Spring Data JPA)
- **Security**: Spring Security
- **Validation**: Hibernate Validator
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18+
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Library**: Optional (none specified, but ready for integration)

## 🎯 Features

- Authentication & Authorization
- User Management (Roles: Admin, Technician, Researcher)
- Role-based Access Control (RBAC)
- Request Management
- Audit Logging
- Clean Architecture (Controller-Service-Repository pattern)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Membership Requests
- `POST /api/membership-requests` - Create request
- `GET /api/membership-requests` - Get all requests
- `GET /api/membership-requests/{id}` - Get request by ID
- `PUT /api/membership-requests/{id}` - Update request
- `DELETE /api/membership-requests/{id}` - Delete request

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) NOT NULL, -- ADMIN, TECHNICIAN, RESEARCHER
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Membership Requests Table
```sql
CREATE TABLE membership_requests (
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) NOT NULL, -- ADMIN, TECHNICIAN, RESEARCHER
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Running in Docker

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: lias-postgres
    environment:
      POSTGRES_DB: liasdb
      POSTGRES_USER: liasuser
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./lias-backend
    container_name: lias-backend
    ports:
      - "8081:8081"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/liasdb
      - SPRING_DATASOURCE_USERNAME=liasuser
      - SPRING_DATASOURCE_PASSWORD=password
    depends_on:
      - postgres

  frontend:
    build: ./lias-frontend
    container_name: lias-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up --build
```

### Option 2: Manual Docker

**PostgreSQL**
```bash
docker run --name lias-postgres \
  -e POSTGRES_DB=liasdb \
  -e POSTGRES_USER=liasuser \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Backend**
```bash
docker build -t lias-backend ./lias-backend

docker run --name lias-backend \
  -p 8081:8081 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/liasdb \
  -e SPRING_DATASOURCE_USERNAME=liasuser \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -d lias-backend
```

**Frontend**
```bash
docker build -t lias-frontend ./lias-frontend

docker run --name lias-frontend \
  -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:8081 \
  -d lias-frontend
```

## 🏗️ Architecture

### Backend
```
com.lias.lias_backend
├── controller
│   └── AuthController
│   └── UserController
│   └── MembershipRequestController
├── service
│   ├── AuthService
│   ├── UserServiceImpl
│   ├── MembershipRequestServiceImpl
│   └── JwtUtils
├── repository
│   ├── UserRepository
│   └── MembershipRequestRepository
├── model
│   ├── User
│   └── MembershipRequest
└── config
    ├── SecurityConfig
    