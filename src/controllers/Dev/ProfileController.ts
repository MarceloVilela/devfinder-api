import { Request, Response } from 'express';
import Dev from '../../models/Dev';

export default {
  async show(req: Request, res: Response) {
    const { id: userId } = req.user;

    const loggedDev = await Dev.findById(userId)

    if (!loggedDev) {
      return res.status(400).json({ error: 'DevProfile not exists' })
    }

    return res.json(loggedDev)
  }
}