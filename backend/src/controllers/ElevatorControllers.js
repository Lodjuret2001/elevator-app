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
      const myFloor = parseInt(req.body.floor);
      if (isNaN(myFloor) || myFloor > 10 || myFloor <= 0)
        return res.status(400).send(`ERROR! Given floor was not found!`);

      let elevator = await findClosestElevatorTo(myFloor);

      if (elevator.currentFloor === myFloor) {
        elevator = await resetElevator(elevator, myFloor);

        console.log(
          `Elevator ${elevator.id} is already at floor ${myFloor}...`
        );
        return res.send(
          `Elevator ${elevator.id} is already at floor ${myFloor}...`
        );
      }

      elevator = await changeElevatorStatus(elevator);

      const travelTime = calculateTravelTime(elevator, myFloor);
      await moveElevator(travelTime);

      elevator = await resetElevator(elevator, myFloor);

      console.log(
        `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
      );
      res.send(
        `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
      );
    } catch (error) {
      console.error(error.message);
    }
  },

  callOneElevator: async (req, res) => {
    try {
      const toFloor = parseInt(req.body.floor);
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
        return res.send(
          `Elevator ${elevator.id} is already at floor ${toFloor}...`
        );
      }

      elevator = await changeElevatorStatus(elevator);

      const travelTime = calculateTravelTime(elevator, toFloor);
      await moveElevator(travelTime);

      elevator = await resetElevator(elevator, toFloor);

      console.log(
        `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
      );
      res.send(
        `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
      );
    } catch (error) {
      console.error(error.message);
    }
  },
};

export default ElevatorControllers;
