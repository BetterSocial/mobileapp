import api from '../config';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {ChannelData} from '../../../types/repo/ChannelData';
import {
  ChannelTypeEnum,
  SignedPostNotification
} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {GetstreamChannelType} from './types.d';

type SendPayloadType = {
  channelId: string;
  message: string;
  channelType: number;
  messageType?: string;
  attachments?: any;
  replyMessageId?: string;
};
type ChangeGroupInfoPayload = {
  channel_id: string;
  channel_name?: string;
  channel_image?: string;
};

const baseUrl = {
  checkIsTargetAllowingAnonDM: 'chat/channels/check-allow-anon-dm-status',
  sendSignedMessage: '/chat/send-signed-message',
  getAllSignedChannels: '/chat/channels/signed',
  getAllSignedPostNotifications: '/feeds/feed-chat',
  setChannelAsRead: '/chat/channels/read',
  createSignedChat: '/chat/channels-signed',
  deleteMessage: (messageId: string) => `/chat/message/${messageId}`,
  getSingleSignedPostNotifications: (activityId: string) => `/feeds/feed-chat/${activityId}`,
  getSignedChannelDetail: (channelType: GetstreamChannelType, channelId: string) =>
    `/chat/channel-detail?channel_type=${channelType}&channel_id=${channelId}`,
  changeSignedChannelDetail: '/chat/channel-detail'
};

interface SignedMessageRepoTypes {
  checkIsTargetAllowingAnonDM: (targetUserId: string) => Promise<any>;
  deleteMessage: (messageId: string) => Promise<any>;
  sendSignedMessage: (
    channelId: string,
    message: string,
    channelType: number,
    attachments: any,
    replyMessageId?: string
  ) => Promise<any>;
  getAllSignedChannels: (timeStamp: string) => Promise<ChannelData[]>;
  getAllSignedPostNotifications: (timeStamp: string) => Promise<SignedPostNotification[]>;
  getSingleSignedPostNotifications: (activityId: string) => Promise<SignedPostNotification>;
  setChannelAsRead: (channelId: string, channelType: ChannelTypeEnum) => Promise<boolean>;
  createSignedChat: (body: string[]) => Promise<any>;
  getSignedChannelDetail: (channelType: GetstreamChannelType, channelId: string) => Promise<any>;
  changeSignedChannelDetail: (
    channelId: string,
    channelName?: string,
    channelImage?: string
  ) => Promise<any>;
}

async function checkIsTargetAllowingAnonDM(targetUserId: string) {
  try {
    const payload = {
      members: [targetUserId]
    };
    const response = await api.post(baseUrl.checkIsTargetAllowingAnonDM, payload);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.message);
  } catch (e) {
    console.log(e);
    if (e?.response?.data?.message) return Promise.reject(e?.response?.data?.message);
    return Promise.reject(e);
  }
}

async function sendSignedMessage(
  channelId: string,
  message: string,
  channelType: number,
  attachments: any,
  replyMessageId?: string
) {
  let payload: SendPayloadType = {channelId, message, channelType, attachments};
  if (replyMessageId) {
    payload = {...payload, messageType: 'reply', replyMessageId};
  }

  try {
    const response = await api.post(baseUrl.sendSignedMessage, payload);

    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.data);
  } catch (e) {
    console.log(e?.response);
    return Promise.reject(e);
  }
}

async function getAllSignedChannels(timeStamp: string | undefined) {
  const url = timeStamp ? `${baseUrl.getAllSignedChannels}` : baseUrl.getAllSignedChannels;
  try {
    const response = await api.get(url);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log('FAILED URL', url);
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllSignedPostNotifications(timeStamp: string | undefined) {
  const url = timeStamp
    ? `${baseUrl.getAllSignedPostNotifications}?last_fetch_date=${timeStamp}`
    : baseUrl.getAllSignedPostNotifications;
  try {
    const response = await api.get(url);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log('FAILED URL', url);
    console.log(e);
    return Promise.reject(e);
  }
}

async function getSingleSignedPostNotifications(
  activityId: string
): Promise<SignedPostNotification> {
  try {
    const response = await api.get(baseUrl.getSingleSignedPostNotifications(activityId));
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function setChannelAsRead(channelId: string, channelType: ChannelTypeEnum): Promise<boolean> {
  try {
    const data = {channelId, channelType};
    const response = await api.post(baseUrl.setChannelAsRead, data);
    if (response.status === 200) {
      return Promise.resolve(true);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function createSignedChat(members: string[]) {
  try {
    const body = {
      members
    };
    const response = await api.post(baseUrl.createSignedChat, body);
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getSignedChannelDetail(channelType: GetstreamChannelType, channelId: string) {
  try {
    const response = await api.get(baseUrl.getSignedChannelDetail(channelType, channelId));
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function changeSignedChannelDetail(
  channelId: string,
  channelName?: string,
  channelImage?: string
) {
  const payload: ChangeGroupInfoPayload = {
    channel_id: channelId
  };
  if (channelName) {
    payload.channel_name = channelName;
  }
  if (channelImage) {
    payload.channel_image = channelImage;
  }

  try {
    const response = await api.post(baseUrl.changeSignedChannelDetail, payload);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.data);
  } catch (e) {
    console.log(e?.response);
    return Promise.reject(e);
  }
}

async function deleteMessage(messageId: string) {
  try {
    const response = await api.delete(baseUrl.deleteMessage(messageId));
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

const SignedMessageRepo: SignedMessageRepoTypes = {
  checkIsTargetAllowingAnonDM,
  deleteMessage,
  sendSignedMessage,
  getAllSignedChannels,
  getAllSignedPostNotifications,
  getSingleSignedPostNotifications,
  setChannelAsRead,
  createSignedChat,
  getSignedChannelDetail,
  changeSignedChannelDetail
};

export default SignedMessageRepo;
