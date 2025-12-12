# Lingua Pass

A scalable, microservice-driven web platform for managing international language programs.

The frontend layer consists of two independent PWA portals (React, TypeScript) maintained in a PNPM-based monorepository with shared UI and utility packages.

The backend is composed of isolated .NET microservices designed using Vertical Slice Architecture and Clean Architecture, each exposing its own bounded context and operating on a dedicated database. Binary data is handled through object storage with server-side validation and sanitization.

Inter-service communication is split between gRPC for high-throughput, low-latency synchronous RPC calls and RabbitMQ (MassTransit) for asynchronous, fire-and-forget operations and event distribution.

A YARP-based API Gateway provides centralized routing, request pre-processing, authentication enforcement, and load balancing across internal service clusters. The system runs fully containerized via Docker, enabling reproducible environments and horizontal scaling of individual services.


## 👷 Frameworks, Libraries and Technologies

### PWA Clients

- [PNPM workspace](https://pnpm.io/workspaces)
- [Vite](https://github.com/vitejs/vite)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [React](https://github.com/facebook/react)
- [React router](https://github.com/remix-run/react-router)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite PWA](https://github.com/vite-pwa/vite-plugin-pwa)
- [Yup validation](https://github.com/jquense/yup)
- [PostCSS](https://github.com/postcss/postcss)


### Microservices

- [.NET](https://github.com/dotnet/core)
- [C#](https://github.com/dotnet/csharplang)
- [xUnit](https://github.com/xunit/xunit)
- [Yarp.ReverseProxy](https://github.com/microsoft/reverse-proxy)
- [ASP.NET Core](https://github.com/dotnet/aspnetcore)
- [Carter](https://github.com/CarterCommunity/Carter)
- [MediatR](https://github.com/jbogard/MediatR)
- [MassTransit](https://github.com/MassTransit/MassTransit)
- [RabbitMQ](https://github.com/rabbitmq)
- [GRPC](https://github.com/grpc/grpc-dotnet)
- [Entity Framework Core](https://github.com/dotnet/efcore)
- [PostgreSQL](https://github.com/postgres)
- [FluentValidation](https://github.com/FluentValidation/FluentValidation)
- [Docker](https://github.com/docker)



## 🖥️ List of Clients

- **Customer Portal:** *Application for users to register for international language courses in various countries, upload required documents, and track application status, solving the problem of a complicated registration process and lack of transparency.*


- **Manager Portal:** *Application for administrators to manage educational programs, user data, and documents in real time, eliminating difficulties related to manual administration and lack of centralized data.*



## 🏗️ List of Microservices

- **Gateway Service:** *Acts as the single entry point, handling routing, request validation and load balancing across internal services.*


- **Identity Service:** *Handles authentication, authorization, JWT/refresh token lifecycle, role management, password hashing and security policies.*


- **Storage Service:** *Manages secure binary file storage using MinIO, including validation, size checks and malicious-content protection.*


- **Account Service:** *Stores and manages user account data, personal details, and selected program information.*


- **Course Service:** *Manages educational programs, languages, schools and related administrative datasets.*


- **Progress Service:** *Tracks and updates user application progress in real time across all registration stages.*


- **MailSender Service:** *Asynchronous email dispatching for internal services through RabbitMQ (e.g., notifications, system messages).*





## 🔍️ Microservices diagram

![Microservices diagram](https://github.com/gitEugeneL/LinguaPass/blob/dev/Presentation/microservices-diagram.png)

## 🐳 List of Docker Containers

- **gateway.service** – *reverse proxy gateway (YARP) container.*


- **rabbitmq** – *message broker container for asynchronous communication.*


- **minio** – *object storage container for binary file handling.*


- **identity.service** – *ASP.NET Core container for the Identity microservice.*


- **identity.database** – *PostgreSQL database container for the Identity service.*


- **account.service** – *ASP.NET Core container for the Account microservice.*


- **account.database** – *PostgreSQL database container for the Account service.*


- **course.service** – *ASP.NET Core container for the Course microservice.*


- **course.database** – *PostgreSQL database container for the Course service.*


- **progress.service** – *ASP.NET Core container for the Progress microservice.*


- **progress.database** – *PostgreSQL database container for the Progress service.*


- **storage.service** – *ASP.NET Core container for the Storage microservice (MinIO integration).*


- **mail-sender.service** – *ASP.NET Core container for the asynchronous email dispatching microservice.*


- customer-portal.frontend – React frontend container for the Customer Portal.


- manager-portal.frontend – React frontend container for the Manager Portal.


## 🩺 How to run tests

*Allows you to run all integration and unit tests.*

   ```sh
   > dotnet test  # donet SKD is required
   ```


## 🚀 How to run the application

***make*** commands work on Linux/macOS. Alternatively, Docker Compose can be used.

### 🌐 Backend

| Action                | Make                              | Docker Compose                                                  |
| --------------------- |-----------------------------------| --------------------------------------------------------------- |
| Build                 | `make build-backend`              | `docker compose -f docker-compose.backend.yml build --no-cache` |
| Start                 | `make up-backend`                 | `docker compose -f docker-compose.backend.yml up --build`       |
| Stop                  | `make down-backend`               | `docker compose -f docker-compose.backend.yml down`             |
| Stop & remove volumes | `make down-backend-clean-volumes` | `docker compose -f docker-compose.backend.yml down -v`          |

### 🖥️ Frontend

| Action | Make                  | Docker Compose                                                   |
| ------ | --------------------- | ---------------------------------------------------------------- |
| Build  | `make build-frontend` | `docker compose -f docker-compose.frontend.yml build --no-cache` |
| Start  | `make up-frontend`    | `docker compose -f docker-compose.frontend.yml up`               |
| Stop   | `make down-frontend`  | `docker compose -f docker-compose.frontend.yml down`             |


## 🧪 Test Data

SQL scripts automatically create tables and populate databases with test data when Docker containers start.

| Role          | URL                                                                | Login           | Password     |
|---------------|--------------------------------------------------------------------| --------------- | ------------ |
| Administrator | [http://localhost:5174](http://localhost:5174) *(Manager portal)*  | `admin@dev.com` | `devDev123!` |
| User          | [http://localhost:5173](http://localhost:5173) *(Customer portal)* | `dev@dev.com`   | `devDev123!` |


## 💾 Database diagrams


- Account.database **(*Account.service*)**

![Account database](https://github.com/gitEugeneL/LinguaPass/blob/dev/Presentation/databases/account.database.png?raw=true)

- Course.database **(*Course.service*)**

![Course database](https://github.com/gitEugeneL/LinguaPass/blob/dev/Presentation/databases/course.database.png?raw=true)

- Identity.database **(*Identity.service*)**

![Identity database](https://github.com/gitEugeneL/LinguaPass/blob/dev/Presentation/databases/identity.database.png?raw=true)

- Progress.database **(*Progress.service*)**

![Progress database](https://github.com/gitEugeneL/LinguaPass/blob/dev/Presentation/databases/progress.database.png?raw=true)

- MinIO Storage **(*Storage.service*)**

![MinIO Storage](https://github.com/gitEugeneL/LinguaPass/blob/dev/Presentation/databases/storage.png?raw=true)


## 🎡️ Clients screenshots

