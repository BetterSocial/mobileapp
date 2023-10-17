import api from '../config';
import {ChannelData} from '../../../types/repo/ChannelData';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';

const baseUrl = {
  checkIsTargetAllowingAnonDM: 'chat/channels/check-allow-anon-dm-status',
  sendSignedMessage: '/chat/anonymous',
  getAllSignedChannels: '/chat/channels/signed',
  getAllSignedPostNotifications: '/feeds/feed-chat',
  getSingleSignedPostNotifications: (activityId: string) => `/feeds/feed-chat/${activityId}`,
  setChannelAsRead: (channelId: string) => `/chat/channels/${channelId}/read`
};

interface SignedMessageRepoTypes {
  checkIsTargetAllowingAnonDM: (targetUserId: string) => Promise<any>;
  sendSignedMessage: (channelId: string, message: string) => Promise<any>;
  getAllSignedChannels: () => Promise<ChannelData[]>;
  getAllSignedPostNotifications: () => Promise<SignedPostNotification[]>;
  getSingleSignedPostNotifications: (activityId: string) => Promise<SignedPostNotification>;
  setChannelAsRead: (channelId: string) => Promise<boolean>;
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

async function sendSignedMessage(channelId: string, message: string) {
  const payload = {channelId, message};
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

async function setChannelAsRead(channelId: string): Promise<boolean> {
  try {
    const data = {channelType: 'messaging'};
    const response = await api.post(baseUrl.setChannelAsRead(channelId), data);
    if (response.status === 200) {
      return Promise.resolve(true);
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
  setChannelAsRead
};

export default SignedMessageRepo;
