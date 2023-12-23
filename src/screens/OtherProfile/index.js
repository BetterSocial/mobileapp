import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import ToastMessage from 'react-native-toast-message';
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
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import GlobalButton from '../../components/Button/GlobalButton';
import ProfileHeader from '../ProfileScreen/elements/ProfileHeader';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import ReportUser from '../../components/Blocking/ReportUser';
import ShareUtils from '../../utils/share';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import dimen from '../../utils/dimen';
import useCreateChat from '../../hooks/screen/useCreateChat';
import useFeedPreloadHook from '../FeedScreen/hooks/useFeedPreloadHook';
import useOtherProfileScreenHooks from './hooks/useOtherProfileScreenHooks';
import useViewPostTimeHook from '../FeedScreen/hooks/useViewPostTimeHook';
import {CircleGradient} from '../../components/Karma/CircleGradient';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {blockUser, unblockUserApi} from '../../service/blocking';
import {colors} from '../../utils/colors';
import {downVote, upVote} from '../../service/vote';
import {fonts, normalize} from '../../utils/fonts';
import {generateAnonProfileOtherProfile} from '../../service/anonymousProfile';
import {getFeedDetail} from '../../service/post';
import {getSingularOrPluralText} from '../../utils/string/StringUtils';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex, setOtherProfileFeed} from '../../context/actions/otherProfileFeed';
import {setFollow, setUnFollow} from '../../service/profile';
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

  const [user_id, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [other_id, setOtherId] = React.useState('');
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [reason, setReason] = React.useState([]);
  const [yourselfId] = React.useState('');
  const [loadingBlocking, setLoadingBlocking] = React.useState(false);

  const headerHeightRef = React.useRef(0);
  const interactionManagerRef = React.useRef(null);
  const [mainFeeds, dispatchOtherProfile] = React.useContext(Context).otherProfileFeed;
  const [profile] = React.useContext(Context).profile;
  const {timer, viewPostTimeIndex} = mainFeeds;
  const [, dispatch] = React.useContext(Context).feeds;
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const {params} = route;
  const [loadingGenerateAnon, setLoadingGenerateAnon] = React.useState(false);
  const [anonProfile, setAnonProfile] = React.useState();
  const {createSignChat} = useCreateChat();

  const {
    feeds,
    otherProfileData: dataMain,
    isBlocked,
    isBlocking,
    isLoading,
    isProfileFetching,
    postOffset,

    refetchFeeds,
    refetchBlockStatus,
    refetchOtherProfile,
    setOtherProfileData: setDataMain
  } = useOtherProfileScreenHooks(params?.data?.other_id, params?.data?.username);

  const isSignedMessageEnabled = dataMain.isSignedMessageEnabled ?? true;
  const isAnonimityEnabled = dataMain.isAnonMessageEnabled && isSignedMessageEnabled;

  const {onWillSendViewPostTime} = useViewPostTimeHook(dispatch, timer, viewPostTimeIndex);
  const {fetchNextFeeds} = useFeedPreloadHook(feeds?.length, () => refetchFeeds(postOffset));

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

  React.useEffect(() => {
    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      setOtherProfileFeed([], dispatchOtherProfile);
    };
  }, []);

  React.useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    setUserId(params.data.user_id);
    setUsername(params.data.username);
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
      refetchOtherProfile();
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
      refetchOtherProfile();
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
      if (isBlocking)
        return (
          <View style={styles.buttonFollowing}>
            <Text style={styles.textButtonFollowing}>Blocked</Text>
          </View>
        );

      return (
        <View style={{...styles.btnMsg, borderColor: colors.gray1}}>
          <BlockIcon width={20} height={20} style={{color: colors.gray1}} />
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
              <Text style={styles.textTotal}>{dataMain.follower_symbol}</Text>
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
            <View style={styles.buttonFollowing}>
              <Text style={styles.textButtonFollowing}>Following</Text>
            </View>
          </GlobalButton>
        );

      return (
        <GlobalButton onPress={() => handleSetFollow()}>
          <View style={styles.buttonFollow}>
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
      if (isBlocking) return <></>;
      return (
        <React.Fragment>
          {__renderFollowingButton()}
          <GlobalButton onPress={onCreateChat}>
            <View style={styles.btnMsg}>
              <EnveloveBlueIcon width={20} height={20} fill={colors.bondi_blue} />
            </View>
          </GlobalButton>
        </React.Fragment>
      );
    };

    if (isBlocked) return <></>;
    return (
      <>
        <View style={styles.headerImageContainer}>
          <View style={{marginRight: normalize(22)}}>
            <CircleGradient
              fill={dataMain.karma_score ?? 0}
              size={normalize(100)}
              width={normalize(3)}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: dataMain.profile_pic_path ?? DEFAULT_PROFILE_PIC_PATH
                }}
              />
            </CircleGradient>
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
        blockUserRef.current.close();
        specificIssueRef.current.close();
        reportUserRef.current.close();
      }
    } catch (e) {
      refetchBlockStatus();
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

    refetchFeeds();
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
    refetchFeeds(0);
  };

  const handleDataFeed = () => {
    if (isProfileFetching) return [];
    const isFeedsShown = !(isBlocking || isBlocked);
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
          isBlocker={isBlocking}
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
              <ArrowUpWhiteIcon width={12} height={20} fill={colors.white} />
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
    backgroundColor: colors.white
  },
  content: {
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
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
    color: colors.black,
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
    backgroundColor: 'red'
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black
  },
  wrapFollower: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textTotal: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.bondi_blue,
    paddingRight: 4
  },
  textFollow: {
    fontSize: 14,
    color: colors.black,
    paddingRight: 4
  },
  tabs: {
    width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row'
  },
  postText: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.bondi_blue
  },
  wrapNameAndbackButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapImageAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  wrapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8
  },
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue,
    color: colors.white
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white
  },
  btnBottom: {
    position: 'absolute',
    width: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    height: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    right: 20,
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    backgroundColor: colors.darkBlue,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabsFixed: {
    width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    zIndex: 2000,
    backgroundColor: colors.white
  },
  containerFlatFeed: {
    // padding: 20,
    flex: 1
  },
  btnMsg: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.bondi_blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  toggleSwitchContainer: {display: 'flex', alignSelf: 'flex-end', paddingVertical: 10},
  bioAndSendChatContainer: (dynamicColors) => ({
    backgroundColor: dynamicColors.primary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 10
  }),
  bioText: (dynamicColors) => ({
    color: dynamicColors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22
  }),
  rightHeaderContentContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  headerImageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20
  }
});

export default withInteractionsManaged(OtherProfile);
