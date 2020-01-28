const router = require('express').Router();
const bcrypt = require('bcrypt');

const db = require('../controllers/sql');

router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/login', (req, res) => {
    res.render('login', {success: req.query.s});
})

router.post('/login', (req, res) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [req.body.email], (err, user) => {
        if(!user) {
            res.render('login', {error: "Bruger eller password forkert!"});
            return;
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) throw err;
            if(result) {
                req.session.user = user;
                res.redirect('/');
            } else {
                res.render('login', {error: "Bruger eller password forkert!"});
            }
        })
    })
})

router.post('/register', (req, res) => {
    if(req.body.password != req.body.passwordRepeat) {
        res.render('register', {error: 'De indtastede passwords matchede ikke', post: req.body});
        return;
    }
    db.get(`SELECT 1 FROM users WHERE email = ?`, [req.body.email], (err, result) => {
        if(err) throw err;
        if(!result) {
            bcrypt.hash(req.body.password, 10, (err, passwordHash) => {
                if(err) throw err;
                let sql = `INSERT INTO users(email, password) VALUES (?, ?)`;
                db.run(sql, [req.body.email, passwordHash], (err, result) => {
                    if(err) {
                        res.render('register', {error: 'Der skete en fejl', post: req.body});
                        return;
                    }
                    res.redirect('/login?s=Brugeren blev oprettet!');
                });
            })
        } else {
            res.render('register', {error: 'Email allerede oprettet', post: req.body});
        }

    })

})

module.exports = router;