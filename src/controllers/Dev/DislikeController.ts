import { Request, Response } from 'express';
const Dev = require('../../models/Dev')

export default {
  async store(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { username } = req.params;

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