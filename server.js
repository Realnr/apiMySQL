const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();


const app = express();
const port = 3000;

app.use(express.json());

let connection;

const createConnection = () => {
        connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
	});
	connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
        } else {
            console.log('Database connected successfully.');
        }
    });
}

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (error, results) => {
            if (error) {
                reject('Error executing query: ' + error);
                return;
            }
            resolve(results);
        });
    });
};

app.post('/api/custom-query', (req, res) => {
    createConnection();
    const sql = req.body.sql; // Expecting { sql: "YOUR SQL COMMAND" }

    if (!sql) {
        return res.status(400).json({ error: 'SQL command is required.' });
    }

    executeQuery(sql)
        .then(results => {
            res.json(results);
            connection.end((err) => {
                if (err) {
                    console.error('Error closing the connection:', err);
                } else {
                    console.log('Connection closed gracefully');
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while executing the query.' });
            connection.end(); // Ensure connection is closed even on error
        });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});