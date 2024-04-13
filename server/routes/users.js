import express from 'express';
import { getConnection } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const connection = await getConnection();

    try {
        const [rows] = await connection.execute('SELECT * FROM USER');
        res.json(rows); // Send the user data as JSON response
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

export default router;