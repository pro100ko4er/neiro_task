import jwt from "jsonwebtoken";
import db from '../db/index'
import UserDto from "../dtos/UserDto";
import dotenv from 'dotenv'
dotenv.config()
class TokenService {
    static jwt_access = process.env.JWT_ACCESS_KEY || ''
    static jwt_refresh = process.env.JWT_REFRESH_KEY || ''
    static generateTokens(payload: UserDto) {
        console.log("access " + this.jwt_access)
        console.log("refresh " + this.jwt_refresh)
        process.env.JWT_REFRESH_KEY
        const accessToken = jwt.sign(payload, this.jwt_access, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, this.jwt_refresh, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    static verifyAccessToken(token: string) {
        const verify = jwt.verify(token, this.jwt_access)
        return verify
    }

    static verifyRefreshToken(token: string) {
        const verify = jwt.verify(token, this.jwt_refresh)
        return verify as UserDto
    }

    static async findToken(refreshToken: string, deviceId: string) {
        const token = await db.query('SELECT * FROM token WHERE "refreshToken" = $1 and "deviceId" = $2', [refreshToken, deviceId])
        return token.rows[0]
    }

    static async findTokenToIdUserAndDeviceId(userId: number, deviceId: string) {
        const token = await db.query('SELECT * FROM token WHERE "userId" = $1 and "deviceId" = $2', [userId, deviceId])
        return token.rows[0]
    }

    static async saveToken(userId: number, refreshToken: string, deviceId: string, device: string) {
        const findToken = await this.findTokenToIdUserAndDeviceId(userId, deviceId)
        if(findToken) {
            console.log('token finded')
            // if(!findToken.device || findToken.device === 'unknown') {
            //     await this.removeToken(findToken.refreshToken)
            // }
            const token = (await db.query('UPDATE token SET "refreshToken" = $1 WHERE "userId" = $2 RETURNING *', [refreshToken, userId])).rows[0]
            return token
        }
        console.log(refreshToken)
        const token = await db.query('INSERT INTO "token" ("userId", "refreshToken", "deviceId", "device") VALUES($1, $2, $3, $4) RETURNING *', [userId, refreshToken, deviceId, device])
        console.log(token.rows[0])
        return token.rows[0]
    }

    static async removeToken(refreshToken: string, deviceId: string) {
        console.log('remove token')
        const token = (await db.query('DELETE FROM token WHERE "refreshToken" = $1 AND "deviceId" = $2', [refreshToken, deviceId])).rows[0]
        console.log(token)
        return token
    }


}

export default TokenService