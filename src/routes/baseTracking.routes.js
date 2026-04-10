import express from "express"
import { setupBaseTrackingController } from "../controllers/baseTracking.controller.js"

const baseTrackingRouter = express.Router();
baseTrackingRouter.post("/setup", setupBaseTrackingController);

export default baseTrackingRouter;