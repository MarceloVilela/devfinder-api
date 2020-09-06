const Dev = require('../models/Dev')

module.exports = {
  async show(req, res) {
    const { userId } = req;
    
    const loggedDev = await Dev.findById(userId)
    
    if (!loggedDev) {
      return res.status(400).json({ error: 'DevProfile not exists' })
    }

    return res.json(loggedDev)
  }
}