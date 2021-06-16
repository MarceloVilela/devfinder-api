import axios from 'axios';
import Dev from '../models/Dev';

interface User {
  user: string;
  name?: string;
  bio?: string;
  avatar?: string;
}

const findOrCreateDev = async ({ user, name = '', bio = '', avatar = '' }: User) => {
  user = user.toLowerCase()

  const userExists = await Dev.findOne({ user })
  if (userExists) {
    return userExists
  }

  if (!name || !bio || !avatar) {
    const { data } = await axios.get(`https://api.github.com/users/${user}`);
    ({ name, avatar_url: avatar, bio } = data);

    if(!name){
      name = user;
    }
  }

  const dev = await Dev.create({
    name,
    user,
    bio,
    avatar
  })

  return dev;
}

export default findOrCreateDev;
