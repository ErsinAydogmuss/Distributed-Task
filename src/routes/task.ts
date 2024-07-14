import { Router } from "express";
import { createTaskController } from "../controllers/task";

const taskRoutes: Router = Router();

taskRoutes.post("/", createTaskController);

export default taskRoutes;
