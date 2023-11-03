import * as React from 'react';
import {Animated, ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import PropTypes from 'prop-types';

import MemoIcArrowBack from '../../../assets/arrow/Ic_arrow_back';
import MemoIcArrowBackCircle from '../../../assets/arrow/Ic_arrow_back_circle';
import TopicDefaultIcon from '../../../assets/topic.png';
import dimen from '../../../utils/dimen';
import {normalize} from '../../../utils/fonts';
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
  const coverPath = topicDetail?.cover_path || null;
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

  const onDomainLayout = React.useCallback(
    (event) => {
      const {height} = event.nativeEvent.layout;
      setDomainHeight(Math.round(height));
    },
    [setDomainHeight]
  );

  const backScreen = () => {
    navigation.goBack();
  };

  const getBottomPostition = () => {
    let containerHeight = 0;
    if (isHeaderHide) {
      containerHeight = dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2;
    } else {
      containerHeight =
        hideSeeMember || !isFollow
          ? dimen.size.TOPIC_FEED_HEADER_HEIGHT
          : dimen.size.TOPIC_FEED_HEADER_HEIGHT + normalize(4);
    }
    return Math.round((containerHeight - domainHeight) / 2);
  };

  const heightWithCoverImage = () => {
    if (coverPath) {
      return {height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER};
    }
    return null;
  };

  return (
    <Animated.View style={{height: animatedHeight}}>
      <ImageBackground
        source={{uri: coverPath}}
        style={[styles.Nav(isHeaderHide), heightWithCoverImage()]}
        imageStyle={{opacity: isHeaderHide ? 0 : 1}}>
        <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
          {coverPath && !isHeaderHide ? (
            <MemoIcArrowBackCircle width={normalize(32)} height={normalize(32)} />
          ) : (
            <MemoIcArrowBack width={normalize(24)} height={normalize(24)} />
          )}
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
      </ImageBackground>
      <Animated.View style={styles.Header}>
        {!isHeaderHide ? (
          <>
            <Animated.Image
              source={topicDetail?.icon_path ? {uri: topicDetail?.icon_path} : TopicDefaultIcon}
              style={styles.image(opacityHeaderAnimation)}
            />
            <View style={styles.containerAction}>
              <Animated.View style={{opacity: opacityHeaderAnimation}}>
                {isFollow ? (
                  <ButtonFollowing handleSetUnFollow={handleFollowTopic} />
                ) : (
                  <ButtonFollow handleSetFollow={handleFollowTopic} />
                )}
              </Animated.View>
            </View>
          </>
        ) : null}
      </Animated.View>
      <View
        onLayout={onDomainLayout}
        style={[styles.domain(isHeaderHide), {bottom: getBottomPostition()}]}>
        <TopicDomainHeader {...props} />
      </View>
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
  Nav: (isHeaderHide, hasCoverImage) => ({
    flexDirection: 'row',
    height: isHeaderHide
      ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2
      : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingVertical: dimen.normalizeDimen(12),
    paddingHorizontal: dimen.normalizeDimen(20),
    zIndex: 10
  }),
  Header: {
    width: '100%',
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    paddingHorizontal: normalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  image: (opacityHeaderAnimation) => ({
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: 'lightgrey',
    marginRight: 8,
    opacity: opacityHeaderAnimation
  }),
  backbutton: {
    paddingRight: 16,
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
    backgroundColor: 'transparent'
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
