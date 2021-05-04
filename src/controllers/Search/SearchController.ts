import { Request, Response } from 'express';
import Video from '../../models/Video';
import Channel from '../../models/Channel';

export default {
  async show(req: Request, res: Response) {
    const { q } = req.query;
    const searchQuery = String(q);

    const filterChannel = {
      $or: [
        { name: new RegExp(searchQuery, 'i') },
        { link: new RegExp(searchQuery, 'i') }
      ]
    };
    const channels = await Channel.find(filterChannel);
    const channelsOptions = channels.map(({ name }) => ({
      value: encodeURI(`${name}`),
      label: name,
      type: 'channel'
    }));

    const filterVideo = {
      $or: [
        { title: new RegExp(searchQuery, 'i') }
      ]
    };
    const videos = await Video.find(filterVideo);
    const videosOptions = videos.map(({ url, title }) => ({
      value: encodeURI(`${url.split('v=')[1]}`),
      label: title,
      type: 'video'
    }));

    return res.json([...channelsOptions, ...videosOptions]);
  }
}
