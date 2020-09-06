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

    if (targetDev.likes.includes(loggedDev._id)) {
      console.log('DEU MATCH')
    }

    if (!loggedDev.likes.includes(targetDev._id)) {
      loggedDev.likes.push(targetDev._id)
      await loggedDev.save()
    }

    return res.json(loggedDev)
  }
}