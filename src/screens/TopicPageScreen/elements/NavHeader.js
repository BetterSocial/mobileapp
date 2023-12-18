import * as React from 'react';
import {Animated, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import PropTypes from 'prop-types';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
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
import Search from '../../DiscoveryScreenV2/elements/Search';
import {COLORS} from '../../../utils/theme';

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
    isFollow,
    hasSearch,
    searchText,
    setSearchText,
    setDiscoveryLoadingData,
    isFocus,
    setIsFocus,
    fetchDiscoveryData,
    onCancelToken,
    placeholderText,
    setIsFirstTimeOpen,
    getSearchLayout
  } = props;
  const navigation = useNavigation();
  const coverPath = topicDetail?.cover_path || null;
  const [domainHeight, setDomainHeight] = React.useState(0);
  const [searchHeight, setSearchHeight] = React.useState(0);
  const {top} = useSafeAreaInsets();
  const topPosition = Platform.OS === 'ios' ? top : 0;

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

  const onSearchLayout = React.useCallback(
    (event) => {
      const {height} = event.nativeEvent.layout;
      setSearchHeight(Math.round(height));
      getSearchLayout(Math.round(height));
    },
    [setSearchHeight]
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
    return Math.round((containerHeight - domainHeight) / 2) + searchHeight;
  };

  const heightWithCoverImage = () => {
    if (coverPath) {
      return {height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER + topPosition};
    }
    return null;
  };

  return (
    <Animated.View style={styles.container(animatedHeight)}>
      <StatusBar barStyle="dark-content" />
      <View
        source={{uri: coverPath}}
        style={[styles.navContainer(isHeaderHide, topPosition), heightWithCoverImage()]}
        imageStyle={{opacity: isHeaderHide ? 0 : 1}}>
        <Animated.View style={styles.headerImage(opacityHeaderAnimation)}>
          <FastImage source={{uri: coverPath}} style={heightWithCoverImage()} />
        </Animated.View>
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
      </View>
      <Animated.View style={[styles.headerContainer]}>
        {!isHeaderHide ? (
          <>
            <Animated.View style={{opacity: opacityHeaderAnimation}}>
              <FastImage
                source={topicDetail?.icon_path ? {uri: topicDetail?.icon_path} : TopicDefaultIcon}
                style={styles.image}
              />
            </Animated.View>
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

      {hasSearch && (
        <View onLayout={onSearchLayout} style={styles.search}>
          <Search
            getSearchLayout={setSearchHeight}
            searchText={searchText}
            setSearchText={setSearchText}
            setDiscoveryLoadingData={setDiscoveryLoadingData}
            isFocus={isFocus}
            setIsFocus={setIsFocus}
            fetchDiscoveryData={fetchDiscoveryData}
            onCancelToken={onCancelToken}
            placeholderText={placeholderText}
            setIsFirstTimeOpen={setIsFirstTimeOpen}
            hideBackIcon={true}
            autoFocus={false}
          />
        </View>
      )}
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
  setIsFollow: PropTypes.func,

  searchText: PropTypes.string,
  setSearchText: PropTypes.func,
  setDiscoveryLoadingData: PropTypes.func,
  isFocus: PropTypes.bool,
  setIsFocus: PropTypes.func,
  fetchDiscoveryData: PropTypes.func,
  onCancelToken: PropTypes.func,
  placeholderText: PropTypes.string,
  setIsFirstTimeOpen: PropTypes.func,
  getSearchLayout: PropTypes.func,
  hasSearch: PropTypes.bool
};

const styles = StyleSheet.create({
  container: (animatedHeight) => ({
    width: '100%',
    height: animatedHeight,
    backgroundColor: COLORS.lightgrey,
    position: 'absolute',
    zIndex: 80,
    overflow: 'hidden'
  }),
  navContainer: (isHeaderHide, top) => ({
    flexDirection: 'row',
    height:
      (isHeaderHide
        ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2
        : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT) + top,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    paddingTop: dimen.normalizeDimen(12) + top,
    zIndex: 10
  }),
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    paddingLeft: normalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  headerImage: (opacityHeaderAnimation) => ({
    width: '100%',
    position: 'absolute',
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
    justifyContent: 'center',
    paddingLeft: dimen.normalizeDimen(20)
  },
  domain: (isHeaderHide) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: normalize(14),
    alignSelf: 'center',
    position: 'absolute',
    left: normalize(isHeaderHide ? 32 : 48) + normalize(28),
    zIndex: 99,
    backgroundColor: 'transparent'
  }),
  search: {
    width: '100%',
    position: 'absolute',
    zIndex: 99,
    backgroundColor: 'transparent',
    bottom: 0
  },
  containerAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: dimen.normalizeDimen(20)
  },
  shareIconStyle: {},
  searchContainerStyle: {
    position: 'relative',
    marginBottom: 0
  }
});

export default NavHeader;
