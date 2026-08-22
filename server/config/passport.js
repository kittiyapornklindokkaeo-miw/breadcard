const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const { db } = require('./database')
const UserModel = require('../models/userModel')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
}, async ( _, __, profile, done) => {
    try {
        const email = profile.emails[0].value
        const name = profile.displayName
        const url = profile.photos[0].value
        const provider = 'google'
        const provider_id = profile.id

        //เช็คในตาราง oauth_account ว่าเคยมีการ login ด้วย google มาแล้วหรือยัง
        const [oauthRow] = await db.query('SELECT * FROM oauth_accounts WHERE provider = ? AND provider_id = ?', [provider, provider_id])

        if(oauthRow.length) {
            //ถ้าเคย login ให้ดึงข้อมูล
            const user = await UserModel.findById(oauthRow[0].user_id)
            return done(null, user)
        }
        
        //ยังไม่มีใน oauth_accounts ให้เช็คว่ามีอีเมลล์นี้ในระบบหรือยัง
        const existingUser = await UserModel.findByEmail(email)

        let userId

        if(existingUser) {
            userId = existingUser.id
        } else {
            //ไม่มีเลยให้สร้าง user ใหม่
            await UserModel.create({ email, name, url })

            //ดึง id ของ user ที่เพิ่มข้อมูลลงไป
            const newUser = await UserModel.findByEmail(email)
            userId = newUser.id
        }

        //บันทึกลง oauth_accounts
        await db.query('INSERT INTO oauth_accounts (user_id, provider, provider_id) VALUES (?, ?, ?)', [userId, provider, provider_id])

        const findUser = await UserModel.findById(userId)
        return done(null, findUser) 
    } catch (error) {
        return done(error, null)
    }
}))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos'], 
    enableProof: true
}, async (_, __, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || null
        const name = profile.displayName
        const url = profile.photos?.[0]?.value || null
        const provider = 'facebook'
        const provider_id = profile.id

        const [oauthRow] = await db.query('SELECT * FROM oauth_accounts WHERE provider = ? AND provider_id = ?', [provider, provider_id])

        if(oauthRow.length) {
            const user = await UserModel.findById(oauthRow[0].user_id)
            return done(null, user)
        }

        let userId

        if(email) {
            const user = await UserModel.findByEmail(email)
            if(user) {
                userId = user.id
            }
        }

        if(!userId) {
            const emailToSave = email || `facebook_${provider_id}@noemail.com`

            await UserModel.create({ email: emailToSave, name, url })

            const newUser = await UserModel.findByEmail(emailToSave)
            userId = newUser.id
        }

        await db.query('INSERT INTO oauth_accounts (user_id, provider, provider_id) VALUES (?, ?, ?)', [userId, provider, provider_id])

        const findUser = await UserModel.findById(userId)
        return done(null, findUser) 
    } catch (error) {
        return done(error, null)
    }
}))

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
    try {
        const rows = await UserModel.findById(id)
        done(null, rows || null)
    } catch (error) {
        done(error, null)
    }
})

module.exports = passport