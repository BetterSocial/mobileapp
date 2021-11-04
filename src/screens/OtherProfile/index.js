import * as React from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  Share,
  ScrollView,
} from 'react-native';

import {STREAM_API_KEY, STREAM_APP_ID} from '@env';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {StreamApp, FlatFeed} from 'react-native-activity-feed';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import {generateRandomId} from 'stream-chat-react-native';

import {
  getOtherProfile,
  setUnFollow,
  setFollow,
  checkUserBlock,
} from '../../service/profile';
import RenderActivity from './elements/RenderActivity';
import Loading from '../Loading';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {trimString} from '../../utils/string/TrimString';
import {getAccessToken} from '../../utils/token';
import ShareIcon from '../../assets/icons/images/share.svg';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import BlockBlueIcon from '../../assets/icons/images/block-blue.svg';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import BlockDomain from '../../components/Blocking/BlockDomain';
import BlockUser from '../../components/Blocking/BlockUser';
import ReportUser from '../../components/Blocking/ReportUser';
import BlockProfile from '../../components/Blocking/BlockProfile';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import {blockUser, unblockUserApi} from '../../service/blocking';

const width = Dimensions.get('screen').width;

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
  const [reason, setReason] = React.useState([]);
  const [blockStatus, setBlockStatus] = React.useState({
    blocked: false,
    blocker: false,
  });
  const [loadingBlocking, setLoadingBlocking] = React.useState(false);
  const [profile] = React.useContext(Context).profile;
  const create = useClientGetstream();

  const {params} = route;

  React.useEffect(() => {
    create();
    setIsLoading(true);
    let getJwtToken = async () => {
      setTokenJwt(await getAccessToken());
    };

    getJwtToken();
    setUserId(params.data.user_id);
    setOtherId(params.data.other_id);
    setUsername(params.data.username);
    fetchOtherProfile(params.data.user_id, params.data.other_id);
  }, [params.data]);

  const checkUserBlockHandle = async (user_id) => {
    try {
      const sendData = {
        user_id,
      };
      const processGetBlock = await checkUserBlock(sendData);
      console.log(processGetBlock, 'kumala');
      if (processGetBlock.status === 200) {
        setBlockStatus(processGetBlock.data.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e, 'eman');
      setIsLoading(false);
    }
  };

  const fetchOtherProfile = async (userId, otherId) => {
    try {
      const result = await getOtherProfile(userId, otherId);
      if (result.code === 200) {
        setDataMain(result.data);
        checkUserBlockHandle(result.data.user_id);
      }
    } catch (e) {
      setBlockStatus({
        ...blockStatus,
        blocked: true,
      });
      setIsLoading(false);
    }
  };

  async function buildLink() {
    const link = await dynamicLinks().buildLink(
      {
        link: `https://dev.bettersocial.org/${dataMain.username}`,
        domainUriPrefix: 'https://bettersocialapp.page.link',
        analytics: {
          campaign: 'banner',
        },
        navigation: {
          forcedRedirectEnabled: false,
        },
        android: {
          packageName: 'org.bettersocial.dev',
        },
      },
      'SHORT',
    );
    return link;
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: await buildLink(),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSetUnFollow = async () => {
    let data = {
      user_id_follower: user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile',
    };
    const result = await setUnFollow(data);
    if (result.code == 200) {
      fetchOtherProfile(user_id, other_id, false);
    }
  };

  const handleSetFollow = async () => {
    let data = {
      user_id_follower: user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile',
    };
    const result = await setFollow(data);
    if (result.code === 200) {
      fetchOtherProfile(user_id, other_id, false);
    }
  };

  const renderBio = (string) => {
    return (
      <View style={styles.containerBio}>
        {string === null || string === undefined ? (
          <Text>No Bio</Text>
        ) : (
          <Text linkStyle={styles.seeMore}>
            {trimString(string, 121)}{' '}
            {string.length > 121 ? (
              <Text style={{color: colors.blue}}>see more</Text>
            ) : null}
          </Text>
        )}
      </View>
    );
  };

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
    let members = [other_id, user_id];
    setIsLoading(true);
    const clientChat = await client.client;
    const filter = {type: 'messaging', members: {$eq: members}};
    const sort = [{last_message_at: -1}];
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
          name: [profile.username, username].join(', '),
          members: members,
        },
      );
      await channelChat.watch();
      setChannel(channelChat, dispatchChannel);
    }
    setIsLoading(false);
    await navigation.navigate('ChatDetailPage');
  };

  const onBlockReaction = () => {
    blockUserRef.current.open();
  };

  //blocking

  const handleBlocking = async (message) => {
    setLoadingBlocking(true);
    console.log('blocking');
    let data = {
      userId: dataMain.user_id,
      source: 'screen_profile',
      reason,
    };
    if (message) {
      data = {...data, message};
    }
    const blockingUser = await blockUser(data);
    if (blockingUser.code == 200) {
      console.log(data, 'kakamna');
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
    console.log('hanim');
    try {
      const processPostApi = await unblockUserApi({user_id: dataMain.user_id});
      console.log('unblock user', processPostApi);
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
    console.log(question, 'hanhan');
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

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        {isOffsetScroll ? (
          <View style={styles.tabsFixed}>
            <Text style={styles.postText}>Post{}</Text>
          </View>
        ) : null}
        <ScrollView onScroll={handleScroll} ref={scrollViewReff}>
          {tokenJwt !== '' && (
            <StreamApp
              apiKey={STREAM_API_KEY}
              appId={STREAM_APP_ID}
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
                              <BlockBlueIcon
                                width={20}
                                height={20}
                                fill={colors.bondi_blue}
                              />
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
                                {dataMain.is_following ? (
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
                                )}
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
                            <View style={styles.following}>
                              <View style={styles.wrapRow}>
                                <Text style={styles.textTotal}>
                                  {dataMain.following_symbol}
                                </Text>
                                <Text style={styles.textFollow}>Following</Text>
                              </View>
                            </View>
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
                    <View>
                      <View style={styles.tabs} ref={postRef}>
                        <Text style={styles.postText}>
                          Post{/* Please change this to post size */}
                        </Text>
                      </View>
                      <View style={styles.containerFlatFeed}>
                        <FlatFeed
                          feedGroup="user"
                          userId={other_id}
                          Activity={(props, index) => {
                            return RenderActivity(props, dataMain);
                          }}
                          notify
                        />
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
            refReportUser={reportUserRef}
            onSelect={onNextQuestion}
            onSkip={skipQuestion}
          />
          <SpecificIssue
            refSpecificIssue={specificIssueRef}
            onSkip={skipQuestion}
            onPress={onReportIssue}
          />
        </ScrollView>
        {isShowButton ? (
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{...styles.btnBottom, opacity}}>
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
  following: {marginLeft: 18},
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
    width: width,
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
    width: width,
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
    padding: 20,
    flex: 1,
  },
  btnMsg: {
    paddingVertical: 10,
    paddingRight: 16,
    paddingLeft: 24,
  },
});
export default OtherProfile;
