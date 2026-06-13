# LIAS - Laboratory Information and Administration System

LIAS is a web-based platform developed to support the management of research laboratories.

## Technologies

### Backend

* Java 17
* Spring Boot 3
* Spring Data JPA
* PostgreSQL
* Maven

### Frontend

* React
* React Router
* Axios

## Main Modules

* Member Management
* Membership Requests
* Teams
* Publications
* Meetings
* Events
* Documents
* Equipment Management
* Discussions
* Notifications
* Partners & Conventions
* Annual Reports

## Current Status

Implemented:

* Database schema
* JPA entities
* Repositories
* DTOs
* MapStruct mappers
* Service layer

In progress:

* Spring Security & JWT
* REST Controllers
* Membership approval workflow
* Frontend ↔ Backend integration

## Running Backend

```bash
cd lias-backend
mvn spring-boot:run
```

## Running Frontend

```bash
cd lias-frontend
npm install
npm start
```
