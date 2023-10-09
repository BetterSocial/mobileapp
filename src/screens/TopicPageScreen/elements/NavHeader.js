import * as React from 'react';
import {Animated} from 'react-native';

import Navigation from './Navigation';
import Header from './Header';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';

const NavHeader = (props) => {
  const {isFollow, setIsFollow, topicDetail, animatedHeight} = props;
  const {followTopic} = useChatClientHook();

  const handleFollowTopic = async () => {
    setIsFollow(!isFollow);
    try {
      const followed = await followTopic(topicDetail.name);
      setIsFollow(followed);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  return (
    <Animated.View style={{height: animatedHeight}}>
      <Navigation isFollow={isFollow} detail={topicDetail} onPress={handleFollowTopic} {...props} />
      <Header isFollow={isFollow} detail={topicDetail} onPress={handleFollowTopic} {...props} />
    </Animated.View>
  );
};

export default NavHeader;
