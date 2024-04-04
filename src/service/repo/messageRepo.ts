import api from '../config';

const baseUrl = {
  getMessageDetail: (message_id: string) => `/chat/message/${message_id}`
};

async function getMessageDetail(messageId: string) {
  try {
    const response = await api.get(baseUrl.getMessageDetail(messageId));
    if (response.status === 200) {
      return Promise.resolve(response.data?.data);
    }

    return Promise.reject(response.data?.status);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

export {getMessageDetail};
