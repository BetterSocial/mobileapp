import * as React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';

const NavHeader = (props) => {
  const {isFollow, setIsFollow, topicDetail} = props;
  const {followTopic} = useChatClientHook();

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

  return (
    <>
      <Navigation isFollow={isFollow} detail={topicDetail} onPress={handleFollowTopic} {...props} />
      <Header isFollow={isFollow} detail={topicDetail} onPress={handleFollowTopic} {...props} />
    </>
  );
};

export default NavHeader;
