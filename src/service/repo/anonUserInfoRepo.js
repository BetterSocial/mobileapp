import anonymousApi from '../anonymousConfig';

const baseUrl = {
  getPostAnonUserInfo: '/feeds/generate-anonymous-username'
};

const baseGetAnonUserInfo = async (contentType, postId = '') => {
  try {
    const response = await anonymousApi.post(baseUrl.getPostAnonUserInfo, {
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

const getCommentAnonUserInfo = async (postId) => {
  return baseGetAnonUserInfo('comment', postId);
};

const AnonUserInfoRepo = {
  getPostAnonUserInfo,
  getCommentAnonUserInfo
};

export default AnonUserInfoRepo;
