import express from "express"
import { listGoogleAccounts } from "../controllers/googleListAccount.controller.js"

const googleRouter = express.Router()

googleRouter.get("/accounts", listGoogleAccounts)

export default googleRouter;