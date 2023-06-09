import anonymousApi from '../anonymousConfig';

const baseUrl = {
  sendAnonymousMessage: '/chat/anonymous'
};

interface AnonymousMessageRepoTypes {
  sendAnonymousMessage: (channelId: string, message: string) => Promise<any>;
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

const AnonymousMessageRepo: AnonymousMessageRepoTypes = {
  sendAnonymousMessage
};

export default AnonymousMessageRepo;
