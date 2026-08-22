const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { listHome } = require('../controller/home')
const router = express.Router()

router.get('/home', authCheck, listHome)

module.exports = router