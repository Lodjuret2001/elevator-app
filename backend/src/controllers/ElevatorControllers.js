import {
  findClosestElevatorTo,
  changeElevatorStatus,
  calculateTravelTime,
  moveElevator,
  resetElevator,
} from "../utils/validationFunctions.js";
import {
  getElevatorWithId,
  updateElevator,
  getElevators,
} from "../utils/databaseFunctions.js";
import { updateElevatorStatus } from "../utils/commands.js";

const ElevatorControllers = {
  getAllElevators: async (req, res) => {
    let sql = "SELECT * FROM elevators";
    const elevators = await getElevators(sql);
    res.send(elevators);
  },

  getOneElevator: async (req, res) => {
    const id = req.params.id;
    const result = await getElevatorWithId(id);
    res.send(result);
  },

  callAllElevators: async (req, res) => {
    try {
      const floors = req.body;
      if (!Array.isArray(floors) || floors.length === 0) {
        return "Invalid floors...";
      }

      const results = await Promise.all(
        floors.map(async (floor) => {
          if (isNaN(floor) || floor > 10 || floor <= 0)
            return `ERROR! Given floor was not found!`;

          let elevator = await findClosestElevatorTo(floor);

          if (elevator.currentFloor === floor) {
            elevator = await resetElevator(elevator, floor);

            console.log(
              `Elevator ${elevator.id} is already at floor ${floor}...`
            );
            return `Elevator ${elevator.id} is already at floor ${floor}...`;
          }

          elevator = await changeElevatorStatus(elevator);

          const travelTime = calculateTravelTime(elevator, floor);
          await moveElevator(travelTime);

          elevator = await resetElevator(elevator, floor);

          console.log(
            `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
          );
          return `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`;
        })
      );

      res.send(results);
    } catch (error) {
      console.error(error.message);
    }
  },

  callOneElevator: async (req, res) => {
    try {
      const toFloor = parseInt(req.body.data);
      if (isNaN(toFloor) || toFloor > 10 || toFloor <= 0)
        return res.status(400).send(`ERROR! Given floor was not found!`);

      const id = parseInt(req.params.id);

      let sql = `UPDATE elevators SET destinationFloor = ${toFloor} WHERE id = ${id}`;
      await updateElevator(sql);

      let elevator = await getElevatorWithId(id);

      if (elevator.currentFloor === toFloor) {
        elevator = await resetElevator(elevator, toFloor);

        console.log(
          `Elevator ${elevator.id} is already at floor ${toFloor}...`
        );
        return res
          .status(400)
          .send(`Elevator ${elevator.id} is already at floor ${toFloor}...`);
      }

      elevator = await changeElevatorStatus(elevator);

      const travelTime = calculateTravelTime(elevator, toFloor);
      await moveElevator(travelTime);

      elevator = await resetElevator(elevator, toFloor);

      console.log(
        `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
      );
      res.send(elevator);
    } catch (error) {
      console.error(error.message);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, destinationFloor } = req.body;
      const result = await updateElevatorStatus(id, status, destinationFloor);
      res.send(result);
    } catch (error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  },
};

export default ElevatorControllers;
