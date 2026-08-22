const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { create, list, update, remove, save } = require('../controller/deck')
const { resetSession } = require('../controller/pronunciationSession')
const router = express.Router()

router.post('/deck', authCheck, create)
router.get('/deck', authCheck, list)
router.patch('/deck/:id', authCheck, update)
router.post('/deck/:id/save', authCheck, save)
router.post('/deck/:id/session/reset', authCheck, resetSession)
router.delete('/deck/:id', authCheck, remove)

module.exports = router