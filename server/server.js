import cors from 'cors';
import dotenv from 'dotenv'
import express from 'express';
import session from 'express-session';
import mysql from 'mysql2/promise';
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import usersRoute from './routes/users.js';
import homepageRoute from './routes/homepage.js';
import insertRoute from './routes/insert.js';
import path from 'path';

const __dirname = path.resolve();

dotenv.config()

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Create MySQL connection pool
let dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};

// if(process.env.NODE_ENV == "production") {
//     dbConfig.socketPath = process.env.CB_DB_SOCKET;
//     dbConfig.user = process.env.CB_DB_USER;
//     dbConfig.password = process.env.CB_DB_PASSWORD;
//     dbConfig.database = process.env.CB_DB_DATABASE;
// } else {
//     dbConfig.host = process.env.MYSQL_HOST;
//     dbConfig.user = process.env.MYSQL_USER;
//     dbConfig.password = process.env.MYSQL_PASSWORD;
//     dbConfig.database = process.env.MYSQL_DATABASE;
// }

const pool = mysql.createPool(dbConfig)

// Define getConnection function
export const getConnection = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error("Error getting MySQL connection: ", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Middleware to get connection from pool
app.use(async (req, res, next) => {
    try {
        const connection = await getConnection();
        req.db = connection;
        next();
    } catch (error) {
        console.error("Error getting MySQL connection: ", error);
        res.status(500).send('Internal Server Error');
    }
});

app.use(express.static(path.join(__dirname, 'dist/front-end/browser')));

// Routess
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/users', usersRoute);
app.use('/api/homepage', homepageRoute);
app.use('/api/insert', insertRoute);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
