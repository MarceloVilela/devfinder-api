import express from 'express';

import authMiddleware from '../middlewares/auth';
import optionalAuthMiddleware from '../middlewares/optionalAuth';
import socialLoginGithub from './socialLoginGithub';

import DevController from '../controllers/Dev/DevController';
import ProfileController from '../controllers/Dev/ProfileController';
import LikeController from '../controllers/Dev/LikeController';
import DislikeController from '../controllers/Dev/DislikeController';

import VideoController from '../controllers/Video/VideoController';
import TrendingController from '../controllers/Video/TrendingController';
import SubscriptionsController from '../controllers/Video/SubscriptionsController';

import ChannelController from '../controllers/Channel/ChannelController';
import ChannelRefreshController from '../controllers/Channel/ChannelRefreshController';
import FollowController from '../controllers/Channel/FollowController';
import IgnoreController from '../controllers/Channel/IgnoreController';

const routes = express.Router()

routes.get('/', (req, res) => {
  return res.json({ message: `HelloWorld@DevFinder`, params: req.params, body: req.body, query: req.query })
})

routes.use(optionalAuthMiddleware);

routes.get('/devs', DevController.index)

routes.get('/channels', ChannelController.index)
routes.get('/channels/*', ChannelController.show)

routes.get('/feed/trending', TrendingController.index)

routes.use(socialLoginGithub);

// Authenticate user
routes.use(authMiddleware);

routes.get('/me', ProfileController.show)

routes.post('/devs/:username/likes', LikeController.store)
routes.post('/devs/:username/dislikes', DislikeController.store)
routes.post('/channels/:username/likes', FollowController.store)
routes.post('/channels/:username/dislikes', IgnoreController.store)

routes.get('/feed/subscriptions', SubscriptionsController.index)
routes.get('/devs/likes', LikeController.index)
routes.get('/devs/dislikes', DislikeController.index)

routes.delete('/devs/:username/likes', LikeController.delete)
routes.delete('/devs/:username/dislikes', DislikeController.delete)
routes.delete('/channels/:username/likes', FollowController.delete)
routes.delete('/channels/:username/dislikes', IgnoreController.delete)

routes.post('/devs', DevController.store)
routes.post('/channels', ChannelController.store)
routes.post('/channels/refresh', ChannelRefreshController.store)
routes.post('/feed/trending', VideoController.store)

export default routes