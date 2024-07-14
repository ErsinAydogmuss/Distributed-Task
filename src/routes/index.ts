import { Router } from "express";
import taskRoutes from "./task";

const rootRouter: Router = Router();

rootRouter.use("/task", taskRoutes);

export default rootRouter;
