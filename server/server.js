import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// Import routes
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import dashboardRoute from './routes/dashboard.js';
import usersRoute from './routes/users.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "11Edward11",
    database: "clippy_bird"
});

// Define getConnection function
export const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error("Error getting MySQL connection: ", error);
        throw error;
    }
};

// Middleware to get connection from pool
app.use(async (req, res, next) => {
    try {
        req.db = await pool.getConnection();
        next();
    } catch (error) {
        console.error("Error getting MySQL connection: ", error);
        res.status(500).send('Internal Server Error');
    }
});

// Routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboardRoute);
app.use('/users', usersRoute);

// Route handler for the root URL
app.get('/', (req, res) => {
    res.redirect('/register'); // Redirect to the registration page
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
