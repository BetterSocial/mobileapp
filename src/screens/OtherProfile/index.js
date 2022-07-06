import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  Dimensions,
  Image,
  InteractionManager,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {FlatFeed, StreamApp} from 'react-native-activity-feed';
import {STREAM_API_KEY, STREAM_APP_ID} from '@env';
import {generateRandomId} from 'stream-chat-react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BlockBlueIcon from '../../assets/icons/images/block-blue.svg';
import BlockDomain from '../../components/Blocking/BlockDomain';
import BlockProfile from '../../components/Blocking/BlockProfile';
import BlockUser from '../../components/Blocking/BlockUser';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import GlobalButton from '../../components/Button/GlobalButton';
import Loading from '../Loading';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import ProfileHeader from '../ProfileScreen/elements/ProfileHeader';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderActivity from './elements/RenderActivity';
import RenderItem from '../ProfileScreen/elements/RenderItem';
import ReportUser from '../../components/Blocking/ReportUser';
import ShareIcon from '../../assets/icons/images/share.svg';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import dimen from '../../utils/dimen';
import {Context} from '../../context';
import {blockUser, unblockUserApi} from '../../service/blocking';
import {
  checkUserBlock,
  getOtherFeedsInProfile,
  getOtherProfile,
  setFollow,
  setUnFollow,
} from '../../service/profile';
import {colors} from '../../utils/colors';
import { downVote, upVote } from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getAccessToken} from '../../utils/token';
import { getFeedDetail } from '../../service/post';
import { getSingularOrPluralText } from '../../utils/string/StringUtils';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import {setChannel} from '../../context/actions/setChannel';
import { setFeedByIndex, setOtherProfileFeed } from '../../context/actions/otherProfileFeed';
import { shareUserLink } from '../../utils/Utils';
import {trimString} from '../../utils/string/TrimString';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const {width, height} = Dimensions.get('screen');
// let headerHeight = 0;

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const scrollViewReff = React.useRef(null);
  const postRef = React.useRef(null);
  const blockUserRef = React.useRef();
  const reportUserRef = React.useRef();
  const specificIssueRef = React.useRef();
  const flatListRef = React.useRef();

  const [dataMain, setDataMain] = React.useState({});
  const [dataMainBio, setDataMainBio] = React.useState("");
  const [user_id, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [other_id, setOtherId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [isOffsetScroll, setIsOffsetScroll] = React.useState(false);
  const [tokenJwt, setTokenJwt] = React.useState('');
  const [reason, setReason] = React.useState([]);
  const [yourselfId, setYourselfId] = React.useState('');
  const [blockStatus, setBlockStatus] = React.useState({
    blocked: false,
    blocker: false,
  });
  const [loadingBlocking, setLoadingBlocking] = React.useState(false);
  const [postOffset, setPostOffset] = React.useState(0)

  const headerHeightRef = React.useRef(0);

  const [client] = React.useContext(Context).client;
  const [channel, dispatchChannel] = React.useContext(Context).channel;
  const [otherProfileFeeds, dispatchOtherProfile] = React.useContext(Context).otherProfileFeed;
  const [profile] = React.useContext(Context).profile;

  const create = useClientGetstream();

  const {params} = route;
  const {feeds} = otherProfileFeeds

  const getOtherFeeds = async (userId, offset = 0) => {
    let result = await getOtherFeedsInProfile(userId)

    if(offset === 0) setOtherProfileFeed([...result.data, {dummy: true}], dispatchOtherProfile)
    else {
      let clonedFeeds = [...feeds]
      clonedFeeds.splice(feeds.length - 1, 0, ...data)
      setOtherProfileFeed(clonedFeeds, dispatchOtherProfile)
    }

    setPostOffset(result.offset)
  }

  React.useEffect(() => {
    create();
    setIsLoading(true);
    let getJwtToken = async () => {
      setTokenJwt(await getAccessToken());
    };

    getJwtToken();
    setUserId(params.data.user_id);
    setUsername(params.data.username);
    fetchOtherProfile(params.data.username);
  }, [params.data]);

  const checkUserBlockHandle = async (user_id, callback) => {
    try {
      const sendData = {
        user_id,
      };
      const processGetBlock = await checkUserBlock(sendData);
      if(callback) callback()
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
        setDataMainBio(result.data.bio)
        checkUserBlockHandle(result.data.user_id);
        setOtherId(result.data.user_id);
        getOtherFeeds(result.data.user_id)
      }
    } catch (e) {
      if(e.response && e.response.data && e.response.data.message) {
          SimpleToast.show(e.response.data.message, SimpleToast.SHORT)
      }
      setBlockStatus({
        ...blockStatus,
        blocked: true,
      });
      setIsLoading(false);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: shareUserLink(username),
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
      fetchOtherProfile(username);
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
      fetchOtherProfile(username);
    }
  };

  const __renderBio = (string) => {
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

  const __renderListHeader = () => {
    const __renderBlockIcon = () => {
      if(blockStatus.blocker) return (
        <View style={styles.buttonFollowing}>
          <Text style={styles.textButtonFollowing}>
            Blocked
          </Text>
        </View>)

      return (
        <BlockBlueIcon
          width={20}
          height={20}
          fill={colors.bondi_blue} />
          )
    }

    const __renderFollowerDetail = () => {
      if(blockStatus.blocker) return <></>
      return (
        <React.Fragment>
          <View style={styles.wrapFollower}>
            <View style={styles.wrapRow}>
              <Text style={styles.textTotal}>
                {dataMain.follower_symbol}
              </Text>
              <Text style={styles.textFollow}>{getSingularOrPluralText(dataMain.follower_symbol, "Follower", "Followers")}</Text>
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
          {__renderBio(dataMain.bio)}
        </React.Fragment>
      )
    }

    const __renderFollowingButton = () => {
      if(user_id === dataMain.user_id) return <></>
      if(dataMain.is_following) return (
        <React.Fragment>
          <GlobalButton
            onPress={() => handleSetUnFollow()}>
            <View style={styles.buttonFollowing}>
              <Text style={styles.textButtonFollowing}>
                Following
              </Text>
            </View>
          </GlobalButton>
        </React.Fragment>)

      return (
        <React.Fragment>
          <GlobalButton
            onPress={() => handleSetFollow()}>
            <View style={styles.buttonFollow}>
              <Text style={styles.textButtonFollow}>
                Follow
              </Text>
            </View>
          </GlobalButton>
        </React.Fragment>
      )
    }

    const __renderMessageAndFollowButtonGroup = () => {
      if(blockStatus.blocker) return <></>
      return (
        <React.Fragment>
          <GlobalButton
            onPress={createChannel}>
            <View style={styles.btnMsg}>
              <EnveloveBlueIcon
                width={20}
                height={20}
                fill={colors.bondi_blue}
              />
            </View>
          </GlobalButton>

          {__renderFollowingButton()}
        
      </React.Fragment>
      )
    }

    if(blockStatus.blocked) return <></>
    return (
    <React.Fragment>
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
            <GlobalButton onPress={onBlockReaction}>
              {__renderBlockIcon()}
            </GlobalButton>

            {__renderMessageAndFollowButtonGroup()}
          </View>
        </View>
        {dataMain.real_name && (
          <Text style={styles.nameProfile}>
            {dataMain.real_name}
          </Text>
        )}
      </View>
      {__renderFollowerDetail()}
  </React.Fragment>
  )}

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

  const createChannel = async () => {
    try {
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
            name: [profile.myProfile.username, username].join(', '),
            members: members,
          },
        );
        await channelChat.watch();
        setChannel(channelChat, dispatchChannel);
      }
      await navigation.navigate('ChatDetailPage');
      setTimeout(() => setIsLoading(false), 400)
      // setIsLoading(false)
    } catch(e) {
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
      data = {...data, message};
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
      const processPostApi = await unblockUserApi({userId: dataMain.user_id});
      if (processPostApi.code == 200) {
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

  const onBlocking = (reason) => {
    if (reason === 1) {
      handleBlocking();
    } else if (reason === 2) {
      blockUserRef.current.close();
      InteractionManager.runAfterInteractions(() => {
        reportUserRef.current.open();
      })
    } else {
      unblockUser();
    }
  };

  const onNextQuestion = (question) => {
    setReason(question);
    reportUserRef.current.close();
    InteractionManager.runAfterInteractions(() => {
      specificIssueRef.current.open();

    })
  };

  const skipQuestion = () => {
    reportUserRef.current.close();
    handleBlocking();
  };

  const onReportIssue = async (message) => {
    specificIssueRef.current.close();
    handleBlocking(message);
  };

  let onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index: index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

  const onPressDomain = (item) => {
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.navigate('DomainScreen', param);
  };

  const onPress = (item, index) => {
    navigation.navigate('OtherProfilePostDetailPage', {
      index: index,
      isalreadypolling: item.isalreadypolling,
    });
  };

  const onPressComment = (index) => {
    navigation.navigate('OtherProfilePostDetailPage', {
      index: index,
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
      let data = await getFeedDetail(post.activity_id);
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
      params: {user_id, username},
    });
  };

  const isFeedsShown = !(blockStatus.blocked) && !(blockStatus.blocker)
  const __handleOnEndReached = () => getOtherFeeds(other_id, postOffset)

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        <ProfileHeader hideSetting showArrow onShareClicked={onShare} username={dataMain.username}/>  
        {isLoading ? (
          <View style={styles.containerLoading}>
            <LoadingWithoutModal />
          </View>
        ) : (
          <></>
        )}

        <ProfileTiktokScroll
          ref={flatListRef}
          data={isFeedsShown ? feeds : []}
          onScroll={handleScroll}
          onEndReach={__handleOnEndReached}
          snapToOffsets={(() => {
            let posts = feeds.map((item, index) => {
              return headerHeightRef.current + (index * dimen.size.PROFILE_ITEM_HEIGHT)
            })
            console.log(posts)
            return [headerHeightRef.current, ...posts]
          })()}
          ListHeaderComponent={
            <View onLayout={(event) => {
              let headerHeightLayout = event.nativeEvent.layout.height
              headerHeightRef.current = headerHeightLayout
            }}>
              <View style={styles.content}>
                {__renderListHeader()}
              </View>
              <View>
                <View style={styles.tabs} ref={postRef}>
                  <Text style={styles.postText}>
                    Posts
                  </Text>
                </View>
              </View>
            </View>
          }>
            {({item, index}) => {
              let dummyItemHeight = height - dimen.size.PROFILE_ITEM_HEIGHT - 44 - 16 - StatusBar.currentHeight;
              if(item.dummy) return <View style={styles.dummyItem(dummyItemHeight)}></View>
              return <View style={{width: '100%'}}>
                <RenderItem
                  bottomBar={false}
                  item={item}
                  index={index}
                  onNewPollFetched={onNewPollFetched}
                  onPressDomain={onPressDomain}
                  onPress={() => onPress(item, index)}
                  onPressComment={() => onPressComment(index)}
                  onPressBlock={() => onPressBlock(item)}
                  onPressUpvote={(post) => setUpVote(post, index)}
                  selfUserId={yourselfId}
                  onPressDownVote={(post) =>
                    setDownVote(post, index)
                  } />
            </View>
            }}
          </ProfileTiktokScroll>
        
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
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'column',
    padding: 20,
  },
  dummyItem : (height) => {
    return {
      height,
      
    }
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
    width: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    height: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    right: 20,
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
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
    // padding: 20,
    flex: 1,
  },
  btnMsg: {
    paddingVertical: 0,
  },
  containerLoading: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default withInteractionsManaged (OtherProfile);
