import pg from 'pg'
import bcrypt from 'bcrypt'
const {Pool} = pg

const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'neiro_task'
})

async function createAdmin(password: string) {
    const user = await db.query('SELECT * FROM "user" WHERE "role" = $1', ['admin'])
    if(user.rows.length) {
    await db.query('DELETE FROM "token" WHERE "userId" = $1', [user.rows[0].id])
    }
    await db.query('DELETE FROM "user" WHERE "role" = $1', ['admin'])
    const hashPassword = await bcrypt.hash(password, 3)
    const data = await db.query('INSERT INTO "user" (email, password, credits, pass_code, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['admin@mail.com', hashPassword, 999999999, 0, 'admin'])
    console.log(data.rows[0])
}


createAdmin('micha777')