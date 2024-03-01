import {
  getElevatorWithId,
  getElevators,
  updateElevator,
} from "./databaseFunctions.js";

import AsyncLock from "async-lock";
const lock = new AsyncLock();

async function findClosestElevatorTo(floor) {
  const release = await lock.acquire("elevator-lock", async () => {
    try {
      const availableElevators = await findIdleElevator();

      let closestElevator = calculateDistance(availableElevators, floor);
      console.log(`Found Elevator ${closestElevator.id}`);

      let sql = `UPDATE elevators SET destinationFloor = ${floor} WHERE id = ${closestElevator.id}`;
      await updateElevator(sql);

      closestElevator = await getElevatorWithId(closestElevator.id);

      return closestElevator;
    } catch (error) {
      console.error(error.message);
    }
  });
  return release;
}

async function changeElevatorStatus(elevator) {
  const direction =
    elevator.currentFloor < elevator.destinationFloor ? "up" : "down";
  const update = `moving_${direction}`;

  let sql = `UPDATE elevators SET status = '${update}' WHERE id = ${elevator.id}`;
  await updateElevator(sql);

  console.log(
    `Elevator ${elevator.id} is moving ${direction} to floor ${elevator.destinationFloor}!`
  );

  return await getElevatorWithId(elevator.id);
}

function calculateTravelTime(elevator, floor) {
  //Each floor takes 3 seconds to travel
  const floorsToTravel = Math.abs(elevator.currentFloor - floor);
  return floorsToTravel * 3000;
}

async function moveElevator(travelTime) {
  console.log(`Waiting for ${travelTime / 1000} seconds`);
  await delay(travelTime);
}

async function resetElevator(elevator, floor) {
  let sql = `UPDATE elevators SET status = 'idle', currentFloor = ${floor}, destinationFloor = 0 WHERE id = ${elevator.id}`;
  await updateElevator(sql);

  return await getElevatorWithId(elevator.id);
}

//Functions that should not be exported

async function findIdleElevator() {
  return new Promise((resolve, reject) => {
    const timeLoop = setInterval(async () => {
      try {
        console.log("Searching for elevators...");

        let sql = "SELECT * FROM elevators WHERE destinationFloor = 0";

        const idleElevator = await getElevators(sql);

        if (idleElevator.length > 0) {
          clearInterval(timeLoop);
          resolve(idleElevator);
        }
      } catch (error) {}
    }, 2000);
  });
}

function calculateDistance(elevators, floor) {
  let closestElevator = null;
  let shortestDistance = 11; // Greater than the maximum floor (10)

  for (let elevator of elevators) {
    const distance = Math.abs(elevator.currentFloor - floor);

    if (distance < shortestDistance) {
      closestElevator = elevator;
      shortestDistance = distance;
    }
  }
  return closestElevator;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export {
  changeElevatorStatus,
  calculateTravelTime,
  moveElevator,
  resetElevator,
  findClosestElevatorTo,
};
