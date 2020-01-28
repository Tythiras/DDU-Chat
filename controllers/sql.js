const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./main.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL,
            password VARCHAR(255) NOT NULL,
            creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            message TEXT NOT NULL,
            receiverID INTEGER NOT NULL,
            senderID INTEGER NOT NULL,
            read BOOLEAN DEFAULT 0,
            creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});


module.exports = db;