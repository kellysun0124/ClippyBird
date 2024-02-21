import express from 'express';
import cookieParser from 'cookie-parser';
import sessions from 'express-session';
import parseUrl from 'body-parser';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const encodeUrl = parseUrl.urlencoded({ extended: false });

// Session middleware
app.use(sessions({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "11Edward11",
    database: "clippy_bird"
});

// Get connection from the pool
const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error("Error getting MySQL connection: ", error);
        throw error;
    }
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', encodeUrl, async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USERNAME = ? OR EMAIL = ?', [userName, email]
        );

        if (rows.length > 0) {
            return res.sendFile(__dirname + '/failReg.html');
        }

        const [result] = await connection.execute(
            'INSERT INTO USER (FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, userName, email, password]
        );

        // Set session data for the newly registered user
        req.session.user = {
            firstname: firstName,
            lastname: lastName
        };

            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Login and register form with Node.js, Express.js and MySQL</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                    <a href="/">Log out</a>
                </div>
            </body>
            </html>
            `);
            
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/dashboard", encodeUrl, async (req, res) => {
    const { userName, password } = req.body;

    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USERNAME = ? AND PASSWORD = ?',
            [userName, password]
        );

        if (rows.length > 0) {
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Login and register form with Node.js, Express.js and MySQL</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                    <a href="/">Log out</a>
                </div>
            </body>
            </html>
            `);

        } else {
            res.sendFile(__dirname + '/failLog.html');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

app.get('/users', async (req, res) => {
    const connection = await getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM USER');
        res.json(rows); // Send the user data as JSON response
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});