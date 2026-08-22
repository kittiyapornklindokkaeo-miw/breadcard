const cloudinary = require('../config/cloudinary')
const streamifier  = require('streamifier')

const FOLDER_CONFIG = {
    profile: {folder: 'profile', prefix: 'user'},
    category: { folder: 'categories', prefix: 'category' },
    vocabulary: { folder: 'vocabulary', prefix: 'word'}
}

const uploadFromBuffer = (buffer, option) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(option, (error, result) =>{
            if (error) return reject(error)
            resolve(result)
        })
        streamifier.createReadStream(buffer).pipe(stream)
    })
}

exports.create = async(req, res, next) => {
    try {
        const { type } = req.body
        const file = req.file

        if(!file || !type) {
            return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })
        }

        const config = FOLDER_CONFIG[type]
        if(!config) {
            return res.status(400).json({ message: 'ประเภทไม่ถูกต้อง' })
        }

        const result = await uploadFromBuffer(file.buffer, {
            folder: config.folder,
            public_id: `${config.prefix}_${Date.now()}`,
            overwrite: true,
            unique_filename: false
        })

        res.status(201).json({ url: result.secure_url, public_id: result.public_id })
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}

exports.remove = async(req, res, next) => {
    try {
        const { public_id } = req.body

        if(!public_id) {
            return res.status(400).json({ message: 'ไม่มี public_id'})
        }

        await cloudinary.uploader.destroy(public_id)
        
        res.status(200).json({ message: 'ลบรูปภาพสำเร็จ'})
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}