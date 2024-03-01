import DatabaseControllers from '../controllers/DatabaseControllers.js'
import express from "express";
const router = express.Router();

router.get("/create-database", DatabaseControllers.createDatabase);
router.get("/create-table", DatabaseControllers.createTable);
router.get("/create-elevators", DatabaseControllers.createElevators);

export { router as databaseRoutes };
