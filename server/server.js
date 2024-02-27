import express from 'express';
import session from 'express-session';
import mysql from 'mysql2/promise';
import cors from 'cors';
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import usersRoute from './routes/users.js';

const app = express();
const port = process.env.PORT || 4000;

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
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "11Edward11",
    database: "clippy_bird"
});

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

// Route handler for the root URL
app.get('/', (req, res) => {
    res.redirect('/register'); // Redirect to the registration page
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});