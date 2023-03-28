import api from '../config';

const baseUrl = {
  getSelfAnonymousFeed: (limit, offset) =>
    `profiles/self-anonymous-feeds?limit=${limit}&offset=${offset}`
};
/**
 * @typedef {Object} GetSelfAnonymousFeedResponse
 * @property {boolean} isSuccess
 * @property {ProfileRepoItem[]} data
 * @property {string} [error]
 * @property {number} [offset]
 */

/**
 *
 * @param {number} [offset = 0]
 * @param {number} [limit = 10]
 * @returns {GetSelfAnonymousFeedResponse}
 */
const getSelfAnonymousFeed = async (offset = 0, limit = 10) => {
  try {
    const response = await api.get(baseUrl.getSelfAnonymousFeed(limit, offset));
    if (response.status === 200) {
      const feeds = response?.data?.data?.feeds;
      const offsetData = response?.data?.data?.offset;
      return {
        isSuccess: true,
        data: feeds,
        offset: offsetData
      };
    }
    return {
      isSuccess: false,
      error: response?.data?.data?.error,
      data: []
    };
  } catch (e) {
    return {
      isSuccess: false,
      error: e?.message,
      data: []
    };
  }
};

const ProfileRepo = {
  getSelfAnonymousFeed
};

export default ProfileRepo;
