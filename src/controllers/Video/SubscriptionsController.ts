import { Request, Response } from 'express';
import Video from '../../models/Video';
import Dev from '../../models/Dev';

export default {
  async index(req: Request, res: Response) {
    const { id: userId } = req.user;
    const { page } = req.query;

    const loggedDev = await Dev.findById(userId)
    if (!loggedDev) {
      throw new Error(`user ${userId} not found`)
    }

    const query = {
      $and: [
        { channel_id: { $in: loggedDev.follow } },
      ],
    }

    const options = {
      sort: { createdAt: -1 },
      limit: 30,
      page: page ? page : 1
    };

    const result = await Video
      .paginate(
        query,
        options
      );

    const { docs, totalDocs: total, limit: itemsPerPage } = result;
    return res.json({ docs, total, itemsPerPage });
  }
}