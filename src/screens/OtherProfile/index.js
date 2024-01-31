import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import ToastMessage from 'react-native-toast-message';
import netInfo from '@react-native-community/netinfo';
import {
  Dimensions,
  Image,
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
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import ReportUser from '../../components/Blocking/ReportUser';
import ShareUtils from '../../utils/share';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import StorageUtils from '../../utils/storage';
import dimen from '../../utils/dimen';
import useCoreFeed from '../FeedScreen/hooks/useCoreFeed';
import useCreateChat from '../../hooks/screen/useCreateChat';
import useFeedPreloadHook from '../FeedScreen/hooks/useFeedPreloadHook';
import useViewPostTimeHook from '../FeedScreen/hooks/useViewPostTimeHook';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {blockUser, unblockUserApi} from '../../service/blocking';
import {
  checkUserBlock,
  getOtherFeedsInProfile,
  getOtherProfile,
  setFollow,
  setUnFollow
} from '../../service/profile';
import {downVote, upVote} from '../../service/vote';
import {fonts, normalize} from '../../utils/fonts';
import {generateAnonProfileOtherProfile} from '../../service/anonymousProfile';
import {getFeedDetail} from '../../service/post';
import {getSingularOrPluralText} from '../../utils/string/StringUtils';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex, setOtherProfileFeed} from '../../context/actions/otherProfileFeed';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import ProfilePicture from '../ProfileScreen/elements/ProfilePicture';
import {COLORS} from '../../utils/theme';
import EnvelopeIcon from '../../assets/icon/EnvelopeIcon';

const {width} = Dimensions.get('screen');

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetBio = React.useRef(null);
  const blockUserRef = React.useRef();
  const reportUserRef = React.useRef();
  const specificIssueRef = React.useRef();
  const flatListRef = React.useRef();

  const [dataMain, setDataMain] = React.useState({});
  const [, setDataMainBio] = React.useState('');
  const [user_id, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [other_id, setOtherId] = React.useState('');
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [reason, setReason] = React.useState([]);
  const [yourselfId] = React.useState('');
  const [blockStatus, setBlockStatus] = React.useState({
    blocked: false,
    blocker: false
  });
  const [loadingBlocking, setLoadingBlocking] = React.useState(false);
  const [postOffset, setPostOffset] = React.useState(0);

  const headerHeightRef = React.useRef(0);
  const interactionManagerRef = React.useRef(null);
  const [otherProfileFeeds, dispatchOtherProfile] = React.useContext(Context).otherProfileFeed;
  const [profile] = React.useContext(Context).profile;
  const [mainFeeds, dispatch] = React.useContext(Context).feeds;
  const [loading, setLoading] = React.useState(false);
  const [initLoading, setInitLoading] = React.useState(true);
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const {params} = route;
  const {feeds} = otherProfileFeeds;
  const {timer, viewPostTimeIndex} = mainFeeds;
  const [loadingGenerateAnon, setLoadingGenerateAnon] = React.useState(false);
  const [anonProfile, setAnonProfile] = React.useState();
  const {mappingColorFeed} = useCoreFeed();
  const isSignedMessageEnabled = dataMain.isSignedMessageEnabled ?? true;
  const isAnonimityEnabled = dataMain.isAnonMessageEnabled && isSignedMessageEnabled;
  const {createSignChat} = useCreateChat();

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

  React.useEffect(() => {
    setOtherId(params?.data?.other_id);
  }, [params.data]);

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
      setLoading(false);
      setPostOffset(Number(result.offset));
    } catch (e) {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      setOtherProfileFeed([], dispatchOtherProfile);
    };
  }, []);

  React.useEffect(() => {
    netInfo.addEventListener((state) => {
      if (state.isConnected) {
        initData();
      } else {
        handleOfflineMode();
      }
    });
    initData();
  }, []);

  React.useEffect(() => {
    getOtherFeeds();
  }, [other_id]);

  const initData = () => {
    setInitLoading(true);
    setUserId(params.data.user_id);
    setUsername(params.data.username);
    fetchOtherProfile();
  };

  const checkUserBlockHandle = async (userId, callback) => {
    const status = await netInfo.fetch();
    if (status.isConnected) {
      try {
        const sendData = {
          user_id: userId
        };
        const processGetBlock = await checkUserBlock(sendData);
        if (callback) callback();
        if (processGetBlock.status === 200) {
          setBlockStatus(processGetBlock.data.data);
        }
      } catch (e) {
        if (__DEV__) {
          console.log(e, 'error');
        }
      }
    }
  };

  const handleSaveDataOtherProfile = (data) => {
    setDataMain(data);
    setDataMainBio(data.bio);
    checkUserBlockHandle(data.user_id);
    setOtherId(data.user_id);
    setLoading(false);
    setInitLoading(false);
  };

  const fetchOtherProfile = async () => {
    const status = await netInfo.fetch();
    if (status.isConnected) {
      try {
        handleOfflineMode();
        const result = await getOtherProfile(params?.data?.username);
        if (result.code === 200) {
          handleSaveDataOtherProfile(result.data);
        }
        StorageUtils.otherProfileData.setForKey(
          params?.data?.username,
          JSON.stringify(result.data)
        );
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          SimpleToast.show(e.response.data.message, SimpleToast.SHORT);
        }
        setLoading(false);
        setInitLoading(false);
      }
    } else {
      handleOfflineMode();
    }
  };

  const handleOfflineMode = async () => {
    const cache = await StorageUtils.otherProfileData.getForKey(params?.data?.username);
    if (cache) {
      const data = JSON.parse(cache);
      handleSaveDataOtherProfile(data);
    } else {
      setLoading(false);
      setInitLoading(false);
    }
  };
  const onShare = async () => ShareUtils.shareUserLink(username);

  const handleSetUnFollow = async () => {
    setDataMain((prevState) => ({
      ...prevState,
      is_following: false
    }));

    const data = {
      user_id_follower: profile.myProfile.user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile'
    };
    const result = await setUnFollow(data);
    if (result.code === 200) {
      fetchOtherProfile();
    }
  };

  const handleSetFollow = async () => {
    setDataMain((prevState) => ({
      ...prevState,
      is_following: true
    }));

    const data = {
      user_id_follower: profile.myProfile.user_id,
      user_id_followed: other_id,
      username_follower: profile.myProfile.username,
      username_followed: username,
      follow_source: 'other-profile'
    };
    const result = await setFollow(data);
    if (result.code === 200) {
      fetchOtherProfile();
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
        text1: 'This user does not want to receive anonymous messages',
        position: 'bottom'
      });
    } else {
      setIsAnonimity((prevState) => !prevState);
      await generateAnonProfile();
    }
  };

  const __renderListHeader = () => {
    const __renderBlockIcon = () => {
      if (blockStatus.blocker)
        return (
          <View style={styles.buttonFollowing(isAnonimity)}>
            <Text style={styles.textButtonFollowing(isAnonimity)}>Blocked</Text>
          </View>
        );

      return (
        <View
          style={{
            ...styles.btnMsg(isAnonimity),
            borderColor: isAnonimity ? COLORS.anon_primary : COLORS.signed_primary
          }}>
          <BlockIcon
            width={20}
            height={20}
            style={{color: isAnonimity ? COLORS.anon_primary : COLORS.signed_primary}}
          />
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
      if (blockStatus.blocker) return <></>;
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
      if (dataMain.is_following)
        return (
          <GlobalButton onPress={() => handleSetUnFollow()}>
            <View style={styles.buttonFollowing(isAnonimity)}>
              <Text style={styles.textButtonFollowing(isAnonimity)}>Following</Text>
            </View>
          </GlobalButton>
        );

      return (
        <GlobalButton onPress={() => handleSetFollow()}>
          <View style={styles.buttonFollow(isAnonimity)}>
            <Text style={styles.textButtonFollow}>Follow</Text>
          </View>
        </GlobalButton>
      );
    };

    const onCreateChat = () => {
      const channelName = [username, profile?.myProfile?.username].join(',');

      const selectedUser = {
        user: {
          name: channelName,
          image: dataMain.profile_pic_path ?? DEFAULT_PROFILE_PIC_PATH
        }
      };
      const members = [other_id, profile.myProfile.user_id];
      createSignChat(members, selectedUser);
    };

    const __renderMessageAndFollowButtonGroup = () => {
      if (blockStatus.blocker) return <></>;
      return (
        <React.Fragment>
          {__renderFollowingButton()}
          <GlobalButton onPress={onCreateChat}>
            <View style={styles.btnMsg(isAnonimity)}>
              <EnvelopeIcon color={isAnonimity ? COLORS.anon_primary : COLORS.signed_primary} />
            </View>
          </GlobalButton>
        </React.Fragment>
      );
    };

    if (blockStatus.blocked) return <></>;
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
              <GlobalButton buttonStyle={{paddingLeft: 0}} onPress={onBlockReaction}>
                {__renderBlockIcon()}
              </GlobalButton>
              {__renderMessageAndFollowButtonGroup()}
            </View>
            {__renderFollowerDetail()}
          </View>
        </View>
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
        />
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
      blockUserRef.current.close();
      specificIssueRef.current.close();
      reportUserRef.current.close();
      checkUserBlockHandle(dataMain.user_id);
      setLoadingBlocking(false);
    } else {
      setLoadingBlocking(false);
    }
  };

  const unblockUser = async () => {
    try {
      const processPostApi = await unblockUserApi({userId: dataMain.user_id});
      if (processPostApi.code === 200) {
        checkUserBlockHandle(dataMain.user_id);
        blockUserRef.current.close();
        specificIssueRef.current.close();
        reportUserRef.current.close();
      }
    } catch (e) {
      checkUserBlockHandle(dataMain.user_id);
      blockUserRef.current.close();
      specificIssueRef.current.close();
      reportUserRef.current.close();
    }
  };

  const onBlocking = (reasonBlock) => {
    if (reasonBlock === 1) {
      handleBlocking();
    } else if (reasonBlock === 2) {
      blockUserRef.current.close();
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

  const skipQuestion = () => {
    reportUserRef.current.close();
    handleBlocking();
  };

  const onReportIssue = async (message) => {
    specificIssueRef.current.close();
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
      feedId: item.id
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
    const isFeedsShown = !blockStatus.blocked && !blockStatus.blocker;
    if (isFeedsShown) {
      return feeds;
    }
    return [];
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        <ProfileHeader
          hideSetting
          showArrow
          onShareClicked={onShare}
          username={dataMain.username}
        />

        <ProfileTiktokScroll
          keyboardShouldPersistTaps="handled"
          ref={flatListRef}
          extraData={[feeds]}
          data={handleDataFeed()}
          onScroll={handleScroll}
          onRefresh={handleRefresh}
          refreshing={loading}
          onMomentumScrollEnd={(event) => {
            onWillSendViewPostTime(event, feeds);
            fetchNextFeeds(event);
          }}
          ListHeaderComponent={
            <>
              {!initLoading ? (
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
          username={username}
          isBlocker={blockStatus.blocker}
        />
        <ReportUser ref={reportUserRef} onSelect={onNextQuestion} onSkip={skipQuestion} />
        <SpecificIssue
          refSpecificIssue={specificIssueRef}
          onSkip={skipQuestion}
          onPress={onReportIssue}
          loading={loadingBlocking}
        />
        {isShowButton ? (
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{...styles.btnBottom, opacity}}>
              <ArrowUpWhiteIcon width={12} height={20} fill={COLORS.white} />
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
    backgroundColor: COLORS.white
  },
  content: {
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgrey
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
    color: isAnon ? COLORS.anon_primary : COLORS.signed_primary,
    paddingRight: 4
  }),
  textFollow: {
    fontSize: 14,
    color: COLORS.black,
    paddingRight: 4
  },
  tabs: {
    width,
    borderBottomColor: COLORS.lightgrey,
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
    backgroundColor: COLORS.white
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
    color: COLORS.white
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
    borderBottomColor: COLORS.lightgrey,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    zIndex: 2000,
    backgroundColor: COLORS.white
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
