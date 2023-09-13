import * as React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import {getTopics, getUserTopic} from '../../../service/topics';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';

const NavHeader = (props) => {
  const [isFollow, setIsFollow] = React.useState(false);
  const [topicDetail, setTopicDetail] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const {followTopic} = useChatClientHook();

  React.useEffect(() => {
    initData();
  }, []);

  const handleFollowTopic = async () => {
    try {
      const followed = await followTopic(props.domain);
      setIsFollow(followed);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  const initData = async () => {
    try {
      setIsLoading(true);
      const query = `?name=${props.domain}`;
      const resultGetUserTopic = await getUserTopic(query);
      if (resultGetUserTopic.data) {
        setIsFollow(true);
      }
      const resultTopicDetail = await getTopics(props.domain);
      if (resultTopicDetail.data) {
        const detail = resultTopicDetail.data[0];
        setTopicDetail(detail);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('err: ', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (props.isInitialLoading || isLoading) return null;
  return (
    <>
      <Navigation isFollow={isFollow} detail={topicDetail} onPress={handleFollowTopic} {...props} />
      <Header isFollow={isFollow} detail={topicDetail} onPress={handleFollowTopic} {...props} />
    </>
  );
};

export default NavHeader;
