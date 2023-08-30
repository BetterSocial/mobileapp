import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import ToastMessage from 'react-native-toast-message';
import ToggleSwitch from 'toggle-switch-react-native';
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
import {generateRandomId} from 'stream-chat-react-native';
/* eslint-disable no-underscore-dangle */
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BlockIcon from '../../assets/icons/images/block-blue.svg';
import BlockProfile from '../../components/Blocking/BlockProfile';
import BottomSheetBio from '../ProfileScreen/elements/BottomSheetBio';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import GlobalButton from '../../components/Button/GlobalButton';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import ProfileHeader from '../ProfileScreen/elements/ProfileHeader';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import ReportUser from '../../components/Blocking/ReportUser';
import ShareUtils from '../../utils/share';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import TextAreaChat from '../../components/TextAreaChat';
import dimen from '../../utils/dimen';
import useSaveAnonChatHook from '../../database/hooks/useSaveAnonChatHook';
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
import {colors} from '../../utils/colors';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {generateAnonProfileOtherProfile} from '../../service/anonymousProfile';
import {getFeedDetail} from '../../service/post';
import {getSingularOrPluralText} from '../../utils/string/StringUtils';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {sendAnonymousDMOtherProfile, sendSignedDMOtherProfile} from '../../service/chat';
import {setChannel} from '../../context/actions/setChannel';
import {setFeedByIndex, setOtherProfileFeed} from '../../context/actions/otherProfileFeed';
import {trimString} from '../../utils/string/TrimString';
import {useAfterInteractions} from '../../hooks/useAfterInteractions';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const {width, height} = Dimensions.get('screen');
// let headerHeight = 0;

const BioAndChat = (props) => {
  const {
    isAnonimity,
    bio,
    openBio,
    isSignedMessageEnabled,
    showSignedMessageDisableToast,
    loadingGenerateAnon,
    avatarUrl,
    anonProfile,
    onSendDM,
    setDMChat,
    loadingSendDM,
    dmChat,
    username,
    toggleSwitch,
    isAnonimityEnabled
  } = props;
  return (
    <View style={styles.bioAndSendChatContainer(isAnonimity)}>
      <View style={styles.containerBio}>
        {bio === null || bio === undefined ? (
          <Text style={styles.bioText(isAnonimity)}>Send a message</Text>
        ) : (
          <TouchableOpacity onPress={openBio}>
            <Text linkStyle={styles.seeMore} style={styles.bioText(isAnonimity)}>
              {trimString(bio, 121)}{' '}
              {bio.length > 121 ? <Text style={{color: colors.blue}}>see more</Text> : null}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        disabled={isSignedMessageEnabled}
        activeOpacity={1}
        onPress={showSignedMessageDisableToast}>
        <TextAreaChat
          isAnonimity={isAnonimity}
          loadingAnonUser={loadingGenerateAnon}
          avatarUrl={avatarUrl}
          anonUser={anonProfile}
          placeholder="Send a direct message"
          disabledInput={!isSignedMessageEnabled}
          onSend={onSendDM}
          onChangeMessage={setDMChat}
          disabledButton={loadingSendDM || !isSignedMessageEnabled}
          defaultValue={
            isSignedMessageEnabled ? dmChat : `Only users ${username} follows can send messages`
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSwitch} style={styles.toggleSwitchContainer}>
        <ToggleSwitch
          isOn={isAnonimity}
          onToggle={toggleSwitch}
          onColor={'#9DEDF1'}
          label={isAnonimityEnabled || !isSignedMessageEnabled ? 'Anonymity' : 'Anonymity disabled'}
          offColor="#F5F5F5"
          size="small"
          labelStyle={{color: isAnonimityEnabled ? colors.white : '#648ABF'}}
        />
      </TouchableOpacity>
    </View>
  );
};

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
  const [isLoading, setIsLoading] = React.useState(true);
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

  const [client] = React.useContext(Context).client;
  const [, dispatchChannel] = React.useContext(Context).channel;
  const [otherProfileFeeds, dispatchOtherProfile] = React.useContext(Context).otherProfileFeed;
  const [profile] = React.useContext(Context).profile;
  const [, dispatch] = React.useContext(Context).feeds;
  const [isLastPage, setIsLastPage] = React.useState(false);
  const [, setIsHitApiFirstTime] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAnonimity, setIsAnonimity] = React.useState(false);

  const {saveChatFromOtherProfile, savePendingChatFromOtherProfile} = useSaveAnonChatHook();

  const create = useClientGetstream();
  const {interactionsComplete} = useAfterInteractions();

  const {params} = route;
  const {feeds} = otherProfileFeeds;

  const [loadingGenerateAnon, setLoadingGenerateAnon] = React.useState(false);
  const [loadingSendDM, setLoadingSendDM] = React.useState(false);
  const [anonProfile, setAnonProfile] = React.useState();
  const [dmChat, setDMChat] = React.useState();

  const isSignedMessageEnabled = dataMain.isSignedMessageEnabled ?? true;
  const isAnonimityEnabled = dataMain.isAnonMessageEnabled && isSignedMessageEnabled;

  React.useEffect(() => {
    setDMChat('');
  }, [isSignedMessageEnabled]);

  const generateAnonProfile = async () => {
    setLoadingGenerateAnon(true);
    const anonProfileResult = await generateAnonProfileOtherProfile(other_id);
    setLoadingGenerateAnon(false);
    setAnonProfile(anonProfileResult);
  };

  const sentAnonDM = async () => {
    try {
      setIsLoading(true);
      setLoadingSendDM(true);
      const {
        anon_user_info_emoji_name,
        anon_user_info_emoji_code,
        anon_user_info_color_name,
        anon_user_info_color_code
      } = anonProfile ?? {};

      const anonDMParams = {
        user_id: dataMain.user_id,
        message: dmChat,
        anon_user_info_emoji_name,
        anon_user_info_emoji_code,
        anon_user_info_color_name,
        anon_user_info_color_code
      };
      const response = await sendAnonymousDMOtherProfile(anonDMParams);
      await saveChatFromOtherProfile(response, 'sent', true);
      setDMChat('');
    } catch (e) {
      if (e?.response?.data?.status === 'Channel is blocked') {
        const response = e?.response?.data?.data;
        await savePendingChatFromOtherProfile(response, true);
        setDMChat('');
        return;
      }
    } finally {
      setLoadingSendDM(false);
      setIsLoading(false);
    }
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

  const gotoChatRoom = async () => {
    const type = 'messaging';
    const sort = [{last_message_at: -1}];

    const members = [profile.myProfile.user_id, dataMain.user_id];
    const filter = {type, members: {$eq: members}};

    const clientChat = await client.client;

    const findChannels = await clientChat.queryChannels(filter, sort, {
      watch: true,
      state: true
    });

    setChannel(findChannels[0], dispatchChannel);
    await navigation.navigate('ChatDetailPage');
  };

  const sendSignedDM = async () => {
    try {
      setLoadingSendDM(true);
      setIsLoading(true);
      const signedMParams = {
        user_id: dataMain.user_id,
        message: dmChat
      };
      await sendSignedDMOtherProfile(signedMParams);
      await gotoChatRoom();
      setDMChat('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSendDM(false);
      setIsLoading(false);
    }
  };

  const onSendDM = async () => {
    if (isAnonimity) {
      await sentAnonDM();
    } else {
      await sendSignedDM();
    }
  };

  const getOtherFeeds = async (userId, offset = 0) => {
    try {
      setIsHitApiFirstTime(true);

      const result = await getOtherFeedsInProfile(userId, offset);
      if (Array.isArray(result.data) && result.data.length === 0) {
        setIsLastPage(true);
      }
      if (offset === 0) setOtherProfileFeed(result.data, dispatchOtherProfile);
      else {
        const clonedFeeds = [...feeds, ...result.data];
        setOtherProfileFeed(clonedFeeds, dispatchOtherProfile);
      }
      setLoading(false);
      setPostOffset(Number(result.offset));
    } catch (e) {
      setLoading(false);
      console.log(e, 'error');
    }
  };

  React.useEffect(() => {
    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      setOtherProfileFeed([], dispatchOtherProfile);
    };
  }, []);

  React.useEffect(() => {
    if (interactionsComplete) {
      fetchOtherProfile(params?.data?.username);
    }
  }, [interactionsComplete]);

  React.useEffect(() => {
    create();
    setIsLoading(true);
    setUserId(params.data.user_id);
    setUsername(params.data.username);
    fetchOtherProfile(params.data.username);
  }, [params.data]);

  const checkUserBlockHandle = async (userId, callback) => {
    try {
      const sendData = {
        user_id: userId
      };
      const processGetBlock = await checkUserBlock(sendData);
      if (callback) callback();
      if (processGetBlock.status === 200) {
        setBlockStatus(processGetBlock.data.data);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const fetchOtherProfile = async (usernames) => {
    try {
      const result = await getOtherProfile(usernames);
      if (result.code === 200) {
        setDataMain(result.data);
        setDataMainBio(result.data.bio);
        checkUserBlockHandle(result.data.user_id);
        setOtherId(result.data.user_id);
        getOtherFeeds(result.data.user_id);
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        SimpleToast.show(e.response.data.message, SimpleToast.SHORT);
      }
      setBlockStatus({
        ...blockStatus,
        blocked: true
      });
      setIsLoading(false);
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
      fetchOtherProfile(username);
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
      fetchOtherProfile(username);
    }
  };

  const openBio = () => {
    bottomSheetBio.current.open();
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
      if (blockStatus.blocker) return <></>;
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    };

    const __renderFollowingButton = () => {
      if (user_id === dataMain.user_id) return <></>;
      if (dataMain.is_following)
        return (
          <React.Fragment>
            <GlobalButton onPress={() => handleSetUnFollow()}>
              <View style={styles.buttonFollowing}>
                <Text style={styles.textButtonFollowing}>Following</Text>
              </View>
            </GlobalButton>
          </React.Fragment>
        );

      return (
        <React.Fragment>
          <GlobalButton onPress={() => handleSetFollow()}>
            <View style={styles.buttonFollow}>
              <Text style={styles.textButtonFollow}>Follow</Text>
            </View>
          </GlobalButton>
        </React.Fragment>
      );
    };

    const __renderMessageAndFollowButtonGroup = () => {
      if (blockStatus.blocker) return <></>;
      return (
        <React.Fragment>
          {__renderFollowingButton()}
          <GlobalButton onPress={onCreateChannel}>
            <View style={styles.btnMsg}>
              <EnveloveBlueIcon width={20} height={20} fill={colors.bondi_blue} />
            </View>
          </GlobalButton>
        </React.Fragment>
      );
    };

    if (blockStatus.blocked) return <></>;
    return (
      <>
        <View style={styles.headerImageContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: dataMain.profile_pic_path ?? DEFAULT_PROFILE_PIC_PATH
            }}
          />

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
          isSignedMessageEnabled={isSignedMessageEnabled}
          showSignedMessageDisableToast={showSignedMessageDisableToast}
          loadingGenerateAnon={loadingGenerateAnon}
          avatarUrl={profile.myProfile.profile_pic_path}
          anonProfile={anonProfile}
          onSendDM={onSendDM}
          setDMChat={setDMChat}
          loadingSendDM={loadingSendDM}
          dmChat={dmChat}
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

  const onCreateChannel = async () => {
    try {
      const members = [other_id, profile.myProfile.user_id];
      setIsLoading(true);
      const clientChat = await client.client;
      const filter = {type: 'messaging', members: {$eq: members}};
      const sort = [{last_message_at: -1}];
      const channels = await clientChat.queryChannels(filter, sort, {
        watch: true,
        state: true
      });

      if (channels.length > 0) {
        setChannel(channels[0], dispatchChannel);
      } else {
        const membersUsername = [profile.myProfile.username, username].join(', ');
        const channelChat = await clientChat.channel('messaging', generateRandomId(), {
          name: membersUsername,
          members
        });
        await channelChat.watch();
        setChannel(channelChat, dispatchChannel);
      }
      await navigation.navigate('ChatDetailPage');
      setTimeout(() => setIsLoading(false), 400);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
      setIsLoading(false);
    }
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

    getOtherFeeds(other_id);
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

  const isFeedsShown = !blockStatus.blocked && !blockStatus.blocker;
  const __handleOnEndReached = () => {
    if (!isLastPage) {
      getOtherFeeds(other_id, postOffset);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setIsLastPage(false);
    getOtherFeeds(other_id, 0);
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
        {isLoading ? (
          <View
            style={loadingSendDM ? styles.containerLoading : styles.containerLoadingBlockScreen}>
            <LoadingWithoutModal text={loadingSendDM ? 'Initializing chat' : null} />
          </View>
        ) : (
          <></>
        )}

        <ProfileTiktokScroll
          keyboardShouldPersistTaps="handled"
          ref={flatListRef}
          data={isFeedsShown ? feeds : []}
          onScroll={handleScroll}
          onEndReach={__handleOnEndReached}
          onRefresh={handleRefresh}
          refreshing={loading}
          snapToOffsets={(() => {
            const posts = feeds.map(
              (item, index) => headerHeightRef.current + index * dimen.size.PROFILE_ITEM_HEIGHT
            );
            return [0, ...posts];
          })()}
          ListHeaderComponent={
            <View
              onLayout={(event) => {
                const headerHeightLayout = event.nativeEvent.layout.height;
                headerHeightRef.current = headerHeightLayout;
              }}>
              <View style={styles.content}>{__renderListHeader()}</View>
            </View>
          }>
          {({item, index}) => {
            const dummyItemHeight =
              height - dimen.size.PROFILE_ITEM_HEIGHT - 44 - 16 - StatusBar.currentHeight;
            if (item.dummy) return <View style={styles.dummyItem(dummyItemHeight)}></View>;
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
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 22
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
  containerBio: {
    marginBottom: 10
  },
  seeMore: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black
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
    backgroundColor: colors.bondi_blue,
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
  rightHeaderContentContainer: {display: 'flex', flexDirection: 'row'},
  headerImageContainer: {display: 'flex', flexDirection: 'row', marginBottom: 20},
  bioAndSendChatContainer: (isAnonimity) => ({
    backgroundColor: isAnonimity ? colors.bondi_blue : colors.blue1,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 10
  }),
  bioText: (isAnonimity) => ({
    color: isAnonimity ? colors.greenDark : colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22
  })
});
export default withInteractionsManaged(OtherProfile);
