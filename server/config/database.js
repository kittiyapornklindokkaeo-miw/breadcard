require('dotenv').config()
const mysql = require('mysql2/promise')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const sessionStore = new MySQLStore({}, db)

db.getConnection()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection failed: ', err))

module.exports = { db, sessionStore }