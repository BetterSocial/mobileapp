import Config from 'react-native-config';
/* eslint-disable no-useless-catch */
import {StreamChat} from 'stream-chat';

import anonymousApi from './anonymousConfig';
import api from './config';
import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';
import {getUserId} from '../utils/users';

const chatClient = new StreamChat(Config.STREAM_API_KEY);
const createChannel = async (channelType, members, channelName) => {
  try {
    const token = TokenStorage.get(ITokenEnum.token);
    const id = await getUserId();
    const user = {
      id
    };
    await chatClient.connectUser(user, token);
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

const followClient = async (members, data, text, textOwnMessage) => {
  try {
    const token = TokenStorage.get(ITokenEnum.token);
    const id = await getUserId();
    const user = {
      id
    };
    const sort = [{last_message_at: -1}];
    const filter = {type: 'messaging', members: {$eq: members}};
    await chatClient.disconnectUser();
    await chatClient.connectUser(user, token);
    const channel = await chatClient.queryChannels(filter, sort, {
      watch: true,
      state: true
    });
    const message = {
      user_id: data.user_id_follower,
      text,
      isSystem: true,
      silent: true,
      textOwnMessage,
      userIdFollowed: data?.user_id_followed,
      userIdFollower: data?.user_id_follower
    };

    const name = [data?.username_followed, data?.username_follower].join(',');

    if (channel?.length <= 0) {
      const newChannel = await createChannel('messaging', members, name);
      return newChannel.sendMessage(message, {skip_push: true});
    }
    const messageClient = chatClient.channel('messaging', channel[0].id);
    await messageClient.sendMessage(message, {skip_push: true});

    return channel;
  } catch (error) {
    console.log('error follow client', error);
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
  const token = TokenStorage.get(ITokenEnum.token);
  const id = await getUserId();
  const user = {
    id
  };
  await chatClient.connectUser(user, token);
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

const sendAnonymousDMOtherProfile = async ({
  user_id,
  anon_user_info_color_code,
  anon_user_info_color_name,
  anon_user_info_emoji_code,
  anon_user_info_emoji_name,
  message
}) => {
  const payload = {
    members: [user_id],
    message,
    anon_user_info_emoji_name,
    anon_user_info_emoji_code,
    anon_user_info_color_name,
    anon_user_info_color_code
  };

  const response = await anonymousApi.post('/chat/init-chat-anonymous', payload);

  if (response.status === 200) {
    return Promise.resolve(response.data?.data);
  }
  return Promise.reject(response.data?.data);
};

const sendSignedDMOtherProfile = async ({user_id, message}) => {
  const payload = {
    members: [user_id],
    message
  };

  const response = await api.post('/chat/init-chat', payload);

  if (response.status === 200) {
    return Promise.resolve(response.data?.data);
  }
  return Promise.reject(response.data?.data);
};

const getOrCreateAnonymousChannel = async (userId) => {
  const payload = {
    members: [userId]
  };

  try {
    const response = await anonymousApi.post('/chat/channels', payload);
    console.log({response}, 'nana15');
    if (response?.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

export {
  createChannel,
  sendSystemMessage,
  sendAnonymousDMOtherProfile,
  sendSignedDMOtherProfile,
  getOrCreateAnonymousChannel,
  followClient
};
