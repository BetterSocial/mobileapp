import * as React from 'react';
import {Animated} from 'react-native';
import PropTypes from 'prop-types';

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

NavHeader.propTypes = {
  isFollow: PropTypes.bool,
  setIsFollow: PropTypes.func,
  topicDetail: PropTypes.object,
  memberCount: PropTypes.number,
  setMemberCount: PropTypes.func,
  animatedHeight: PropTypes.number,
  getTopicDetail: PropTypes.func
};

export default NavHeader;
