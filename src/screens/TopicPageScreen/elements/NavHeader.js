import {useNavigation} from '@react-navigation/core';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

import {BlurView} from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MemoIcArrowBackCircle from '../../../assets/arrow/Ic_arrow_back_circle';
import ShareIconCircle from '../../../assets/icons/Ic_share_circle';
import TopicDefaultIcon from '../../../assets/topic.png';
import {Shimmer} from '../../../components/Shimmer/Shimmer';
import dimen from '../../../utils/dimen';
import {normalize} from '../../../utils/fonts';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';
import Search from '../../DiscoveryScreenV2/elements/Search';
import {COLORS} from '../../../utils/theme';
import ButtonFollow from './ButtonFollow';
import ButtonFollowing from './ButtonFollowing';
import TopicDomainHeader from './TopicDomainHeader';

const NavHeader = (props) => {
  const {
    isLoading,
    initialData,
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
    getSearchLayout,
    opacityImage
  } = props;
  const navigation = useNavigation();
  const coverPath = topicDetail?.cover_path || null;
  const insets = useSafeAreaInsets();
  const {width: displayWidth} = useWindowDimensions();

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

  const backScreen = () => {
    navigation.goBack();
  };

  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
  // const renderBlur = !hasSearch || (hasSearch && coverPath?.length > 0);
  const renderBlur = !(coverPath?.length > 0)
    ? false
    : !hasSearch || (hasSearch && coverPath?.length > 0);
  return (
    <View>
      <View style={{}}>
        <StatusBar barStyle="dark-content" />
        <View
          style={[
            styles.navContainer(isHeaderHide),
            {
              height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
            }
          ]}
          imageStyle={{opacity: isHeaderHide ? 0 : 1}}>
          {initialData?.coverImage === undefined && isLoading ? (
            <Shimmer width={displayWidth} height={dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER} />
          ) : (
            <>
              <View
                style={{
                  width: '100%',
                  height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
                }}>
                <FastImage
                  source={
                    initialData?.coverImage ? {uri: initialData.coverImage} : {uri: coverPath}
                  }
                  style={{
                    height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
                  }}
                />
                {renderBlur && (
                  <AnimatedBlurView
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        opacity: opacityImage
                      }
                    ]}
                    blurAmount={1}
                    blurType="dark"
                  />
                )}
              </View>
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingTop: insets.top,
              zIndex: 2,
              position: 'absolute'
            }}>
            <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
              <MemoIcArrowBackCircle width={normalize(32)} height={normalize(32)} />
            </TouchableOpacity>

            <Animated.View
              style={{
                opacity: opacityImage
              }}>
              <TopicDomainHeader {...props} />
            </Animated.View>
          </View>
          <View
            style={
              (styles.containerAction,
              {
                paddingTop: insets.top,
                paddingRight: dimen.normalizeDimen(20),
                zIndex: 2,
                position: 'absolute',
                right: 0
              })
            }>
            {!isFollow && isHeaderHide ? (
              <ButtonFollow handleSetFollow={handleFollowTopic} />
            ) : (
              <TouchableOpacity onPress={onShareCommunity} style={styles.shareIconStyle}>
                <ShareIconCircle color="black" width={32} height={32} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!hasSearch && (
          <>
            <View style={[styles.headerContainer]}>
              <Animated.View style={{opacity: opacityHeaderAnimation}}>
                <FastImage
                  source={
                    initialData?.channelPicutre
                      ? {uri: initialData?.channelPicutre}
                      : topicDetail?.icon_path
                      ? {uri: topicDetail?.icon_path}
                      : TopicDefaultIcon
                  }
                  style={styles.image}
                />
              </Animated.View>
              <View
                style={[
                  styles.containerAction,
                  {
                    alignSelf: 'center'
                  }
                ]}>
                <Animated.View style={{opacity: opacityHeaderAnimation}}>
                  {isFollow === undefined && isLoading ? (
                    <Shimmer width={normalize(100)} height={normalize(36)} />
                  ) : isFollow ? (
                    <ButtonFollowing handleSetUnFollow={handleFollowTopic} />
                  ) : (
                    <ButtonFollow handleSetFollow={handleFollowTopic} />
                  )}
                </Animated.View>
              </View>
            </View>
            <Animated.View
              style={[
                styles.domain(isHeaderHide),
                {bottom: normalize(isFollow ? 13 : 24), opacity: opacityHeaderAnimation}
              ]}>
              <TopicDomainHeader {...props} />
            </Animated.View>
          </>
        )}
      </View>

      {hasSearch && (
        <View
          style={{
            width: '100%'
          }}>
          <Search
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
    </View>
  );
};

NavHeader.propTypes = {
  initialData: PropTypes.object,
  onShareCommunity: PropTypes.func,
  isHeaderHide: PropTypes.bool,
  isFollow: PropTypes.bool,
  hideSeeMember: PropTypes.bool,
  animatedHeight: PropTypes.number,
  opacityHeaderAnimation: PropTypes.number,
  opacityImage: PropTypes.number,
  getTopicDetail: PropTypes.func,
  setMemberCount: PropTypes.func,
  memberCount: PropTypes.number,
  topicDetail: PropTypes.object,
  setIsFollow: PropTypes.func,
  isLoading: PropTypes.bool,
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
    height: isHeaderHide
      ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2
      : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
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
