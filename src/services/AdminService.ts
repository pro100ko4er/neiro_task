import UserDto from "../dtos/UserDto";
import db from "../db";

export default class AdminService {
    static async addCredits(userId: number, count: number) {
        const result = await db.query('UPDATE "user" SET credits = credits + $1 WHERE id = $2 RETURNING *', [count, userId])
        const userDto = new UserDto(result.rows[0])
        return userDto
    }

    static async decrementCredits(userId: number, count: number) {
        const result = await db.query('UPDATE "user" SET credits = credits - $1 WHERE id = $2 RETURNING *', [count, userId])
        const userDto = new UserDto(result.rows[0])
        return userDto
    }
    
    static async getUsers(limit: string, page: string) {
        const offset = Number(page) * Number(limit)
        const result = await db.query('SELECT id, email, credits, verifyed, role FROM "user" LIMIT $1 OFFSET $2', [limit, offset.toString()])
        return result.rows
    }
}