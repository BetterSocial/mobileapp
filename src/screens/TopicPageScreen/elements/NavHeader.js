import * as React from 'react';
import {Animated, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import PropTypes from 'prop-types';

import MemoIcArrowBack from '../../../assets/arrow/Ic_arrow_back';
import TopicDefaultIcon from '../../../assets/topic.png';
import dimen from '../../../utils/dimen';
import {normalize, normalizeFontSizeByWidth} from '../../../utils/fonts';
import ShareIconCircle from '../../../assets/icons/Ic_share_circle';
import ButtonFollow from './ButtonFollow';
import TopicDomainHeader from './TopicDomainHeader';
import ButtonFollowing from './ButtonFollowing';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';

const NavHeader = (props) => {
  const {
    hideSeeMember,
    animatedHeight,
    opacityHeaderAnimation,
    onShareCommunity,
    getTopicDetail,
    setMemberCount,
    memberCount,
    isHeaderHide,
    topicDetail,
    setIsFollow,
    isFollow
  } = props;
  const navigation = useNavigation();
  const [domainHeight, setDomainHeight] = React.useState(0);

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

  const onDomainLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    setDomainHeight(height);
  };

  const backScreen = () => {
    navigation.goBack();
  };

  const getBottomPostition = () => {
    let bottom = 0;
    if (isHeaderHide) {
      bottom = dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2;
    } else {
      bottom = hideSeeMember
        ? dimen.size.TOPIC_FEED_HEADER_HEIGHT
        : dimen.size.TOPIC_FEED_HEADER_HEIGHT + normalize(4);
    }
    return (bottom - domainHeight) / 2;
  };

  return (
    <Animated.View style={{height: animatedHeight}}>
      <View style={[styles.Nav(isHeaderHide)]}>
        <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
          <MemoIcArrowBack width={normalize(24)} height={normalize(24)} />
        </TouchableOpacity>
        <View style={styles.containerAction}>
          {!isFollow && isHeaderHide ? (
            <ButtonFollow handleSetFollow={handleFollowTopic} />
          ) : (
            <TouchableOpacity onPress={onShareCommunity} style={styles.shareIconStyle}>
              <ShareIconCircle color="black" width={32} height={32} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Animated.View style={styles.Header(opacityHeaderAnimation)}>
        {!isHeaderHide ? (
          <>
            <Image
              source={topicDetail?.icon_path ? {uri: topicDetail?.icon_path} : TopicDefaultIcon}
              style={styles.image}
            />
            <View style={styles.containerAction}>
              {isFollow ? (
                <ButtonFollowing handleSetUnFollow={handleFollowTopic} />
              ) : (
                <ButtonFollow handleSetFollow={handleFollowTopic} />
              )}
            </View>
          </>
        ) : null}
      </Animated.View>
      <Animated.View
        onLayout={onDomainLayout}
        style={[styles.domain(isHeaderHide), {bottom: getBottomPostition()}]}>
        <TopicDomainHeader {...props} />
      </Animated.View>
    </Animated.View>
  );
};

NavHeader.propTypes = {
  onShareCommunity: PropTypes.func,
  isHeaderHide: PropTypes.bool,
  isFollow: PropTypes.bool,
  hideSeeMember: PropTypes.bool,
  animatedHeight: PropTypes.number,
  opacityHeaderAnimation: PropTypes.number,
  getTopicDetail: PropTypes.func,
  setMemberCount: PropTypes.func,
  memberCount: PropTypes.number,
  topicDetail: PropTypes.object,
  setIsFollow: PropTypes.func
};

const styles = StyleSheet.create({
  Nav: (isHeaderHide) => ({
    flexDirection: 'row',
    height: isHeaderHide
      ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2
      : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 10,
    paddingHorizontal: normalizeFontSizeByWidth(20)
  }),
  Header: (opacityHeaderAnimation) => ({
    width: '100%',
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    paddingHorizontal: normalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: opacityHeaderAnimation
  }),
  image: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: 'lightgrey',
    marginRight: 8
  },
  backbutton: {
    paddingRight: 16,
    height: '100%',
    justifyContent: 'center'
  },
  domain: (isHeaderHide) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: normalize(14),
    alignSelf: 'center',
    position: 'absolute',
    left: normalize(isHeaderHide ? 32 : 48) + normalize(20) + normalize(8),
    zIndex: 99,
    backgroundColor: 'white'
  }),
  containerAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIconStyle: {},
  searchContainerStyle: {
    position: 'relative',
    marginBottom: 0
  }
});

export default NavHeader;
