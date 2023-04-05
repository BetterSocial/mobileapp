import api from '../config';

const baseUrl = {
  getPostAnonUserInfo: '/feeds/generate-anonymous-username'
};

const baseGetAnonUserInfo = async (contentType, postId = '') => {
  try {
    const response = await api.post(baseUrl.getPostAnonUserInfo, {
      contentType,
      postId
    });

    if (response.status === 200) {
      const anonUserInfo = response?.data?.data?.data;
      return {
        isSuccess: true,
        data: {
          emojiName: anonUserInfo?.emojiName,
          emojiCode: anonUserInfo?.emojiIcon,
          colorName: anonUserInfo?.colorName,
          colorCode: anonUserInfo?.colorCode
        }
      };
    }
    return {
      isSuccess: false,
      error: response?.data?.data?.error
    };
  } catch (e) {
    return {
      isSuccess: false,
      error: e
    };
  }
};

const getPostAnonUserInfo = async () => {
  return baseGetAnonUserInfo('post');
};

const AnonUserInfoRepo = {
  getPostAnonUserInfo
};

export default AnonUserInfoRepo;
