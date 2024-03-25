/* eslint-disable @typescript-eslint/no-explicit-any */
import {ChannelData} from '../../../types/repo/ChannelData';
import {
  ChannelTypeEnum,
  SignedPostNotification
} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import StorageUtils from '../../utils/storage';
import api from '../config';
import {GetstreamChannelType} from './types.d';

type SendPayloadType = {
  channelId: string;
  message: string;
  channelType: number;
  messageType?: string;
  attachments?: any;
  replyMessageId?: string;
};

const baseUrl = {
  checkIsTargetAllowingAnonDM: 'chat/channels/check-allow-anon-dm-status',
  sendSignedMessage: '/chat/send-signed-message',
  getAllSignedChannels: '/chat/channels/signed',
  getAllSignedPostNotifications: '/feeds/feed-chat',
  getSingleSignedPostNotifications: (activityId: string) => `/feeds/feed-chat/${activityId}`,
  setChannelAsRead: '/chat/channels/read',
  createSignedChat: '/chat/channels-signed',
  getSignedChannelDetail: (channelType: GetstreamChannelType, channelId: string) =>
    `/chat/channel-detail?channel_type=${channelType}&channel_id=${channelId}`
};

interface SignedMessageRepoTypes {
  checkIsTargetAllowingAnonDM: (targetUserId: string) => Promise<any>;
  sendSignedMessage: (
    channelId: string,
    message: string,
    channelType: number,
    attachments: any,
    replyMessageId?: string
  ) => Promise<any>;
  getAllSignedChannels: () => Promise<ChannelData[]>;
  getAllSignedPostNotifications: () => Promise<SignedPostNotification[]>;
  getSingleSignedPostNotifications: (activityId: string) => Promise<SignedPostNotification>;
  setChannelAsRead: (channelId: string, channelType: ChannelTypeEnum) => Promise<boolean>;
  createSignedChat: (body: string[]) => Promise<any>;
  getSignedChannelDetail: (channelType: GetstreamChannelType, channelId: string) => Promise<any>;
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

async function getAllSignedChannels() {
  const timeStamp = StorageUtils.channelSignedTimeStamps.get();
  const url = timeStamp
    ? `${baseUrl.getAllSignedChannels}?last_fetch_date=${timeStamp}`
    : baseUrl.getAllSignedChannels;
  try {
    const response = await api.get(url);
    if (response.status === 200) {
      console.log('SUCCESS URL', url);
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log('FAILED URL', url);
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllSignedPostNotifications() {
  const timeStamp = StorageUtils.channelAnonTimeStamps.get();
  const url = timeStamp
    ? `${baseUrl.getAllSignedPostNotifications}?last_fetch_date=${timeStamp}`
    : baseUrl.getAllSignedPostNotifications;
  try {
    const response = await api.get(url);
    if (response.status === 200) {
      console.log('SUCCESS URL', url);
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

const SignedMessageRepo: SignedMessageRepoTypes = {
  checkIsTargetAllowingAnonDM,
  sendSignedMessage,
  getAllSignedChannels,
  getAllSignedPostNotifications,
  getSingleSignedPostNotifications,
  setChannelAsRead,
  createSignedChat,
  getSignedChannelDetail
};

export default SignedMessageRepo;
