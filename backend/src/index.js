import express from "express";
const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password_here",
  database: "elevator_db",
});

db.connect(async (err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database...");
});

//HTTP-REQ & createDB routes

import { databaseRoutes } from './routes/databaseRoutes.js';
import { elevatorRoutes } from './routes/elevatorRoutes.js';

app.use(databaseRoutes);
app.use(elevatorRoutes);

//Elevator Commands

import {
  getElevatorStatus,
  callElevatorToFloor,
  callMultipleElevatorToFloors,
  updateElevatorStatus,
  isElevatorAvailable,
} from "./utils/commands.js";

async function run() {
  // await getElevatorStatus();
  // await callElevatorToFloor(1);
  // await updateElevatorStatus(1, 'idle', 0);
  // await updateElevatorStatus(2, 'idle', 0);
  // await updateElevatorStatus(3, 'idle', 0);
  // await getElevatorStatus();
  // await isElevatorAvailable(2);
  // await isElevatorAvailable(3);
  // await callMultipleElevatorToFloors([1, 2, 3, 4, 5, 6]);
  // await callMultipleElevatorToFloors([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  // await callMultipleElevatorToFloors([8, 8, 8]);
}

run();

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));

export { db };
