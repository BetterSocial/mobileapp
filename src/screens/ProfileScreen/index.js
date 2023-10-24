import * as React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  LogBox,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {debounce} from 'lodash';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';
import netInfo from '@react-native-community/netinfo';
import AnonymousTab from './elements/AnonymousTab';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BioAndDMSetting from './elements/BioAndDMSetting';
import BlockComponent from '../../components/BlockComponent';
import BottomSheetBio from './elements/BottomSheetBio';
import BottomSheetImage from './elements/BottomSheetImage';
import BottomSheetRealname from './elements/BottomSheetRealname';
import CustomPressable from '../../components/CustomPressable';
import FollowInfoRow from './elements/FollowInfoRow';
import LinkAndSocialMedia from './elements/LinkAndSocialMedia';
import PostOptionModal from '../../components/Modal/PostOptionModal';
import ProfileHeader from './elements/ProfileHeader';
import ProfilePicture from './elements/ProfilePicture';
import ProfileTiktokScroll from './elements/ProfileTiktokScroll';
import RenderItem from '../FeedScreen/RenderList';
import ShareUtils from '../../utils/share';
import StorageUtils from '../../utils/storage';
import dimen from '../../utils/dimen';
import useCoreFeed from '../FeedScreen/hooks/useCoreFeed';
import useResetContext from '../../hooks/context/useResetContext';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import useProfileScreenHook, {
  TAB_INDEX_ANONYMOUS,
  TAB_INDEX_SIGNED
} from '../../hooks/screen/useProfileScreenHook';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {ButtonNewPost} from '../../components/Button';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH, SOURCE_MY_PROFILE} from '../../utils/constants';
import {
  changeRealName,
  getMyProfile,
  getSelfFeedsInProfile,
  removeImageProfile,
  updateBioProfile,
  updateImageProfile
} from '../../service/profile';
import {colors} from '../../utils/colors';
import {deleteAnonymousPost, deletePost} from '../../service/post';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import {setFeedByIndex} from '../../context/actions/feeds';
import {setMyProfileAction} from '../../context/actions/setMyProfileAction';
import {setMyProfileFeed} from '../../context/actions/myProfileFeed';
import {useAfterInteractions} from '../../hooks/useAfterInteractions';
import {useUpdateClientGetstreamHook} from '../../utils/getstream/ClientGetStram';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import ShadowFloatingButtons from '../../components/Button/ShadowFloatingButtons';

const {width} = Dimensions.get('screen');

const Header = (props) => {
  const {
    headerHeightRef,
    changeImage,
    dataMain,
    goToFollowings,
    goToFollowers,
    dataMainBio,
    changeBio,
    postRef,
    profileTabIndex,
    setTabIndexToSigned,
    setTabIndexToAnonymous
  } = props;

  return (
    <View
      onLayout={(event) => {
        const headerHeightLayout = event.nativeEvent.layout.height;
        headerHeightRef.current = headerHeightLayout;
      }}>
      <View style={styles.content}>
        <View style={{flexDirection: 'row'}}>
          <ProfilePicture
            onImageContainerClick={changeImage}
            profilePicPath={dataMain.profile_pic_path}
          />
          <View style={{marginLeft: 20}}>
            <FollowInfoRow
              follower={dataMain.follower_symbol}
              following={dataMain.following_symbol}
              onFollowingContainerClicked={() =>
                goToFollowings(dataMain.user_id, dataMain.username)
              }
              onFollowersContainerClicked={() => goToFollowers(dataMain.user_id, dataMain.username)}
            />
          </View>
        </View>

        <BioAndDMSetting
          avatarUrl={DEFAULT_PROFILE_PIC_PATH}
          bio={dataMainBio}
          changeBio={changeBio}
          allowAnonDm={dataMain.allow_anon_dm}
          onlyReceivedDmFromUserFollowing={dataMain.only_received_dm_from_user_following}
          following={dataMain.following}
        />

        <LinkAndSocialMedia username={dataMain.username} prompt={dataMainBio} />
      </View>
      <View>
        <View style={styles.tabs} ref={postRef}>
          <CustomPressable
            style={styles.tabItem(profileTabIndex === TAB_INDEX_SIGNED)}
            onPress={setTabIndexToSigned}>
            <Text style={styles.postText(profileTabIndex === TAB_INDEX_SIGNED)}>Signed Posts</Text>
          </CustomPressable>
          <CustomPressable
            style={styles.tabItem(profileTabIndex === TAB_INDEX_ANONYMOUS)}
            onPress={setTabIndexToAnonymous}>
            <AnonymousTab isActive={profileTabIndex === TAB_INDEX_ANONYMOUS} />
          </CustomPressable>
        </View>
      </View>
    </View>
  );
};

const ProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.TIKTOK_SCROLL);

  const bottomSheetNameRef = React.useRef();
  const bottomSheetBioRef = React.useRef();
  const bottomSheetProfilePictureRef = React.useRef();
  const postRef = React.useRef(null);
  const refBlockComponent = React.useRef();
  const headerHeightRef = React.useRef(0);

  const [profile, dispatchProfile] = React.useContext(Context).profile;
  const [, dispatch] = React.useContext(Context).users;
  const [myProfileFeed, myProfileDispatch] = React.useContext(Context).myProfileFeed;

  const [dataMain, setDataMain] = React.useState({});
  const [, setDataMainBio] = React.useState('');
  const [errorBio, setErrorBio] = React.useState('');
  const [isChangeRealName, setIsChangeRealName] = React.useState(false);
  const [isLoadingRemoveImage, setIsLoadingRemoveImage] = React.useState(false);
  const [isLoadingUpdateBio, setIsLoadingUpdateBio] = React.useState(false);
  const [isShowButton, setIsShowButton] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);
  const [tempBio, setTempBio] = React.useState('');
  const [tempFullName, setTempFullName] = React.useState('');
  const [isLoadingUpdateImageGalery, setIsLoadingUpdateImageGalery] = React.useState(false);
  const [isLoadingUpdateImageCamera, setIsLoadingUpdateImageCamera] = React.useState(false);
  const [errorChangeRealName, setErrorChangeRealName] = React.useState('');
  const [postOffset, setPostOffset] = React.useState(0);
  const [isLastPage, setIsLastPage] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isPostOptionModalOpen, setIsOptionModalOpen] = React.useState(false);
  const [selectedPostForOption, setSelectedPostForOption] = React.useState(null);
  const [isFetchingList, setIsFetchingList] = React.useState(false);
  const {interactionsComplete} = useAfterInteractions();
  const isNotFromHomeTab = route?.params?.isNotFromHomeTab;
  const [, setIsHitApiFirstTime] = React.useState(false);

  const updateUserClient = useUpdateClientGetstreamHook();
  const {refreshCount} = useResetContext();
  const {mappingColorFeed} = useCoreFeed();
  const LIMIT_PROFILE_FEED = 10;

  const {feeds} = myProfileFeed;
  const {
    feeds: mainFeeds,
    profileTabIndex,
    isProfileTabSigned,
    setTabIndexToAnonymous,
    setTabIndexToSigned,
    reloadFetchAnonymousPost,
    getProfileCache
  } = useProfileScreenHook();
  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (interactionsComplete) {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      Analytics.logEvent('myprofile_begin_view', {
        id: 'profile_begin',
        myprofile_begin_view: Date.now()
      });
      return () => {
        Analytics.logEvent('myprofile_end_view', {
          id: 'myprofile_end_view',
          myprofile_end_view: Date.now()
        });
        Analytics.logEvent('myprofile_begin_view', {
          id: 'profile_begin',
          myprofile_begin_view: Date.now()
        });
      };
    }
  }, [interactionsComplete]);

  React.useEffect(() => {
    if (refreshCount > 0) {
      setDataMain({});
      setDataMainBio('');
    }
  }, [refreshCount]);

  const initialMyFeed = async () => {
    const cacheFeed = StorageUtils.myFeeds.get();
    const status = await netInfo.fetch();
    if (status.isConnected) {
      getMyFeeds(0, LIMIT_PROFILE_FEED);
      console.log('masuka');
    } else {
      setMyProfileFeed(JSON.parse(cacheFeed), myProfileDispatch);
    }
  };
  React.useEffect(() => {
    if (interactionsComplete) {
      initialMyFeed();
      getProfileCache();
    }
  }, [interactionsComplete]);

  const fetchMyProfile = async (updateData) => {
    try {
      const result = await getMyProfile();
      if (result.code === 200) {
        const {data} = result;
        StorageUtils.profileData.set(JSON.stringify(data));
        saveProfileState(data);
        return data?.profile_pic_path;
      }
    } catch (e) {
      console.log('get my profile error', e);
    }

    return null;
  };

  const saveProfileState = (result) => {
    if (result && typeof result === 'object') {
      setDataMain(result);
      setDataMainBio(result.bio);
      setMyProfileAction(result, dispatchProfile);
    }
  };

  const getMyFeeds = async (offset = 0, limit = 10) => {
    try {
      setIsFetchingList(true);
      setIsHitApiFirstTime(true);
      const cacheFeed = StorageUtils.myFeeds.get();
      const result = await getSelfFeedsInProfile(offset, limit);
      const {data: dataMyFeed} = result;
      const {mapNewData} = mappingColorFeed({dataFeed: dataMyFeed, dataCache: cacheFeed});
      if (Array.isArray(result.data) && result.data.length === 0) {
        setIsLastPage(true);
      }
      if (offset === 0) {
        StorageUtils.myFeeds.set(JSON.stringify(mapNewData));
        setMyProfileFeed(mapNewData, myProfileDispatch);
      } else {
        const clonedFeeds = [...feeds, ...mapNewData];
        StorageUtils.myFeeds.set(JSON.stringify(clonedFeeds));
        setMyProfileFeed(clonedFeeds, myProfileDispatch);
      }
      setLoading(false);
      setIsFetchingList(false);
      setPostOffset(offset + 10);
    } catch (e) {
      setIsChangeRealName(false);
      setLoading(false);
    }
  };

  const onShare = async () => {
    Analytics.logEvent('profile_screen_btn_share', {
      id: 'btn_share'
    });
    ShareUtils.shareUserLink(profile?.myProfile?.username);
  };

  const goToSettings = () => {
    Analytics.logEvent('profile_screen_btn_settings', {
      id: 'btn_settings'
    });
    navigation.navigate('Settings');
  };

  const goToFollowings = (userId, username) => {
    navigation.navigate('Followings', {
      screen: 'TabFollowing',
      params: {user_id: userId, username}
    });
  };
  const goToFollowers = (userId, username) => {
    navigation.navigate('Followers', {
      screen: 'TabFollowing',
      params: {user_id: userId, username, isFollower: true}
    });
  };

  const openImageBs = debounce(() => {
    bottomSheetProfilePictureRef.current.open();
  }, 350);

  const closeImageBs = debounce(() => {
    bottomSheetProfilePictureRef.current.close();
  }, 350);

  const changeImage = () => {
    openImageBs();
  };

  const handleSave = async () => {
    setIsChangeRealName(true);
    const result = await changeRealName(tempFullName);
    if (result.code === 200) {
      fetchMyProfile(true);
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
    listRef?.current?.scrollToTop();
  };

  const openSettingApp = () => {
    Linking.openSettings();
    closeImageBs();
  };

  const onOpenImageGalery = async () => {
    const {success} = await requestExternalStoragePermission();
    if (success) {
      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      }).then((imageRes) => {
        handleUpdateImage(`data:image/jpeg;base64,${imageRes.data}`, 'gallery');
      });
    } else {
      openAlertPermission(
        'We’re not able to access your photos, please adjust your permission settings for BetterSocial.'
      );
    }
  };

  const onOpenCamera = async () => {
    const {success} = await requestCameraPermission();
    if (success) {
      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      }).then((imageRes) => {
        handleUpdateImage(`data:image/jpeg;base64,${imageRes.data}`, 'camera');
      });
    } else {
      openAlertPermission(
        'We’re not able to access your camera, please adjust your permission settings for BetterSocial.'
      );
    }
  };

  const openAlertPermission = (message) => {
    Alert.alert('Permission Denied', message, [
      {text: 'Open Settings', onPress: openSettingApp},
      {text: 'Close'}
    ]);
  };

  const onViewProfilePicture = () => {
    closeImageBs();
    navigation.push('ImageViewer', {
      title: dataMain.username,
      images: [{url: dataMain.profile_pic_path}]
    });
  };

  const handleUpdateImage = (value, type) => {
    if (type === 'gallery') {
      setIsLoadingUpdateImageGalery(true);
    } else {
      setIsLoadingUpdateImageCamera(true);
    }
    const data = {
      profile_pic_path: value
    };

    updateImageProfile(data)
      .then(async (res) => {
        if (type === 'gallery') {
          setIsLoadingUpdateImageGalery(false);
        } else {
          setIsLoadingUpdateImageCamera(false);
        }
        if (res.code === 200) {
          closeImageBs();
          getMyFeeds();
          const profilePicture = await fetchMyProfile(true);
          updateUserClient(profilePicture);
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
          closeImageBs();
          fetchMyProfile(true);
          getMyFeeds();
        }
      })
      .catch(() => {
        setIsLoadingRemoveImage(false);
        showMessage({
          message: 'Remove image profile error',
          type: 'danger'
        });
      });
  };

  const changeBio = () => {
    if (dataMain.bio !== null || dataMain.bio !== undefined) {
      setTempBio(dataMain.bio);
    }
    debounceModalOpen();
  };

  const debounceModalOpen = debounce(() => {
    bottomSheetBioRef.current.open();
  }, 350);

  const debounceModalClose = debounce(() => {
    bottomSheetBioRef.current.close();
  }, 350);

  const handleSaveBio = () => {
    setIsLoadingUpdateBio(true);
    const data = {
      bio: tempBio
    };
    setDataMainBio(tempBio);
    updateBioProfile(data)
      .then((res) => {
        setIsLoadingUpdateBio(false);
        if (res.code === 200) {
          fetchMyProfile(true);
          debounceModalClose();
        }
      })
      .catch(() => {
        setIsLoadingUpdateBio(false);
        setDataMainBio(dataMain.bio);
        showMessage({
          message: 'Failed to update profile',
          type: 'danger'
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

  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );
    navigation.navigate('DomainScreen', param);
  };

  const onPress = (item, haveSeeMore) => {
    navigation.navigate('PostDetailPage', {
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      refreshParent: profileTabIndex === 0 ? getMyFeeds : reloadFetchAnonymousPost,
      haveSeeMore,
      data: item
    });
  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index,
        singleFeed: newPolls
      },
      dispatch
    );
  };

  const setUpVote = async (post) => {
    await upVote(post);
  };

  const setDownVote = async (post) => {
    await downVote(post);
  };

  const handleOnEndReached = () => {
    if (!isLastPage) {
      getMyFeeds(postOffset);
    }
  };

  function handleRefresh() {
    setLoading(true);
    setIsLastPage(false);
    getMyFeeds(0, LIMIT_PROFILE_FEED);
    reloadFetchAnonymousPost();
    fetchMyProfile(true);
  }

  const onHeaderOptionClosed = () => {
    setSelectedPostForOption(null);
    setIsOptionModalOpen(false);
  };

  const onHeaderOptionClicked = (post) => {
    setSelectedPostForOption(post);
    setIsOptionModalOpen(true);
  };

  const removePostByIdFromContext = () => {
    const deletedIndex = feeds?.findIndex((find) => selectedPostForOption?.id === find?.id);
    const newData = [...feeds];
    newData?.splice(deletedIndex, 1);
    setMyProfileFeed(newData, myProfileDispatch);
  };

  const onDeletePost = async () => {
    setIsOptionModalOpen(false);
    removePostByIdFromContext();

    let response;
    if (isProfileTabSigned) response = await deletePost(selectedPostForOption?.id);
    else response = await deleteAnonymousPost(selectedPostForOption?.id);
    if (response?.success) {
      Toast.show('Post was permanently deleted', Toast.LONG);
    }

    if (isProfileTabSigned) return getMyFeeds();
    return reloadFetchAnonymousPost();
  };

  return (
    <SafeAreaProvider style={styles.container} forceInset={{top: 'always'}}>
      <StatusBar translucent={false} />
      <ProfileHeader
        showArrow={isNotFromHomeTab}
        onShareClicked={onShare}
        onSettingsClicked={goToSettings}
        username={profile?.myProfile?.username}
      />
      <ProfileTiktokScroll
        ref={listRef}
        data={mainFeeds}
        onRefresh={handleRefresh}
        refreshing={loading}
        style={styles.flatlistContainer}
        onScroll={handleScroll}
        ListFooterComponent={isFetchingList ? <ActivityIndicator /> : null}
        onEndReach={handleOnEndReached}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={10}
        removeClippedSubviews
        windowSize={10}
        ListHeaderComponent={
          <Header
            headerHeightRef={headerHeightRef}
            changeImage={changeImage}
            dataMain={profile?.myProfile}
            goToFollowings={goToFollowings}
            goToFollowers={goToFollowers}
            dataMainBio={profile?.myProfile?.bio}
            changeBio={changeBio}
            postRef={postRef}
            profileTabIndex={profileTabIndex}
            setTabIndexToSigned={setTabIndexToSigned}
            setTabIndexToAnonymous={setTabIndexToAnonymous}
          />
        }>
        {({item, index}) => {
          return (
            <RenderItem
              key={item.id}
              item={item}
              onNewPollFetched={onNewPollFetched}
              index={index}
              onPressDomain={onPressDomain}
              onPress={(haveSeeMore) => onPress(item, haveSeeMore)}
              onPressComment={(haveSeeMore) => onPress(item, haveSeeMore)}
              onPressUpvote={(post) => setUpVote(post)}
              selfUserId={profile.myProfile.user_id}
              onPressDownVote={(post) => setDownVote(post)}
              loading={loading}
              source={SOURCE_MY_PROFILE}
              hideThreeDot={false}
              showAnonymousOption={true}
              onHeaderOptionClicked={() => onHeaderOptionClicked(item)}
            />
          );
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
      <ButtonNewPost isShowArrow={isShowButton} />

      {isShowButton ? (
        <ShadowFloatingButtons>
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{...styles.btnBottom, opacity}}>
              <ArrowUpWhiteIcon width={12} height={20} fill={colors.white} />
            </View>
          </TouchableNativeFeedback>
        </ShadowFloatingButtons>
      ) : null}

      <BlockComponent ref={refBlockComponent} refresh={getMyFeeds} screen="my_profile" />
      <PostOptionModal
        isOpen={isPostOptionModalOpen}
        onClose={onHeaderOptionClosed}
        onDeleteClicked={onDeletePost}
      />
    </SafeAreaProvider>
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
    backgroundColor: colors.white
  },
  dummyItem: (heightItem) => ({
    height: heightItem,
    backgroundColor: colors.white
  }),
  postText: (isActive) => ({
    fontFamily: isActive ? fonts.inter[600] : fonts.inter[400],
    fontSize: 14,
    lineHeight: 17,
    color: isActive ? colors.bondi_blue : colors.blackgrey,
    paddingHorizontal: 16,
    textAlign: 'center'
  }),
  containerFlatFeed: {
    padding: 0,
    flex: 1
  },
  btnBottom: {
    width: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,
    height: dimen.size.PROFILE_ACTION_BUTTON_RADIUS,

    backgroundColor: colors.bondi_blue,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  containerBio: {
    paddingVertical: 8
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  tabItem: (isActive) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderBottomColor: colors.bondi_blue,
    borderBottomWidth: isActive ? 2 : 0
  }),
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
    backgroundColor: colors.white
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 12,
    color: colors.black
  },

  containerLoading: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bioText: {
    paddingLeft: 0
  },
  tooltipText: {
    color: '#828282',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400'
  },
  flatlistContainer: {
    backgroundColor: 'white'
  }
});

Header.propTypes = {
  headerHeightRef: PropTypes.object,
  changeImage: PropTypes.func,
  dataMain: PropTypes.object,
  goToFollowings: PropTypes.func,
  dataMainBio: PropTypes.object,
  changeBio: PropTypes.func,
  postRef: PropTypes.object,
  profileTabIndex: PropTypes.number,
  setTabIndexToSigned: PropTypes.func,
  setTabIndexToAnonymous: PropTypes.func
};

ProfileScreen.propTypes = {
  route: PropTypes.object
};

export default React.memo(withInteractionsManaged(ProfileScreen));
