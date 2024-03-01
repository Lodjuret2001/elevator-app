import ElevatorControllers from "../controllers/ElevatorControllers.js";
import express from "express";
const router = express.Router();

router.get("/elevator", ElevatorControllers.getAllElevators);
router.get("/elevator/:id", ElevatorControllers.getOneElevator);
router.put("/elevator", ElevatorControllers.callAllElevators);
router.put("/elevator/:id", ElevatorControllers.callOneElevator);

export { router as elevatorRoutes };
