import {useNavigation} from '@react-navigation/core';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

import {BlurView} from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MemoIcArrowBackCircle from '../../../assets/arrow/Ic_arrow_back_circle';
import ShareIconCircle from '../../../assets/icons/Ic_share_circle';
import {Shimmer} from '../../../components/Shimmer/Shimmer';
import dimen from '../../../utils/dimen';
import {normalize, normalizeFontSize} from '../../../utils/fonts';
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
    isHeaderHide,
    topicDetail,
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
    opacityImage,
    onFollowButtonPress,
    followType
  } = props;
  const navigation = useNavigation();
  const coverPath = topicDetail?.cover_path || null;
  const insets = useSafeAreaInsets();
  const {width: displayWidth} = useWindowDimensions();

  const backScreen = () => {
    navigation.goBack();
  };

  const renderBlur = !(coverPath?.length > 0)
    ? false
    : !hasSearch || (hasSearch && coverPath?.length > 0);

  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const additionalHeaderHeight =
    isHeaderHide || initialData?.coverImage !== undefined || coverPath !== null
      ? dimen.normalizeDimen(12)
      : 0;

  return (
    <View>
      <View>
        <StatusBar barStyle="light-content" />
        <View
          style={[styles.navContainer(isHeaderHide, additionalHeaderHeight)]}
          imageStyle={{opacity: isHeaderHide ? 0 : 1}}>
          {initialData?.coverImage === undefined && isLoading ? (
            <Shimmer
              width={displayWidth}
              height={dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER + additionalHeaderHeight}
            />
          ) : (
            <>
              <View
                style={{
                  width: '100%',
                  height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER + additionalHeaderHeight
                }}>
                <FastImage
                  source={
                    initialData?.coverImage ? {uri: initialData.coverImage} : {uri: coverPath}
                  }
                  style={{
                    height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER + additionalHeaderHeight
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
          <View style={styles.headerBarContainer(insets.top)}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <TouchableOpacity onPress={() => backScreen()} style={styles.backButton}>
                <MemoIcArrowBackCircle width={normalize(32)} height={normalize(32)} />
              </TouchableOpacity>
              <Animated.View
                style={{
                  opacity: opacityImage
                }}>
                <TopicDomainHeader {...props} />
              </Animated.View>
            </View>
            <View>
              {!isFollow && isHeaderHide ? (
                <ButtonFollow handleSetFollow={onFollowButtonPress} />
              ) : (
                <TouchableOpacity onPress={onShareCommunity}>
                  <ShareIconCircle color="black" width={32} height={32} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {!hasSearch && (
          <>
            <View style={[styles.headerContainer]}>
              <Animated.View style={{opacity: opacityHeaderAnimation}}>
                {initialData?.channelPicutre || topicDetail?.icon_path ? (
                  <FastImage
                    source={
                      initialData?.channelPicutre
                        ? {uri: initialData?.channelPicutre}
                        : topicDetail?.icon_path
                        ? {uri: topicDetail?.icon_path}
                        : null
                    }
                    style={styles.image(followType)}
                  />
                ) : (
                  <View style={styles.image(followType)}>
                    <Text style={styles.profileHashtag}>#</Text>
                  </View>
                )}
              </Animated.View>
              <View style={[styles.containerAction]}>
                <Animated.View style={{opacity: opacityHeaderAnimation}}>
                  {isFollow === undefined && isLoading ? (
                    <Shimmer width={normalize(100)} height={normalize(36)} />
                  ) : isFollow ? (
                    <ButtonFollowing
                      handleSetUnFollow={onFollowButtonPress}
                      followType={followType}
                    />
                  ) : (
                    <ButtonFollow handleSetFollow={onFollowButtonPress} />
                  )}
                </Animated.View>
              </View>
            </View>
            <Animated.View
              style={[
                styles.domain(isHeaderHide),
                {
                  bottom: normalize(isFollow ? 13 : 24),
                  opacity: opacityHeaderAnimation
                }
              ]}>
              <TopicDomainHeader {...props} />
            </Animated.View>
          </>
        )}
      </View>

      {hasSearch && (
        <View style={styles.searchBar}>
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
  hasSearch: PropTypes.bool,
  onFollowButtonPress: PropTypes.func,
  followType: PropTypes.string
};

const styles = StyleSheet.create({
  navContainer: (isHeaderHide, additionalHeight) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
    height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER + additionalHeight,
    backgroundColor: COLORS.almostBlack,
    borderBottomWidth: isHeaderHide ? 1 : 0,
    borderBottomColor: COLORS.gray310
  }),
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    paddingLeft: normalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.almostBlack
  },
  headerBarContainer: (top) => ({
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: top,
    zIndex: 2,
    position: 'absolute',
    paddingHorizontal: dimen.normalizeDimen(20),
    height: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
  }),
  image: (followType) => ({
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: followType === 'incognito' ? COLORS.anon_secondary : COLORS.signed_primary,
    marginRight: 8,
    alignContent: 'center',
    justifyContent: 'center'
  }),
  profileHashtag: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: normalizeFontSize(24)
  },
  backButton: {
    paddingRight: dimen.normalizeDimen(20),
    justifyContent: 'center'
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
    backgroundColor: COLORS.transparent
  }),
  containerAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: dimen.normalizeDimen(20),
    alignSelf: 'center'
  },
  searchBar: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray210
  }
});

export default NavHeader;
