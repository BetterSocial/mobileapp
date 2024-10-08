import Config from 'react-native-config';
/* eslint-disable no-useless-catch */
import {StreamChat} from 'stream-chat';

import {useMutation} from 'react-query';
import anonymousApi from './anonymousConfig';
import api from './config';
import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';
import {getUserId} from '../utils/users';
import ChatSchema from '../database/schema/ChatSchema';
import SignedMessageRepo from './repo/signedMessageRepo';
import AnonymousMessageRepo from './repo/anonymousMessageRepo';

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

const connectUser = async () => {
  const token = TokenStorage.get(ITokenEnum.token);
  const id = await getUserId();
  const user = {id};
  await chatClient.disconnectUser();
  await chatClient.connectUser(user, token);
};

const queryChannels = async (members) => {
  const sort = [{last_message_at: -1}];
  const filter = {type: 'messaging', members: {$eq: members}};
  const result = await chatClient.queryChannels(filter, sort, {watch: true, state: true});
  return result;
};

const followClient = async (members, data, text, textOwnMessage) => {
  try {
    await connectUser();
    const channels = await queryChannels(members);
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

    if (channels?.length <= 0) {
      const newChannel = await createChannel('messaging', members, name);
      return newChannel.sendMessage(message, {skip_push: true});
    }
    const messageClient = chatClient.channel('messaging', channels[0].id);
    await messageClient.sendMessage(message, {skip_push: true});

    return channels;
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
    member: user_id,
    message,
    anon_user_info_emoji_name,
    anon_user_info_emoji_code,
    anon_user_info_color_name,
    anon_user_info_color_code
  };

  const response = await anonymousApi.post('/chat/init-chat-anonymous-v2', payload);

  if (response.status === 200) {
    return Promise.resolve(response.data?.data);
  }
  return Promise.reject(response.data?.data);
};

const sendSignedDMOtherProfile = async ({user_id, message}) => {
  const payload = {
    member: user_id,
    message
  };

  const response = await api.post('/chat/init-chat-signed-v2', payload);
  if (response.status === 200) {
    return Promise.resolve(response.data?.data);
  }
  return Promise.reject(response.data?.data);
};

const getOrCreateAnonymousChannel = async (userId, oldChannelId = null, context = null) => {
  const payload = {
    members: [userId],
    oldChannelId,
    context
  };

  try {
    const response = await anonymousApi.post('/chat/channels', payload);
    if (response?.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const moveChatToSigned = async ({oldChannelId, targetUserId, source}) => {
  try {
    const response = await api.post('/chat/move-to-sign', {oldChannelId, targetUserId, source});
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const moveChatToAnon = async ({
  anon_user_info_color_code,
  anon_user_info_color_name,
  anon_user_info_emoji_code,
  anon_user_info_emoji_name,
  oldChannelId,
  targetUserId,
  source
}) => {
  try {
    const response = await anonymousApi.post('/chat/move-to-anon', {
      anon_user_info_color_code,
      anon_user_info_color_name,
      anon_user_info_emoji_code,
      anon_user_info_emoji_name,
      oldChannelId,
      targetUserId,
      source,
      context: 'chat'
    });
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const initChatFromPost = async ({source, id, postId}) => {
  let payload = {source};
  switch (source) {
    case 'post':
      payload = {...payload, postId: id};
      break;
    case 'comment':
      payload = {...payload, commentId: id, postId};
      break;
    default:
      break;
  }
  try {
    const response = await api.post('/chat/init-chat-from-post', payload);
    if (response?.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const getAllowAnonDmStatus = async (type, id) => {
  const generateUrl = () => {
    switch (type) {
      case 'post':
        return `/users/check-allow-dm/?source=post&post_id=${id}`;
      case 'comment':
        return `/users/check-allow-dm/?source=comment&comment_id=${id}`;
      default:
        return '';
    }
  };
  try {
    const response = await api.get(generateUrl());
    if (response?.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const checkValidUrl = async (url) => {
  try {
    const response = await api.get(url);
    if (response?.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const initChatFromPostAnon = async ({source, id, feedId}) => {
  let payload = {source};
  switch (source) {
    case 'post':
      payload = {...payload, postId: id};
      break;
    case 'comment':
      payload = {...payload, commentId: id, postId: feedId};
      break;
    default:
      break;
  }
  try {
    const response = await anonymousApi.post('/chat/init-chat-from-post', payload);
    if (response?.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const addMemberGroup = async ({channelId, memberIds}) => {
  try {
    const response = await api.post('/chat/group/add-members', {
      channel_id: channelId,
      members: memberIds
    });
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const removeMemberGroup = async ({channelId, targetUserId}) => {
  try {
    const response = await api.post('/chat/group/remove-member', {
      channelId,
      targetUserId
    });
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

const leaveGroup = async ({channelId}) => {
  try {
    const response = await api.post('/chat/group/leave', {
      channelId
    });
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  } catch (e) {
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
};

function useSendSignedMessage(options) {
  return useMutation(
    (payload) =>
      SignedMessageRepo.sendSignedMessage(
        payload.channelId,
        payload.message,
        payload.channelType,
        payload.attachments,
        payload.replyMessageId
      ),
    {
      retry: true,
      ...options
    }
  );
}
function useSendAnonMessage(options) {
  return useMutation(
    (payload) =>
      AnonymousMessageRepo.sendAnonymousMessage(
        payload.channelId,
        payload.message,
        payload.attachments,
        payload.replyMessageId
      ),
    {
      retry: true,
      ...options
    }
  );
}

const manualResendPendingMessages = async (localDb, message, anonMutation, signedMutation) => {
  const currentChat = await ChatSchema.getByid(localDb, message?.id);
  let response;
  if (message.channel_type === 'ANON_PM') {
    response = await anonMutation.mutateAsync({
      channelId: message?.channelId,
      message: message?.message,
      attachments: message.attachmentJson,
      replyMessageId: null
    });
  } else {
    response = await signedMutation.mutateAsync({
      channelId: message?.channelId,
      message: message?.message,
      channelType: 0,
      attachments: message.attachmentJson,
      replyMessageId: null
    });
    await currentChat.updateChatSentStatus(localDb, response);
  }
};

const resendPendingMessages = async (localDb, anonMutation, signedMutation) => {
  try {
    const pendingMessages = await ChatSchema.getPendingMessages(localDb);
    const promises = pendingMessages?.map((message) => {
      return manualResendPendingMessages(localDb, message, anonMutation, signedMutation);
    });
    await Promise.all(promises);
  } catch (e) {
    console.log('[Error] failed get pending chats', e);
  }
};

export {
  createChannel,
  sendSystemMessage,
  sendAnonymousDMOtherProfile,
  sendSignedDMOtherProfile,
  getOrCreateAnonymousChannel,
  followClient,
  moveChatToSigned,
  moveChatToAnon,
  initChatFromPost,
  initChatFromPostAnon,
  getAllowAnonDmStatus,
  addMemberGroup,
  removeMemberGroup,
  leaveGroup,
  resendPendingMessages,
  useSendSignedMessage,
  useSendAnonMessage,
  checkValidUrl
};
