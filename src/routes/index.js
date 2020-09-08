const express = require('express')

const authMiddleware = require('../middlewares/auth');
const optionalAuthMiddleware = require('../middlewares/optionalAuth');
const socialLoginGithub = require('./socialLoginGithub')

const DevController = require('../controllers/DevController')
const ProfileController = require('../controllers/ProfileController')
const ChannelController = require('../controllers/ChannelController')
const VideoController = require('../controllers/VideoController');
const TrendingController = require('../controllers/TrendingController');
const SubscriptionsController = require('../controllers/SubscriptionsController');
const LikeController = require('../controllers/LikeController')
const DislikeController = require('../controllers/DislikeController')
const FollowController = require('../controllers/FollowController')
const IgnoreController = require('../controllers/IgnoreController')

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

routes.post('/devs', DevController.store)
routes.post('/channels', ChannelController.store)
routes.post('/feed/trending', VideoController.store)
routes.get('/feed/subscriptions', SubscriptionsController.index)

module.exports = routes