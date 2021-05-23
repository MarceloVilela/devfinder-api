import { Request, Response } from 'express';
import axios from 'axios';

import Channel from '../../models/Channel';
import Dev from '../../models/Dev'

export default {

  async store(req: Request, res: Response) {
    const stored = await Channel.find()
    const names = stored.map(({ name }) => name)
    const links = stored.map(({ link }) => link)
    const available = [...names, ...links]

    const url = 'https://github.com/lucasgomide/videos-pt.br-tecnologia'
    const configRequestChannels = { params: { url } }
    const { data: source } = await axios.get(process.env.APP_APIPLACEHOLDER_URL + '/tech-source/channels/br', configRequestChannels)
    const toAdd = source.filter(({ link, title }) => !available.includes(link) && !available.includes(title))

    for (let i = 0; i < toAdd.length; i++) {
      const element = toAdd[i];

      const { title: name, link, description, category, tags } = element
      const categoryFormatted = category.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')

      const configRequestAbout = { params: { url: link } }
      const { data: about } = await axios.get(process.env.APP_APIPLACEHOLDER_URL + '/tech-source/yt/about', configRequestAbout)

      const { profileImage: avatar, userGithub: aboutUserGitHub } = about;

      let userGithub = undefined
      let githubUser = {}
      try {
        const paramName = aboutUserGitHub ? aboutUserGitHub : name
        const responseGitHub = await axios.get(`https://api.github.com/users/${paramName}`)
        githubUser = responseGitHub.data
        userGithub = responseGitHub.data.login
      } catch (error) {
        userGithub = ''
      }

      const channel = await Channel.create(
        { name, link, userGithub, description, category: categoryFormatted, tags, avatar }
      )

      if (githubUser.avatar_url) {
        const { name: title, bio, avatar_url } = githubUser
        const dev = await Dev.create(
          { name: title, bio, avatar: avatar_url }
        )
      }
    };

    return res.json(toAdd);
  }
}
