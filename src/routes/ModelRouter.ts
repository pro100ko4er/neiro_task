import express from "express";
import ModelController from "../controllers/ModelController";
import AuthMiddleware from "../middleware/AuthMiddleware";
import CreditsMiddleware from "../middleware/CreditsMiddleware";

const modelRouter = express()

modelRouter.post('/gpt-4o-mini', AuthMiddleware, CreditsMiddleware, ModelController.gpt4)
modelRouter.post('/gpt-3.5-turbo', AuthMiddleware, CreditsMiddleware, ModelController.gpt35turbo)


export default modelRouter