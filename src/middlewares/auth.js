const jwt = require('jsonwebtoken');
const { promisify }  = require('util');

const authConfig = require('../config/auth');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');
  
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded._id;
    console.log(req.userId)

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};

module.exports = authMiddleware;
