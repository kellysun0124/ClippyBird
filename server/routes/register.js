import express from 'express';
import { getConnection } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    const connection = await getConnection();

    try { // This checks to see if the username is taken
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USERNAME = ?', [userName]
        );

        // If the username was taken it will render the failReg view
        if (rows.length > 0) {
            return res.render('failReg'); // Renders failReg.ejs from the views directory
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

export default router;
