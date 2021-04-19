import React from 'react';
import {useEffect, useState, useRef} from 'react';
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
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage'
import JWTDecode from 'jwt-decode';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {StreamApp, FlatFeed} from 'react-native-activity-feed';
import {getOtherProfile, setUnFollow, setFollow} from '../../service/profile';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import ShareIcon from '../../assets/icons/images/share.svg';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import BlockBlueIcon from '../../assets/icons/images/block-blue.svg';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import Loading from '../Loading';
import {getToken} from '../../helpers/getToken';
import { trimString } from '../../helpers/stringSplit';
// import RenderActivity from './RenderActivity';

const width = Dimensions.get('screen').width;

let token_JWT = '';

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const scrollViewReff = useRef(null);
  const postRef = useRef(null);

  const [tokenParse, setTokenParse] = useState({});
  const [dataMain, setDataMain] = useState({});
  const [user_id, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [other_id, setOtherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowButton, setIsShowButton] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isOffsetScroll, setIsOffsetScroll] = useState(false);
  const [tokenJwt, setTokenJwt] = useState('')

  console.log(route.params)
  const {params} = route;

  useEffect(() => {
    let getJwtToken = async() => {
      setTokenJwt(await getToken())
    }

    getJwtToken()

    setUserId(params.data.user_id);
    setOtherId(params.data.other_id);
    setUsername(params.data.username);
    fetchOtherProfile(params.data.user_id, params.data.other_id, true);
  }, [params.data]);

  const fetchOtherProfile = async (userId, otherId, withLoading) => {
    const value = await AsyncStorage.getItem('tkn-getstream');
    var decoded = await JWTDecode(value);
    setTokenParse(decoded);
    withLoading ? setIsLoading(true) : null;
    const result = await getOtherProfile(userId, otherId);
    if (result.code == 200) {
      withLoading ? setIsLoading(false) : null;
      console.log(result.data)
      setDataMain(result.data);
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
    if (result.code == 200) {
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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {isOffsetScroll ? (
          <View style={styles.tabsFixed}>
            <Text style={styles.postText}>Post ({})</Text>
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
                  <View style={styles.wrapImageProfile}>
                    <View style={styles.wrapImageAndStatus}>
                      <View style={styles.wrapImageProfile}>
                        <Image
                          style={styles.profileImage}
                          source={{
                            uri: dataMain.profile_pic_path
                              ? dataMain.profile_pic_path
                              : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
                          }}
                        />
                        <Text style={styles.nameProfile}>
                          {dataMain.real_name
                            ? dataMain.real_name
                            : 'no name specifics'}
                        </Text>
                      </View>
                      <View style={styles.wrapButton}>
                        <TouchableNativeFeedback>
                          <BlockBlueIcon
                            width={20}
                            height={20}
                            fill={colors.bondi_blue}
                          />
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback>
                          <EnveloveBlueIcon
                            width={20}
                            height={16}
                            fill={colors.bondi_blue}
                          />
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
                      </View>
                    </View>
                    <Text style={styles.nameProfile}>
                      {params.data.full_name}
                    </Text>
                  </View>
                  <View style={{...styles.wrapFollower, marginTop: 12}}>
                    <View style={styles.wrapRow}>
                      <Text style={styles.textTotal}>
                        {dataMain.follower_symbol}
                      </Text>
                      <Text style={styles.textFollow}>Followers</Text>
                    </View>
                    <View style={{marginLeft: 18}}>
                      <View style={styles.wrapRow}>
                        <Text style={styles.textTotal}>
                          {dataMain.following_symbol}
                        </Text>
                        <Text style={styles.textFollow}>Following</Text>
                      </View>
                    </View>
                  </View>
                  {renderBio(dataMain.bio)}
                </View>
              ) : null}
              {!isLoading ? (
                <View>
                  <View style={styles.tabs} ref={postRef}>
                    <Text style={styles.postText}>Post ({})</Text>
                  </View>
                  <View style={styles.containerFlatFeed}>
                    <FlatFeed
                      feedGroup="main_feed"
                      userId={other_id}
                      Activity={(props, index) => {
                        return RenderActivity(props, dataMain);
                      }}
                      notify
                    />
                  </View>
                </View>
              ) : null}
            </StreamApp>
          )}
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
  wrapImageProfile: {
    marginTop: 24,
    flexDirection: 'column',
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
  },
  wrapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 180,
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
});
export default OtherProfile;
