import Config from 'react-native-config';
/* eslint-disable no-useless-catch */
import {StreamChat} from 'stream-chat';

import {getAccessToken} from '../utils/token';
import {getUserId} from '../utils/users';

const chatClient = new StreamChat(Config.STREAM_API_KEY);
const createChannel = async (channelType, members, channelName) => {
  try {
    const token = await getAccessToken();
    const id = await getUserId();
    const user = {
      id
    };
    await chatClient.connectUser(user, token.id);
    const channel = chatClient.channel(channelType, {
      name: channelName,
      members
      //   image: null,
    });
    await channel.create();
    return channel;
  } catch (error) {
    throw error;
  }
};

const sendSystemMessage = async (
  channelType,
  channelId,
  channelName,
  selfUserText,
  otherUserText
) => {
  const token = await getAccessToken();
  const id = await getUserId();
  const user = {
    id
  };
  await chatClient.connectUser(user, token.id);
  try {
    const channel = await chatClient.channel(channelType, channelId);
    channel.update(
      {
        name: channelName
      },
      {
        text: selfUserText,
        system_user: id,
        is_from_prepopulated: true,
        other_text: otherUserText
      }
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export {createChannel, sendSystemMessage};
