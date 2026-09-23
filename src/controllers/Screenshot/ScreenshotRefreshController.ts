import { Request, Response } from 'express';
import axios from 'axios';

const GITHUB_OWNER = 'MarceloVilela';
const GITHUB_REPO = 'youtube-feed-subscriptions';
const GITHUB_WORKFLOW = 'screenshot.yml';
const GITHUB_REF = 'master';

export default {
  async store(req: Request, res: Response) {
    await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
      { ref: GITHUB_REF },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACTIONS_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'devfinder-api',
        },
      },
    );

    return res.status(202).json({ message: 'screenshot workflow dispatched' });
  },
};
