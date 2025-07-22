const mysql = require('mysql2');
const fs = require('fs');

     // Create DB connection

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Pander@2022',
  database: 'ClubArea'
 });

module.exports=pool.promise();





