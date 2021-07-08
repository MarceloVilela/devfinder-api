import { Request, Response } from 'express';
import axios from 'axios';

export default {

  async store(req: Request, res: Response) {
    //const { data: toAdd } = await axios.get(process.env.APP_APIFEED_URL + '/feed/subscriptions?auth_method=stored');

    const { data: { record: toAdd } } = await axios.get(
      'https://api.jsonbin.io/v3/b/' + process.env.JSONBIN_ID_SUBS,
      { headers: { 'Content-Type': 'application/json', 'X-Master-Key': process.env.JSONBIN_API_KEY, } }
    );

    const videosAdded = [];

    for (let i = 0; i < toAdd.length; i++) {
      const { title, url, channel_name, channel_url, thumbnail } = toAdd[i];

      try {
        const token = process.env.APP_API_TOKEN;
        await axios.post(
          process.env.APP_API_URL + '/v1/video',
          { title, url, channel: channel_name, channel_url, thumbnail },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        videosAdded.push({ title, url, channel_name, channel_url, thumbnail });
      } catch (error) {
        if (error.response) {
          // Request made and server responded
          console.log(
            `STATUS(${error.response.status}) => `,
            error.response.data.message ? error.response.data.message : error.response.data
          );
        } else {
          console.log(error);
        }
      }

    };

    return res.json(videosAdded);
  }
}
