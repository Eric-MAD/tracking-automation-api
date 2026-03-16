import express from "express"
import { listGoogleAccounts } from "../controllers/googleListAccount.controller.js"
import { createTestTag, getTagsDiagnostic, getTriggersDiagnostic } from "../controllers/googleTagManager.controller.js"

const googleRouter = express.Router()

googleRouter.get("/accounts", listGoogleAccounts)
googleRouter.post("/tags", createTestTag);
googleRouter.get("/tags/diagnostic", getTagsDiagnostic);
googleRouter.get("/triggers/diagnostic", getTriggersDiagnostic);

export default googleRouter;