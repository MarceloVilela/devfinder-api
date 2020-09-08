require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
require('express-async-errors')

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const routes = require('./routes')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const server = express()

server.use(cors())
server.use(express.json())

server.use(routes)

server.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ ...err, message: err.message });
});

server.listen(process.env.PORT, () => {
  console.log('listen on: ' + process.env.PORT)
})