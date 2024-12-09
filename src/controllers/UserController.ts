import ApiError from '../error/ApiError'
import UserService from '../services/UserService'
import { validationResult } from 'express-validator'
import {Request, Response, NextFunction} from 'express'
class UserController {
    static async registration(req: any, res: any, next: NextFunction) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Произошла ошибка валидации данных!", errors))
            }
            const {email, password} = req.body
            const user = await UserService.registration(email, password)
            return res.status(200).json(user)
        } catch (error) {
            return next(error)
          
        }
    }

    static async login(req: any, res: any, next: NextFunction) {
        try {
            const {email, password} = req.body
            const platform = req.useragent?.platform || 'unknown'
            const login = await UserService.login(email, password, platform)
            if(!login.tokens) {
                return res.status(200).json(login)
            }
            res.cookie('refreshToken', login.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.cookie('deviceId', login.tokens.deviceId, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json(login)
        } catch (error) {
            return next(error)
        }
    }

    static async logout(req: any, res: any, next: NextFunction) {
        try {
            const {refreshToken, deviceId} = req.cookies;
            console.log(req.cookies)
            await UserService.logout(refreshToken, deviceId)
            res.clearCookie('refreshToken')
            res.clearCookie('deviceId')
            console.log('clear cookioe')
            return res.status(200).json({status: "ok"})
        } catch (error) {
            return next(error)
        }
    }

    static async activation(req: any, res: any, next: NextFunction) {
        try {
            const errors = validationResult(req)
            
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Пароль должен содержать не менее 5 символов!", errors))
            }
            const {code, email} = req.body
            const platform = req.useragent?.platform || 'unknown'
            console.log(email)
            const userData = await UserService.activation(email, code, platform)
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.cookie('deviceId', userData.tokens.deviceId, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json(userData)
        } catch (error) {
            return next(error)
        }
    }

    static async refresh(req: any, res: any, next: NextFunction) {
        try {
            const {refreshToken, deviceId} = req.cookies
            const platform = req.useragent?.platform || 'unknown'
            const userData = await UserService.refresh(refreshToken, deviceId, platform)
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json(userData)
        } catch (error) {
            return next(error)
        }
    }

    static async forgotPassword(req: any, res: any, next: NextFunction) {
        try {
            const errors = validationResult(req)
            
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Пароль должен содержать не менее 5 символов!", errors))
            }
            const {email} = req.body
            const user = await UserService.updateForgotPassword(email)
            return res.status(200).json(user)
        } catch (error) {
            return next(error)
        }
    }

    static async forgotPasswordFinish(req: any, res: any, next: NextFunction) {
        try {
            const errors = validationResult(req)
            
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Пароль должен содержать не менее 5 символов!", errors))
            }
            const {email, password, pass_code} = req.body
            const userData = await UserService.updateForgotPasswordFinish(email, pass_code, password)
            return res.status(200).json(userData)
        } catch (error) {
            return next(error)
        }
    }

    static async updatePassword(req: any, res: any, next: NextFunction) {
        try {
            const errors = validationResult(req)
            
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest("Пароль должен содержать не менее 5 символов!", errors))
            }
            const {id} = req.user
            const {oldPassword, newPassword} = req.body
            const user = await UserService.updatePassword(id, oldPassword, newPassword)
            return res.status(200).json(user)
        } catch (error) {
            return next(error)
        }
    }

}

export default UserController