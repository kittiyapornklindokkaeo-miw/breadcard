const Crypto = require('crypto')
const WebSocket = require('ws')

exports.buildIflytekWsUrl = () => {
    const config = {
        // Request Address
        hostUrl: "ws://ise-api-sg.xf-yun.com/v2/ise",
        host: "ise-api-sg.xf-yun.com",
        uri: "/v2/ise",
        appid: process.env.PRONUNCATION_APP_ID,
        apiSecret: process.env.PRONUNCATION_API_SECRET,
        apiKey: process.env.PRONUNCATION_API_KEY,
    }

    const date = (new Date().toUTCString())

    const signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    const signatureSha = Crypto.createHmac("Sha256", config.apiSecret).update(signatureOrigin).digest("base64")
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`
    const authorization = Buffer.from(authorizationOrigin).toString("base64")

    const url = config.hostUrl + "?authorization=" + encodeURIComponent(authorization) + "&date=" + encodeURIComponent(date) + "&host=" + config.host
    
    return url
}