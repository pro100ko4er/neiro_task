import pg from 'pg'

const {Pool} = pg

const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'neiro_task'
})

export default db