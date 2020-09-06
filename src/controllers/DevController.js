const {Query} = require('mongoose')
const { validate: isUuid } = require('uuid');

const Dev = require('../models/Dev')
const createDevService = require('../services/CreateDev')

module.exports = {
  async index(req, res) {
    const { userId } = req;

    let devs = [];

    if (userId) {
      const loggedDev = await Dev.findById(userId)
      console.log('usuario logado: ', loggedDev._id);

      if (!loggedDev) {
        throw new Error(`user ${user} not found`)
      }

      devs = await Dev.find({
        $and: [
          { _id: { $ne: loggedDev._id } },
          { _id: { $nin: loggedDev.likes } },
          { _id: { $nin: loggedDev.deslikes } },
        ],
      })
    }
    else {
      devs = await Dev.find()
    }

    return res.json(devs)
  },

  async store(req, res) {
    const { username: user } = req.body

    const dev = await createDevService({ user })

    return res.json(dev)
  }
}