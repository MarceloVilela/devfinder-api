import express from 'express';

import authMiddleware from '../middlewares/auth';
import optionalAuthMiddleware from '../middlewares/optionalAuth';
import socialLoginGithub from './socialLoginGithub';

import DevController from '../controllers/Dev/DevController';
import ProfileController from '../controllers/Dev/ProfileController';
import LikeController from '../controllers/Dev/LikeController';
import DislikeController from '../controllers/Dev/DislikeController';

import VideoController from '../controllers/Video/VideoController';
import VideoRefreshController from '../controllers/Video/VideoRefreshController';
import TrendingController from '../controllers/Video/TrendingController';
import FeedController from '../controllers/Description/FeedController';
import SubscriptionsController from '../controllers/Video/SubscriptionsController';

import ChannelController from '../controllers/Channel/ChannelController';
import ChannelRefreshController from '../controllers/Channel/ChannelRefreshController';
import FollowController from '../controllers/Channel/FollowController';
import IgnoreController from '../controllers/Channel/IgnoreController';

import SearchController from '../controllers/Search/SearchController';

const routes = express.Router()

routes.get('/', (req, res) => {
  // #swagger.summary = 'Get info about app'
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/AppInfo" }
} */
  return res.json({ appname: `DevFinder` })
})

routes.use(optionalAuthMiddleware);

routes.get('/devs', DevController.index
  // #swagger.tags = ['Dev']
  // #swagger.summary = 'Get all devs (whit pagination)'
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/PaginationDev" },
  } */
)
routes.get('/devs/:username', DevController.show
  // #swagger.tags = ['Dev']
  // #swagger.summary = 'Gets a dev by username'
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
  } */
)

routes.get('/channels', ChannelController.index
  // #swagger.tags = ['Channel']
  // #swagger.summary = 'Get all channels (whit pagination)'
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/ArrayOfChannel" },
  } */
)
routes.get('/channels/:searchQuery', ChannelController.show
  // #swagger.tags = ['Channel']
  // #swagger.summary = 'Get a channel by name or link'
  /* #swagger.parameters['searchQuery'] = {
    in: 'path',
    description: 'name or link of channel to be used as a search',
    type: 'string',
  } */
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Channel" },
  } */
)

routes.get('/description/feed', FeedController.index);

routes.get('/feed/trending', TrendingController.index
  // #swagger.tags = ['Video']
  // #swagger.summary = 'Get all recents videos'
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/PaginationVideo" },
  } */
)
routes.get('/feed/channel', VideoController.index
  // #swagger.tags = ['Video']
  // #swagger.summary = 'Get all videos from a channel'
  /* #swagger.parameters['channel_name'] = {
    in: 'query',
    type: 'string',
  } */
  /* #swagger.parameters['page'] = {
    in: 'query',
    type: 'string',
  } */
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/PaginationVideo" },
  } */
)
routes.get('/video/:idYoutubeWatch', VideoController.show
  // #swagger.tags = ['Video']
  // #swagger.summary = 'Get a vídeo by the id contained in the link'
  /* #swagger.parameters['idYoutubeWatch'] = {
    in: 'path',
    description: 'Youtube video id. Ex: https://www.youtube.com/watch?v=Cz55Jmhfw84 , id: Cz55Jmhfw84',
    type: 'string',
  } */
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Video" },
  } */
)
routes.get('/search', SearchController.show
  // #swagger.tags = ['Search']
  // #swagger.summary = 'Search videos, channels'
  /* #swagger.parameters['q'] = {
    in: 'query',
    description: 'Search Query',
    type: 'string',
  } */
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/SearchResult" }
} */
)

routes.use(socialLoginGithub);

// Authenticate user
routes.use(authMiddleware);

routes.get('/me', ProfileController.show
  // #swagger.tags = ['Dev']
  // #swagger.summary = 'Returns authenticated user information'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)

routes.post('/likes/devs/:username', LikeController.store
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Add like to dev'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)
routes.post('/dislikes/devs/:username', DislikeController.store
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Add dislike to dev'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)
routes.post('/likes/channels/:username', FollowController.store
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Add like to channel'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)
routes.post('/dislikes/channels/:username', IgnoreController.store
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Add dislike to channel'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)

routes.delete('/likes/devs/:username', LikeController.delete
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Remove like for dev'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)
routes.delete('/dislikes/devs/:username', DislikeController.delete
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Remove dislike for dev'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)
routes.delete('/likes/channels/:username', FollowController.delete
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Remove like for channel'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)
routes.delete('/dislikes/channels/:username', IgnoreController.delete
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Remove dislike for channel'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'A JSON object containing data from the authenticated user'
} */
)

routes.get('/likes/devs', LikeController.index
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Get devs marked whit like'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/ArrayOfDev" },
    description: 'A JSON object containing array of devs marked whit like by authenticated user'
} */
)
routes.get('/dislikes/devs', DislikeController.index
  // #swagger.tags = ['Dev.likes|dislikes']
  // #swagger.summary = 'Get devs marked whit dislike'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/ArrayOfDev" },
    description: 'A JSON object containing array of devs marked whit dislike by authenticated user'
} */
)

routes.get('/feed/subscriptions', SubscriptionsController.index
  // #swagger.tags = ['Video']
  // #swagger.summary = 'Get videos related to the channels you are subscribed'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/PaginationVideo" },
  } */
)

routes.post('/devs', DevController.store
  // #swagger.tags = ['Dev']
  // #swagger.summary = 'Create dev'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'username: github username',
    type: 'object',
    schema: { username: 'marcelovilela' }
  } */
  /* #swagger.responses[201] = {
    schema: { $ref: "#/definitions/Dev" },
    description: 'Dev adicionado.'
  } */
)
routes.post('/channels', ChannelController.store
  // #swagger.tags = ['Channel']
  // #swagger.summary = 'Create channel'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'A JSON object containing data for the dev',
    type: 'object',
    schema: { $ref: "#/definitions/AddChannel" }
  } */
  /* #swagger.responses[201] = {
    schema: { $ref: "#/definitions/Channel" },
  } */
)
routes.post('/channels/refresh', ChannelRefreshController.store
  // #swagger.tags = ['Channel']
  // #swagger.summary = 'Synchronize channels'
  // #swagger.security = [{"apiKeyAuth": []}]
  // #swagger.description = 'Consult the list of channels, check which ones are not yet registered, then register'
  /* #swagger.responses[200] = {
    schema: { $ref: "#/definitions/ArrayOfChannelName" },
    description: 'Array with the names of the channels that were added'
} */
)
routes.post('/video', VideoController.store
  // #swagger.tags = ['Video']
  // #swagger.summary = 'Create vídeo'
  // #swagger.security = [{"apiKeyAuth": []}]
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'A JSON object containing data for the dev',
    type: 'object',
    schema: { $ref: "#/definitions/AddVideo" }
  } */
  /* #swagger.responses[201] = {
    schema: { $ref: "#/definitions/Video" }
} */
)
routes.post('/video/refresh', VideoRefreshController.store);

export default routes
