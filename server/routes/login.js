import express from 'express';
import { getConnection } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
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
            res.render(__dirname + 'failLog');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

export default router;