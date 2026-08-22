const { XMLParser } = require('fast-xml-parser')

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
})

/**
 * decode base64 XML จาก iFlytek แล้วแปลงเป็น JSON สะอาดๆ
 * @param {string} base64Data - ค่า data.data จาก response ของ iFlytek
 * @returns {object} ผลประเมินแบบ flat, พร้อมใช้ใน frontend
 */
function parseIseResult(base64Data) {
    const xml = Buffer.from(base64Data, 'base64').toString('utf-8')
    const parsed = parser.parse(xml)

    const readWordRoot = parsed.xml_result.read_word
    const paper = readWordRoot.rec_paper.read_word // มีชื่อซ้ำกับ root เพราะ XML structure ของ iFlytek เป็นแบบนี้

    const sentence = paper.sentence
    const words = normalizeToArray(sentence.word)

    return {
        overall: {
            content: paper.content, // เช่น "你好。"
            totalScore: paper.total_score,
            phoneScore: paper.phone_score,
            toneScore: paper.tone_score,
            fluencyScore: paper.fluency_score,
            integrityScore: paper.integrity_score,
        },
        sentence: {
            content: sentence.content, // เช่น "你好"
        },
        words: words.map(word => ({
            content: word.content,       // เช่น "你好"
            pinyin: word.symbol,         // เช่น "ni2hao3"
            syllables: normalizeToArray(word.syll)
                .filter(syll => syll.rec_node_type !== 'silv' && syll.rec_node_type !== 'sil') // ตัด silence marker ออก
                .map(syll => ({
                    content: syll.content,   // เช่น "你", "好"
                    pinyin: syll.symbol,     // เช่น "ni2", "hao3"
                    tone: getToneFromPhones(syll.phone),
                    hasError: hasPerrError(syll.phone),
                })),
        })),
    }
}

// XML บาง element มีตัวเดียวจะ parse เป็น object เดี่ยว, ถ้ามีหลายตัวจะเป็น array
// ฟังก์ชันนี้ normalize ให้เป็น array เสมอ กันโค้ดพังตอน .map()
function normalizeToArray(value) {
    if (value === undefined || value === null) return []
    return Array.isArray(value) ? value : [value]
}

function getToneFromPhones(phone) {
    const phones = normalizeToArray(phone)
    const tonedPhone = phones.find(p => p.mono_tone)
    return tonedPhone?.mono_tone || null // เช่น "TONE2", "TONE3"
}

function hasPerrError(phone) {
    const phones = normalizeToArray(phone)
    return phones.some(p => p.perr_msg && p.perr_msg !== 0)
}

module.exports = { parseIseResult }