const Dev = require('../models/Dev')
const Channel = require('../models/Channel')

module.exports = {
  async store(req, res) {
    const { userId } = req;
    const { username } = req.params

    const loggedDev = await Dev.findById(userId)
    const targetChannel = await Channel.findOne({ name: username })

    if (!targetChannel) {
      return res.status(400).json({ error: 'Channel not exists' })
    }

    if (!loggedDev.ignore.includes(targetChannel._id)) {
      loggedDev.ignore.push(targetChannel._id)
      await loggedDev.save()
    }

    return res.json(loggedDev)
  }
}