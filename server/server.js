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
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};

if(process.env.NODE_ENV == "production") {
    dbConfig.socketPath = process.env.CB_DB_SOCKET;
} else {
    dbConfig.host = process.env.MYSQL_HOST;
}

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

// Routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/users', usersRoute);
app.use('/homepage', homepageRoute);
app.use('/insert', insertRoute);

// Route handler for the root URL
// app.get('/', (req, res) => {
//     res.redirect('/register'); // Redirect to the registration page
// });

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
