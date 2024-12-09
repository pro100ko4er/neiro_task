import express from "express";
import AdminController from "../controllers/AdminController";
import AuthMiddleware from "../middleware/AuthMiddleware";
import RoleMiddleware from "../middleware/RoleMiddleware";

const adminRouter = express()

adminRouter.post('/balance/increment', AuthMiddleware, RoleMiddleware, AdminController.addCredits)
adminRouter.post('/balance/decrement', AuthMiddleware, RoleMiddleware, AdminController.decrementCredits)
adminRouter.get('/users/all/:page/:limit', AuthMiddleware, RoleMiddleware, AdminController.getUsers)



export default adminRouter