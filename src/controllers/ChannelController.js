const axios = require('axios')
const { validate: isUuid } = require('uuid');

const Channel = require('../models/Channel')
const Dev = require('../models/Dev')

module.exports = {
  async index(req, res) {
    const channels = await Channel.find()

    return res.json(channels)
  },

  async show(req, res) {
    const { 0: search_query } = req.params;
    const filter = {
      $or: [
        { name: new RegExp(search_query) },
        { link: new RegExp(search_query) }
      ]
    };

    const channel = await Channel.findOne(filter)

    return res.json(channel)
  },

  async store(req, res) {
    const { name, link, userGithub, description, category, tags } = req.body

    const channelExists = await Channel.findOne({ name })

    //remove emoji
    const categoryFormatted = category.category.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')

    if (channelExists) {
      const channelUpdated = Object.assign(channelExists, {
        name, link, userGithub, description, category: categoryFormatted, tags
      })

      await channelUpdated.save()

      return res.json(channelUpdated)
    }

    const channel = await Dev.create(
      { name, link, userGithub, description, category: categoryFormatted, tags }
    )

    const response = await axios.get(`https://api.github.com/users/${username}`)
    const { name: title, bio, avatar_url: avatar } = response.data
    const dev = await Dev.create(
      { name: title, bio, avatar }
    )

    return res.json(dev)
  }
}