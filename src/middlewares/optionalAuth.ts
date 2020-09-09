import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';
import { TokenPayload } from './auth';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, String(authConfig.secret)) as TokenPayload;

    req.user = { id: decoded.id };

    return next();
  } catch (error) {
    return next();
  }
};

export default authMiddleware;
