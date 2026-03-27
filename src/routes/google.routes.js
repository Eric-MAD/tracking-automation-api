import express from "express"
import { listGoogleAccounts } from "../controllers/googleListAccount.controller.js"
import { getTagsDiagnostic, getTriggersDiagnostic, handleCreateTrigger, handleCreateTag } from "../controllers/googleTagManager.controller.js"

const googleRouter = express.Router()

googleRouter.get("/accounts", listGoogleAccounts)
googleRouter.post("/tags", handleCreateTag);
googleRouter.get("/tags/diagnostic", getTagsDiagnostic);
googleRouter.get("/triggers/diagnostic", getTriggersDiagnostic);
googleRouter.post("/triggers", handleCreateTrigger);

export default googleRouter;