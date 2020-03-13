const mysql = require('mysql');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'labb2-sql'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
    return connection;
});

module.exports = connection;