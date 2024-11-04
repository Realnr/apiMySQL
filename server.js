const express = require('express');
const mysql = require('mysql2');


const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    user: 'newuser',
    password: 'wLXREt9c',
    database: 'mlp',
    port: '48517'
});

connection.connect();

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
    const sql = req.body.sql; // Expecting { sql: "YOUR SQL COMMAND" }
    if (!sql) {
        return res.status(400).json({ error: 'SQL command is required.' });
    }
    executeQuery(sql, res);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});