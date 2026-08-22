const { resetScore } = require('../lib/pronunciationScoreStore')

exports.resetSession = (req, res) => {
    const deckId = parseInt(req.params.id)
    const userId = req.session.userId

    if (isNaN(deckId)) {
        return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
    }

    resetScore(userId, deckId)
    res.status(200).json({ message: 'เริ่มเซสชันใหม่แล้ว' })
}