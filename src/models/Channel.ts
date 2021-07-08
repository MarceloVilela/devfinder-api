const { Schema, model } = require('mongoose')

const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  avatar: String,
  userGithub: String,
  description: String,
  category: {
    type: String,
    required: true
  },
  tags: [{ type: String }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  deslikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }]
}, {
  timestamps: true,
})

export default model('Channel', ChannelSchema)

export type TChannel = {
  name: string;
  link: string;
  avatar: string;
  userGithub: string;
  description: string;
  category: string;
  tags: string[];
  likes: string[];
  deslikes: string[];
};
