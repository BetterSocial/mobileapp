import {StreamChat} from 'stream-chat';
import {STREAM_API_KEY} from '@env';
import {getAccessToken} from '../utils/token';
import jwtDecode from 'jwt-decode';
const chatClient = new StreamChat(STREAM_API_KEY);
const createChannel = async (
  channelType,
  members,
  channelName,
  image = null,
) => {
  try {
    const token = await getAccessToken();
    const id = await jwtDecode(token).user_id;
    let user = {
      id: id,
    };
    await chatClient.connectUser(user, token);
    const channel = chatClient.channel(channelType, {
      members: members,
      name: channelName,
      //   image: null,
    });
    // let res = await channel.create();
    let res = await channel.watch();
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

export {createChannel};
