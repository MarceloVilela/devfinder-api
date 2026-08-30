import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';

export interface TokenPayload {
  id: string;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Cookie httpOnly é o caminho real (browser/devfinder-next); o header Authorization fica
  // como fallback para o Swagger UI (/v1/doc, "Authorize" manual) e chamadas server-to-server.
  const token = req.cookies?.[authConfig.cookie.name] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret) as TokenPayload;

    req.user = { id: decoded.id };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};

export default authMiddleware;
