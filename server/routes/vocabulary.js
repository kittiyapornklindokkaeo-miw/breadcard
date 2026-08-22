const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { create, list, remove, update } = require('../controller/vocabulary')
const router = express.Router()

router.post('/vocabulary', authCheck, create)
router.get('/vocabulary/:id', authCheck, list)
router.patch('/vocabulary/:id', authCheck, update)
router.delete('/vocabulary/:id', authCheck, remove)

module.exports = router