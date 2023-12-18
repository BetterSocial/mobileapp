import StorageUtils from '..';

interface IFeedStorageObject {
  bg: string;
}

interface IFeedStorage {
  get: (postId: string) => IFeedStorageObject;
  set: (postId: string, feed: object) => void;
}

const __generateKey = (postId: string) => {
  return `${postId}`;
};

const FeedStorage: IFeedStorage = {
  get: (postId: string) => {
    const feed = StorageUtils.feed.getForKey(__generateKey(postId));

    try {
      const data = {
        ...JSON.parse(feed || '{}')
      };
      return data;
    } catch (e) {
      return {
        bg: null
      };
    }
  },
  set: (postId: string, feed: object) => {
    StorageUtils.feed.setForKey(__generateKey(postId), JSON.stringify(feed));
  }
};

export default FeedStorage;
