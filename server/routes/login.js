import bcrypt from 'bcrypt';
import express from 'express';
import { getConnection } from '../server.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, password } = req.body;

    const connection = await getConnection();

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM USER WHERE USER_ID = ?', 
            [userId]
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





// import express from 'express';
// import { getConnection } from '../server.js';

// const router = express.Router();

// router.post('/', async (req, res) => {
//     const { userName, password } = req.body;

//     const connection = await getConnection();

//     try {
//         const [rows] = await connection.execute(
//             'SELECT * FROM USER WHERE USERNAME = ? AND PASSWORD = ?',
//             [userName, password]
//         );

//         if (rows.length > 0) {
//             // Set session user
//             req.session.user = {
//                 firstname: rows[0].FIRST_NAME,
//                 lastname: rows[0].LAST_NAME
//             };

//             res.status(200).json({
//                 message: "User Successfully logged in",
//                 firstname: rows[0].FIRST_NAME,
//                 lastname: rows[0].LAST_NAME
//             });
//         } else {
//             // Send a response indicating incorrect username or password
//             res.status(401).json({
//                 message: "Username or password was incorrect!"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     } finally {
//         connection.release();
//     }
// });

// export default router;

