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
      //const titles = trend.map(({ title, channel }) => `${channel}: ${title}`).join(newLine);
      const channelsNames = trend.map(({ channel }) => channel);
      const channelsNamesSet = [...new Set(channelsNames)];
      const titles = channelsNamesSet.join(newLine);

      let hashtags = <String[]>[];

      trend.map(({ channel }) => channels.filter(({ name }) => name === channel).length === 1 ? hashtags.push(...channels.filter(({ name }) => name === channel)[0]['tags']) : []);
      const hashtagsLegend = [...new Set(hashtags.filter(hashtag => typeof hashtag === 'string').map(hashtag => `#${hashtag.replace(/\s/g, '-')}`))]

      let descriptionTrend = `https://devfinder.vercel.app | Adicionados novos vídeos | ${newLine}${newLine}`;
      descriptionTrend += `${titles}${newLine}${newLine}`;
      descriptionTrend += `Repositório da aplicação web: https://github.com/marcelovilela/devfinder-next ${newLine}${newLine}`
      descriptionTrend += `Meu github: https://github.com/marcelovilela ${newLine}${newLine}`;
      descriptionTrend += `${hashtagsLegend.join(newLine)}`;

      return { descriptionTrend };
    }

    const { dataChannels, dataTrending } = await requestContent();
    const { descriptionTrend } = generateLegend(dataChannels, dataTrending);

    return res.send(`${descriptionTrend}`);
  }
}
