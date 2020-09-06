const { Schema, model } = require('mongoose')

/*
 * https://github.com/kihapper/TheirTube/blob/master/src/theirtube.js#L172
 * title, url, channel, channel_url, -channel_icon, thumbnail, -viewnum, -date
 */
const VideoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  channel_id: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  },
  channel: {
    type: String,
    required: true
  },
  channel_url: {
    type: String,
    required: true
  },
  channel_icon: String,
  thumbnail: {
    type: String,
    required: true
  },
  viewnum: Number,
  date: Date,
}, {
  timestamps: true,
})

module.exports = model('Video', VideoSchema)
