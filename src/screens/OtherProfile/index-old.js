import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import config from 'react-native-config';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import { STREAM_API_KEY } from '@env';
import { StreamApp } from 'react-native-activity-feed';
import { generateRandomId } from 'stream-chat-react-native';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';

import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BlockBlueIcon from '../../assets/icons/images/block-blue.svg';
import BlockProfile from '../../components/Blocking/BlockProfile';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import Loading from '../Loading';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import ReportUser from '../../components/Blocking/ReportUser';
import ShareIcon from '../../assets/icons/images/share.svg';
import ShareUtils from '../../utils/share';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import { Context } from '../../context';
import { blockUser, unblockUserApi } from '../../service/blocking';
import {
  checkUserBlock,
  getOtherFeedsInProfile,
  getOtherProfile,
  setFollow,
  setUnFollow
} from '../../service/profile';
import { colors } from '../../utils/colors';
import { downVote, upVote } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import { getAccessToken } from '../../utils/token';
import { getFeedDetail } from '../../service/post';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setChannel } from '../../context/actions/setChannel';
import { setFeedByIndex, setOtherProfileFeed } from '../../context/actions/otherProfileFeed';
import { trimString } from '../../utils/string/TrimString';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';

const { width } = Dimensions.get('screen');

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const scrollViewReff = React.useRef(null);
  const postRef = React.useRef(null);
  const blockUserRef = React.useRef();
  const reportUserRef = React.useRef();
  const specificIssueRef = React.useRef();
  const [dataMain, setDataMain] = React.useState({});
  const [user_id, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [other_id, setOtherId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [isOffsetScroll, setIsOffsetScroll] = React.useState(false);
  const [tokenJwt, setTokenJwt] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [channel, dispatchChannel] = React.useContext(Context).channel;
  const [otherProfileFeeds, dispatchOtherProfile] = React.useContext(Context).otherProfileFeed;
  const [reason, setReason] = React.useState([]);
  const [yourselfId, setYourselfId] = React.useState('');
  const [blockStatus, setBlockStatus] = React.useState({
    blocked: false,
    blocker: false,
  });
  const [loadingBlocking, setLoadingBlocking] = React.useState(false);
  const [profile] = React.useContext(Context).profile;
  const create = useClientGetstream();

  const { params } = route;
  const { feeds } = otherProfileFeeds

  const getOtherFeeds = async (userId) => {
    const result = await getOtherFeedsInProfile(userId)
    setOtherProfileFeed(result.data, dispatchOtherProfile)
  }

  React.useEffect(() => {
    create();
    setIsLoading(true);
    const getJwtToken = async () => {
      setTokenJwt(await getAccessToken());
    };

    getJwtToken();
    setUserId(params.data.user_id);
    setUsername(params.data.username);
    fetchOtherProfile(params.data.username);
  }, [params.data]);

  const checkUserBlockHandle = async (user_id) => {
    try {
      const sendData = {
        user_id,
      };
      const processGetBlock = await checkUserBlock(sendData);
      if (processGetBlock.status === 200) {
        setBlockStatus(processGetBlock.data.data);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const fetchOtherProfile = async (username) => {
    try {
      const result = await getOtherProfile(username);
      if (result.code === 200) {
        setDataMain(result.data);
        checkUserBlockHandle(result.data.user_id);
        setOtherId(result.data.user_id);
        getOtherFeeds(result.data.user_id)
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        SimpleToast.show(e.response.data.message, SimpleToast.SHORT)
      }
      setBlockStatus({
        ...blockStatus,
        blocked: true,
      });
      setIsLoading(false);
    }
  };

  const onShare = async () => ShareUtils.shareUserLink(dataMain.username);

  const handleSetUnFollow = async () => {
    const data = {
      user_id_follower: user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile',
    };
    const result = await setUnFollow(data);
    if (result.code == 200) {
      fetchOtherProfile(username);
    }
  };

  const handleSetFollow = async () => {
    const data = {
      user_id_follower: user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile',
    };

    const result = await setFollow(data);

    if (result.code === 200) {
      fetchOtherProfile(username);
    }
  };

  const renderBio = (string) => (
    <View style={styles.containerBio}>
      {string === null || string === undefined ? (
        <Text>No Bio</Text>
      ) : (
        <Text linkStyle={styles.seeMore}>
          {trimString(string, 121)}{' '}
          {string.length > 121 ? (
            <Text style={{ color: colors.blue }}>see more</Text>
          ) : null}
        </Text>
      )}
    </View>
  );

  const handleScroll = (event) => {
    postRef.current.measure((x, y, width, height, pagex, pagey) => {
      if (pagey < 0) {
        setIsOffsetScroll(true);
      } else {
        setIsOffsetScroll(false);
      }
    });

    const currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset < 70) {
      setOpacity(0);
      setIsShowButton(false);
    } else if (currentOffset >= 70 && currentOffset <= 270) {
      setIsShowButton(true);
      setOpacity((currentOffset - 70) * (1 / 100));
    } else if (currentOffset > 270) {
      setOpacity(1);
      setIsShowButton(true);
    }
  };

  const toTop = () => {
    scrollViewReff.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  const createChannel = async () => {
    try {
      const members = [other_id, user_id];
      setIsLoading(true);
      const clientChat = await client.client;
      const filter = { type: 'messaging', members: { $eq: members } };
      const sort = [{ last_message_at: -1 }];
      const channels = await clientChat.queryChannels(filter, sort, {
        watch: true,
        state: true,
      });
      if (channels.length > 0) {
        setChannel(channels[0], dispatchChannel);
      } else {
        const channelChat = await clientChat.channel(
          'messaging',
          generateRandomId(),
          {
            name: [profile.myProfile.username, username].join(', '),
            members,
          },
        );
        await channelChat.watch();
        setChannel(channelChat, dispatchChannel);
      }
      await navigation.navigate('ChatDetailPage');
      setTimeout(() => setIsLoading(false), 400)
      // setIsLoading(false)
    } catch (e) {
      console.log(e)
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
      reason,
    };
    if (message) {
      data = { ...data, message };
    }
    const blockingUser = await blockUser(data);
    if (blockingUser.code == 200) {
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
      const processPostApi = await unblockUserApi({ userId: dataMain.user_id });
      if (processPostApi.code == 200) {
        checkUserBlockHandle(dataMain.user_id);
        blockUserRef.current.close();
        specificIssueRef.current.close();
        reportUserRef.current.close();
      }
    } catch (e) {
      console.log(e, 'eman');
    }
  };

  const onBlocking = (reason) => {
    if (reason === 1) {
      handleBlocking();
    } else if (reason === 2) {
      blockUserRef.current.close();
      reportUserRef.current.open();
    } else {
      unblockUser();
    }
  };

  const onNextQuestion = (question) => {
    setReason(question);
    reportUserRef.current.close();
    specificIssueRef.current.open();
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
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.navigate('DomainScreen', param);
  };

  const onPress = (item, index) => {
    navigation.navigate('OtherProfilePostDetailPage', {
      index,
      isalreadypolling: item.isalreadypolling,
    });
  };

  const onPressComment = (index) => {
    navigation.navigate('OtherProfilePostDetailPage', {
      index,
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
            index,
          },
          dispatch,
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goToFollowings = (user_id, username) => {
    navigation.navigate('Followings', {
      screen: 'TabFollowing',
      params: { user_id, username },
    });
  };


  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        {isOffsetScroll ? (
          <View style={styles.tabsFixed}>
            <Text style={styles.postText}>Post{ }</Text>
          </View>
        ) : null}
        <ScrollView onScroll={handleScroll} ref={scrollViewReff}>
          {tokenJwt !== '' && (
            <StreamApp
              apiKey={config, STREAM_API_KEY}
              appId={config.STREAM_APP_ID}
              token={tokenJwt}>
              {!isLoading ? (
                <View style={styles.content}>
                  {blockStatus.blocked ? null : (
                    <React.Fragment>
                      <View style={styles.header}>
                        <View style={styles.wrapNameAndbackButton}>
                          <TouchableNativeFeedback
                            onPress={() => navigation.goBack()}>
                            <ArrowLeftIcon width={20} height={12} fill="#000" />
                          </TouchableNativeFeedback>
                          <Text style={styles.textUsername}>{username}</Text>
                        </View>
                        <TouchableNativeFeedback onPress={onShare}>
                          <ShareIcon width={20} height={20} fill="#000" />
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.containerProfile}>
                        <View style={styles.wrapImageAndStatus}>
                          <Image
                            style={styles.profileImage}
                            source={{
                              uri: dataMain.profile_pic_path
                                ? dataMain.profile_pic_path
                                : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
                            }}
                          />

                          <View style={styles.wrapButton}>
                            <TouchableNativeFeedback onPress={onBlockReaction}>
                              {blockStatus.blocker ? (
                                <View style={styles.buttonFollowing}>
                                  <Text style={styles.textButtonFollowing}>
                                    Blocked
                                  </Text>
                                </View>
                              ) : (
                                <BlockBlueIcon
                                  width={20}
                                  height={20}
                                  fill={colors.bondi_blue}
                                />
                              )}
                            </TouchableNativeFeedback>

                            {blockStatus.blocker ? null : (
                              <React.Fragment>
                                <TouchableNativeFeedback
                                  onPress={createChannel}>
                                  <View style={styles.btnMsg}>
                                    <EnveloveBlueIcon
                                      width={20}
                                      height={16}
                                      fill={colors.bondi_blue}
                                    />
                                  </View>
                                </TouchableNativeFeedback>
                                {user_id === dataMain.user_id ? null : <React.Fragment>{dataMain.is_following ? (
                                  <TouchableNativeFeedback
                                    onPress={() => handleSetUnFollow()}>
                                    <View style={styles.buttonFollowing}>
                                      <Text style={styles.textButtonFollowing}>
                                        Following
                                      </Text>
                                    </View>
                                  </TouchableNativeFeedback>
                                ) : (
                                  <TouchableNativeFeedback
                                    onPress={() => handleSetFollow()}>
                                    <View style={styles.buttonFollow}>
                                      <Text style={styles.textButtonFollow}>
                                        Follow
                                      </Text>
                                    </View>
                                  </TouchableNativeFeedback>
                                )}</React.Fragment>}

                              </React.Fragment>
                            )}
                          </View>
                        </View>
                        {dataMain.real_name && (
                          <Text style={styles.nameProfile}>
                            {dataMain.real_name}
                          </Text>
                        )}
                      </View>
                      {blockStatus.blocker ? null : (
                        <React.Fragment>
                          <View style={styles.wrapFollower}>
                            <View style={styles.wrapRow}>
                              <Text style={styles.textTotal}>
                                {dataMain.follower_symbol}
                              </Text>
                              <Text style={styles.textFollow}>Followers</Text>
                            </View>
                            {user_id === dataMain.user_id ? <View style={styles.following}>
                              <TouchableNativeFeedback
                                onPress={() =>
                                  goToFollowings(dataMain.user_id, dataMain.username)
                                }>
                                <View style={styles.wrapRow}>
                                  <Text style={styles.textTotal}>
                                    {dataMain.following_symbol}
                                  </Text>
                                  <Text style={styles.textFollow}>Following</Text>
                                </View>
                              </TouchableNativeFeedback>
                            </View> : null}
                          </View>
                          {renderBio(dataMain.bio)}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </View>
              ) : null}
              {!isLoading ? (
                <React.Fragment>
                  {blockStatus.blocked || blockStatus.blocker ? null : (
                    // {true ? null : (
                    <View>
                      <View style={styles.tabs} ref={postRef}>
                        <Text style={styles.postText}>
                          Post{/* Please change this to post size */}
                        </Text>
                      </View>
                      <View style={styles.containerFlatFeed}>
                        {feeds.map((item, index) => (
                          <RenderItem
                            bottomBar={false}
                            item={item}
                            index={index}
                            onNewPollFetched={onNewPollFetched}
                            onPressDomain={onPressDomain}
                            onPress={() => onPress(item, index)}
                            onPressComment={() => onPressComment(index)}
                            onPressBlock={onBlockReaction}
                            onPressUpvote={(post) => setUpVote(post, index)}
                            selfUserId={user_id}
                            onPressDownVote={(post) =>
                              setDownVote(post, index)
                            } />
                        ))}
                      </View>
                    </View>
                  )}
                </React.Fragment>
              ) : null}
            </StreamApp>
          )}
          <BlockProfile
            onSelect={onBlocking}
            refBlockUser={blockUserRef}
            username={username}
            isBlocker={blockStatus.blocker}
          />
          <ReportUser
            ref={reportUserRef}
            onSelect={onNextQuestion}
            onSkip={skipQuestion}
          />
          <SpecificIssue
            refSpecificIssue={specificIssueRef}
            onSkip={skipQuestion}
            onPress={onReportIssue}
            loading={loadingBlocking}
          />
        </ScrollView>
        {isShowButton ? (
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{ ...styles.btnBottom, opacity }}>
              <ArrowUpWhiteIcon width={12} height={20} fill={colors.white} />
            </View>
          </TouchableNativeFeedback>
        ) : null}
        <Loading visible={isLoading} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  following: { marginLeft: 18 },
  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
    marginLeft: 18,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 12,
  },
  containerProfile: {
    marginTop: 24,
  },
  wrapImageProfile: {
    marginTop: 24,
    flexDirection: 'column',
    backgroundColor: 'red',
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  wrapFollower: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  wrapRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTotal: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.bondi_blue,
    paddingRight: 4,
  },
  textFollow: {
    fontFamily: fonts.inter[800],
    fontSize: 14,
    color: colors.black,
    paddingRight: 4,
  },
  containerBio: {
    marginTop: 8,
  },
  seeMore: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
  },
  tabs: {
    width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  postText: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.bondi_blue,
  },
  wrapNameAndbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapImageAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  wrapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8,
  },
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue,
    color: colors.white,
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white,
  },
  btnBottom: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 20,
    bottom: 50,
    backgroundColor: colors.bondi_blue,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.white,
  },
  containerFlatFeed: {
    // padding: 20,
    flex: 1,
  },
  btnMsg: {
    paddingVertical: 10,
    paddingRight: 16,
    paddingLeft: 24,
  },
});
export default OtherProfile;
