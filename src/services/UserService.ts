import db from '../db/index'
import TokenDto from '../dtos/TokenDto'
import UserDto from '../dtos/UserDto'
import ApiError from '../error/ApiError'
import MailService from './MailService'
import TokenService from './TokenService'
import bcrypt from 'bcrypt'
class UserService {

    static genPassCode() {
        const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        return code
    }

    static genUniqId(len: number) {
            let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ1234567890';
            var str = '';
            for (var i = 0; i < len; i++) {
                var pos = Math.floor(Math.random() * chrs.length);
                str += chrs.substring(pos,pos+1);
            }
            return str;
    }

    static async registration(email: string, password: string) {
        console.log(0)
        const validEmail = await this.findUserToEmail(email)
        console.log(validEmail)
        if(validEmail) {
            throw ApiError.BadRequest("Такой пользователь уже есть!")
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const pass_code = this.genPassCode()
        console.log(1)
        await db.query('INSERT INTO "user" (email, password, credits, pass_code, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, hashPassword, 3000, pass_code, 'user'])
        console.log(2)
        const findUser = await UserService.findUserToEmail(email)
        if(!findUser) {
            throw ApiError.BadRequest("Произошла ошибка при регистрации! Попробуйте позже")
        }
        const user = await UserService.sendActivationCode(findUser.id)
        return user
    }

    static async login(email: string, password: string, device: string) {
        const find = await this.findUserToEmail(email)
        if(find) {
            const verifyPass = await bcrypt.compare(password, find.password)
            if(!verifyPass) {
                throw ApiError.BadRequest("Логин или пароль неверны!")
            }
            if(!find.verifyed) {
                const user = await UserService.sendActivationCode(find.id)
                return {
                    user
                }
            }
            const userDto = new UserDto(find)
            const token = TokenService.generateTokens({...userDto})
            const deviceid = this.genUniqId(64)
            const tokens = await TokenService.saveToken(userDto.id, token.refreshToken, deviceid, device)
            const tokensDto = new TokenDto(tokens, token.accessToken)
            return {
                tokens: tokensDto,
                user: userDto
            }
        }
        throw ApiError.BadRequest("Аккаунта с такой почтой не найдено!")
    }

    static async logout(refreshToken: string, deviceId: string) {
        const token = await TokenService.removeToken(refreshToken, deviceId)
        return token
    }

    static async activation(email: string, code: number, device: string) {
        console.log(4)
        const userCode = await this.findUserToEmail(email)
        console.log(email, code)
        if(userCode.pass_code !== Number(code) || !code || userCode.pass_code === 0) {
            console.log(code)
            throw ApiError.BadRequest("Неверный код!")
        }
        const userData = await this.activateUser(userCode.id)
        const userDto = new UserDto(userData)
        console.log(userData)
        console.log(userDto)
        const token = TokenService.generateTokens({...userDto})
        const deviceId = this.genUniqId(64)
        const tokens = await TokenService.saveToken(userDto.id, token.refreshToken, deviceId, device)
        const tokenDto = new TokenDto(tokens, token.accessToken)
        console.log(tokens)
        return {
            tokens: tokenDto,
            user: userDto
        }
    }

    static async sendActivationCode(userId: number) {
        const findUser = await this.findUserToId(userId)
        if(!findUser) {
            throw ApiError.BadRequest("Пользователь не найден!")
        }
        const pass_code = this.genPassCode()
        const user = (await db.query('UPDATE "user" set pass_code = $1 WHERE "id" = $2 RETURNING *', [pass_code, userId])).rows[0]
        await new MailService().sendMail(user.email, `Код авторизации аккаунта Neiro_task: ${pass_code}`)
        const userDto = new UserDto(user, "Вы успешно зарегистрированы! Код для подтверждения отправлен на почту",)
        return userDto
    }

    static async refresh(refreshToken: string, deviceId: string, device: string) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.verifyRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken, deviceId)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        console.log(userData)
        const user = await this.findUserToId(userData.id)
        const userDto = new UserDto(user)
        const token = TokenService.generateTokens(user)
        const token_save = await TokenService.saveToken(userDto.id, token.refreshToken, deviceId, device)
        const tokens = new TokenDto(token_save, token.accessToken)
        return {
            tokens,
            user: userDto
        }
    }

    static async updateForgotPassword(email: string) {
        const find = await this.findUserToEmail(email)
        if(find) {
            const userData = await this.sendActivationCode(find.id)
            return userData
        }
        throw ApiError.BadRequest("Пользователь не найден!")
    }

    static async updateForgotPasswordFinish(email: string, pass_code: number, password: string) {
        const find = await this.findUserToEmail(email)
        if(find) {
            if(find.pass_code === pass_code && find.pass_code !== 0) {
                const hashPassword = await bcrypt.hash(password, 3)
                const update = await db.query('UPDATE "user" SET "password" = $1 WHERE email = $2 RETURNING *', [hashPassword, email])
                const userDto = new UserDto(update.rows[0], "Пароль успешно изменен!")
                return userDto
            }
            throw ApiError.BadRequest("Неверный код!")
        }
        throw ApiError.BadRequest("Пользователь не найден!")
    }

    static async updatePassword(id: number, oldPassword: string, newPassword: string) {
        const find = await this.findUserToId(id)
        if(find) {
            const verify_password = await bcrypt.compare(oldPassword, find.password)
            if(!verify_password) {
                throw ApiError.BadRequest("Неверный старый пароль")
            }
            const password = await bcrypt.hash(newPassword, 3)
            const userData = await db.query('UPDATE "user" SET password = $1 WHERE "id" = $2 RETURNING *', [password, id])
            console.log(userData)
            const userDto = new UserDto(userData.rows[0], "Пароль успешно изменен!")
            return userDto
        }
        throw ApiError.BadRequest("Пользователь не найден")
    }


    static async findUserToEmail(email: string) {
        const find = (await db.query('SELECT * FROM "user" WHERE "email" = $1', [email])).rows[0]
        return find
    }

    static async findUserToId(id: number) {
        const find = (await db.query('SELECT * FROM "user" WHERE "id" = $1', [id])).rows[0]
        return find
    }

    static async findUserToPassCode(code: number) {
        const find = (await db.query('SELECT * FROM "user" WHERE pass_code = $1', [code])).rows[0]
        return find
    }

    static async activateUser(userId: number) {
        const activate = (await db.query('UPDATE "user" SET "verifyed" = true, "pass_code" = $1 WHERE "id" = $2 RETURNING *', [0, userId])).rows[0]
        return activate
    }

    static async setPassCode(email: string, pass_code: number) {
        const find = await this.findUserToEmail(email)
        if(find) {
            const code = (await db.query('UPDATE "user" SET "pass_code" = $1, WHERE email = $2 RETURNING *', [pass_code, email])).rows[0]
            return code
        }
        throw ApiError.BadRequest("Пользователь не найден!")
    }

}


export default UserService