const mysql2 = require('mysql2')

const db = mysql2.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "KenKone@2#",
    database: "sys"
})

exports.db = db