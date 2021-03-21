import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import passport, { Profile } from 'passport';
import { Strategy } from 'passport-github';

import authConfig from '../config/auth';
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
      callbackURL: process.env.APP_API_URL + '/auth/github/callback'
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

    return res.redirect(process.env.APP_WEB_URL + `/login?id=${id}&token=${token}`)
  }
  // #swagger.ignore = true
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Handles the response of social authentication - github'
);

export default routes
