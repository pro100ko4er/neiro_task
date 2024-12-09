import { NextFunction } from "express";
import ApiError from "../error/ApiError";
import UserService from "../services/UserService";

export default async function(req: any, res: any, next: NextFunction) {
    const verify = await UserService.findUserToId(req.user.id)
    if(verify.role !== 'admin') {
        return next(ApiError.BadRequest("У вас недостаточно прав!"))
    }
    next()
}