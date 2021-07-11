import { Request, Response } from 'express';
import axios from 'axios';

export default {

  async store(req: Request, res: Response) {
    //const { data: toAdd } = await axios.get(process.env.APP_APIFEED_URL + '/feed/subscriptions?auth_method=stored');

    const { data: { record: toAdd } } = await axios.get(
      'https://api.jsonbin.io/v3/b/' + process.env.JSONBIN_ID_SUBS,
      { headers: { 'Content-Type': 'application/json', 'X-Master-Key': process.env.JSONBIN_API_KEY, } }
    );

    //console.log('toAdd: ', toAdd.length);

    const videosAdded = [];
    const videosFounded = [];
    const errors = [];

    for (let i = 0; i < toAdd.length; i++) {
      const { title, url, channel_name, channel_url, thumbnail } = toAdd[i];

      try {
        const token = process.env.APP_API_TOKEN;
        await axios.post(
          process.env.APP_API_URL + '/v1/video',
          { title, url, channel: channel_name, channel_url, thumbnail },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        //console.log('SUCCESS:', title);
        videosAdded.push({ title, url, channel_name, channel_url, thumbnail });
      } catch (error) {
        if (error.response.status && error.response.status === 409) {
          // Request made and server responded
          //console.log(`FOUND(${error.response.status}):`);
          //console.table(error.response.data);
          videosFounded.push(error.response.data);
        }
        else if (error.response) {
          // Request made and server responded
          //console.log(`ERROR_STATUS(${error.response.status}):`);
          //console.table(error.response.data);
          errors.push(error.response.data);
        } else {
          //console.log(error);
          errors.push(error);
        }
      }

    };

    return res.json({ errors, videosAdded, videosFounded });
  }
}
