import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2/promise'

const router = express.Router()
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.get("/", async (req, res) => {
    try {

        const connection = await pool.getConnection()
        const [rows] = await connection.query("SELECT * FROM IMAGE;")
        connection.release()
        res.json(rows)

    } catch (error) {
        console.error("Error retrieving images: ", error)
        res.status(500).json({ error: "Internal Server Error"})
    }
});

export default router;