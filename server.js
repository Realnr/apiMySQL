const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();


const app = express();
const port = 3000;

app.use(express.json());

let con;

const con.createCon = () => {
        connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
	});
	
}


const executeQuery = (sql, res) => {
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while executing the query.' });
            return;
        }
        res.json(results);
    });
};

app.post('/api/custom-query', (req, res) => {
    connection.createConnection();
    const sql = req.body.sql; // Expecting { sql: "YOUR SQL COMMAND" }
    if (!sql) {
        return res.status(400).json({ error: 'SQL command is required.' });
    }
    executeQuery(sql, res);
    connection.end((err) => {
        if (err) {
            console.error('Error closing the connection:', err);
            return;
        }
        console.log('Connection closed gracefully');
    });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});