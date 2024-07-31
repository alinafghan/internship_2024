# Project Name

## Overview

This project is a web application built with the following technologies:

- **Backend**: .NET Web API framework using Clean Architecture (API, Application, Domain, and Infrastructure layers).
- **Database**: Microsoft SQL Server.
- **Frontend**: React with Shadcn components library and Tailwind CSS.
- **Configuration**: JavaScript config.

## Architecture

- **API Layer**: Handles HTTP requests and responses.
- **Application Layer**: Contains business logic and application services.
- **Domain Layer**: Defines the core business entities and domain logic.
- **Infrastructure Layer**: Manages data access, external services, and other infrastructure concerns.

## Setup

### Backend

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. Restore the dependencies:
  ```bash
 dotnet restore


3.Update the database connection string in appsettings.json if necessary.

4.Apply migrations to the database:
```bash
 dotnet ef database update

5.Run the backend application:
```bash
dotnet run

###Frontend

1.Navigate to the frontend directory 

```bash
cd frontend

2. install dependencies
```bash
npm install 

3.start the frontend application
```bash
npm start


##Schema

##Development

Backend: Make sure to follow Clean Architecture principles while adding features or fixing bugs.
Frontend: Use Shadcn components and Tailwind CSS for UI development. JavaScript config should be used for any frontend configurations.


