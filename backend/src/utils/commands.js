import axios from "../config/axiosConfig.js";

import {
  getElevatorWithQuery,
  getElevators,
  updateElevator,
} from "./databaseFunctions.js";

async function getElevatorStatus() {
  let sql = "SELECT id, status, currentFloor FROM elevators";
  const result = await getElevators(sql);

  console.log("Elevators status:");
  for (const elevator of result) {
    console.log(
      `id: ${elevator.id}, status: ${elevator.status}, currentFloor: ${elevator.currentFloor}`
    );
  }
}

function callElevatorToFloor(floor) {
  try {
    axios.put("elevator/:id", { floor });
  } catch (error) {
    console.error(error.message);
  }
}

function callMultipleElevatorToFloors(floors) {
  //floors must be an array of numbers
  try {
    for (let floor of floors) {
      axios.put("/elevator", { floor });
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function updateElevatorStatus(id, status, destinationFloor) {
  let sql = `UPDATE elevators SET status = '${status}', destinationFloor = ${destinationFloor} WHERE id = ${id}`;
  await updateElevator(sql);

  console.log(`Updated Elevator ${id} statuses successfully...`);
}

async function isElevatorAvailable(id) {
  let sql = `SELECT * FROM elevators WHERE id = ${id} AND status = 'idle'`;
  const result = await getElevatorWithQuery(sql);

  if (!result) return console.log(`Elevator with id ${id} was not found`);
  console.log(`Elevator ${id} is available...`);
}

export {
  getElevatorStatus,
  callElevatorToFloor,
  callMultipleElevatorToFloors,
  updateElevatorStatus,
  isElevatorAvailable,
};
