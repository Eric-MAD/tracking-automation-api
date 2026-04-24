import express from "express";
import { createEcommerceSetup } from "../controllers/ecommerceBaseTags.controller.js";

const ecommerceTemplateRouter = express.Router();
ecommerceTemplateRouter.post("/setup", createEcommerceSetup);

export default ecommerceTemplateRouter;