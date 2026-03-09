import express from "express";
import { getTemplates, createTemplate } from "../controllers/templates.controller.js";

const templateRoutes = express.Router();

templateRoutes.get("/", getTemplates);
templateRoutes.post("/", createTemplate);

export default templateRoutes;