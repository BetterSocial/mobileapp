/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../config';
import {ChannelData} from '../../../types/repo/ChannelData';
import {
  ChannelTypeEnum,
  SignedPostNotification
} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';

const baseUrl = {
  checkIsTargetAllowingAnonDM: 'chat/channels/check-allow-anon-dm-status',
  sendSignedMessage: '/chat/send-signed-message',
  getAllSignedChannels: '/chat/channels/signed',
  getAllSignedPostNotifications: '/feeds/feed-chat',
  getSingleSignedPostNotifications: (activityId: string) => `/feeds/feed-chat/${activityId}`,
  setChannelAsRead: '/chat/channels/read',
  createSignedChat: '/chat/channels-signed'
};

interface SignedMessageRepoTypes {
  checkIsTargetAllowingAnonDM: (targetUserId: string) => Promise<any>;
  sendSignedMessage: (channelId: string, message: string, channelType: number) => Promise<any>;
  getAllSignedChannels: () => Promise<ChannelData[]>;
  getAllSignedPostNotifications: () => Promise<SignedPostNotification[]>;
  getSingleSignedPostNotifications: (activityId: string) => Promise<SignedPostNotification>;
  setChannelAsRead: (channelId: string, channelType: ChannelTypeEnum) => Promise<boolean>;
  createSignedChat: (body: string[]) => Promise<any>;
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

async function sendSignedMessage(channelId: string, message: string, channelType: number) {
  const payload = {channelId, message, channelType};
  try {
    const response = await api.post(baseUrl.sendSignedMessage, payload);

    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.data);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllSignedChannels() {
  try {
    const response = await api.get(baseUrl.getAllSignedChannels);

    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllSignedPostNotifications() {
  try {
    const response = await api.get(baseUrl.getAllSignedPostNotifications);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
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
    console.log({response}, 'pola');
    if (response.status === 200) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(response.status);
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
  createSignedChat
};

export default SignedMessageRepo;
