const Video = require('../models/Video');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { userId } = req;

    let result = null;

    if (userId) {
      const loggedDev = await Dev.findById(userId)

      if (!loggedDev) {
        throw new Error(`user ${userId} not found`)
      }

      console.log(`trending de ${loggedDev.name}, ignora os canais ${loggedDev.ignore.join(',')}`)
      const query = {
        $and: [
          { channel_id: { $nin: loggedDev.ignore } },
        ],
      };
      const options = {
        sort: { createdAt: -1 },
        limit: 30,
      };
      result = await Video.paginate(
        query,
        options
      );
    }
    else {
      const options = {
        sort: { createdAt: -1 }
      };
      result = await Video.paginate(
        {},
        options
      );
    }

    const { docs, totalDocs: total, limit: itemsPerPage } = result;
    return res.json({ docs, total, itemsPerPage })
  }
}