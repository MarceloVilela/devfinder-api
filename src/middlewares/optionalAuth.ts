import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';
import { TokenPayload } from './auth';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[authConfig.cookie.name] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = await promisify(jwt.verify)(token, String(authConfig.secret)) as TokenPayload;

    req.user = { id: decoded.id };

    return next();
  } catch (error) {
    return next();
  }
};

export default authMiddleware;
