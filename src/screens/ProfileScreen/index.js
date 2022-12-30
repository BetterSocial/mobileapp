import * as React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import {
  ActivityIndicator,
  Dimensions,
  LogBox,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
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
import PostOptionModal from '../../components/Modal/PostOptionModal';
import ProfileHeader from './elements/ProfileHeader';
import ProfilePicture from './elements/ProfilePicture';
import ProfileTiktokScroll from './elements/ProfileTiktokScroll';
import RenderItem from './elements/RenderItem';
import dimen from '../../utils/dimen';
import { Context } from '../../context';
import { PROFILE_CACHE } from '../../utils/cache/constant';
import {
  changeRealName,
  getMyProfile,
  getSelfFeedsInProfile,
  removeImageProfile,
  updateBioProfile,
  updateImageProfile
} from '../../service/profile';
import { colors } from '../../utils/colors';
import { deletePost, getFeedDetail } from '../../service/post';
import { downVote, upVote } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import { getAccessToken } from '../../utils/token';
import { getSpecificCache, saveToCache } from '../../utils/cache';
import { getUserId } from '../../utils/users';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import {
  requestCameraPermission,
  requestExternalStoragePermission
} from '../../utils/permission';
import { setFeedByIndex } from '../../context/actions/feeds';
import { setMyProfileAction } from '../../context/actions/setMyProfileAction';
import { setMyProfileFeed } from '../../context/actions/myProfileFeed';
import { shareUserLink } from '../../utils/Utils';
import { trimString } from '../../utils/string/TrimString';
import { useAfterInteractions } from '../../hooks/useAfterInteractions';
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
  const refBlockComponent = React.useRef();
  const headerHeightRef = React.useRef(0);

  const [, dispatchProfile] = React.useContext(Context).profile;
  const [, dispatch] = React.useContext(Context).users;
  const [myProfileFeed, myProfileDispatch] =
    React.useContext(Context).myProfileFeed;

  const [, setTokenJwt] = React.useState('');
  const [dataMain, setDataMain] = React.useState({});
  const [dataMainBio, setDataMainBio] = React.useState("");
  const [errorBio, setErrorBio] = React.useState('');
  const [isChangeRealName, setIsChangeRealName] = React.useState(false);
  const [isLoadingRemoveImage, setIsLoadingRemoveImage] = React.useState(false);
  const [isLoadingUpdateBio, setIsLoadingUpdateBio] = React.useState(false);
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [tempBio, setTempBio] = React.useState('');
  const [tempFullName, setTempFullName] = React.useState('');
  const [, setUserId] = React.useState(null);
  const [isLoadingUpdateImageGalery, setIsLoadingUpdateImageGalery] = React.useState(false);
  const [isLoadingUpdateImageCamera, setIsLoadingUpdateImageCamera] = React.useState(false);
  const [errorChangeRealName, setErrorChangeRealName] = React.useState('');
  const [postOffset, setPostOffset] = React.useState(0)
  const [loadingContainer, setLoadingContainer] = React.useState(true)
  const [yourselfId,] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isPostOptionModalOpen, setIsOptionModalOpen] = React.useState(false)
  const [selectedPostForOption, setSelectedPostForOption] = React.useState(null)

  const { interactionsComplete } = useAfterInteractions()
  const isNotFromHomeTab = route?.params?.isNotFromHomeTab
  const bottomBarHeight = isNotFromHomeTab ? 0 : useBottomTabBarHeight();
  const LIMIT_PROFILE_FEED = 1

  const { feeds } = myProfileFeed;

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (interactionsComplete) {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
    }

  }, [interactionsComplete]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (__DEV__) {
        console.log(e);
      }
    });

    if (interactionsComplete) {
      getMyFeeds(0, LIMIT_PROFILE_FEED);
      getAccessToken().then((val) => {
        setTokenJwt(val);
      });
      getSpecificCache(PROFILE_CACHE, (res) => {
        if (!res) {
          fetchMyProfile()
        } else {
          saveProfileState(res)
        }
      })
    }


    return () => unsubscribe();
  }, [interactionsComplete]);

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

      setDataMain(result);
      setDataMainBio(result.bio)
      setMyProfileAction(result, dispatchProfile)
      setLoadingContainer(false)
    }

  }

  const getMyFeeds = async (offset = 0, limit = 10) => {
    const result = await getSelfFeedsInProfile(offset, limit);
    if (offset === 0) setMyProfileFeed(result.data, myProfileDispatch)
    else {
      const clonedFeeds = [...feeds]
      clonedFeeds.splice(feeds.length - 1, 0)
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
      await Share.share({
        message: shareUserLink(dataMain.username),
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const goToSettings = () => {
    analytics().logEvent('profile_screen_btn_settings', {
      id: 'btn_settings',
    });
    navigation.navigate('Settings');
  };

  const goToFollowings = (userId, username) => {
    navigation.navigate('Followings', {
      screen: 'TabFollowing',
      params: { user_id: userId, username },
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
    const { success, message } = await requestExternalStoragePermission();
    if (success) {
      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      }).then((imageRes) => {
        handleUpdateImage(`data:image/jpeg;base64,${imageRes.data}`, 'gallery');
      })
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const onOpenCamera = async () => {
    const { success, message } = await requestCameraPermission();
    if (success) {
      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      }).then((imageRes) => {
        handleUpdateImage(`data:image/jpeg;base64,${imageRes.data}`, 'camera');
      })
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
    const data = {
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
    const data = {
      bio: tempBio,
    };
    setDataMainBio(tempBio)
    updateBioProfile(dataMain.user_id, data)
      .then((res) => {
        setIsLoadingUpdateBio(false);
        if (res.code === 200) {
          fetchMyProfile();
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

  const renderBio = (string) => (
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
    navigation.navigate('ProfilePostDetailPage', {
      index,
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      refreshParent: getMyFeeds
    });
  };

  const onPressComment = (item, id) => {
    navigation.navigate('ProfilePostDetailPage', {
      feedId: id,
      isalreadypolling: item.isalreadypolling,
      refreshParent: getMyFeeds
    });
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

  const handleOnEndReached = () => {
    getMyFeeds(postOffset)
  }

  const handleRefresh = () => {
    setLoading(true)
    getMyFeeds(0, LIMIT_PROFILE_FEED)
  }

  const onHeaderOptionClicked = (item) => {
    setSelectedPostForOption(item)
    setIsOptionModalOpen(true)
  }

  const onHeaderOptionClosed = () => {
    setSelectedPostForOption(null)
    setIsOptionModalOpen(false)
  }

  const removePostByIdFromContext = () => {
    const deletedIndex = feeds?.findIndex((find) => selectedPostForOption?.id === find?.id)
    const newData = [...feeds]
    newData?.splice(deletedIndex, 1)
    setMyProfileFeed(newData, myProfileDispatch)
  }

  const onDeletePost = async () => {
    setIsOptionModalOpen(false)
    removePostByIdFromContext()

    const response = await deletePost(selectedPostForOption?.id)
    if (response?.success) {
      Toast.show('Post was permanently deleted')
    }
    getMyFeeds()
  }

  const renderHeader = React.useMemo(() => (
    <View onLayout={(event) => {
      const headerHeightLayout = event.nativeEvent.layout.height
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
  ), [dataMain, dataMainBio])

  return (
    <>
      {!loadingContainer ? <SafeAreaProvider style={styles.container} forceInset={{ top: 'always' }}>
        <StatusBar translucent={false} />
        <ProfileHeader showArrow={isNotFromHomeTab} onShareClicked={onShare} onSettingsClicked={goToSettings} username={dataMain.username} />
        <ProfileTiktokScroll
          ref={flatListScrollRef}
          data={feeds}
          onRefresh={handleRefresh}
          refreshing={loading}
          onScroll={handleScroll}
          ListFooterComponent={<ActivityIndicator />}
          onEndReach={handleOnEndReached}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={10}
          removeClippedSubviews
          windowSize={10}
          snapToOffsets={(() => {
            const posts = feeds.map((item, index) => headerHeightRef.current + (index * dimen.size.PROFILE_ITEM_HEIGHT))
            return [0, ...posts]
          })()}
          ListHeaderComponent={
            renderHeader
          }>
          {({ item, index }) => {
            const dummyItemHeight = height - dimen.size.PROFILE_ITEM_HEIGHT - 44 - 16 - StatusBar.currentHeight - bottomBarHeight;
            if (item.dummy) return <View style={styles.dummyItem(dummyItemHeight)}></View>
            return <View style={{ width: '100%' }}>
              <RenderItem
                bottomBar={!isNotFromHomeTab}
                item={item}
                index={index}
                onNewPollFetched={onNewPollFetched}
                onPressDomain={onPressDomain}
                onPress={() => onPress(item, index)}
                onPressComment={() => onPressComment(item, item.id)}
                onPressUpvote={(post) => setUpVote(post, index)}
                selfUserId={yourselfId}
                onHeaderOptionClicked={onHeaderOptionClicked}
                showAnonymousOption={true}
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
        <PostOptionModal isOpen={isPostOptionModalOpen}
          onClose={onHeaderOptionClosed}
          onDeleteClicked={onDeletePost} />
      </SafeAreaProvider> : null}

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
  dummyItem: (heightItem) => ({
    height: heightItem,
    backgroundColor: colors.white
  }),
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
    width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  tabsFixed: {
    width,
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
export default React.memo(withInteractionsManaged(ProfileScreen));
