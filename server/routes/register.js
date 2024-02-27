import express from 'express';
import { getConnection } from '../server.js'; // Import getConnection function from server.js

const router = express.Router();

router.get('/', async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    const connection = await getConnection(); // Call getConnection function to get a database connection

    try {
        // Check if the username is taken
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USERNAME = ?', [userName]
        );

        // If the username was taken, render the failReg view
        if (rows.length > 0) {
            res.status(401).send("your username was taken."); // Renders failReg.ejs from the views directory
        }

        // If the username is available, proceed with registration
        const [result] = await connection.execute(
            'INSERT INTO USER (FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, userName, email, password]
        );

        req.session.user = {
            firstname: firstName,
            lastname: lastName
        };

        // Send a response indicating successful registration
        res.status(201).json({
            message: "User created Sucessfully)",
            userId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release(); // Release the database connection
    }
});

export default router;
