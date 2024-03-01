# Elevator Control System with MySQL Integration

This project implements a simple elevator control system using Node.js, Express, and MySQL for database storage.

## Setup

1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/Lodjuret2001/elevator-MySQL.git
   ```

2. Navigate to the project directory:
   ```bash
   cd elevator-MySQL
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Execute database setup endpoints:
   - **Create Database**: Replace `<database_name>` with your desired database name and run the following command:
     ```bash
     curl -X GET http://localhost:3000/createdb
     ```
   - **Create Elevators Table**:
     ```bash
     curl -X GET http://localhost:3000/createtable
     ```
   - **Insert Elevators**:
     ```bash
     curl -X GET http://localhost:3000/createelevators
     ```

   *Note: Ensure that you replace `<database_name>` in the database creation step with the desired database name.*

## API Endpoints

### GET Requests

1. **Get All Elevators**
   ```http
   GET /
   ```
   Returns a list of all elevators.

2. **Get Elevator by ID**
   ```http
   GET /elevator/:id
   ```
   Returns information about a specific elevator based on the provided ID.

### PUT Requests

3. **Call Elevator to Floor**
   ```http
   PUT /elevator/call
   ```
   Body:
   ```json
   {
     "floor": 2
   }
   ```

4. **Move Elevator to Floor**
   ```http
   PUT /elevator/move/:id
   ```
   Body:
   ```json
   {
     "floor": 5
   }
   ```

   This endpoint moves the elevator with the specified ID to the specified floor. It updates the destination floor of the elevator and calculates the travel time to reach the floor. Once the elevator arrives at the floor, it resets the elevator's status and updates its current floor accordingly.

### Commands

Some commands have been provided in the index.js. Uncomment and use them as needed.

### Elevator Control Functions

Various utility functions have been implemented to control elevators.

## Notes

- Adjust the base URL in the `createAxios` function.
- Ensure proper setup and dependencies are installed.
- Use provided API endpoints to interact with the elevator control system.

## Contributions

Contributions and feature suggestions are welcome! Feel free to submit a pull request or open an issue on GitHub.