/* eslint-disable no-useless-catch */
import {StreamChat} from 'stream-chat';
import Config from 'react-native-config';
import {getAccessToken} from '../utils/token';
import {getUserId} from '../utils/users';

const chatClient = new StreamChat(Config.STREAM_API_KEY);
const createChannel = async (
  channelType,
  members,
  channelName,

) => {
  try {
    const token = await getAccessToken();
    const id = await getUserId();
    const user = {
      id,
    };
    await chatClient.connectUser(user, token.id);
    const channel = chatClient.channel(channelType, {
      name: channelName,
      members
      //   image: null,
    });
    await channel.create();
    return channel
  } catch (error) {
    throw error;
  }
};

export {createChannel};
