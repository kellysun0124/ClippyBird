import bcrypt from 'bcrypt';
import express from 'express';
import { getConnection } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { userName, password } = req.body;

    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USERNAME = ?', [userName]
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Verify password using bcrypt
            const passwordMatch = await bcrypt.compare(password, user.PASSWORD);
            if (passwordMatch) {
                req.session.user = {
                    firstname: user.FIRST_NAME,
                    lastname: user.LAST_NAME
                };
                return res.status(200).json({
                    message: "User successfully logged in",
                    firstname: user.FIRST_NAME,
                    lastname: user.LAST_NAME
                });
            }
        }
        res.status(401).json({
            message: "Username or password is incorrect"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

export default router;

