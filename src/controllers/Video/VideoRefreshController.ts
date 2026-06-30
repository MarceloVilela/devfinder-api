import { Request, Response } from 'express';
import Video from '../../models/Video';
import Channel from '../../models/Channel';

type AddResult =
  | { status: 'added'; data: unknown }
  | { status: 'duplicate'; data: unknown }
  | { status: 'error'; data: unknown };

async function addVideo(item: {
  title: string;
  url: string;
  channel_name: string;
  channel_url: string;
  thumbnail: string;
}): Promise<AddResult> {
  const { title, channel_name: channel, channel_url } = item;
  const url = item.url.replace(/&pp=[^&]*/g, '');
  const thumbnail = item.thumbnail ? item.thumbnail.replace(/&pp=[^&]*/g, '') : '';

  const channelExists = await Channel.findOne({
    $or: [
      { name: { $eq: channel } },
      { link: { $eq: channel_url } },
      { alternativeLink: { $eq: channel_url } },
    ],
  });

  if (!channelExists) {
    return {
      status: 'error',
      data: { errorMessage: `channel(${channel}) not found, for: ${title}`, title, url, channel, channel_url, thumbnail },
    };
  }

  const videoExists = await Video.findOne({ url: { $eq: url } });

  if (videoExists) {
    return {
      status: 'duplicate',
      data: { errorMessage: `video(${title}) already exists`, ...videoExists.toObject() },
    };
  }

  let thumbnailFormatted = thumbnail;
  if (!thumbnail) {
    const watch_id = url.split('=')[1];
    thumbnailFormatted = `https://i.ytimg.com/vi/${watch_id}/hqdefault.jpg`;
  }

  const video = await Video.create({
    title,
    url,
    channel_id: channelExists._id,
    channel,
    channel_url,
    thumbnail: thumbnailFormatted,
  });

  return { status: 'added', data: video };
}

export default {
  async store(req: Request, res: Response) {
    const { record: toAdd } = req.body;

    const videosAdded = [];
    const videosFounded = [];
    const errors = [];

    for (const item of toAdd) {
      try {
        const result = await addVideo(item);
        if (result.status === 'added') videosAdded.push(result.data);
        if (result.status === 'duplicate') videosFounded.push(result.data);
        if (result.status === 'error') errors.push(result.data);
      } catch (error) {
        errors.push(error);
      }
    }

    return res.json({ errors, videosAdded, videosFounded });
  },
};
