import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import passport, { Profile } from 'passport';
import { Strategy } from 'passport-github';

import authConfig, { cookieOptions } from '../config/auth';
import findOrCreateDev from '../services/findOrCreateDev';

interface ProfileGitHub extends Strategy.Profile {
  '_json': {
    bio?: string;
  }
  photos?: [
    { value: string }
  ]
}

const routes = express.Router();

routes.use(passport.initialize());
routes.use(passport.session());

passport.serializeUser(({ _id }, done) => {
  done(null, _id);
});

passport.deserializeUser((id, done) => {
  done(null, { dev: { _id: id } })
});

passport
  .use(
    new Strategy({
      clientID: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
      // GITHUB_CALLBACK_URL (nova, opcional) permite apontar o callback pro proxy reverso do
      // frontend (devfinder-next/review-human.md #2) sem mexer em APP_API_URL, que
      // provavelmente serve outros usos. Sem essa env var setada, comportamento idêntico ao de
      // antes (fallback pro cálculo original) — inerte até alguém configurar
      // GITHUB_CALLBACK_URL no Render.
      callbackURL: process.env.GITHUB_CALLBACK_URL || (process.env.APP_API_URL + '/v1/auth/github/callback')
    },
      async function (accessToken, refreshToken, profile, cb) {
        const profileGitHub = profile as ProfileGitHub;
        const dev = await findOrCreateDev({
          user: String(profileGitHub.username),
          name: profileGitHub.displayName,
          bio: profileGitHub._json.bio,
          avatar: profileGitHub.photos && profileGitHub.photos[0] ? profileGitHub.photos[0].value : ''
        })

        return cb(null, dev);
      }
    ));

routes.get('/auth/github', passport.authenticate('github')
  // #swagger.ignore = true
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Redirects to social authentication - github'
);

routes.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req: Request, res: Response) {
    const { id } = req.user;

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    })

    // Sessão via cookie httpOnly, nunca no token/query string — inacessível a JS/XSS no
    // frontend. O frontend descobre a sessão chamando GET /me (o cookie vai junto sozinho).
    res.cookie(authConfig.cookie.name, token, { ...cookieOptions, maxAge: authConfig.cookie.maxAge })

    return res.redirect(process.env.APP_WEB_URL + '/login')
  }
  // #swagger.ignore = true
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Handles the response of social authentication - github'
);

routes.post('/auth/logout',
  function (req: Request, res: Response) {
    res.clearCookie(authConfig.cookie.name, cookieOptions)

    return res.status(204).end()
  }
  // #swagger.ignore = true
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Clears the session cookie'
);

export default routes
