const {Schema, model} = require('mongoose')

const DevSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  bio: String,
  avatar: {
    type: String,
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  deslikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  follow: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  }],
  ignore: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  }]
}, {
  timestamps: true,
})

export default model('Dev', DevSchema)