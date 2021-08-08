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
        { alternativeLink: { $eq: channel_url } },
      ],
    })

    if (!channelExists) {
      //throw new Error(`channel(${channel}) not found, for: ${title}`)
      return res.status(400).json({
        errorMessage: `channel(${channel}) not found, for: ${title}`,
        title, url, channel, channel_url, channel_icon, thumbnail, viewnum, date
      });
    }

    const videoExists = await Video.findOne({
      $or: [
        //{ title: { $eq: title } },
        { url: { $eq: url } },
      ],
    })

    if (videoExists) {
      //throw new Error(`video(${title}) already exists`)
    }

    const status = videoExists
      ? 409 //"409 Conflict" is the best existing answer code
      : 201;

    const channel_id = channelExists._id;

    let thumbnailFormatted = thumbnail;
    if (!thumbnail) {
      const watch_id = url.split('=')[1]
      thumbnailFormatted = `https://i.ytimg.com/vi/${watch_id}/hqdefault.jpg`
    }

    if (videoExists) {
      return res.status(status).json(videoExists);
    }

    const video = await Video.create(
      { title, url, channel_id, channel, channel_url, channel_icon, thumbnail: thumbnailFormatted, viewnum, date }
    )

    return res.status(status).json(video);
  },

  async index(req: Request, res: Response) {
    const { page, channel_name } = req.query;

    const channel = await Channel.findOne(
      { name: new RegExp(String(channel_name), 'i') }
    );

    console.log(channel_name)
    let result = null;

    const options = {
      sort: { createdAt: -1 },
      limit: 30,
      page: page ? page : 1,
    };

    const query = {
      $or: [
        { channel_url: channel.link },
        { channel: channel.name }
      ]
    };

    result = await Video.paginate(
      query,
      options
    );

    const { docs, totalDocs: total, limit: itemsPerPage } = result;

    return res.json({ docs, total, itemsPerPage })
  },

  async show(req: Request, res: Response) {
    const { idYoutubeWatch } = req.params;
    const filter = {
      url: new RegExp(idYoutubeWatch)
    };

    const video = await Video.findOne(filter)

    return res.json(video);
  },

}
