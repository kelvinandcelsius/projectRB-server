import './db/index.js'
import express from 'express'
const app = express()

import './events/brokerEvents.js'

import config from './config/index.js'
config(app)

import routes from './routes/index.js'
app.use('/api', routes)

import errorHandler from './error-handling/index.js'
errorHandler(app)

export default app