const db = require('./sql');



module.exports = {
    getConversations: (id, cb) => {
        //sql kan muligvis effektiveres meget hvis man lavede en anden måde at handle conversations på
        let sql = `SELECT u.id, u.email,
        CASE
            WHEN m.id THEN m.creation
            ELSE u.creation
        END date,
        CASE
            WHEN m.receiverID = $id THEN 1
            ELSE 0
        END receiver,
        m.message, m.read
        FROM users u
        LEFT OUTER JOIN messages m ON m.id = (
            SELECT MAX(id)
            FROM messages
            WHERE (receiverID = u.id AND senderID = $id) OR (receiverID = $id AND senderID = u.id)
        )
        WHERE u.id != $id
        ORDER BY date DESC`;
        db.all(sql, {$id: id}, (err, results) => {
            if(err) throw err;
            cb(results);
        })
    },
    getMessages: (convID, userID, cb) => {
        let sql = `SELECT m.message, m.read, m.senderID, m.receiverID, m.creation,
        CASE
            WHEN m.receiverID = $convID THEN 0
            ELSE 1
        END receiver
        FROM messages m
        WHERE (m.senderID = $convID AND m.receiverID = $userID) OR (m.senderID = $userID AND m.receiverID = $convID)`;
        db.all(sql, {$convID: convID, $userID: userID}, (err, results) => {
            db.run('UPDATE messages SET `read` = 1 WHERE senderID = $convID AND receiverID = $userID', {$convID: convID, $userID: userID}, (err) => {
                if(err) throw err;
            });
            if(err) throw err;
            cb(results);
        })
    },
    insertMessage: (sender, receiver, message, cb) => {
        let sql = `INSERT INTO messages(senderID, receiverID, read, message) VALUES (?, ?, ?, ?)`;
        db.run(sql, [sender, receiver, 0, message])
    }
}