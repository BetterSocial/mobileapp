import * as React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';
import Toast from 'react-native-simple-toast';
import netInfo from '@react-native-community/netinfo';
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
import {debounce} from 'lodash';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';

import AnonymousTab from './elements/AnonymousTab';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import BioAndDMSetting from './elements/BioAndDMSetting';
import BlockComponent from '../../components/BlockComponent';
import BottomSheetBio from './elements/BottomSheetBio';
import BottomSheetImage from './elements/BottomSheetImage';
import BottomSheetRealname from './elements/BottomSheetRealname';
import CustomPressable from '../../components/CustomPressable';
import DiscoveryAction from '../../context/actions/discoveryAction';
import FollowInfoRow from './elements/FollowInfoRow';
import ImageCompressionUtils from '../../utils/image/compress';
import LinkAndSocialMedia from './elements/LinkAndSocialMedia';
import PostOptionModal from '../../components/Modal/PostOptionModal';
import ProfileHeader from './elements/ProfileHeader';
import ProfilePicture from './elements/ProfilePicture';
import ProfileTiktokScroll from './elements/ProfileTiktokScroll';
import RenderItem from '../FeedScreen/RenderList';
import ShadowFloatingButtons from '../../components/Button/ShadowFloatingButtons';
import ShareUtils from '../../utils/share';
import StorageUtils from '../../utils/storage';
import dimen from '../../utils/dimen';
import useCoreFeed from '../FeedScreen/hooks/useCoreFeed';
import useFeedPreloadHook from '../FeedScreen/hooks/useFeedPreloadHook';
import useProfileScreenAnalyticsHook from '../../libraries/analytics/useProfileScreenAnalyticsHook';
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
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {
  DEFAULT_PROFILE_PIC_PATH,
  NavigationConstants,
  SOURCE_FEED_TAB,
  SOURCE_MY_PROFILE
} from '../../utils/constants';
import {KarmaLock} from './elements/KarmaLock';
import {KarmaScore} from './elements/KarmaScore';
import {
  changeRealName,
  getFollower,
  getMyProfile,
  getSelfFeedsInProfile,
  removeImageProfile,
  updateBioProfile,
  updateImageProfile
} from '../../service/profile';
import {deleteAnonymousPost, deletePost, viewTimePost} from '../../service/post';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import {setFeedByIndex, setTimer} from '../../context/actions/feeds';
import {setMyProfileAction} from '../../context/actions/setMyProfileAction';
import {setMyProfileFeed} from '../../context/actions/myProfileFeed';
import {useAfterInteractions} from '../../hooks/useAfterInteractions';
import {useUpdateClientGetstreamHook} from '../../utils/getstream/ClientGetStram';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

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
  const navigator = useNavigation();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const eventTrack = useProfileScreenAnalyticsHook();

  const {feeds, timer, viewPostTimeIndex} = feedsContext;
  // eslint-disable-next-line no-underscore-dangle
  const handleOnAddPostButtonClicked = () => {
    const currentTime = new Date().getTime();
    const id = feeds && feeds[viewPostTimeIndex]?.id;
    if (id) viewTimePost(id, currentTime - timer.getTime(), SOURCE_FEED_TAB);
    eventTrack.onNoPostsStartPostingClicked();
    navigator.navigate(NavigationConstants.CREATE_POST_SCREEN, {});
    setTimer(new Date(), dispatch);
  };
  return (
    <View
      onLayout={(event) => {
        const headerHeightLayout = event.nativeEvent.layout.height;
        headerHeightRef.current = headerHeightLayout;
      }}>
      <View style={styles.content}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <ProfilePicture
            onImageContainerClick={changeImage}
            profilePicPath={dataMain.profile_pic_path}
            karmaScore={dataMain.is_karma_unlocked ? dataMain.karma_score : 0}
            withKarma={true}
            size={!dataMain.is_karma_unlocked ? 48 : undefined}
            width={!dataMain.is_karma_unlocked ? 4 : undefined}
          />
          <View
            style={{
              flexDirection: 'column',
              paddingHorizontal: 14,
              justifyContent: 'center'
            }}>
            {dataMain.is_karma_unlocked ? (
              <KarmaScore score={Math.floor(dataMain.karma_score)} evenTrack={eventTrack} />
            ) : (
              <KarmaLock onPressCreatePost={handleOnAddPostButtonClicked} />
            )}
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
          eventTrack={eventTrack}
        />

        <LinkAndSocialMedia
          username={dataMain.username}
          prompt={dataMainBio}
          eventTrack={{
            onShareLinkClicked: () => eventTrack.onShareLinkClicked()
          }}
        />
      </View>
      <View>
        <View style={styles.tabs} ref={postRef}>
          <CustomPressable
            style={styles.tabItem(profileTabIndex === TAB_INDEX_SIGNED)}
            onPress={setTabIndexToSigned}>
            <Text style={styles.postText(profileTabIndex === TAB_INDEX_SIGNED)}>Signed Posts</Text>
          </CustomPressable>
          <CustomPressable
            style={styles.tabItem(profileTabIndex === TAB_INDEX_ANONYMOUS, true)}
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
  const closeProfilePicBottomSheetRef = React.useRef(false);

  const [profile, dispatchProfile] = React.useContext(Context).profile;
  const [, dispatch] = React.useContext(Context).users;
  const [myProfileFeed, myProfileDispatch] = React.useContext(Context).myProfileFeed;
  const [, discoveryDispatch] = React.useContext(Context).discovery;

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
  const [isLoadingUpdateImageGallery, setIsLoadingUpdateImageGallery] = React.useState(false);
  const [isLoadingUpdateImageCamera, setIsLoadingUpdateImageCamera] = React.useState(false);
  const [errorChangeRealName, setErrorChangeRealName] = React.useState('');
  const [postOffset, setPostOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [isPostOptionModalOpen, setIsOptionModalOpen] = React.useState(false);
  const [selectedPostForOption, setSelectedPostForOption] = React.useState(null);
  const [isFetchingList, setIsFetchingList] = React.useState(false);
  const {interactionsComplete} = useAfterInteractions();
  const isNotFromHomeTab = route?.params?.isNotFromHomeTab;
  const [, setIsHitApiFirstTime] = React.useState(false);
  const [initialFollowerData, setInitialFollowerData] = React.useState([]);

  const updateUserClient = useUpdateClientGetstreamHook();
  const {refreshCount} = useResetContext();
  const {mappingColorFeed} = useCoreFeed();
  const LIMIT_PROFILE_FEED = 10;
  const TYPE_GALLERY = 'gallery';
  const refBottomSheet = React.useRef();
  const eventTrack = useProfileScreenAnalyticsHook();
  const {
    onEditBioClicked,
    onSaveBioClicked,
    onShareUserClicked,
    onSettingsClicked,
    onProfilePicClicked,
    onProfileLibraryClicked,
    onProfilePhotoClicked,
    onRemoveCurrentProfilePicClicked,
    onViewProfilePictureClicked,
    onBannerClosed,
    onFollowerClicked,
    onFollowingClicked
  } = eventTrack;

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

  const fetchFollower = async () => {
    const result = await getFollower('');
    if (result.code === 200) {
      const newData = result.data.map((data) => ({
        ...data,
        name: data.user.username,
        image: data.user.profile_pic_path,
        description: null
      }));
      setInitialFollowerData(newData);

      const followedUsers = newData.filter((item) => item.user.following);
      const unfollowedUsers = newData.filter((item) => !item.user.following);
      DiscoveryAction.setNewFollowedUsers(followedUsers, discoveryDispatch);
      DiscoveryAction.setNewUnfollowedUsers(unfollowedUsers, discoveryDispatch);
    }
  };

  const {fetchNextFeeds} = useFeedPreloadHook(mainFeeds?.length, () => getMyFeeds(postOffset));
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
    } else {
      setMyProfileFeed(JSON.parse(cacheFeed), myProfileDispatch);
    }
  };
  React.useEffect(() => {
    if (interactionsComplete) {
      initialMyFeed();
      getProfileCache();
      fetchFollower();
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
    onShareUserClicked();
    ShareUtils.shareUserLink(profile?.myProfile?.username);
  };

  const goToSettings = () => {
    Analytics.logEvent('profile_screen_btn_settings', {
      id: 'btn_settings'
    });
    onSettingsClicked();
    navigation.navigate('Settings');
  };

  const goToFollowings = (userId, username) => {
    onFollowingClicked();
    navigation.navigate('Followings', {
      screen: 'TabFollowing',
      params: {user_id: userId, username}
    });
  };
  const goToFollowers = (userId, username) => {
    onFollowerClicked();
    navigation.navigate('Followers', {
      screen: 'TabFollowing',
      params: {user_id: userId, username, isFollower: true, initialData: initialFollowerData}
    });
  };

  const openImageBs = debounce(() => {
    bottomSheetProfilePictureRef.current.open();
    closeProfilePicBottomSheetRef.current = true;
    onProfilePicClicked();
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
    closeProfilePicBottomSheetRef.current = false;
    closeImageBs();
  };

  const onOpenImageGalery = async () => {
    const {success} = await requestExternalStoragePermission();
    if (success) {
      onProfileLibraryClicked();
      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      }).then((imageRes) => {
        handleUpdateImage(`data:image/jpeg;base64,${imageRes.data}`, TYPE_GALLERY);
      });
    } else {
      openAlertPermission(
        'We’re not able to access your photos, please adjust your permission settings for Helio.'
      );
    }
  };

  const onOpenCamera = async () => {
    const {success} = await requestCameraPermission();
    if (success) {
      onProfilePhotoClicked();
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
        'We’re not able to access your camera, please adjust your permission settings for Helio.'
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
    closeProfilePicBottomSheetRef.current = false;
    closeImageBs();
    onViewProfilePictureClicked();
    navigation.push('ImageViewer', {
      title: profile?.myProfile?.username,
      images: [{url: profile?.myProfile?.profile_pic_path}]
    });
  };

  const handleUpdateImage = async (imgBase64, type) => {
    try {
      if (type === TYPE_GALLERY) {
        setIsLoadingUpdateImageGallery(true);
      } else {
        setIsLoadingUpdateImageCamera(true);
      }
      const compressionResult = await ImageCompressionUtils.compress(imgBase64, 'base64');
      const data = {
        profile_pic_path: compressionResult
      };

      updateImageProfile(data)
        .then(async (res) => {
          if (type === TYPE_GALLERY) {
            setIsLoadingUpdateImageGallery(false);
          } else {
            setIsLoadingUpdateImageCamera(false);
          }
          if (res.code === 200) {
            closeProfilePicBottomSheetRef.current = false;
            closeImageBs();
            getMyFeeds();
            const profilePicture = await fetchMyProfile(true);
            updateUserClient(profilePicture);
          }
        })
        .catch(() => {
          if (type === TYPE_GALLERY) {
            setIsLoadingUpdateImageGallery(false);
          } else {
            setIsLoadingUpdateImageCamera(false);
          }
        });
    } catch (error) {
      showMessage({
        message: 'Failed to update profile',
        type: 'danger'
      });
      if (type === TYPE_GALLERY) {
        setIsLoadingUpdateImageGallery(false);
      } else {
        setIsLoadingUpdateImageCamera(false);
      }
    }
  };

  const handleRemoveImageProfile = async () => {
    setIsLoadingRemoveImage(true);
    removeImageProfile(dataMain.user_id)
      .then((res) => {
        setIsLoadingRemoveImage(false);
        if (res.code === 200) {
          onRemoveCurrentProfilePicClicked();
          closeProfilePicBottomSheetRef.current = false;
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
    onEditBioClicked();
    if (dataMain.bio !== null || dataMain.bio !== undefined) {
      setTempBio(dataMain.bio);
    }
    debounceModalOpen();
  };

  const debounceModalOpen = debounce(() => {
    setTempBio(profile?.myProfile?.bio);
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
          onSaveBioClicked();
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

  const onPressComment = (item, haveSeeMore) => {
    navigation.navigate('PostDetailPage', {
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      refreshParent: profileTabIndex === 0 ? getMyFeeds : reloadFetchAnonymousPost,
      haveSeeMore,
      data: item,
      isKeyboardOpen: true
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

  function handleRefresh() {
    setLoading(true);
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

  const removePostByIdFromContext = (post) => {
    const deletedIndex = feeds?.findIndex((find) => post?.id === find?.id);
    const newData = [...feeds];
    newData?.splice(deletedIndex, 1);
    setMyProfileFeed(newData, myProfileDispatch);
  };

  const onDeletePost = async (item) => {
    removePostByIdFromContext(item);

    let response;
    if (isProfileTabSigned) response = await deletePost(item?.id);
    else response = await deleteAnonymousPost(item?.id);
    if (response?.success) {
      Toast.show('Post was permanently deleted', Toast.LONG);
    }

    if (isProfileTabSigned) return getMyFeeds();
    return reloadFetchAnonymousPost();
  };

  const onProfilePicBottomSheetClosed = () => {
    if (closeProfilePicBottomSheetRef.current) {
      closeProfilePicBottomSheetRef.current = false;
      onBannerClosed();
    }
  };

  return (
    <View style={styles.container} forceInset={{top: 'always'}}>
      <StatusBar translucent={false} barStyle={'light-content'} />
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
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={10}
        removeClippedSubviews
        windowSize={10}
        onMomentumScrollEnd={(event) => fetchNextFeeds(event)}
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
              onPressComment={(haveSeeMore) => onPressComment(item, haveSeeMore)}
              onPressUpvote={(post) => setUpVote(post)}
              selfUserId={profile.myProfile.user_id}
              onPressDownVote={(post) => setDownVote(post)}
              loading={loading}
              source={SOURCE_MY_PROFILE}
              hideThreeDot={false}
              showAnonymousOption={true}
              onDeletePost={onDeletePost}
              isSelf={item.is_self}
              isShowDelete={true}
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
        isLoadingUpdateImageGallery={isLoadingUpdateImageGallery}
        isLoadingUpdateImageCamera={isLoadingUpdateImageCamera}
        isLoadingRemoveImage={isLoadingRemoveImage}
        onClose={onProfilePicBottomSheetClosed}
      />
      <ButtonNewPost isShowArrow={isShowButton} />

      {isShowButton ? (
        <ShadowFloatingButtons>
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{...styles.btnBottom, opacity}}>
              <ArrowUpWhiteIcon width={12} height={20} fill={COLORS.almostBlack} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    height: '100%'
  },
  content: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: COLORS.almostBlack,
    paddingVertical: 11
  },
  dummyItem: (heightItem) => ({
    height: heightItem,
    backgroundColor: COLORS.almostBlack
  }),
  postText: (isActive) => ({
    fontFamily: isActive ? fonts.inter[600] : fonts.inter[400],
    fontSize: 14,
    lineHeight: 17,
    color: isActive ? COLORS.signed_primary : COLORS.gray410,
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

    backgroundColor: COLORS.signed_primary,
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
    color: COLORS.black
  },
  tabs: {
    width,
    borderBottomColor: COLORS.gray210,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.almostBlack
  },
  tabItem: (isActive, isAnonymous = false) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderBottomColor: isAnonymous ? COLORS.anon_primary : COLORS.signed_primary,
    borderBottomWidth: isActive ? 2 : 0
  }),
  tabsFixed: {
    width,
    borderBottomColor: COLORS.gray110,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    position: 'absolute',
    top: 42,
    zIndex: 2000,
    backgroundColor: COLORS.almostBlack
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 12,
    color: COLORS.black
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
    color: COLORS.gray410,
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400'
  },
  flatlistContainer: {
    backgroundColor: COLORS.almostBlack
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
  setTabIndexToAnonymous: PropTypes.func,
  goToFollowers: PropTypes.func
};

ProfileScreen.propTypes = {
  route: PropTypes.object
};

export default React.memo(withInteractionsManaged(ProfileScreen));
