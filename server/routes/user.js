const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { update, remove } = require('../controller/user')
const router = express.Router()

router.patch('/user', authCheck, update)
router.delete('/user', authCheck, remove)

module.exports = router