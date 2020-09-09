import { Request, Response } from 'express';
import Video from '../../models/Video';
import Channel from '../../models/Channel';

export default {
  async store(req: Request, res: Response) {
    const { title, url, channel, channel_url, channel_icon, thumbnail, viewnum, date } = req.body


    const channelExists = await Channel.findOne({
      $or: [
        { name: { $eq: channel } },
        { link: { $eq: channel_url } },
      ],
    })

    if (!channelExists) {
      throw new Error(`channel(${channel}) not found, for: ${title}`)
    }

    const videoExists = await Video.findOne({
      $or: [
        //{ title: { $eq: title } },
        { url: { $eq: url } },
      ],
    })

    if (videoExists) {
      throw new Error(`video(${title}) already exists`)
    }

    const channel_id = channelExists._id;

    let thumbnailFormatted = thumbnail;
    if (!thumbnail) {
      const watch_id = url.split('=')[1]
      thumbnailFormatted = `https://i.ytimg.com/vi/${watch_id}/hqdefault.jpg`
    }

    const video = await Video.create(
      { title, url, channel_id, channel, channel_url, channel_icon, thumbnail: thumbnailFormatted, viewnum, date }
    )

    return res.json(video)
  }
}