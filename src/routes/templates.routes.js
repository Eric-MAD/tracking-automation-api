import express from "express";
import { getTemplates } from "../controllers/templates.controller.js";

const templateRoutes = express.Router();

templateRoutes.get("/", getTemplates);

export default templateRoutes;