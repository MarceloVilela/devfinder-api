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

    const { data: source } = await axios.get('https://siteplaceholder.herokuapp.com/tech-source/channels/br?url=https%3A%2F%2Fgithub.com%2Fcarolcodes%2Fvideos-pt.br-tecnologia')
    const toAdd = source.filter(({ link, title }) => !available.includes(link) && !available.includes(title))

    for (let i = 0; i < toAdd.length; i++) {
      const element = toAdd[i];

      const { title: name, link, description, category, tags } = element
      const categoryFormatted = category.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')

      const params = { params: { url: link } }
      const { data: about } = await axios.get('https://siteplaceholder.herokuapp.com/tech-source/yt/about', params)
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
