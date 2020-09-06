const axios = require('axios')
const Dev = require('../models/Dev')

const create = async ({ user, name, bio, avatar }) => {
  user = user.toLowerCase()
  
  const userExists = await Dev.findOne({ user })
  if (userExists) {
    return userExists
  }

  if (!name || !bio || !avatar) {
    const { data } = await axios.get(`https://api.github.com/users/${user}`);
    ({ name, avatar_url: avatar, bio } = data);
  }

  const dev = await Dev.create({
    name,
    user,
    bio,
    avatar
  })

  return dev;
}

module.exports = create;