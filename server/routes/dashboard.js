import express from 'express';
import { getConnection } from '../server.js';

const router = express.Router();

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // If logged in, render the dashboard
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Dashboard</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <h2>Welcome to the Dashboard, ${req.session.user.firstname} ${req.session.user.lastname}!</h2>
                <a href="/">Log out</a>
            </div>
        </body>
        </html>
    `);
});

export default router;