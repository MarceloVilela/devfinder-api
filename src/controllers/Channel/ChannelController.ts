import { Request, Response } from 'express';
import axios from 'axios';

import Channel from '../../models/Channel';
import Dev from '../../models/Dev'

export default {
  async index(req: Request, res: Response) {
    const channels = await Channel.find()

    return res.json(channels)
  },

  async show(req: Request, res: Response) {
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

  async store(req: Request, res: Response) {
    const { title: name, link, userGithub, description, category, tags, avatar } = req.body

    const nameRegex = new RegExp(name, 'i');
    const linkRegex = new RegExp(link, 'i');

    const channelExists = await Channel.findOne({
      $or: [
        { name: { $regex: nameRegex } },
        { link: { $regex: linkRegex } }
      ],
    })

    //remove emoji
    const categoryFormatted = category.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')

    if (channelExists) {
      const channelUpdated = Object.assign(channelExists, {
        name, link, userGithub, description, category: categoryFormatted, tags, avatar
      })

      await channelUpdated.save()

      return res.json(channelUpdated)
    }

    const channel = await Channel.create(
      { name, link, userGithub, description, category: categoryFormatted, tags, avatar }
    )

    const response = await axios.get(`https://api.github.com/users/${userGithub}`)
    const { name: title, bio, avatar_url } = response.data
    const dev = await Dev.create(
      { name: title, bio, avatar: avatar_url }
    )

    return res.json(channel)
  }
}