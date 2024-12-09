import express from "express"
import UserController from "../controllers/UserController"
import AuthMiddleware from '../middleware/AuthMiddleware'
import { body } from "express-validator"
const userRouter = express()


userRouter.post('/registration', body('email').isEmail(), body('password').isLength({min: 5, max: 32}), UserController.registration)
userRouter.post('/login', UserController.login)
userRouter.post('/activation', body('email').isEmail(), UserController.activation)
userRouter.put('/forgot-password', body('email').isEmail(), UserController.forgotPassword)
userRouter.put('/forgot-password-finish', body('email').isEmail(), body('password').isLength({min: 5, max: 32}), UserController.forgotPasswordFinish)
userRouter.put('/update-password', AuthMiddleware, body('newPassword').isLength({min: 5, max: 32}), UserController.updatePassword)
userRouter.get('/refresh', UserController.refresh)
userRouter.get('/logout', UserController.logout)

export default userRouter