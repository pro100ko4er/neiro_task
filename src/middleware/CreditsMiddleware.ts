import { NextFunction } from "express";
import ApiError from "../error/ApiError";

export default async function (req: any, res: any, next: NextFunction) {
    console.log(req.body)
    const {credits} = req.user
    if(credits < req.body.content) {
        return next(ApiError.BadRequest('У вас недостаточно кредитов!'))
    }
    next()
}