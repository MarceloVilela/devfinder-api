require('dotenv').config()

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';

interface ErrorHandler extends Error {
  status?: number;
}

mongoose.connect(String(process.env.MONGO_URI), { useNewUrlParser: true, useUnifiedTopology: true })

const server = express()

server.use(cors())
server.use(express.json())

server.use(routes)

server.use(function (err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  res.json({ ...err, message: err.message });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('listen on: ' + process.env.PORT)
})