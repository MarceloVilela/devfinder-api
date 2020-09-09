import { Request, Response } from 'express';
import Video from '../../models/Video';
import Dev from '../../models/Dev';

export default {
  async index(req: Request, res: Response) {
    const { id: userId } = req.user;

    const loggedDev = await Dev.findById(userId)

    if (!loggedDev) {
      throw new Error(`user ${userId} not found`)
    }

    const videos = await Video
    .find({
      $and: [
        { channel_id: { $in: loggedDev.follow } },
      ],
    })
    .sort({'createdAt': -1})

    return res.json(videos)
  }
}