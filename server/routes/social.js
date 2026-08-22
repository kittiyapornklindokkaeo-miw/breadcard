const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}?error=google` }),
    (req, res) => {
        req.session.userId = req.user.id 
        res.redirect(process.env.CLIENT_URL)
    }
)

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}?error=facebook` }),
    (req, res) => {
        req.session.userId = req.user.id
        res.redirect(process.env.CLIENT_URL)
    }
)

module.exports = router 