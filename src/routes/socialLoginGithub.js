const express = require('express')
const jwt = require('jsonwebtoken');

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const authConfig = require('../config/auth');
const CreateDevService = require('../services/CreateDev');

const routes = express.Router()

routes.use(passport.initialize());
routes.use(passport.session());

passport.serializeUser((dev, done) => {
  done(null, dev._id);
});

passport.deserializeUser((id, done) => {
  done(null, { dev: { _id: id } })
});

passport
  .use(
    new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.APP_API_URL + '/auth/github/callback'
    },
      async function (accessToken, refreshToken, profile, cb) {
        const dev = await CreateDevService({
          user: profile.username,
          name: profile.displayName,
          bio: profile._json.bio,
          avatar: profile.photos[0].value
        })

        return cb(null, dev);
      }
    ));

routes.get('/auth/github', passport.authenticate('github'));

routes.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    const { _id, name, user, bio, avatar, createdAt, updatedAt, likes, deslikes } = req.user;

    const token = jwt.sign({ _id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    })

    return res.redirect(process.env.APP_WEB_URL + `?id=${_id}&token=${token}`)
    return res.json({ 'auth': 'github', _id, name, user, bio, avatar, createdAt, updatedAt, likes, deslikes })
  }
);

module.exports = routes