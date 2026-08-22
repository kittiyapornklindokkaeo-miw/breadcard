const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { create, list, remove, update, removeDeck } = require('../controller/category')
const router = express.Router()

router.post('/category', authCheck, create)
router.get('/category', authCheck, list)
router.patch('/category/:id', authCheck, update)
router.delete('/category/:id', authCheck, remove)

router.patch('/category/deck/:id', authCheck, removeDeck)

module.exports = router