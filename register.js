import bcrypt from 'bcrypt';
import express from 'express';
import { getConnection } from '../server.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    const connection = await getConnection();

    try {
        // This checks to see if the username is taken
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USERNAME = ?', [userName]
        );
        if (rows.length > 0) {
            res.status(401).send("your username was taken.");
        }

        //This is where the password gets hashed
        const hashedPassword = await bcrypt.hash(password, 10);

        // If the username is available, it will proceed with the registeration
        const [result] = await connection.execute(
            'INSERT INTO USER (FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, userName, email, hashedPassword]
        );

        req.session.user = {
            firstname: firstName,
            lastname: lastName
        };

        res.status(201).json({
            message: "User created Sucessfully)",
            userId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

export default router;
