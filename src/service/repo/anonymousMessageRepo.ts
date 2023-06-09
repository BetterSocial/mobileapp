import anonymousApi from '../anonymousConfig';
import {ChannelData} from '../../../types/repo/anonymousmessagerepo.types';

const baseUrl = {
  sendAnonymousMessage: '/chat/anonymous',
  getAllAnonymousChannels: '/chat/channels'
};

interface AnonymousMessageRepoTypes {
  sendAnonymousMessage: (channelId: string, message: string) => Promise<any>;
  getAllAnonymousChannels: () => Promise<ChannelData[]>;
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

const AnonymousMessageRepo: AnonymousMessageRepoTypes = {
  sendAnonymousMessage,
  getAllAnonymousChannels
};

export default AnonymousMessageRepo;
