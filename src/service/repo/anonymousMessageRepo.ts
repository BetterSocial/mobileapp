import anonymousApi from '../anonymousConfig';
import {AnonymousPostNotification} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {ChannelData} from '../../../types/repo/AnonymousMessageRepo/ChannelData';

const baseUrl = {
  checkIsTargetAllowingAnonDM: 'chat/channels/check-allow-anon-dm-status',
  sendAnonymousMessage: '/chat/anonymous',
  getAllAnonymousChannels: '/chat/channels',
  getAllAnonymousPostNotifications: '/feeds/feed-chat/anonymous',
  getSingleAnonymousPostNotifications: (activityId: string) => `/feeds/feed-chat/${activityId}`,
  setChannelAsRead: (channelId: string) => `/chat/channels/${channelId}/read`
};

interface AnonymousMessageRepoTypes {
  checkIsTargetAllowingAnonDM: (targetUserId: string) => Promise<any>;
  sendAnonymousMessage: (channelId: string, message: string) => Promise<any>;
  getAllAnonymousChannels: () => Promise<ChannelData[]>;
  getAllAnonymousPostNotifications: () => Promise<AnonymousPostNotification[]>;
  getSingleAnonymousPostNotifications: (activityId: string) => Promise<AnonymousPostNotification>;
  setChannelAsRead: (channelId: string) => Promise<boolean>;
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

async function sendAnonymousMessage(channelId: string, message: string) {
  const payload = {
    channelId,
    message
  };
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

async function getAllAnonymousChannels() {
  try {
    const response = await anonymousApi.get(baseUrl.getAllAnonymousChannels);
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

async function getAllAnonymousPostNotifications() {
  try {
    const response = await anonymousApi.get(baseUrl.getAllAnonymousPostNotifications);
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

const AnonymousMessageRepo: AnonymousMessageRepoTypes = {
  checkIsTargetAllowingAnonDM,
  sendAnonymousMessage,
  getAllAnonymousChannels,
  getAllAnonymousPostNotifications,
  getSingleAnonymousPostNotifications,
  setChannelAsRead
};

export default AnonymousMessageRepo;
