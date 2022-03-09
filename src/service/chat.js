import {StreamChat} from 'stream-chat';
import Config from 'react-native-config';
import {STREAM_API_KEY} from '@env';
import {getAccessToken} from '../utils/token';
import {getUserId} from '../utils/users';

const chatClient = new StreamChat(Config.STREAM_API_KEY);
const createChannel = async (
  channelType,
  members,
  channelName,
  image = null,
) => {
  try {
    const token = await getAccessToken();
    const id = await getUserId();
    let user = {
      id: id,
    };
    await chatClient.connectUser(user, token);
    const channel = chatClient.channel(channelType, {
      members: members,
      name: channelName,
      //   image: null,
    });
    let res = await channel.create();
    // let res = await channel.watch();
    // console.log(res);
    return res.channel;
  } catch (error) {
    throw error;
  }
};

export {createChannel};
