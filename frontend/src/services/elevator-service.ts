import create from "./http-service";

export interface Elevator {
  id: number;
  currentFloor: number;
  status: string;
  destinationFloor: number;
}

export default create("/elevator");
