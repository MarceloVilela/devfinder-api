import { Request, Response } from 'express';
import Dev from '../../models/Dev';
import Channel from '../../models/Channel';

export default {
  async store(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { username } = req.params

    const loggedDev = await Dev.findById(userId)
    const targetChannel = await Channel.findOne({ name: username })

    if (!targetChannel) {
      return res.status(400).json({ error: 'Channel not exists' })
    }

    if (!loggedDev.follow.includes(targetChannel._id)) {
      loggedDev.follow.push(targetChannel._id)
      await loggedDev.save()
    }

    return res.json(loggedDev)
  }
}