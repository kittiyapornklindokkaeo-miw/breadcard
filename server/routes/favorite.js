const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { create, list, update, remove } = require('../controller/favorite')
const router = express.Router()

router.post('/favorite', authCheck, create)
router.get('/favorite', authCheck, list)

module.exports = router