import {useSetRecoilState} from 'recoil';
import {getFeedNotification, setFeedChatsFromLocal} from '../service/feeds';
import {feedChatAtom} from '../models/feeds/feedsNotification';

const useFeedService = () => {
  const setFeedChatData = useSetRecoilState(feedChatAtom);

  const getFeedChat = async () => {
    const res = await getFeedNotification();
    if (res.success) {
      setFeedChatData(res.data);
      setFeedChatsFromLocal(res.data);
    }
  };

  return {getFeedChat};
};

export default useFeedService;
