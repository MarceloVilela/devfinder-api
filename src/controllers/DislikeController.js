const Dev = require('../models/Dev')

module.exports = {
  async store(req, res) {
    const { userId } = req;
    const { username } = req.params

    const loggedDev = await Dev.findById(userId)
    const targetDev = await Dev.findOne({ user: username })

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' })
    }

    if (!loggedDev.deslikes.includes(targetDev._id)) {
      loggedDev.deslikes.push(targetDev._id)
      await loggedDev.save()
    }

    return res.json(loggedDev)
  }
}