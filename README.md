
# Dental Scheduling Backend

This is the backend application for the **Dental Scheduling System** built using **Node.js** and **MongoDB**. It handles API requests for managing dentist schedules, appointments, and user authentication. This app can be deployed locally or on cloud platforms such as AWS EC2, DigitalOcean, etc.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)
- **Git** for cloning the repository
- **Docker** (Optional, for Docker-based deployments)

---

## Installation

To get started with the backend:

1. Go to backend folder:
    ```bash
    cd dental-scheduling-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project to store environment variables (example below).

### Example `.env` File

```env
MONGO_URI=mongodb://localhost:27017/dental_scheduling
JWT_SECRET=your-secret-key
```

## Configuration

1.  **MONGO_URI**: The MongoDB URI used to connect to your MongoDB instance. This can be a local instance or a MongoDB Atlas URI.
    
2.  **PORT**: The port number on which the backend will run (default is 3000).
    
3.  **JWT_SECRET**: Secret key for signing JWT tokens (for user authentication).
    

## Running Locally

Once you have installed the dependencies and configured the `.env` file, you can run the backend server locally:

1.  Start the application:
    
    `npm start` 
    
2.  The server should now be running on http://localhost:3000.
    

----------

## API Endpoints

### 1. **User Authentication**

-   **POST** `/api/register` — Register a new user
    
-   **POST** `/api/login` — Login with username and password
    
-   **PUT** `/api/users` — Update user

-   **GET** `/api/users` — Retrieve users
    

### 2. **Dentist Management**

-   **GET** `/api/dentists` — Retrieve all dentists

-   **GET** `/api/dentists/:id` — Retrieve data of dentist by id
    
-   **POST** `/api/dentists` — Add a new dentist
    
-   **PUT** `/api/dentists/:id` — Update an existing dentist by ID
    
-   **DELETE** `/api/dentists/:id` — Delete a dentist by ID
    

### 3. **Appointment Management**

-   **GET** `/api/appointments` — Retrieve all appointments
    
-   **POST** `/api/appointments` — Schedule a new appointment
    
-   **PUT** `/api/appointments/:id` — Update an appointment
    
-   **DELETE** `/api/appointments/:id` — Cancel an appointment

## Docker

To run this application inside Docker:

### 1. Create a `Dockerfile`

Here's a `Dockerfile` that will build and run your Node.js backend:

```Use an official Node.js runtime as the base image
FROM node:18-alpine

#Set the working directory
WORKDIR /app

#Copy package.json and package-lock.json
COPY package*.json ./

#Install the app dependencies
RUN npm install

#Copy the rest of the application
COPY . .

#Expose the application port
EXPOSE 3000

#Run the app
CMD ["npm", "start"]
```

### 2. Build the Docker image

`docker build -t dental-scheduling-backend .` 

### 3. Run the Docker container

`docker run -p 3000:3000 -e MONGO_URI=mongodb://localhost:27017/dental_scheduling -e JWT_SECRET=your-secret-key dental-scheduling-backend` 

This will start the application inside a Docker container, making it accessible on `http://localhost:3000`.
