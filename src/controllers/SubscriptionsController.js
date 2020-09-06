const Video = require('../models/Video');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { userId } = req;

    const loggedDev = await Dev.findById(userId)

    if (!loggedDev) {
      throw new Error(`user ${userId} not found`)
    }

    console.log(`trending de ${loggedDev.name}, ignora os canais ${loggedDev.ignore.join(',')}`)
    const videos = await Video
    .find({
      $and: [
        { channel_id: { $in: loggedDev.follow } },
      ],
    })
    .sort({'createdAt': -1})

    return res.json(videos)
  }
}