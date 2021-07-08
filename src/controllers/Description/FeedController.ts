import { Request, Response } from 'express';
import axios from 'axios';

import { TChannel } from '../../models/Channel';
import { TVideo } from '../../models/Video';

type ResponseFeedTrending = {
  docs: TVideo[];
}

export default {

  async index(req: Request, res: Response) {
    const requestContent = async () => {
      try {
        const { data: dataChannels } = await axios.get<TChannel[]>(process.env.APP_API_URL + `/v1/channels`);
        const { data: { docs: dataTrending } } = await axios.get<ResponseFeedTrending>(process.env.APP_API_URL + `/v1/feed/trending?page=1`);
        return { dataChannels, dataTrending };
      }
      catch (err) {
        throw new Error('Erro ao listar feed');
      }
    };

    //const newLine = "\n";
    const newLine = "<br />";

    const generateLegend = (channels: TChannel[], trend: TVideo[]) => {
      const channelAddedLegend = channels.map(({ tags, name }) => `https://devfinder.vercel.app/channel | Adicionado o canal: ${name} | ${tags.map(tag => '#' + tag).join(' ')}`)
      const descriptionChannels = channelAddedLegend.join(newLine);

      //
      //
      //
      let hashtags = <String[]>[];
      //trend.map(({channel}) => channels.filter(({name}) => name === channel).length === 1 ? channels.filter(({name}) => name === channel)[0]['tags'] : []);
      trend.map(({ channel }) => channels.filter(({ name }) => name === channel).length === 1 ? hashtags.push(...channels.filter(({ name }) => name === channel)[0]['tags']) : []);
      const hashtagsLegend = [...new Set(hashtags.filter(hashtag => typeof hashtag === 'string').map(hashtag => `#${hashtag.replace(/\s/g, '-')}`))]
      const descriptionTrend = `https://devfinder.vercel.app | Adicionados novos vídeos | ${newLine} ${hashtagsLegend.join(newLine)}`;

      return { descriptionChannels, descriptionTrend };
    }

    const { dataChannels, dataTrending } = await requestContent();
    const { descriptionChannels, descriptionTrend } = generateLegend(dataChannels, dataTrending);

    return res.send(`${descriptionTrend} ${newLine}${newLine}${newLine} ${descriptionChannels}`);
  }
}
