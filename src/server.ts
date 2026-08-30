import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')

import routes from './routes';

interface ErrorHandler extends Error {
  status?: number;
}

mongoose.connect(String(process.env.MONGO_URI), { useNewUrlParser: true, useUnifiedTopology: true })

const server = express()

// origin explícito + credentials:true é obrigatório para o browser aceitar o cookie httpOnly
// de sessão em requests cross-origin (frontend em outra porta/domínio) — cors() sem opções
// (wildcard) é incompatível com credentials.
server.use(cors({ origin: process.env.APP_WEB_URL, credentials: true }))
server.use(cookieParser())
server.use(express.json())

server.use('/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, false, { docExpansion: "none", persistAuthorization: true }))

server.use('/v1', routes)

server.use(function (err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  res.json({ ...err, message: err.message });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('listen on: ' + process.env.PORT)
})
