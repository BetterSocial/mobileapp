import anonymousApi from '../anonymousConfig';
import {AnonymousPostNotification} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {ChannelData} from '../../../types/repo/AnonymousMessageRepo/ChannelData';

const baseUrl = {
  sendAnonymousMessage: '/chat/anonymous',
  getAllAnonymousChannels: '/chat/channels',
  getAllAnonymousPostNotifications: '/feeds/feed-chat/anonymous',
  getSingleAnonymousPostNotifications: (activityId) => `/feeds/feed-chat/${activityId}`
};

interface AnonymousMessageRepoTypes {
  sendAnonymousMessage: (channelId: string, message: string) => Promise<any>;
  getAllAnonymousChannels: () => Promise<ChannelData[]>;
  getAllAnonymousPostNotifications: () => Promise<AnonymousPostNotification[]>;
  getSingleAnonymousPostNotifications: (activityId: string) => Promise<AnonymousPostNotification>;
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
    console.log('activityId');
    console.log(activityId);
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

const AnonymousMessageRepo: AnonymousMessageRepoTypes = {
  sendAnonymousMessage,
  getAllAnonymousChannels,
  getAllAnonymousPostNotifications,
  getSingleAnonymousPostNotifications
};

export default AnonymousMessageRepo;
