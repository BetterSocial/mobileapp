import anonymousApi from '../anonymousConfig';
import {AnonymousPostNotification} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {ChannelData} from '../../../types/repo/ChannelData';
import {GetstreamChannelType} from './types.d';

type SendPayloadType = {
  channelId: string;
  message: string;
  messageType?: string;
  replyMessageId?: string;
  attachments?: any;
};

const baseUrl = {
  checkIsTargetAllowingAnonDM: 'chat/channels/check-allow-anon-dm-status',
  sendAnonymousMessage: '/chat/anonymous',
  getAllAnonymousChannels: '/chat/channels',
  getAllAnonymousPostNotifications: '/feeds/feed-chat-v2/anonymous',
  deleteMessage: (messageId: string) => `/chat/message/${messageId}`,
  getSingleAnonymousPostNotifications: (activityId: string) => `/feeds/feed-chat-v2/${activityId}`,
  setChannelAsRead: (channelId: string) => `/chat/channels/${channelId}/read`,
  getAnonymousChannelDetail: (channelType: GetstreamChannelType, channelId: string) =>
    `/chat/channel-detail?channel_type=${channelType}&channel_id=${channelId}`
};

interface AnonymousMessageRepoTypes {
  checkIsTargetAllowingAnonDM: (targetUserId: string) => Promise<any>;
  deleteMessage: (messageId: string) => Promise<any>;
  sendAnonymousMessage: (
    channelId: string,
    message: string,
    attachments: any,
    replyMessageId?: string
  ) => Promise<any>;
  getAllAnonymousChannels: (timeStamp: string) => Promise<ChannelData[]>;
  getAllAnonymousPostNotifications: (timeStamp: string) => Promise<AnonymousPostNotification[]>;
  getSingleAnonymousPostNotifications: (activityId: string) => Promise<AnonymousPostNotification>;
  setChannelAsRead: (channelId: string) => Promise<boolean>;
  getAnonymousChannelDetail: (channelType: GetstreamChannelType, channelId: string) => Promise<any>;
}

async function checkIsTargetAllowingAnonDM(targetUserId: string) {
  try {
    const payload = {
      members: [targetUserId]
    };
    const response = await anonymousApi.post(baseUrl.checkIsTargetAllowingAnonDM, payload);
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

async function sendAnonymousMessage(
  channelId: string,
  message: string,
  attachments: any,
  replyMessageId?: string
) {
  let payload: SendPayloadType = {channelId, message, attachments};
  if (replyMessageId) {
    payload = {...payload, messageType: 'reply', replyMessageId};
  }

  try {
    const response = await anonymousApi.post(baseUrl.sendAnonymousMessage, payload);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.data);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllAnonymousChannels(timeStamp: string | undefined) {
  // get time stamp
  const url = timeStamp
    ? `${baseUrl.getAllAnonymousChannels}?last_fetch_date=${timeStamp}`
    : baseUrl.getAllAnonymousChannels;
  try {
    const response = await anonymousApi.get(url);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllAnonymousPostNotifications(timeStamp: string | undefined) {
  const url = timeStamp
    ? `${baseUrl.getAllAnonymousPostNotifications}?last_fetch_date=${timeStamp}`
    : baseUrl.getAllAnonymousPostNotifications;

  try {
    const response = await anonymousApi.get(url);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getSingleAnonymousPostNotifications(
  activityId: string
): Promise<AnonymousPostNotification> {
  try {
    const response = await anonymousApi.get(
      baseUrl.getSingleAnonymousPostNotifications(activityId)
    );
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function setChannelAsRead(channelId: string): Promise<boolean> {
  try {
    const data = {
      channelType: 'messaging'
    };
    const response = await anonymousApi.post(baseUrl.setChannelAsRead(channelId), data);
    if (response.status === 200) {
      return Promise.resolve(true);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAnonymousChannelDetail(channelType: GetstreamChannelType, channelId: string) {
  try {
    const response = await anonymousApi.get(
      baseUrl.getAnonymousChannelDetail(channelType, channelId)
    );
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function deleteMessage(messageId: string) {
  try {
    const response = await anonymousApi.delete(baseUrl.deleteMessage(messageId));
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

const AnonymousMessageRepo: AnonymousMessageRepoTypes = {
  checkIsTargetAllowingAnonDM,
  deleteMessage,
  sendAnonymousMessage,
  getAllAnonymousChannels,
  getAllAnonymousPostNotifications,
  getSingleAnonymousPostNotifications,
  setChannelAsRead,
  getAnonymousChannelDetail
};

export default AnonymousMessageRepo;
