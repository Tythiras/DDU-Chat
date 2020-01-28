const router = require('express').Router();
//auth check
const authMiddleware = (req, res, next) => {
    if (req.session.user == undefined) {
        return res.render('login', {success: req.query.s});
    } else {

        req.app.locals.layout = 'logged';
        next();
    }
};
router.get('/', authMiddleware, (req, res) => {
    res.render('front');
})
router.get('/logout', authMiddleware, (req, res) => {
    req.session.destroy();
    res.redirect('/');
})
module.exports = router;