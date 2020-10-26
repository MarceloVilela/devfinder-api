import { Request, Response } from 'express';
import Dev from '../../models/Dev';
import findOrCreateDev from '../../services/findOrCreateDev';

export default {
  async index(req: Request, res: Response) {
    const userId = req.user?.id;
    const { page } = req.query;

    let result = null;

    const options = {
      sort: { createdAt: -1 },
      limit: 30,
      page: page ? page : 1
    };

    if (userId) {
      const loggedDev = await Dev.findById(userId)

      if (!loggedDev) {
        throw new Error(`user ${userId} not found`)
      }

      const query = {
        $and: [
          { _id: { $ne: loggedDev._id } },
          { _id: { $nin: loggedDev.likes } },
          { _id: { $nin: loggedDev.deslikes } },
        ],
      };

      result = await Dev.paginate(
        query,
        options
      )
    }
    else {
      result = await Dev.paginate(
        {},
        options
      )
    }

    const { docs, totalDocs: total, limit: itemsPerPage } = result;
    return res.json({ docs, total, itemsPerPage })
  },

  async store(req: Request, res: Response) {
    const { username: user } = req.body

    const dev = await findOrCreateDev({ user })

    return res.json(dev)
  }
}