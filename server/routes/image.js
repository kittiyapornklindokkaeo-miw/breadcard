const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { create, remove } = require('../controller/image')
const upload = require('../middleware/upload')
const router = express.Router()

router.post('/image', authCheck, upload.single('image'), create)
router.delete('/image', authCheck, remove)

module.exports = router