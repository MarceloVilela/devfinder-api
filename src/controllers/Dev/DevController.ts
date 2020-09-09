import { Request, Response } from 'express';
import Dev from '../../models/Dev';
import findOrCreateDev from '../../services/findOrCreateDev';

export default {
  async index(req: Request, res: Response) {
    const { id: userId } = req.user;

    let devs = [];

    if (userId) {
      const loggedDev = await Dev.findById(userId)

      if (!loggedDev) {
        throw new Error(`user ${userId} not found`)
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

  async store(req: Request, res: Response) {
    const { username: user } = req.body

    const dev = await findOrCreateDev({ user })

    return res.json(dev)
  }
}