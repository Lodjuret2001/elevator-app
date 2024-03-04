# Backend Elevator System

The Elevator Control System backend is built using Node.js and Express.js. It connects to a MySQL database to store elevator data and handles various API endpoints for controlling elevators.

## Prerequisites

Before starting, make sure you have read the [README](../README.md) located in the root folder.

## Setting up MySQL Database

1. Make sure MySQL is installed and running on your system.

2. Navigate to the `src` directory and open the `index.js` file.

3. Remove or comment out the line `database: "elevator_db"` temporarily.

4. Start the server:

   ```bash
   node index.js
   ```

- The server will be running at `http://localhost:3000`.

5. Send a GET request to the `/create-database` endpoint:

   ```bash
   curl http://localhost:3000/create-database
   ```

6. Once the database is created, uncomment the line `database: "elevator_db"` in the `index.js` file.

## Endpoints

- **GET /create-database**: Creates the MySQL database for the Elevator Control System.
- **GET /create-table**: Creates the necessary tables in the database.
- **GET /create-elevators**: Inserts sample elevator data into the database.
- **GET /all-elevators**: Retrieves all elevators from the database.
- **GET /elevator/:id**: Retrieves a single elevator by ID.
- **PUT /elevator**: Finds the closest elevator to specified floors.
- **PUT /elevator/:id**: Updates a single elevator to a specified floor.
- **PUT /elevator/status/:id**: Updates the status of a single elevator.
