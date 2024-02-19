const express = require('express')
const app = express()
const port = 3000

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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))