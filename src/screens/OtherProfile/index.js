import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import ToastMessage from 'react-native-toast-message';
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
/* eslint-disable no-underscore-dangle */
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BioAndChat from './elements/BioAndChat';
import BlockIcon from '../../assets/icons/images/block-blue.svg';
import BlockProfile from '../../components/Blocking/BlockProfile';
import BottomSheetBio from '../ProfileScreen/elements/BottomSheetBio';
import GlobalButton from '../../components/Button/GlobalButton';
import ProfileHeader from '../ProfileScreen/elements/ProfileHeader';
import ProfilePicture from '../ProfileScreen/elements/ProfilePicture';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import ReportUser from '../../components/Blocking/ReportUser';
import ShareUtils from '../../utils/share';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import StorageUtils from '../../utils/storage';
import dimen from '../../utils/dimen';
import useCoreFeed from '../FeedScreen/hooks/useCoreFeed';
import useDiscovery from '../DiscoveryScreenV2/hooks/useDiscovery';
import useFeedPreloadHook from '../FeedScreen/hooks/useFeedPreloadHook';
import useOtherProfileScreenAnalyticsHook from '../../libraries/analytics/useOtherProfileScreenAnalyticsHook';
import useOtherProfileScreenHooks from './hooks/useOtherProfileScreenHooks';
import useViewPostTimeHook from '../FeedScreen/hooks/useViewPostTimeHook';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {blockUser, unblockUserApi} from '../../service/blocking';
import {downVote, upVote} from '../../service/vote';
import {fonts, normalize} from '../../utils/fonts';
import {generateAnonProfileOtherProfile} from '../../service/anonymousProfile';
import {getFeedDetail} from '../../service/post';
import {getOtherFeedsInProfile, setFollow, setUnFollow} from '../../service/profile';
import {getSingularOrPluralText} from '../../utils/string/StringUtils';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex, setOtherProfileFeed} from '../../context/actions/otherProfileFeed';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const {width} = Dimensions.get('screen');

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetBio = React.useRef(null);
  const blockUserRef = React.useRef();
  const reportUserRef = React.useRef();
  const specificIssueRef = React.useRef();
  const flatListRef = React.useRef();
  const closeBlockUserBottomSheetRef = React.useRef(false);

  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [reason, setReason] = React.useState([]);
  const [yourselfId] = React.useState('');
  const [loadingBlocking, setLoadingBlocking] = React.useState(false);
  const [postOffset, setPostOffset] = React.useState(0);

  const headerHeightRef = React.useRef(0);
  const interactionManagerRef = React.useRef(null);
  const [, dispatchOtherProfile] = React.useContext(Context).otherProfileFeed;
  const [profile] = React.useContext(Context).profile;
  const [mainFeeds, dispatch] = React.useContext(Context).feeds;
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const {params} = route;
  const {timer, viewPostTimeIndex} = mainFeeds;
  const [loadingGenerateAnon, setLoadingGenerateAnon] = React.useState(false);
  const [anonProfile, setAnonProfile] = React.useState();
  const {mappingColorFeed} = useCoreFeed();
  const {updateFollowDiscoveryContext} = useDiscovery();

  const {
    feeds,
    otherProfileData: dataMain,
    isBlocked,
    isBlocking,
    isLoading,
    isProfileFetching,
    isCurrentFollowed,
    otherUserId: other_id,
    selfUserId: user_id,

    refetchBlockStatus,
    refetchOtherProfile,
    setOtherProfileData: setDataMain,
    setIsCurrentFollowed
  } = useOtherProfileScreenHooks(params?.data?.other_id, params?.data?.username);

  const eventTrack = useOtherProfileScreenAnalyticsHook();
  const {
    onBioAnonButtonOff,
    onBioAnonButtonOn,
    onHeaderFollowUser,
    onHeaderUnfollowUser,
    onPostBlockButtonClicked,
    onBlockUserBottomSheetClosed,
    onBlockUserBlockAndReportClicked,
    onBlockUserBlockIndefinitelyClicked,
    onBlockUserReportInfoSubmitted,
    onBlockUserReportInfoSkipped,
    onShareUserButtonClicked
  } = eventTrack;

  const isSignedMessageEnabled = dataMain.isSignedMessageEnabled ?? true;
  const isAnonimityEnabled = dataMain.isAnonMessageEnabled && isSignedMessageEnabled;

  const {onWillSendViewPostTime} = useViewPostTimeHook(dispatch, timer, viewPostTimeIndex);
  const {fetchNextFeeds} = useFeedPreloadHook(feeds?.length, () => getOtherFeeds(postOffset));

  const generateAnonProfile = async () => {
    setLoadingGenerateAnon(true);
    const anonProfileResult = await generateAnonProfileOtherProfile(other_id);
    setLoadingGenerateAnon(false);
    setAnonProfile(anonProfileResult);
  };

  const showSignedMessageDisableToast = () => {
    if (!isSignedMessageEnabled) {
      ToastMessage.show({
        type: 'asNative',
        text1: `Only users ${dataMain.username} follows can send messages`,
        position: 'bottom'
      });
    }
  };

  const getOtherFeeds = async (offset = 0) => {
    const otherId = other_id;
    try {
      const cacheFeed = StorageUtils.otherProfileFeed.getForKey(otherId);
      if (cacheFeed) {
        setOtherProfileFeed(JSON.parse(cacheFeed), dispatchOtherProfile);
      }
      const result = await getOtherFeedsInProfile(otherId, offset);
      const {data: feedOtherProfile} = result;
      const {mapNewData} = mappingColorFeed({
        dataFeed: feedOtherProfile,
        dataCache: cacheFeed
      });
      if (offset === 0) {
        setOtherProfileFeed(mapNewData, dispatchOtherProfile);
        StorageUtils.otherProfileFeed.setForKey(otherId, JSON.stringify(mapNewData));
      } else {
        const clonedFeeds = [...feeds, ...mapNewData];
        setOtherProfileFeed(clonedFeeds, dispatchOtherProfile);
        StorageUtils.otherProfileFeed.setForKey(otherId, JSON.stringify(clonedFeeds));
      }
      setPostOffset(Number(result.offset));
    } catch (e) {
      console.log('error', e);
    }
  };

  React.useEffect(() => {
    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      setOtherProfileFeed([], dispatchOtherProfile);
    };
  }, []);

  React.useEffect(() => {
    getOtherFeeds();
  }, [other_id]);

  const onShare = async () => {
    onShareUserButtonClicked();
    ShareUtils.shareUserLink(params?.data?.username);
  };

  const handleSetUnFollow = async () => {
    setDataMain((prevState) => ({
      ...prevState,
      is_following: false,
      is_me_following_target: false
    }));
    setIsCurrentFollowed(false);

    const data = {
      user_id_follower: profile.myProfile.user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile'
    };
    const result = await setUnFollow(data);
    if (result.code === 200) {
      refetchOtherProfile();
      onHeaderUnfollowUser();
    }
  };

  const handleSetFollow = async () => {
    setDataMain((prevState) => ({
      ...prevState,
      is_following: true,
      is_me_following_target: true
    }));
    setIsCurrentFollowed(true);

    const data = {
      user_id_follower: profile.myProfile.user_id,
      user_id_followed: other_id,
      username_follower: profile.myProfile.username,
      username_followed: params?.data?.username,
      follow_source: 'other-profile'
    };
    const result = await setFollow(data);
    if (result.code === 200) {
      refetchOtherProfile();
      onHeaderFollowUser();
    }
  };

  const openBio = () => {
    if (profile?.myProfile?.user_id !== other_id) {
      return null;
    }
    return bottomSheetBio.current.open();
  };

  const toggleSwitch = async () => {
    if (!isSignedMessageEnabled) {
      showSignedMessageDisableToast();
    } else if (!isAnonimityEnabled) {
      ToastMessage.show({
        type: 'asNative',
        text1: 'This user does not allow messages in Incognito Mode.',
        position: 'bottom'
      });
    } else {
      setIsAnonimity((prevState) => {
        if (prevState) onBioAnonButtonOff();
        else onBioAnonButtonOn();
        return !prevState;
      });
      await generateAnonProfile();
    }
  };

  const __renderListHeader = () => {
    const __renderBlockIcon = () => {
      if (isBlocking)
        return (
          <View style={styles.buttonFollowing(isAnonimity)}>
            <Text style={styles.textButtonFollowing(isAnonimity)}>Blocked</Text>
          </View>
        );

      return (
        <View
          style={{
            ...styles.btnMsg(isAnonimity),
            borderColor: COLORS.gray410
          }}>
          <BlockIcon width={20} height={20} style={{color: COLORS.gray410}} />
        </View>
      );
    };

    const handleOpenFollowerUser = () => {
      SimpleToast.show(
        `For privacy reasons, you cannot see who follows ${dataMain.username}`,
        SimpleToast.LONG
      );
    };
    const __renderFollowerDetail = () => {
      if (isBlocking) return <></>;
      return (
        <View style={styles.wrapFollower}>
          <TouchableOpacity onPress={handleOpenFollowerUser} style={styles.wrapRow}>
            <React.Fragment>
              <Text style={styles.textTotal(isAnonimity)}>{dataMain.follower_symbol}</Text>
              <Text style={styles.textFollow}>
                {getSingularOrPluralText(dataMain.follower_symbol, 'Follower', 'Followers')}
              </Text>
            </React.Fragment>
          </TouchableOpacity>
          {user_id === dataMain.user_id ? (
            <View style={styles.following}>
              <TouchableNativeFeedback
                onPress={() => goToFollowings(dataMain.user_id, dataMain.username)}>
                <View style={styles.wrapRow}>
                  <Text style={styles.textTotal}>{dataMain.following_symbol}</Text>
                  <Text style={styles.textFollow}>Following</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          ) : null}
        </View>
      );
    };

    const __renderFollowingButton = () => {
      if (user_id === dataMain.user_id) return <></>;
      if (isCurrentFollowed) {
        return (
          <GlobalButton
            buttonStyle={{paddingLeft: 0}}
            onPress={() => {
              updateFollowDiscoveryContext(false, {user_id: other_id});
              handleSetUnFollow();
            }}>
            <View style={styles.buttonFollowing(isAnonimity)}>
              <Text style={styles.textButtonFollowing(isAnonimity)}>Following</Text>
            </View>
          </GlobalButton>
        );
      }

      return (
        <GlobalButton
          buttonStyle={{paddingLeft: 0}}
          onPress={() => {
            updateFollowDiscoveryContext(true, {user_id: other_id});
            handleSetFollow();
          }}>
          <View style={styles.buttonFollow(isAnonimity)}>
            <Text style={styles.textButtonFollow}>Follow</Text>
          </View>
        </GlobalButton>
      );
    };

    const __renderMessageAndFollowButtonGroup = () => {
      if (isBlocking) return <></>;
      return <React.Fragment>{__renderFollowingButton()}</React.Fragment>;
    };

    if (isBlocked) return <></>;
    return (
      <>
        <View style={styles.headerImageContainer}>
          <View style={{marginRight: normalize(22)}}>
            <ProfilePicture
              karmaScore={dataMain.karma_score ?? 0}
              withKarma={true}
              profilePicPath={dataMain.profile_pic_path ?? DEFAULT_PROFILE_PIC_PATH}
              width={6}
            />
          </View>

          <View>
            <View style={styles.rightHeaderContentContainer}>
              {__renderMessageAndFollowButtonGroup()}
              <GlobalButton buttonStyle={{paddingLeft: 0}} onPress={onBlockReaction}>
                {__renderBlockIcon()}
              </GlobalButton>
            </View>
            {__renderFollowerDetail()}
          </View>
        </View>
        {!isBlocked && !isBlocking && (
          <BioAndChat
            isAnonimity={isAnonimity}
            bio={dataMain.bio}
            openBio={openBio}
            dataMain={dataMain}
            isSignedMessageEnabled={isSignedMessageEnabled}
            showSignedMessageDisableToast={showSignedMessageDisableToast}
            loadingGenerateAnon={loadingGenerateAnon}
            avatarUrl={profile.myProfile.profile_pic_path}
            anonProfile={anonProfile}
            username={dataMain.username}
            toggleSwitch={toggleSwitch}
            isAnonimityEnabled={isAnonimityEnabled}
            eventTrack={eventTrack}
          />
        )}
      </>
    );
  };

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset < 70) {
      setOpacity(0);
      setIsShowButton(false);
    } else if (currentOffset >= 70 && currentOffset <= headerHeightRef.current) {
      setIsShowButton(true);
      setOpacity((currentOffset - 70) * (1 / 100));
    } else if (currentOffset > headerHeightRef.current) {
      setOpacity(1);
      setIsShowButton(true);
    }
  };

  const toTop = () => {
    flatListRef.current.scrollToTop();
  };

  const onBlockReaction = () => {
    blockUserRef.current.open();
    console.log('onBlockReaction');
    onPostBlockButtonClicked();
    closeBlockUserBottomSheetRef.current = true;
  };
  const handleBlocking = async (message) => {
    setLoadingBlocking(true);
    let data = {
      userId: dataMain.user_id,
      source: 'screen_profile',
      reason
    };
    if (message) {
      data = {...data, message};
    }
    const blockingUser = await blockUser(data);
    if (blockingUser.code === 200) {
      closeBlockUserBottomSheetRef.current = false;
      blockUserRef.current.close();
      specificIssueRef.current.close();
      reportUserRef.current.close();
      refetchBlockStatus();
      setLoadingBlocking(false);
    } else {
      setLoadingBlocking(false);
    }
  };

  const unblockUser = async () => {
    try {
      const processPostApi = await unblockUserApi({userId: dataMain.user_id});
      if (processPostApi.code === 200) {
        refetchBlockStatus();
        closeBlockUserBottomSheetRef.current = false;
        blockUserRef.current.close();
        specificIssueRef.current.close();
        reportUserRef.current.close();
      }
    } catch (e) {
      refetchBlockStatus();
      closeBlockUserBottomSheetRef.current = false;
      blockUserRef.current.close();
      specificIssueRef.current.close();
      reportUserRef.current.close();
    }
  };

  const onBlocking = (reasonBlock) => {
    if (reasonBlock === 1) {
      handleBlocking();
    } else if (reasonBlock === 2) {
      closeBlockUserBottomSheetRef.current = false;
      blockUserRef.current.close();
      onBlockUserBlockAndReportClicked();
      interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
        reportUserRef.current.open();
      });
    } else {
      unblockUser();
    }
  };

  const onNextQuestion = (question) => {
    setReason(question);
    reportUserRef.current.close();
    interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
      specificIssueRef.current.open();
    });
  };

  const skipQuestion = (source) => {
    reportUserRef.current.close();
    if (source === 'report-user') {
      onBlockUserBlockIndefinitelyClicked();
    } else if (source === 'specific-issue') {
      onBlockUserReportInfoSkipped();
    }
    handleBlocking();
  };

  const onReportIssue = async (message) => {
    specificIssueRef.current.close();
    onBlockUserReportInfoSubmitted();
    handleBlocking(message);
  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index,
        singleFeed: newPolls
      },
      dispatch
    );

    getOtherFeeds();
  };

  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );
    navigation.navigate('DomainScreen', param);
  };

  const onPress = (item, index) => {
    navigation.navigate('OtherProfilePostDetailPage', {
      index,
      isalreadypolling: item.isalreadypolling,
      feedId: item.id
    });
  };

  const onPressComment = (item, index) => {
    navigation.navigate('OtherProfilePostDetailPage', {
      index,
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      isKeyboardOpen: true
    });
  };

  const setUpVote = async (post, index) => {
    await upVote(post);
    updateFeed(post, index);
  };

  const setDownVote = async (post, index) => {
    await downVote(post);
    updateFeed(post, index);
  };

  const updateFeed = async (post, index) => {
    try {
      const data = await getFeedDetail(post.activity_id);
      if (data) {
        setFeedByIndex(
          {
            singleFeed: data.data,
            index
          },
          dispatch
        );
      }
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const goToFollowings = (idUser, myUsername) => {
    navigation.navigate('Followings', {
      screen: 'TabFollowing',
      params: {idUser, myUsername}
    });
  };

  const handleRefresh = () => {
    getOtherFeeds(0);
  };

  const handleDataFeed = () => {
    if (isProfileFetching) return [];
    const isFeedsShown = !(isBlocking || isBlocked);
    if (isFeedsShown) {
      return feeds;
    }
    return [];
  };

  const handleOnBlockUserBottomSheetClosed = () => {
    if (closeBlockUserBottomSheetRef.current) {
      onBlockUserBottomSheetClosed();
      closeBlockUserBottomSheetRef.current = false;
    }
    console.log('handleOnBlockUserBottomSheetClosed');
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        <ProfileHeader
          hideSetting
          showArrow
          onShareClicked={onShare}
          username={params?.data?.username}
        />

        <ProfileTiktokScroll
          keyboardShouldPersistTaps="handled"
          contentHeight={dimen.size.PROFILE_ITEM_HEIGHT}
          ref={flatListRef}
          extraData={[feeds]}
          data={handleDataFeed()}
          onScroll={handleScroll}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          onMomentumScrollEnd={(event) => {
            onWillSendViewPostTime(event, feeds);
            fetchNextFeeds(event);
          }}
          ListHeaderComponent={
            <>
              {!isProfileFetching ? (
                <View
                  onLayout={(event) => {
                    const headerHeightLayout = event.nativeEvent.layout.height;
                    headerHeightRef.current = headerHeightLayout;
                  }}>
                  <View style={styles.content}>{__renderListHeader()}</View>
                </View>
              ) : null}
            </>
          }>
          {({item, index}) => {
            return (
              <View style={{width: '100%'}}>
                <RenderItem
                  bottomBar={false}
                  item={item}
                  index={index}
                  onNewPollFetched={onNewPollFetched}
                  onPressDomain={onPressDomain}
                  onPress={() => {
                    onPress(item, index);
                    Keyboard.dismiss();
                  }}
                  onPressComment={() => onPressComment(item, item.id)}
                  onPressUpvote={(post) => setUpVote(post, index)}
                  selfUserId={yourselfId}
                  onPressDownVote={(post) => setDownVote(post, index)}
                  eventTrack={eventTrack}
                  onPressBlock={onBlockReaction}
                />
              </View>
            );
          }}
        </ProfileTiktokScroll>

        <BottomSheetBio
          username={dataMain.username}
          isOtherProfile={true}
          ref={bottomSheetBio}
          value={dataMain.bio}
        />
        <BlockProfile
          onSelect={onBlocking}
          refBlockUser={blockUserRef}
          username={params?.data?.username}
          isBlocker={isBlocking}
          onClose={() => handleOnBlockUserBottomSheetClosed()}
        />
        <ReportUser
          ref={reportUserRef}
          onSelect={onNextQuestion}
          onSkip={() => skipQuestion('report-user')}
        />
        <SpecificIssue
          refSpecificIssue={specificIssueRef}
          onSkip={() => skipQuestion('specific-issue')}
          onPress={onReportIssue}
          loading={loadingBlocking}
        />
        {isShowButton ? (
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{...styles.btnBottom, opacity}}>
              <ArrowUpWhiteIcon width={12} height={20} fill={COLORS.almostBlack} />
            </View>
          </TouchableNativeFeedback>
        ) : null}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  content: {
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray110
  },
  dummyItem: (heightItem) => ({
    height: heightItem
  }),
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  following: {marginLeft: 18},
  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.black,
    marginLeft: 18
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 100,
    marginLeft: 3.2,
    marginTop: 3.2
  },
  containerProfile: {
    marginTop: 24
  },
  wrapImageProfile: {
    marginTop: 24,
    flexDirection: 'column',
    backgroundColor: COLORS.redalert
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.black
  },
  wrapFollower: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textTotal: (isAnon) => ({
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black,
    paddingRight: 4
  }),
  textFollow: {
    fontSize: 14,
    color: COLORS.black,
    paddingRight: 4
  },
  tabs: {
    width,
    borderBottomColor: COLORS.gray110,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row'
  },
  postText: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.signed_primary
  },
  wrapNameAndbackButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapImageAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.almostBlack
  },
  wrapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonFollowing: (isAnon) => ({
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isAnon ? COLORS.anon_primary : COLORS.signed_primary,
    borderRadius: 8
  }),
  buttonFollow: (isAnon) => ({
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: isAnon ? COLORS.anon_primary : COLORS.signed_primary,
    color: COLORS.almostBlack
  }),
  textButtonFollowing: (isAnon) => ({
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: isAnon ? COLORS.anon_primary : COLORS.signed_primary
  }),
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.white
  },
  btnBottom: {
    position: 'absolute',
    width: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    height: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    right: 20,
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    backgroundColor: COLORS.signed_primary,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabsFixed: {
    width,
    borderBottomColor: COLORS.gray110,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    zIndex: 2000,
    backgroundColor: COLORS.almostBlack
  },
  containerFlatFeed: {
    // padding: 20,
    flex: 1
  },
  btnMsg: (isAnon) => ({
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: isAnon ? COLORS.anon_primary : COLORS.signed_primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  containerLoading: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99
  },
  containerLoadingBlockScreen: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightHeaderContentContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  headerImageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20
  },
  blockBtnStyle: (isAnonym) => ({
    backgroundColor: isAnonym ? COLORS.anon_primary : COLORS.signed_primary,
    paddingLeft: 0
  })
});

export default withInteractionsManaged(OtherProfile);
