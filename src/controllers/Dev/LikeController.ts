import { Request, Response } from 'express';
import Dev from '../../models/Dev';

export default {
  async index(req: Request, res: Response) {
    const { id: userId } = req.user;

    const loggedDev = await Dev.findById(userId)

    if (!loggedDev) {
      throw new Error(`user ${userId} not found`)
    }

    const devs = await Dev.find({
      $and: [
        { _id: { $ne: loggedDev._id } },
        { _id: { $in: loggedDev.likes } }
      ],
    })

    return res.json(devs)
  },

  async store(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { username } = req.params;

    const loggedDev = await Dev.findById(userId)
    const targetDev = await Dev.findOne({ user: username })

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' })
    }

    if (!loggedDev.likes.includes(targetDev._id)) {
      loggedDev.likes.push(targetDev._id)
      await loggedDev.save()
    }

    return res.json(loggedDev)
  },

  async delete(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { username } = req.params;

    const loggedDev = await Dev.findById(userId)
    const targetDev = await Dev.findOne({ user: username })

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' })
    }

    if (loggedDev.likes.includes(targetDev._id)) {
      const index = loggedDev.likes.indexOf(targetDev._id);
      loggedDev.likes.splice(index, 1);
      await loggedDev.save();
    }

    return res.json(loggedDev)
  }
}
