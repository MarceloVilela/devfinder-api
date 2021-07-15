import { Request, Response } from 'express';
import axios from 'axios';

import { TChannel } from '../../models/Channel';
import { TVideo } from '../../models/Video';

type ResponseFeedTrending = {
  docs: TVideo[];
}

type TChannelsCategorized = {
  [key: string]: TChannel[];
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
      const channelsCategorized = {} as TChannelsCategorized;

      const categoriesName = Array.from(new Set(
        channels?.map(({ category }) => category)
      ));
      categoriesName.forEach(category => {
        channelsCategorized[category] = channels.filter(item => item.category === category)
      });

      const descriptionsForCategories = Object.keys(channelsCategorized)
        .map(categoryName => {
          const items = channelsCategorized[categoryName];

          const names = items.map(({ name }) => name).join(newLine);

          let hashtags = <String[]>[];
          items.forEach(({ tags }) => { tags.forEach(tag => hashtags.push(tag)) });
          const hashtagsLegend = [...new Set(hashtags.filter(hashtag => typeof hashtag === 'string').map(hashtag => `#${hashtag.replace(/\s/g, '-')}`))]

          let description = `Encontre canais sobre ${categoryName} em https://devfinder.vercel.app/channel ${newLine}${newLine}`;
          description += `${names}${newLine}${newLine}`;
          description += `Repositório da aplicação web: https://github.com/marcelovilela/devfinder-next ${newLine}${newLine}`;
          description += `Meu github: https://github.com/marcelovilela ${newLine}${newLine}`;
          description += `${hashtagsLegend.join(newLine)}`
          description += `${newLine}${newLine}--------------------${newLine}${newLine}`;

          `Encontre canais sobre Linux em https://devfinder.vercel.app/channel

Diolinux
Mateus Muller
MicroHobby
Slackjeff

#devops #sistemasembarcados #infraestrutura #linux #open-source

https://github.com/marcelovilela

https://github.com/marcelovilela/devfinder-next
      `;

          return description;
        });

      return { descriptionsForCategories };
    }

    const { dataChannels, dataTrending } = await requestContent();
    const { descriptionsForCategories } = generateLegend(dataChannels, dataTrending);

    return res.send(`${descriptionsForCategories}`);
  }
}
