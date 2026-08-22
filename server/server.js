require('dotenv').config();
const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
const { readdirSync } = require('fs');
const sessionMiddleware = require('./config/session')
const passport = require('./config/passport');
const handleError = require('./config/error');
const { setUpPronuncationRelay } = require('./controller/wsRelay')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', require('./routes/social'))
readdirSync('./routes').filter(i => i !== 'social.js').map(i => app.use('/api', require('./routes/' + i)))

app.use(handleError)

const server = http.createServer(app)
setUpPronuncationRelay(server)

const port = 5000
server.listen(port, () => console.log(`Server is running on port ${port}`))