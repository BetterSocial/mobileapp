import * as React from 'react';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  Dimensions,
  Image,
  LogBox,
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';

import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BlockDomain from '../../components/Blocking/BlockDomain';
import BlockUser from '../../components/Blocking/BlockUser';
import BottomSheetBio from './elements/BottomSheetBio';
import BottomSheetImage from './elements/BottomSheetImage';
import BottomSheetRealname from './elements/BottomSheetRealname';
import Loading from '../Loading';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import MemoIcAddCircle from '../../assets/icons/ic_add_circle';
import RenderActivity from './elements/RenderActivity';
import RenderItem from './elements/RenderItem';
import ReportDomain from '../../components/Blocking/ReportDomain';
import ReportPostAnonymous from '../../components/Blocking/ReportPostAnonymous';
import ReportUser from '../../components/Blocking/ReportUser';
import SettingIcon from '../../assets/icons/images/setting.svg';
import ShareIcon from '../../assets/icons/images/share.svg';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {blockAnonymous, blockUser} from '../../service/blocking';
import {
  changeRealName,
  getMyProfile,
  getSelfFeedsInProfile,
  removeImageProfile,
  updateBioProfile,
  updateImageProfile,
} from '../../service/profile';
import {colors} from '../../utils/colors';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getAccessToken} from '../../utils/token';
import {getFeedDetail, getMainFeed} from '../../service/post';
import {getUserId} from '../../utils/users';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {
  requestCameraPermission,
  requestExternalStoragePermission,
} from '../../utils/permission';
import {setFeedByIndex, setMainFeeds} from '../../context/actions/feeds';
import {setImageUrl} from '../../context/actions/users';
import {setMyProfileFeed} from '../../context/actions/myProfileFeed';
import {trimString} from '../../utils/string/TrimString';

const width = Dimensions.get('screen').width;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const bottomSheetNameRef = React.useRef();
  const bottomSheetBioRef = React.useRef();
  const bottomSheetProfilePictureRef = React.useRef();
  const postRef = React.useRef(null);
  const scrollViewReff = React.useRef(null);

  let [token_JWT, setTokenJwt] = React.useState('');
  let [users, dispatch] = React.useContext(Context).users;
  let [myProfileFeed, myProfileDispatch] =
    React.useContext(Context).myProfileFeed;
  const [dataMain, setDataMain] = React.useState({});
  const [errorBio, setErrorBio] = React.useState('');
  const [isChangeRealName, setIsChangeRealName] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingRemoveImage, setIsLoadingRemoveImage] = React.useState(false);
  const [isLoadingUpdateBio, setIsLoadingUpdateBio] = React.useState(false);
  const [isOffsetScroll, setIsOffsetScroll] = React.useState(false);
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [tempBio, setTempBio] = React.useState('');
  const [tempFullName, setTempFullName] = React.useState('');
  const [userId, setUserId] = React.useState(null);
  const [isLoadingUpdateImageGalery, setIsLoadingUpdateImageGalery] =
    React.useState(false);
  const [isLoadingUpdateImageCamera, setIsLoadingUpdateImageCamera] =
    React.useState(false);
  const [errorChangeRealName, setErrorChangeRealName] = React.useState('');
  const [image, setImage] = React.useState('');

  const [postId, setPostId] = React.useState('');
  const [lastId, setLastId] = React.useState('');
  const [yourselfId, setYourselfId] = React.useState('');
  const [time, setTime] = React.useState(new Date());
  const [username, setUsername] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const refBlockUser = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportUser = React.useRef();
  const refReportDomain = React.useRef();
  const refSpecificIssue = React.useRef();
  const refBlockPostAnonymous = React.useRef();
  const refReportPostAnonymous = React.useRef();

  let {feeds} = myProfileFeed;

  React.useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    fetchMyProfile(true);
    getMyFeeds();

    getAccessToken().then((val) => {
      setTokenJwt(val);
    });
    analytics().logScreenView({
      screen_class: 'ProfileScreen',
      screen_name: 'ProfileScreen',
    });
    analytics().logEvent('myprofile_begin_view', {
      id: 'profile_begin',
      myprofile_begin_view: Date.now(),
    });
    return () => {
      analytics().logEvent('myprofile_end_view', {
        id: 'myprofile_end_view',
        myprofile_end_view: Date.now(),
      });
      analytics().logEvent('myprofile_begin_view', {
        id: 'profile_begin',
        myprofile_begin_view: Date.now(),
      });
    };
  }, []);

  const fetchMyProfile = async (withLoading) => {
    const id = await getUserId();
    if (id) {
      setUserId(id);
      withLoading ? setIsLoading(true) : null;
      const result = await getMyProfile(id);
      if (result.code === 200) {
        setDataMain(result.data);
        setImageUrl(result.data.profile_pic_path, dispatch);
        withLoading ? setIsLoading(false) : null;
      }
    }
  };

  const getMyFeeds = async () => {
    let result = await getSelfFeedsInProfile();
    setMyProfileFeed(result.data, myProfileDispatch);
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
    analytics().logEvent('profile_screen_btn_share', {
      id: 'btn_share',
    });
    try {
      const result = await Share.share({
        message: await buildLink(),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const goToSettings = () => {
    analytics().logEvent('profile_screen_btn_settings', {
      id: 'btn_settings',
    });
    navigation.navigate('Settings');
  };

  const goToFollowings = (user_id, username) => {
    navigation.navigate('Followings', {
      screen: 'TabFollowing',
      params: {user_id, username},
    });
  };

  const changeImage = () => {
    bottomSheetProfilePictureRef.current.open();
  };

  const handleSave = async () => {
    setIsChangeRealName(true);
    const result = await changeRealName(dataMain.user_id, tempFullName);
    if (result.code === 200) {
      fetchMyProfile();
      setIsChangeRealName(false);
      bottomSheetNameRef.current.close();
    } else {
      setErrorChangeRealName(result.message);
    }
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

  const onOpenImageGalery = async () => {
    let {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
        if (res.didCancel) {
        } else {
          setImage(res.base64);
          handleUpdateImage('data:image/jpeg;base64,' + res.base64, 'gallery');
        }
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const onOpenCamera = async () => {
    let {success, message} = await requestCameraPermission();
    if (success) {
      launchCamera({mediaType: 'photo', includeBase64: true}, (res) => {
        if (res.didCancel) {
        } else {
          setImage(res.base64);
          handleUpdateImage('data:image/jpeg;base64,' + res.base64, 'camera');
        }
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const onViewProfilePicture = () => {
    bottomSheetProfilePictureRef.current.close();
    navigation.push('ImageViewer', {
      title: dataMain.username,
      images: [{url: dataMain.profile_pic_path}],
    });
  };

  const handleUpdateImage = (value, type) => {
    if (type === 'gallery') {
      setIsLoadingUpdateImageGalery(true);
    } else {
      setIsLoadingUpdateImageCamera(true);
    }

    let data = {
      profile_pic_path: value,
    };

    updateImageProfile(dataMain.user_id, data)
      .then((res) => {
        if (type === 'gallery') {
          setIsLoadingUpdateImageGalery(false);
        } else {
          setIsLoadingUpdateImageCamera(false);
        }
        if (res.code === 200) {
          bottomSheetProfilePictureRef.current.close();
          fetchMyProfile(false);
        }
      })
      .catch(() => {
        if (type === 'gallery') {
          setIsLoadingUpdateImageGalery(false);
        } else {
          setIsLoadingUpdateImageCamera(false);
        }
      });
  };

  const handleRemoveImageProfile = async () => {
    setIsLoadingRemoveImage(true);
    removeImageProfile(dataMain.user_id)
      .then((res) => {
        setIsLoadingRemoveImage(false);
        if (res.code === 200) {
          bottomSheetProfilePictureRef.current.close();
          fetchMyProfile(false);
        }
      })
      .catch(() => {
        setIsLoadingRemoveImage(false);
        showMessage({
          message: 'Remove image profile error',
          type: 'danger',
        });
      });
  };

  const changeBio = () => {
    if (dataMain.bio !== null || dataMain.bio !== undefined) {
      setTempBio(dataMain.bio);
    }
    bottomSheetBioRef.current.open();
  };

  const handleSaveBio = () => {
    setIsLoadingUpdateBio(true);
    let data = {
      bio: tempBio,
    };
    updateBioProfile(dataMain.user_id, data)
      .then((res) => {
        setIsLoadingUpdateBio(false);
        if (res.code === 200) {
          bottomSheetBioRef.current.close();
          fetchMyProfile(false);
        }
      })
      .catch(() => {
        setIsLoadingUpdateBio(false);
        showMessage({
          message: 'Update bio profile error',
          type: 'danger',
        });
      });
  };

  const onChangeTempBio = (text) => {
    if (text.length < 350) {
      setErrorBio('');
    } else {
      setErrorBio('Max length bio 350');
    }
    setTempBio(text);
  };

  const renderBio = (string) => {
    return (
      <TouchableNativeFeedback onPress={() => changeBio()}>
        <View style={styles.containerBio}>
          {string === null || string === undefined ? (
            <Text style={{color: colors.blue}}>Add Bio</Text>
          ) : (
            <Text linkStyle={styles.seeMore}>
              {trimString(string, 121)}{' '}
              {string.length > 121 ? (
                <Text style={{color: colors.blue}}>see more</Text>
              ) : null}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
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
    navigation.navigate('PostDetailPage', {
      index: index,
      isalreadypolling: item.isalreadypolling,
    });
  };

  const onPressComment = (index) => {
    navigation.navigate('PostDetailPage', {
      index: index,
    });
  };

  const onPressBlock = (value) => {
    if (value.actor.id === yourselfId) {
      Toast.show("Can't Block yourself", Toast.LONG);
    } else {
      setDataToState(value);
      if (value.anonimity) {
        refBlockPostAnonymous.current.open();
      } else {
        refBlockUser.current.open();
      }
    }
  };

  const setDataToState = (value) => {
    if (value.anonimity === true) {
      setUsername('Anonymous');
      setPostId(value.id);
      setUserId(value.actor.id + '-anonymous');
    } else {
      setUsername(value.actor.data.username);
      setPostId(value.id);
      setUserId(value.actor.id);
    }
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

  const onSelectBlocking = (v) => {
    if (v !== 1) {
      refReportUser.current.open();
    } else {
      userBlock();
    }
    refBlockUser.current.close();
  };

  const onSelectBlockingPostAnonymous = (v) => {
    if (v !== 1) {
      refReportPostAnonymous.current.open();
    } else {
      blockPostAnonymous();
    }
    refBlockPostAnonymous.current.close();
  };

  const userBlock = async () => {
    const data = {
      userId: userId,
      postId: postId,
      source: 'screen_feed',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockUser(data);
    if (result.code === 200) {
      getDataFeeds('');
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  const blockPostAnonymous = async () => {
    const data = {
      postId: postId,
      source: 'screen_feed',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockAnonymous(data);
    if (result.code === 201) {
      getDataFeeds('');
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  const getDataFeeds = async (id = '') => {
    setLoading(true);
    try {
      let query = '';
      if (id !== '') {
        query = '?id_lt=' + id;
      }

      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        if (id === '') {
          setMainFeeds(data, dispatch);
        } else {
          setMainFeeds([...feeds, ...data], dispatch);
        }
      }
      setLoading(false);
      setInitialLoading(false);
      setTime(new Date());
      setLoading(false);
    } catch (e) {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  const onIssue = (v) => {
    refSpecificIssue.current.close();
    setMessageReport(v);
    setTimeout(() => {
      userBlock();
    }, 500);
  };
  const onSkipOnlyBlock = () => {
    refReportUser.current.close();
    userBlock();
  };
  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportUser.current.close();
    refSpecificIssue.current.open();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
        {isOffsetScroll ? (
          <View style={styles.tabsFixed}>
            <Text style={styles.postText}>
              Posts{/* Change this to post size*/}
            </Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.containerLoading}>
            <LoadingWithoutModal />
          </View>
        ) : (
          <></>
        )}
        <ScrollView
          onScroll={handleScroll}
          ref={scrollViewReff}
          keyboardShouldPersistTaps="always">
          {token_JWT !== '' && (
            <StreamApp
              apiKey={STREAM_API_KEY}
              appId={STREAM_APP_ID}
              token={token_JWT}>
              {!isLoading ? (
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.textUsername}>{dataMain.username}</Text>
                    <View style={styles.wrapHeaderButton}>
                      <View style={styles.btnShare}>
                        <TouchableNativeFeedback onPress={onShare}>
                          <ShareIcon
                            width={20}
                            height={20}
                            fill={colors.black}
                          />
                        </TouchableNativeFeedback>
                      </View>
                      <TouchableNativeFeedback onPress={goToSettings}>
                        <SettingIcon
                          width={20}
                          height={20}
                          fill={colors.black}
                        />
                      </TouchableNativeFeedback>
                    </View>
                  </View>
                  <View style={styles.wrapImageProfile}>
                    <TouchableNativeFeedback onPress={changeImage}>
                      <View style={styles.profileImageContainer}>
                        <Image
                          style={styles.profileImage}
                          source={{
                            uri: dataMain.profile_pic_path
                              ? `${dataMain.profile_pic_path}`
                              : DEFAULT_PROFILE_PIC_PATH,
                          }}
                        />
                        {!dataMain.profile_pic_path ? (
                          <MemoIcAddCircle
                            width={48}
                            height={48}
                            style={styles.addCircle}
                          />
                        ) : (
                          <></>
                        )}
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                  <View style={styles.wrapFollower}>
                    <View style={styles.wrapRow}>
                      <Text style={styles.textTotal}>
                        {dataMain.follower_symbol}
                      </Text>
                      <Text style={styles.textFollow}>Followers</Text>
                    </View>
                    <View style={styles.following}>
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
                    </View>
                  </View>

                  {renderBio(dataMain.bio)}
                </View>
              ) : null}

              {!isLoading ? (
                <View>
                  <View style={styles.tabs} ref={postRef}>
                    <Text style={styles.postText}>
                      Posts{/* Please change this to post size*/}
                    </Text>
                  </View>
                  <View style={styles.containerFlatFeed}>
                    {feeds &&
                      feeds.map((item, index) => {
                        return (
                          <View style={{width: '100%'}}>
                            <RenderItem
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
                              }
                            />
                          </View>
                        );
                      })}
                  </View>
                </View>
              ) : null}
              <BottomSheetBio
                ref={bottomSheetBioRef}
                value={tempBio}
                onChangeText={(text) => onChangeTempBio(text)}
                handleSave={() => handleSaveBio()}
                isLoadingUpdateBio={isLoadingUpdateBio}
                error={errorBio}
              />

              <BottomSheetRealname
                ref={bottomSheetNameRef}
                setTempFullName={(text) => setTempFullName(text)}
                tempFullName={tempFullName}
                errorChangeRealName={errorChangeRealName}
                isChangeRealName={isChangeRealName}
                handleSave={() => handleSave()}
              />
              <BottomSheetImage
                ref={bottomSheetProfilePictureRef}
                onViewProfilePicture={() => onViewProfilePicture()}
                onOpenImageGalery={() => onOpenImageGalery()}
                onOpenCamera={() => onOpenCamera()}
                handleRemoveImageProfile={() => handleRemoveImageProfile()}
                isLoadingUpdateImageGalery={isLoadingUpdateImageGalery}
                isLoadingUpdateImageCamera={isLoadingUpdateImageCamera}
                isLoadingRemoveImage={isLoadingRemoveImage}
              />
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

        <BlockUser
          refBlockUser={refBlockUser}
          onSelect={(v) => onSelectBlocking(v)}
          username={username}
        />
        <BlockDomain
          refBlockUser={refBlockDomain}
          domain="guardian.com"
          onSelect={() => {}}
        />
        <ReportUser
          refReportUser={refReportUser}
          onSelect={onNextQuestion}
          onSkip={onSkipOnlyBlock}
        />
        <ReportPostAnonymous
          refReportPostAnonymous={refReportPostAnonymous}
          onSelect={onNextQuestion}
          onSkip={onSkipOnlyBlock}
        />
        <ReportDomain refReportDomain={refReportDomain} />
        <SpecificIssue
          refSpecificIssue={refSpecificIssue}
          onPress={onIssue}
          onSkip={onSkipOnlyBlock}
        />
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
  wrapHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 50,
  },
  postText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 17,
    color: colors.bondi_blue,
    paddingBottom: 12,
    // borderBottomWidth: 2,
    // borderBottomColor: colors.bondi_blue,
  },
  containerFlatFeed: {
    padding: 0,
    flex: 1,
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
  containerBio: {
    paddingVertical: 8,
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

  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    // marginBottom: 12
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
    marginTop: 12,
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
    paddingVertical: 8,
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
  profileImageContainer: {
    width: 100,
    borderRadius: 100,
  },
  btnShare: {marginRight: 20},
  addCircle: {position: 'absolute', top: 25, left: 25},
  following: {marginLeft: 18},
  containerLoading: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ProfileScreen;
