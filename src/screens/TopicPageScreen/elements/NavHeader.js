import * as React from 'react';
import {Animated} from 'react-native';

import Navigation from './Navigation';
import Header from './Header';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';

const NavHeader = (props) => {
  const {
    isFollow,
    setIsFollow,
    topicDetail,
    memberCount,
    setMemberCount,
    animatedHeight,
    getTopicDetail
  } = props;
  const {followTopic} = useChatClientHook();

  const handleFollowTopic = async () => {
    setIsFollow(!isFollow);
    if (isFollow) {
      setMemberCount(memberCount - 1);
    } else {
      setMemberCount(memberCount + 1);
    }
    try {
      const followed = await followTopic(topicDetail?.name);

      setIsFollow(followed);
      getTopicDetail(topicDetail?.name);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  return (
    <Animated.View style={{height: animatedHeight}}>
      <Navigation onPress={handleFollowTopic} {...props} />
      <Header onPress={handleFollowTopic} {...props} />
    </Animated.View>
  );
};

export default NavHeader;
