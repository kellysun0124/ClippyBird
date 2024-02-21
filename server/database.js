// import mysql from 'mysql2'
// import dotenv from 'dotenv'

// dotenv.config()

// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// }).promise()

// // async allows asynchronous connect
// // export allows queries to be used elsewhere
// export async function getUsersImages(userId) {
//     const [rows] = await pool.query(
//         `
//         SELECT IMAGE_ID
//         FROM IMAGE i
//         INNER JOIN USER u ON i.USER_ID = u.USER_ID
//         WHERE u.USER_ID = ?;
//         `,
//         [userId]
//     );

//     return rows;
// }

// export async function insertImage() {

// }



// const result = await getUsersImages("GirlyTeenGirl147")
// console.log(result)