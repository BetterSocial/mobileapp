import * as React from 'react';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  InteractionManager,
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
import { debounce } from 'lodash'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';

import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BlockComponent from '../../components/BlockComponent';
import BottomSheetBio from './elements/BottomSheetBio';
import BottomSheetImage from './elements/BottomSheetImage';
import BottomSheetRealname from './elements/BottomSheetRealname';
import FollowInfoRow from './elements/FollowInfoRow';
import GlobalButton from '../../components/Button/GlobalButton';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import MemoIcAddCircle from '../../assets/icons/ic_add_circle';
import ProfileHeader from './elements/ProfileHeader';
import ProfilePicture from './elements/ProfilePicture';
import ProfileTiktokScroll from './elements/ProfileTiktokScroll';
import RenderItem from './elements/RenderItem';
import dimen from '../../utils/dimen';
import { Context } from '../../context';
import { DEFAULT_PROFILE_PIC_PATH } from '../../utils/constants';
import { PROFILE_CACHE } from '../../utils/cache/constant';
import {
  changeRealName,
  getMyProfile,
  getSelfFeedsInProfile,
  removeImageProfile,
  updateBioProfile,
  updateImageProfile,
} from '../../service/profile';
import { colors } from '../../utils/colors';
import { downVote, upVote } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import { getAccessToken } from '../../utils/token';
import { getFeedDetail, getMainFeed } from '../../service/post';
import { getSpecificCache, saveToCache } from '../../utils/cache';
import { getUserId } from '../../utils/users';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import {
  requestCameraPermission,
  requestExternalStoragePermission,
} from '../../utils/permission';
import { setFeedByIndex, setMainFeeds } from '../../context/actions/feeds';
import { setImageUrl } from '../../context/actions/users';
import { setMyProfileFeed } from '../../context/actions/myProfileFeed';
import { shareUserLink } from '../../utils/Utils';
import { trimString } from '../../utils/string/TrimString';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const { height, width } = Dimensions.get('screen');
// let headerHeight = 0;

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const bottomSheetNameRef = React.useRef();
  const bottomSheetBioRef = React.useRef();
  const bottomSheetProfilePictureRef = React.useRef();
  const postRef = React.useRef(null);
  const flatListScrollRef = React.useRef(null);

  let [token_JWT, setTokenJwt] = React.useState('');
  let [users, dispatch] = React.useContext(Context).users;
  let [myProfileFeed, myProfileDispatch] =
    React.useContext(Context).myProfileFeed;
  const [dataMain, setDataMain] = React.useState({});
  const [dataMainBio, setDataMainBio] = React.useState("");
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
  const [postOffset, setPostOffset] = React.useState(0)
  const [loadingContainer, setLoadingContainer] = React.useState(true)
  const [yourselfId, setYourselfId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const refBlockComponent = React.useRef();
  const headerHeightRef = React.useRef(0);

  let isNotFromHomeTab = route?.params?.isNotFromHomeTab
  let bottomBarHeight = isNotFromHomeTab ? 0 : useBottomTabBarHeight();

  let { feeds } = myProfileFeed;

  React.useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      getMyFeeds();
    });

    getSpecificCache(PROFILE_CACHE, (res) => {
      if (!res) {
        fetchMyProfile()
      } else {
        saveProfileState(res)
      }
    })
    return unsubscribe;
  }, []);

  const fetchMyProfile = async () => {
    const id = await getUserId();
    if (id) {
      setUserId(id);
      const result = await getMyProfile(id);
      if (result.code === 200) {
        saveToCache(PROFILE_CACHE, result.data)
        saveProfileState(result?.data)
      }
      setLoadingContainer(false)
    }
  };

  const saveProfileState = (result) => {
    if (result && typeof result === 'object') {
      setDataMain(result || {});
      setDataMainBio(result?.bio)
      setLoadingContainer(false)
    }

  }

  const getMyFeeds = async (offset = 0) => {
    let result = await getSelfFeedsInProfile(offset);
    // setMyProfileFeed([
    //   {dummy: true, component: 'Profile'}, 
    //   {dummy: true, component: 'PostStickyHeader'},
    //   ...result.data], myProfileDispatch);
    if (offset === 0) setMyProfileFeed([...result.data, { dummy: true }], myProfileDispatch)
    else {
      let clonedFeeds = [...feeds]
      clonedFeeds.splice(feeds.length - 1, 0, ...data)
      setMyProfileFeed(clonedFeeds, myProfileDispatch)
    }
    setLoading(false)
    setPostOffset(offset + 10)
  };


  const onShare = async () => {
    analytics().logEvent('profile_screen_btn_share', {
      id: 'btn_share',
    });
    try {
      const result = await Share.share({
        message: shareUserLink(dataMain.username),
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
      params: { user_id, username },
    });
  };

  const openImageBs = debounce(() => {
    bottomSheetProfilePictureRef.current.open();
  }, 350)

  const closeImageBs = debounce(() => {
    bottomSheetProfilePictureRef.current.close();
  }, 350)

  const changeImage = () => {
    openImageBs()
  }

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
    flatListScrollRef.current.scrollToTop()
  };

  const onOpenImageGalery = async () => {
    let { success, message } = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (res) => {
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
    let { success, message } = await requestCameraPermission();
    if (success) {
      launchCamera({ mediaType: 'photo', includeBase64: true }, (res) => {
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
    closeImageBs()
    navigation.push('ImageViewer', {
      title: dataMain.username,
      images: [{ url: dataMain.profile_pic_path }],
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
          closeImageBs()
          fetchMyProfile();
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
          closeImageBs()
          fetchMyProfile();
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
    debounceModalOpen()
  };

  const debounceModalOpen = debounce(() => {
    bottomSheetBioRef.current.open();

  }, 350)

  const debounceModalClose = debounce(() => {
    bottomSheetBioRef.current.close();
  }, 350)

  const handleSaveBio = () => {
    setIsLoadingUpdateBio(true);
    let data = {
      bio: tempBio,
    };
    setDataMainBio(tempBio)
    updateBioProfile(dataMain.user_id, data)
      .then((res) => {
        setIsLoadingUpdateBio(false);
        if (res.code === 200) {
          fetchMyProfile(false);
          debounceModalClose()
        }
      })
      .catch(() => {
        setIsLoadingUpdateBio(false);
        setDataMainBio(dataMain.bio)
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
      <GlobalButton buttonStyle={styles.bioText} onPress={() => changeBio()}>
        <View style={styles.containerBio}>
          {string === null || string === undefined ? (
            <Text style={{ color: colors.blue }}>Add Bio</Text>
          ) : (
            <Text style={styles.seeMore}>
              {trimString(string, 121)}{' '}
              {string.length > 121 ? (
                <Text style={{ color: colors.blue }}>see more</Text>
              ) : null}
            </Text>
          )}
        </View>
      </GlobalButton>
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
    navigation.navigate('ProfilePostDetailPage', {
      index: index,
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      refreshParent: getMyFeeds
    });
  };

  const onPressComment = (id) => {
    navigation.navigate('ProfilePostDetailPage', {
      feedId: id,
      refreshParent: getMyFeeds
    });
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

  const onPressBlock = (value) => {
    refBlockComponet.current.openBlockComponent(value);
  }

  const __handleOnEndReached = () => getMyFeeds(postOffset)

  const handleRefresh = () => {
    setLoading(true)
    getMyFeeds()
  }

  return (
    <>
      <StatusBar translucent={false} barStyle="dark-content" />
      {!loadingContainer ? <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
        <ProfileHeader showArrow={isNotFromHomeTab} onShareClicked={onShare} onSettingsClicked={goToSettings} username={dataMain.username} />
        <ProfileTiktokScroll
          ref={flatListScrollRef}
          data={feeds}
          onRefresh={handleRefresh}
          refreshing={loading}
          onScroll={handleScroll}
          ListFooterComponent={<ActivityIndicator />}
          onEndReach={__handleOnEndReached}
          snapToOffsets={(() => {
            let posts = feeds.map((item, index) => {
              return headerHeightRef.current + (index * dimen.size.PROFILE_ITEM_HEIGHT)
            })
            return [0, ...posts]
          })()}
          ListHeaderComponent={
            <View onLayout={(event) => {
              let headerHeightLayout = event.nativeEvent.layout.height
              headerHeightRef.current = headerHeightLayout
            }}>
              <View style={styles.content}>
                <ProfilePicture onImageContainerClick={changeImage} profilePicPath={dataMain.profile_pic_path} />
                <FollowInfoRow
                  follower={dataMain.follower_symbol}
                  following={dataMain.following_symbol}
                  onFollowingContainerClicked={() => goToFollowings(dataMain.user_id, dataMain.username)} />

                {renderBio(dataMainBio)}
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
          {({ item, index }) => {
            let dummyItemHeight = height - dimen.size.PROFILE_ITEM_HEIGHT - 44 - 16 - StatusBar.currentHeight - bottomBarHeight;
            if (item.dummy) return <View style={styles.dummyItem(dummyItemHeight)}></View>
            return <View style={{ width: '100%' }}>
              <RenderItem
                bottomBar={!isNotFromHomeTab}
                item={item}
                index={index}
                onNewPollFetched={onNewPollFetched}
                onPressDomain={onPressDomain}
                onPress={() => onPress(item, index)}
                onPressComment={() => onPressComment(item.id)}
                onPressBlock={() => onPressBlock(item)}
                onPressUpvote={(post) => setUpVote(post, index)}
                selfUserId={yourselfId}
                onPressDownVote={(post) =>
                  setDownVote(post, index)
                } />
            </View>
          }}
        </ProfileTiktokScroll>
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
        {isShowButton ? (
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{ ...styles.btnBottom, opacity }}>
              <ArrowUpWhiteIcon width={12} height={20} fill={colors.white} />
            </View>
          </TouchableNativeFeedback>
        ) : null}

        <BlockComponent ref={refBlockComponent} refresh={getMyFeeds} screen="my_profile" />
      </SafeAreaView> : null}

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    height: '100%'
  },
  content: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  dummyItem: (height) => {
    return {
      height,
      backgroundColor: colors.white
    }
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
    width: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    height: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    right: 20,
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    backgroundColor: colors.bondi_blue,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
    top: 42,
    zIndex: 2000,
    backgroundColor: colors.white,
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 12,
    color: colors.black,
  },

  containerLoading: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioText: {
    paddingLeft: 0
  }
});
export default withInteractionsManaged(ProfileScreen);
