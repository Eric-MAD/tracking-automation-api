import express from "express"
import { googleAuth, googleCallback } from "../controllers/googleAuth.controller.js"

const googleAuthRoutes = express.Router()

googleAuthRoutes.get("/google", googleAuth)
googleAuthRoutes.get("/google/callback", googleCallback)

export default googleAuthRoutes;