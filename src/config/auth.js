const authConfig = {
    secret: process.env.APP_SECRET,
    expiresIn: '7d',
};

module.exports = authConfig;