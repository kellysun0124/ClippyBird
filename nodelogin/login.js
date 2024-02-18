import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import session from 'express-session';
import path from 'path';
import mysql from 'mysql2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create MySQL connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Promisify the pool for async/await usage

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Address for the website: 'https://localhost:3000/auth'
app.get('/', async function(request, response) {
    // renders the login template
    response.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/auth', async function(request, response) {
    // This captures what the user is inputting into the fields
    let username = request.body.username;
    let password = request.body.password;
    // Makes sure that the input fields exist and are not empty
    if (username && password) {
        try {
            const [results, fields] = await pool.execute('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password]);
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username or Password!');
            }
        } catch (error) {
            console.error(error);
            response.send('An error occurred while processing your request.');
        }
    } else {
        response.send('Please enter Username and Password!');
    }
});

// This serves as the signup page
app.get('/signup', async function(request, response) {
    response.sendFile(path.join(__dirname, '/signup.html'));
});

app.post('/signup', async function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;

    if (username && password && email) {
        try {
            await pool.execute('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
            response.send('User registered successfully!');
        } catch (error) {
            console.error(error);
            response.send('An error occurred while processing your request.');
        }
    } else {
        response.send('Please enter a Username, Password, and Email to Succeed!');
    }
});

// https://localhost:3000/home
app.get('/home', function (request, response) {
    // if the user gets logged in successfully
    if (request.session.loggedin) {
        //Output of the username
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        // if the user is not logged in
        response.send('Please login to view this page!');
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
