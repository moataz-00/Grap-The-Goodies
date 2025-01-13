// database/db.js
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables



const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gtg'  // Your MySQL database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

module.exports = db;