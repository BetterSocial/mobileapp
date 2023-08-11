import StorageUtils from '..';

interface ITopicPageStorageObject {
  offset: number;
  feeds: any[];
}

interface ITopicPageStorage {
  get: (key: string) => ITopicPageStorageObject;
  set: (key: string, feeds: any[], offset: number) => void;
}

const TopicPageStorage: ITopicPageStorage = {
  get: (key: string) => {
    const offset = StorageUtils.topicPages.getForKey(`${key}_offset`);
    const feeds = StorageUtils.topicPages.getForKey(`${key}`);

    const data = {
      offset: offset ? parseInt(offset, 10) : 0,
      feeds: feeds ? JSON.parse(feeds) : []
    };
    return data;
  },
  set: (key: string, feeds: any[], offset: number) => {
    StorageUtils.topicPages.setForKey(`${key}_offset`, offset.toString());
    StorageUtils.topicPages.setForKey(`${key}`, JSON.stringify(feeds));
  }
};

export default TopicPageStorage;
