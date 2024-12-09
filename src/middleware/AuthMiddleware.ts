import { NextFunction } from "express"
import ApiError from "../error/ApiError"
import TokenService from "../services/TokenService"




export default function(req: any, res: any, next: NextFunction) {
    try {
        const authToken = req.headers.authorization
        console.log(authToken)
        if(!authToken) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authToken.split(' ')[1]
        if(!accessToken) {
            console.log('no token 1')
            return next(ApiError.UnauthorizedError())
        }


        const userData = TokenService.verifyAccessToken(accessToken)
        if(!userData) {
            console.log('no token 2')
            return next(ApiError.UnauthorizedError())
        }
        console.log(userData)
        req.user = userData
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}