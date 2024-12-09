import { NextFunction, Response, Request} from "express"
import ApiError from "../error/ApiError"


export default function(err: Error, req: any, res: any, next: NextFunction) {
    console.log(err)
    if(err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: "Произошла ошибка сервера"})
}