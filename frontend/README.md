# Frontend Elevator System

The Hotel Elevator System is a web application designed to simulate and manage elevator operations in a hotel setting. This system provides functionalities for calling elevators to specific floors, updating elevator statuses, and managing multiple elevator calls simultaneously.

## Setup Guide

Follow these steps to set up and run the frontend app for the Hotel Elevator System:

### Prerequisites

Before starting, make sure you have read the [README](../README.md) located in the root folder.

### Installation

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Update the Base URL for API Requests:

   - Open the `api-client.ts` file located in the `services` folder.
   - Change the `baseURL` value to match the URL where your backend server is running.

     ```typescript
     import axios from "axios";

     export default axios.create({
       baseURL: "http://localhost:3000", // Change this to your backend server URL
     });
     ```

3. Once the Base URL is updated, you can start the frontend app:

```bash
npm run dev
```

## Components

### 1. ElevatorList Component

- Displays a list of elevators with their current status and destination floor.
- Allows users to move individual elevators to a specified floor.

### 2. ElevatorForm Component

- Allows users to test the system by making multiple floor calls simultaneously.
- Input fields accept a comma-separated list of floors.

### 3. ElevatorStatus Component

- Enables users to manually update the status and destination floor of a selected elevator.
- Provides feedback on the success or failure of the update.

### 4. App Component

- Main component rendering all other components.
- Fetches elevator data from the backend and manages state.
