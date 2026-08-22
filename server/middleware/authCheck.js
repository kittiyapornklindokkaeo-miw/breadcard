const UserModel = require("../models/userModel")

exports.authCheck = async(req, res, next) => {
    try {
        if(!req.session.userId) {
           return res.sendStatus(401)
        }

        req.user = await UserModel.findById(req.session.userId)

        // userId มีใน session แต่ไม่เจอใน DB
        if(!req.user) {
            return res.sendStatus(401)
        }
        next()
    } catch (error) {
        next(error)
    }
}