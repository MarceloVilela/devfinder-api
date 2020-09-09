import { Request, Response } from 'express';
import Video from '../../models/Video';
import Dev from '../../models/Dev';

export default {
  async index(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { page } = req.query;

    let result = null;

    const options = {
      sort: { createdAt: -1 },
      limit: 30,
      page: page ? page : 0
    };

    if (userId) {
      const loggedDev = await Dev.findById(userId)

      if (!loggedDev) {
        throw new Error(`user ${userId} not found`)
      }

      const query = {
        $and: [
          { channel_id: { $nin: loggedDev.ignore } },
        ],
      };

      result = await Video.paginate(
        query,
        options
      );
    }
    else {
      result = await Video.paginate(
        {},
        options
      );
    }

    const { docs, totalDocs: total, limit: itemsPerPage } = result;
    return res.json({ docs, total, itemsPerPage })
  }
}