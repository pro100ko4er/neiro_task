import { NextFunction } from "express";
import AdminService from "../services/AdminService";

export default class AdminController {
    static async addCredits(req: any, res: any, next: NextFunction) {
        try {
            const {userId, count} = req.body
            const result = await AdminService.addCredits(userId, count)
            return res.status(200).json(result)
        } catch (error) {
            return next(error)
        }
         
    }

    static async decrementCredits(req: any, res: any, next: NextFunction) {
        try {
            const {userId, count} = req.body
            const result = await AdminService.decrementCredits(userId, count)
            return res.status(200).json(result)
        } catch (error) {
            return next(error)
        }
         
    }

    static async getUsers(req: any, res: any, next: NextFunction) {
        try {
            const {limit, page} = req.params
            const result = await AdminService.getUsers(limit, page)
            return res.status(200).json(result)
        } catch (error) {
            return next(error)
        }
    }
}