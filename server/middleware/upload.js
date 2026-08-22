const multer = require('multer')

//ส่งให้ cloudinary ไม่ต้องเขียนลงดิสก์
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png']
    if(allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('รองรับเฉพาะไฟล์ jpg, png เท่านั้น'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1.5 * 1024 * 1024 }
})

module.exports = upload