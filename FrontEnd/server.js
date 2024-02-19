const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2')
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('home'))
app.get



// THIS IS HOW WE wouLD CONNECT TO MYSQL DATABASE
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "next_dbs"
// })
//
// CHECK IF CONNECTING TO DATABASE IS SUCCESSFULL
// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('connected to db')
// })

// User register their account query
// app.post('/register', (req, res) => {
//     const sql = "INSERT INTO user (name, email, password) VALUES (?)";
//     const values = [
//         req.body.name,
//         req.body.email,
//         req.body.password
//     ]
//     db.query(sql, [values], (err, data) => {
      
//         if (err) {
//             return res.json("Error");
//         }
//         return res.json(data);
//     })
// })

// user login check
// app.post('/login', (req, res) => {
//     const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
//     //console.log('app no work')
//     db.query(sql, [req.body.email, req.body.password], (err, data) => {
//         //console.log(err)
//         //console.log(data)
//         if (err) {
//             //console.log('1')

//             return res.json("Error");
//         }
//         if (data.length > 0){
//             //console.log('2')
//             return res.json("Success");
//         } else {
//             //console.log('3')

//             return res.json("Fail");
//         }
//     })
// })


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
