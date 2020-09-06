const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authConfig = require('../config/auth');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded._id;
    console.log(req.userId)

    return next();
  } catch (error) {
    return next();
  }
};

module.exports = authMiddleware;
