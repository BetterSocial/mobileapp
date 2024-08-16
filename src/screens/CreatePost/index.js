/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
import * as React from 'react';
import PSL from 'psl';
import Toast from 'react-native-simple-toast';
import _, {debounce} from 'lodash';
import {
  Alert,
  Animated,
  BackHandler,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {openSettings} from 'react-native-permissions';
import {showMessage} from 'react-native-flash-message';
import {useNavigation, useRoute} from '@react-navigation/core';

import ContentLink from './elements/ContentLink';
import CreatePollContainer from './elements/CreatePollContainer';
import CreatePostInput from '../../components/CreatePostInput';
import Gap from '../../components/Gap';
import Header from '../../components/Header';
import IconHashtag from '../../assets/icons/Ic_hastag';
import ImageCompressionUtils from '../../utils/image/compress';
import ImageUtils from '../../utils/image';
import ListItem from '../../components/MenuPostItem';
import Loading from '../Loading';
import Location from '../../assets/icons/Ic_location';
import MemoIc_user_group from '../../assets/icons/Ic_user_group';
import MemoIc_world from '../../assets/icons/Ic_world';
import ProfileDefault from '../../assets/images/ProfileDefault.png';
import SheetAddTopic from './elements/SheetAddTopic';
import SheetCloseBtn from './elements/SheetCloseBtn';
import SheetExpiredPost from './elements/SheetExpiredPost';
import SheetGeographic from './elements/SheetGeographic';
import SheetMedia from './elements/SheetMedia';
import SheetPrivacy from './elements/SheetPrivacy';
import ShowMedia from './elements/ShowMedia';
import StringConstant from '../../utils/string/StringConstant';
import Timer from '../../assets/icons/Ic_timer';
import TopicItem from '../../components/TopicItem';
import UserProfile from './elements/UserProfile';
import WarningAnimatedMessage from '../../components/WarningAnimateMessage';
import useCreatePostHook from '../../hooks/screen/useCreatePostHook';
import useCreatePostScreenAnalyticsHook from '../../libraries/analytics/useCreatePostScreenAnalyticsHook';
import useHastagMention from './elements/useHastagMention';
import useRawBottomSheetHook from '../../hooks/raw-bottom-sheet';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button, ButtonAddMedia} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED} from '../../utils/constants';
import {ShowingAudience, createPost} from '../../service/post';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {
  getDurationId,
  getLocationId,
  setDurationId,
  setLocationId,
  setPrivacyId
} from '../../utils/setting';
import {getLinkPreviewInfo} from '../../service/feeds';
import {getUrl, isContainUrl} from '../../utils/Utils';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';

const IS_GEO_SELECT_ENABLED = false;

function compire(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const MemoShowMedia = React.memo(ShowMedia, compire);
const CreatePost = () => {
  const defaultPollItem = [{text: ''}, {text: ''}];
  const navigation = useNavigation();

  const sheetGeoRef = React.useRef();
  const sheetPrivacyRef = React.useRef();
  const sheetBackRef = React.useRef();

  const [typeUser, setTypeUser] = React.useState(false);
  const {headerTitle, initialTopic, isInCreatePostTopicScreen, anonUserInfo, setSelectedTopic} =
    useCreatePostHook(typeUser);
  const {params} = useRoute();
  const [message, setMessage] = React.useState('');
  const [mediaStorage, setMediaStorage] = React.useState([]);
  const [listTopic, setListTopic] = React.useState(initialTopic);
  const [listTopicChat, setListTopicChat] = React.useState([]);
  const [isPollShown, setIsPollShown] = React.useState(false);
  const [polls, setPolls] = React.useState([...defaultPollItem]);
  const [isPollMultipleChoice, setIsPollMultipleChoice] = React.useState(false);
  const [linkPreviewMeta, setLinkPreviewMeta] = React.useState(null);
  const [isLinkPreviewShown, setIsLinkPreviewShown] = React.useState(false);
  const [audienceEstimations, setAudienceEstimations] = React.useState(0);
  const [privacySelect, setPrivacySelect] = React.useState(0);
  const [dataImage, setDataImage] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false);
  const [profile] = React.useContext(Context).profile;
  const [geoList, setGeoList] = React.useState([]);
  const [geoSelect, setGeoSelect] = React.useState(0);
  const [locationId, setLocationIdState] = React.useState('');
  const [positionKeyboard, setPositionKeyboard] = React.useState('never');
  const [taggingUsers, setTaggingUsers] = React.useState([]);
  const [isUploadingPhotoMedia, setIsUploadingPhotoMedia] = React.useState(false);
  const [isUploadingPhotoCamera, setIsUploadingPhotoCamera] = React.useState(false);

  const eventTrack = useCreatePostScreenAnalyticsHook();
  const {
    rbSheetRef: rbMediaRef,
    open: openMediaSheet,
    onClose: onCloseMediaSheet,
    forceCloseRbSheet: forceCloseRbMediaSheet
  } = useRawBottomSheetHook(() => {
    if (mediaStorage.length > 0) eventTrack.onAddMorePhotosDialogClose();
    else eventTrack.onAddMediaPollDialogClose();
  });
  const {
    rbSheetRef: rbTopicRef,
    open: openTopicSheet,
    onClose: onCloseTopicSheet,
    forceCloseRbSheet: forceCloseRbTopicSheet
  } = useRawBottomSheetHook(eventTrack.onCommunityTagsCancelClicked);
  const {
    rbSheetRef: rbExpiredRef,
    open: openExpiredSheet,
    onClose: onCloseExpiredSheet,
    forceCloseRbSheet: forceCloseRbExpiredSheet
  } = useRawBottomSheetHook(eventTrack.onExpirationSettingCancelClicked);

  const {setHashtags} = useHastagMention('');
  const [allTaggingUser, setAllTaggingUser] = React.useState([]);
  const animatedReminder = React.useRef(new Animated.Value(0)).current;
  const debounced = React.useCallback(
    debounce((changedText) => {
      if (isContainUrl(changedText)) {
        getPreviewUrl(getUrl(changedText));
      } else {
        setIsLinkPreviewShown(false);
      }
    }, 1000),
    []
  );

  const [selectedTime, setSelectedTime] = React.useState({
    day: 1,
    hour: 0,
    minute: 0
  });
  const [expiredSelect, setExpiredSelect] = React.useState(params?.isCreateCommunity ? 3 : 2);
  const [postExpired] = React.useState([
    {
      label: '24 hours',
      value: '1',
      expiredobject: {
        hour: 24,
        day: 1
      }
    },
    {
      label: '7 days',
      value: '7',
      expiredobject: {
        hour: 24,
        day: 7
      }
    },
    {
      label: '30 days',
      value: '30',
      expiredobject: {
        hour: 24,
        day: 30
      }
    },
    {
      label: 'Never',
      value: 'never',
      expiredobject: {
        hour: 24,
        day: 30
      }
    }
  ]);

  const listPrivacy = [
    {
      icon: <MemoIc_world height={16.67} width={16.67} />,
      label: 'Public',
      desc: 'Anyone in your geographic target area can see your post',
      key: 'public'
    },
    {
      icon: <MemoIc_user_group height={16.67} width={16.67} />,
      label: 'People I follow',
      desc: 'Only those you follow can see your post',
      key: 'people_i_follow'
    }
  ];

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const privacyId = 0;
    if (privacyId && isInCreatePostTopicScreen) {
      setPrivacySelect(0);
    }
    if (privacyId && !isInCreatePostTopicScreen) {
      setPrivacySelect(privacyId);
    }
    const durationId = await getDurationId();
    if (durationId !== null && durationId !== undefined) {
      setExpiredSelect(durationId);
    }

    if (isInCreatePostTopicScreen) {
      setGeoSelect(0);
    }

    if (IS_GEO_SELECT_ENABLED) {
      const locationId = await getLocationId();
      if (locationId && !isInCreatePostTopicScreen) {
        setGeoSelect(locationId);
      }
    }
  };
  const getPreviewUrl = async (link) => {
    const newLink = link;

    const urlWithoutProtocol = link.replace(/(^\w+:|^)\/\//, '');
    const urlDomainOnly = urlWithoutProtocol.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim
    );
    const parsedUrl = PSL.parse(urlDomainOnly[0] || urlWithoutProtocol);

    const response = await getLinkPreviewInfo(parsedUrl?.domain, newLink);
    if (response?.success) {
      const data = response?.data;
      const {domain, meta} = data || {};
      setLinkPreviewMeta({
        domain: domain?.name,
        domainImage: domain?.image,
        title: meta?.title,
        description: meta?.description,
        image: meta?.image,
        url: meta?.url
      });
    } else setLinkPreviewMeta(null);
    setIsLinkPreviewShown(response?.success);
  };

  const location = [
    {
      location_id: 'everywhere',
      neighborhood: 'Everywhere',
      location_level: 'neighborhood'
    }
  ];

  const handleLocation = async () => {
    setGeoList([...location]);
    setLoading(false);
  };

  React.useEffect(() => {
    handleLocation();
  }, []);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, [message]);

  const getEstimationsAudience = async (privacy, location) => {
    const data = await ShowingAudience(privacy, location);
    setAudienceEstimations(data.data);
  };

  const uploadPhotoImage = async (pathImg) => {
    try {
      const compressionResult = await ImageCompressionUtils.compress(pathImg);
      const newArr = {
        id: mediaStorage.length,
        data: compressionResult
      };

      const responseUpload = await ImageUtils.uploadImage(pathImg);
      setMediaStorage((val) => [...val, newArr]);
      if (responseUpload?.data?.url) setDataImage((val) => [...val, responseUpload.data.url]);
      forceCloseRbMediaSheet();
    } catch (e) {
      if (__DEV__) {
        console.log('CreatePost (upload photo):', e);
      }
      showMessage({
        message: StringConstant.UploadPhotoFailed,
        type: 'danger'
      });
    }
  };

  const uploadMediaFromLibrary = async () => {
    const {success} = await requestExternalStoragePermission();
    if (success) {
      eventTrack.onAddMediaPollUploadFromLibClicked();
      launchImageLibrary(
        {mediaType: 'photo', includeBase64: true, tintColor: 'red'},
        async (res) => {
          const uri = res?.assets?.[0]?.uri;
          if (res.didCancel && __DEV__) {
            console.log('User cancelled image picker');
          } else if (uri) {
            setIsUploadingPhotoMedia(true);
            await uploadPhotoImage(uri);
            setIsUploadingPhotoMedia(false);
          } else if (__DEV__) {
            console.log('CreatePost (launchImageLibrary): ', res);
          }
        }
      );
    } else {
      Alert.alert('Permission denied', 'Allow Helio to access photos and media on your device ?', [
        {
          text: 'Open Settings',
          onPress: () => openSettings().then(forceCloseRbMediaSheet)
        },
        {text: 'Close'}
      ]);
    }
  };

  const takePhoto = async () => {
    const {success, message} = await requestCameraPermission();
    if (success) {
      eventTrack.onAddMediaPollTakePhotoClicked();
      launchCamera({mediaType: 'photo', includeBase64: true, selectionLimit: 1}, async (res) => {
        const uri = res?.assets?.[0]?.uri;
        if (res.didCancel && __DEV__) {
          console.log('User cancelled image picker');
        } else if (uri) {
          setIsUploadingPhotoCamera(true);
          await uploadPhotoImage(uri);
          setIsUploadingPhotoCamera(false);
        }
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const onRemoveItem = (v) => {
    const deleteItem = mediaStorage.filter((item) => item.id !== v);
    const index = mediaStorage.findIndex((item) => item.id === v);
    const newImageData = [...dataImage].splice(index);
    setDataImage(newImageData);
    setMediaStorage(deleteItem);
    eventTrack.onPhotoUploadedXButtonClicked();
  };

  const onRemoveAllMedia = () => {
    setMediaStorage([]);
    eventTrack.onPhotoUploadedRemoveAllPhotosClicked();
  };

  const removeTopic = (v) => {
    const newArr = listTopic.filter((e) => e !== v);
    const newChat = listTopicChat.filter((chat) => chat !== `topic_${v}`);
    setListTopic(newArr);
    setHashtags(newArr);
    setListTopicChat(newChat);

    eventTrack.onAddCommsDeleteCommCommDeleted();

    if (params?.topic) {
      if (!newArr.map((i) => i.topic).includes(params?.topic)) {
        setSelectedTopic(null);
      }
    }
  };
  const onSetExpiredSelect = (v) => {
    setExpiredSelect(v);
    if (v === 0) eventTrack.onExpirationSettingChoice24HrClicked();
    else if (v === 1) eventTrack.onExpirationSettingChoice7DaysClicked();
    else if (v === 2) eventTrack.onExpirationSettingChoice30DaysClicked();
    else if (v === 3) eventTrack.onExpirationSettingChoiceNeverClicked();
    forceCloseRbExpiredSheet();
  };
  const onSetGeoSelect = (v) => {
    getEstimationsAudience(listPrivacy[0].key, geoList[v].location_id);
    setGeoSelect(v);
    setLocationIdState(geoList[v].location_id);
    sheetGeoRef.current.close();
  };
  const onSetPrivacySelect = (v) => {
    getEstimationsAudience(listPrivacy[0].key, geoList[geoSelect].location_id);
    setPrivacySelect(v);
    sheetPrivacyRef.current.close();
  };

  const getReducedPoll = () => {
    const reducedPoll = polls.reduce((acc, current) => {
      if (current.text !== '') {
        acc.push(current);
      }
      return acc;
    }, []);

    return reducedPoll;
  };
  const onBack = () => {
    if (message || getReducedPoll().length > 0 || mediaStorage.length > 0) {
      sheetBackRef.current.open();
    } else {
      eventTrack.onBackButtonClicked();
      navigation.goBack();
    }

    return true;
  };

  const onSaveTopic = (v, topicChat) => {
    console.log('CreatePost (onSaveTopic):', v, topicChat);
    setListTopic(v);
    setHashtags(v);
    setListTopicChat(topicChat);
    forceCloseRbTopicSheet();
    eventTrack.onCommunityTagsSaveButtonClicked();
  };

  const navigateToTopicPage = () => {
    return navigation.replace('TopicPageScreen', {id: initialTopic[0]});
  };

  const checkTaggingUser = () => {
    const mapTagUser = taggingUsers.map((data) => {
      const findData = allTaggingUser.find((dataUser) => dataUser.username === data);
      return findData?.user_id;
    });
    return mapTagUser;
  };

  const isEmptyMessageAllowed = () => {
    if (dataImage?.length > 0 || getReducedPoll()?.length > 0) return true;
    return message !== '';
  };

  const postV3 = async () => {
    setLoadingPost(true);

    if (!isEmptyMessageAllowed()) {
      showMessage({
        message: StringConstant.createPostFailedNoMessage,
        type: 'danger'
      });
      eventTrack.onPostButtonEmptyAlerted();
      setLoadingPost(false);
      return true;
    }

    const maxRetries = 5;
    const attemptPost = async (retryCount) => {
      try {
        const topicsToPost = _.union(initialTopic, listTopic);
        const data = {
          message,
          topics: topicsToPost,
          verb: isPollShown ? 'poll' : 'tweet',
          feedGroup: 'main_feed',
          privacy: listPrivacy[0].key,
          anonimity: typeUser,
          location: renderLocationString(geoList[geoSelect]),
          location_id: locationId,
          duration_feed: postExpired[expiredSelect].value,
          images_url: dataImage,
          tagUsers: checkTaggingUser(),
          is_photo_uploaded: true
        };

        if (isPollShown) {
          data.polls = getReducedPoll();
          data.pollsduration = selectedTime;
          data.multiplechoice = isPollMultipleChoice;
        }

        if (typeUser) {
          data.anon_user_info = {
            color_name: anonUserInfo?.colorName,
            color_code: anonUserInfo?.colorCode,
            emoji_name: anonUserInfo?.emojiName,
            emoji_code: anonUserInfo?.emojiCode
          };
        }

        setDurationId(JSON.stringify(expiredSelect));
        if (!isInCreatePostTopicScreen) {
          setLocationId(JSON.stringify(geoSelect));
          setPrivacyId(JSON.stringify(0));
        }

        const post = await createPost(data);
        if (params && params?.onRefresh && typeof params.onRefresh === 'function') {
          params?.onRefresh();
        }
        setLoadingPost(false);
        if (post.code === 200) {
          eventTrack.onPostButtonOpenMainFeed();
          showMessage({
            message: StringConstant.createPostDone,
            type: 'success'
          });

          if (isInCreatePostTopicScreen) {
            navigateToTopicPage();
          } else {
            navigation.navigate('HomeTabs', {
              screen: 'Feed',
              params: {refresh: true}
            });
          }
        } else {
          showMessage({
            message: StringConstant.createPostFailedGeneralError,
            type: 'danger'
          });
        }

        Analytics.logEvent('create_post', {
          id: 6,
          newpost_reach: renderLocationString(geoList[geoSelect]),
          newpost_privacy: listPrivacy[0].label,
          num_images: 0,
          added_poll: isPollShown,
          topics_added: listTopic,
          anon: typeUser,
          predicted_audience: audienceEstimations
        });
      } catch (e) {
        if (__DEV__) {
          console.log('CreatePost : ', e);
          console.warn('retryCount', retryCount);
        }
        if (retryCount >= maxRetries) {
          showMessage({
            message: 'Failed to post. Please check your internet connection.',
            type: 'danger'
          });
          setLoadingPost(false);
          return false;
        }
        return attemptPost(retryCount + 1);
      }
    };

    await attemptPost(0);
  };

  const renderComponentMedia = () => {
    if (isPollShown || isLinkPreviewShown) {
      return <View />;
    }

    if (mediaStorage.length > 0) {
      return (
        <MemoShowMedia
          data={mediaStorage.reverse()}
          onRemoveItem={onRemoveItem}
          onRemoveAll={() => onRemoveAllMedia()}
          onAddMedia={() => {
            openMediaSheet();
            console.log('CreatePost (onAddMedia):');
            eventTrack.onPhotoUploadedAddMorePhotosPhotoRemoved();
          }}
        />
      );
    }

    return (
      <ButtonAddMedia
        label="+ Add media or poll"
        onPress={() => {
          eventTrack.onAddMediaPollButtonClicked();
          openMediaSheet();
        }}
        labelStyle={styles.labelButtonAddMedia}
      />
    );
  };

  const createPoll = () => {
    setIsPollShown(true);
    eventTrack.onAddMediaPollPageAddPollClicked();
    forceCloseRbMediaSheet();
  };

  const removeAllPoll = () => {
    const isPollNotEmpty = polls.reduce(
      (accumulator, current) => accumulator || current.text !== '',
      false
    );
    if (isPollNotEmpty) {
      return Alert.alert('Are you sure?', 'This cannot be undone', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          onPress: () => {
            setIsPollShown(false);
            setPolls(defaultPollItem);
            eventTrack.onPollSectionRemovePollButtonClicked();
          }
        }
      ]);
    }

    eventTrack.onPollSectionRemovePollButtonClicked();
    setIsPollShown(false);
    setPolls(defaultPollItem);
    return null;
  };

  const addNewPollItem = () => {
    if (polls.length >= MAX_POLLING_ALLOWED) {
      return;
    }

    eventTrack.onPollSectionAddChoiceClicked(polls.length + 1);
    setPolls([...polls, {text: ''}]);
  };

  const removeSinglePollByIndex = (index) => {
    if (polls.length <= MIN_POLLING_ALLOWED) {
      return;
    }

    eventTrack.onPollSectionDeleteChoiceClicked(index);
    polls.splice(index, 1);
    setPolls([...polls]);
  };

  const onSinglePollChanged = (item, index) => {
    polls[index] = item;
    setPolls([...polls]);
  };

  const isPollButtonDisabled = () => getReducedPoll().length < 2;
  const isButtonDisabled = () => {
    if (loadingPost) return true;
    if (isPollShown) return isPollButtonDisabled();
    return false;
  };

  const renderListTopic = () => {
    if (listTopic.length > 0) {
      return (
        <ScrollView style={styles.listTopic} horizontal showsHorizontalScrollIndicator={false}>
          {listTopic.map((value, index) => (
            <Pressable key={index} onPress={openTopic}>
              <TopicItem label={value} removeTopic={removeTopic} onTopicPress={() => openTopic()} />
            </Pressable>
          ))}
        </ScrollView>
      );
    }
    return <View />;
  };

  // eslint-disable-next-line no-extend-native, func-names
  String.prototype.insert = function (index, string) {
    if (index > 0) {
      return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
  };

  const openTopic = () => {
    setPositionKeyboard('always');
    openTopicSheet();
    openTopicSheet();
    eventTrack.onAdSetAddCommunitiesOpenCommunityTags();
  };

  const handleTagUser = debounce((text) => {
    const regex = /(^|\W)(@[a-z\d][\w-]*)/gi;
    const findRegex = text.match(regex);
    if (findRegex) {
      const newMapRegex = findRegex.map((tagUser) => {
        const newTagUser = tagUser.replace(/\s/g, '').replace('@', '');
        return newTagUser;
      });
      setTaggingUsers(newMapRegex);
    } else {
      setTaggingUsers([]);
    }
  }, 500);

  const onChangeText = (text) => {
    debounced(text);
    setMessage(text);
    handleTagUser(text);
  };

  const renderLocationString = (geoInfo) => {
    if (geoInfo?.location_level?.toLowerCase() === 'neighborhood') return geoInfo?.neighborhood;
    if (geoInfo?.location_level?.toLowerCase() === 'city') return geoInfo?.city.split(',')[0];
    if (geoInfo?.location_level?.toLowerCase() === 'state') return geoInfo?.state;
    if (geoInfo?.location_level?.toLowerCase() === 'country') return geoInfo?.country;
    return geoInfo?.location_level;
  };

  const onUserTypeChanged = (isAnonymous) => {
    setTypeUser(isAnonymous);
    if (isAnonymous) eventTrack.onAnonButtonOn();
    else eventTrack.onAnonButtonOff();
  };

  React.useEffect(() => {
    if (typeUser) {
      Animated.sequence([
        Animated.timing(animatedReminder, {
          toValue: 1,
          useNativeDriver: true
        })
      ]).start();
    } else {
      animatedReminder.setValue(0);
    }
  }, [typeUser]);

  React.useEffect(() => {
    const followType = params?.followType;
    if (followType === 'incognito') {
      setTypeUser(true);
    } else {
      setTypeUser(false);
    }
  }, [params?.followType]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={positionKeyboard}>
        <Header title={headerTitle} onPress={() => onBack()} />
        <View style={{paddingHorizontal: 15}}>
          <UserProfile
            setTypeUser={onUserTypeChanged}
            isAnonymous={typeUser}
            anonUserInfo={anonUserInfo}
            username={profile?.myProfile?.username}
            photo={
              profile?.myProfile?.profile_pic_path
                ? {uri: profile?.myProfile?.profile_pic_path}
                : ProfileDefault
            }
            onPress={() => {
              onChangeText('');
              eventTrack.onProfileButtonClicked();
              navigation.navigate('ProfileScreen', {
                isNotFromHomeTab: true
              });
            }}
          />
          <Gap style={styles.height(8)} />
          <CreatePostInput
            setMessage={onChangeText}
            setPositionKeyboard={setPositionKeyboard}
            setTopics={setListTopic}
            topics={listTopic}
            message={message}
            setTopicChats={setListTopicChat}
            topicChats={listTopicChat}
            allTaggedUser={allTaggingUser}
            setAllTaggedUser={setAllTaggingUser}
            typeUser={typeUser}
          />
          {typeUser && (
            <Animated.View style={[{opacity: animatedReminder}, styles.reminderContainer]}>
              <Text style={styles.reminderText}>
                Even when incognito, you can be blocked by others.
              </Text>
            </Animated.View>
          )}

          {/* TODO: Garry
          Outline 210
          text 510
          link signed_primary ikutin mode */}
          {isLinkPreviewShown && (
            <ContentLink
              og={
                linkPreviewMeta || {
                  domain: '',
                  domainImage: null,
                  title: '',
                  description: '',
                  image: null,
                  url: ''
                }
              }
            />
          )}

          {isPollShown && (
            <CreatePollContainer
              polls={polls}
              onaddpoll={() => addNewPollItem()}
              onsinglepollchanged={(item, index) => onSinglePollChanged(item, index)}
              onremovesinglepoll={(index) => removeSinglePollByIndex(index)}
              onremoveallpoll={() => removeAllPoll()}
              ismultiplechoice={isPollMultipleChoice}
              selectedtime={selectedTime}
              ontimechanged={(timeObject) => setSelectedTime(timeObject)}
              onmultiplechoicechanged={(ismultiplechoice) => {
                setIsPollMultipleChoice(ismultiplechoice);
                if (ismultiplechoice) eventTrack.onPollSectionMultipleChoiceButtonOn();
                else eventTrack.onPollSectionMultipleChoiceButtonOff();
              }}
              expiredobject={postExpired[expiredSelect].expiredobject}
              isAnonym={typeUser}
              expiration={postExpired[expiredSelect].label}
            />
          )}
          <Gap style={styles.height(26)} />
          {renderComponentMedia()}
          <Gap style={styles.height(29)} />
          <Text style={styles.label}>Advanced Settings</Text>
          <Gap style={styles.height(12)} />
          <ListItem
            icon={<IconHashtag width={16.67} height={16.67} fill={COLORS.white} />}
            topic={listTopic.length > 0}
            listTopic={renderListTopic()}
            label="Add Communities"
            labelStyle={styles.hashtagText}
            onPress={openTopic}
          />
          <Gap style={styles.height(16)} />
          <ListItem
            icon={<Timer width={16.67} height={16.67} fill={COLORS.white} />}
            label={postExpired.length === 0 ? 'Loading...' : postExpired[expiredSelect]?.label}
            labelStyle={styles.listText}
            onPress={() => {
              eventTrack.onAdSetExpirationButtonOpenExpirationSetting();
              openExpiredSheet();
            }}
          />
          {IS_GEO_SELECT_ENABLED && (
            <>
              <Gap style={styles.height(16)} />
              <ListItem
                icon={<Location width={16.67} height={16.67} />}
                label={
                  geoList.length === 0 ? 'Loading...' : renderLocationString(geoList[geoSelect])
                }
                labelStyle={styles.listText}
                onPress={() => sheetGeoRef.current.open()}
              />
            </>
          )}
          <Gap style={styles.height(25)} />
          <Button styles={styles.btnPost(typeUser)} disabled={isButtonDisabled()} onPress={postV3}>
            {params?.isCreateCommunity ? 'Post & Create Community' : 'Post'}
          </Button>
          <Gap style={styles.height(18)} />
          <SheetMedia
            refMedia={rbMediaRef}
            medias={mediaStorage}
            onClose={onCloseMediaSheet}
            uploadFromMedia={() => uploadMediaFromLibrary()}
            takePhoto={() => takePhoto()}
            createPoll={() => createPoll()}
            isLoadingUploadingMedia={isUploadingPhotoMedia}
            isLoadingUploadingPhoto={isUploadingPhotoCamera}
          />
          <SheetAddTopic
            refTopic={rbTopicRef}
            onAdd={(v, chatTopic) => onSaveTopic(v, chatTopic)}
            topics={listTopic}
            chatTopics={listTopicChat}
            onClose={onCloseTopicSheet}
            eventTrack={{
              onAddTopic: eventTrack.onAddCommsAddedCommNewCommAdded,
              onRemoveTopic: eventTrack.onAddCommsDeleteCommCommDeleted
            }}
          />
          <SheetExpiredPost
            refExpired={rbExpiredRef}
            data={postExpired}
            select={expiredSelect}
            onSelect={onSetExpiredSelect}
            onClose={onCloseExpiredSheet}
          />
          <SheetGeographic
            geoRef={sheetGeoRef}
            data={geoList}
            select={geoSelect}
            onSelect={onSetGeoSelect}
          />
          <SheetPrivacy
            privacyRef={sheetPrivacyRef}
            data={listPrivacy}
            select={privacySelect}
            onSelect={onSetPrivacySelect}
          />
          <SheetCloseBtn
            backRef={sheetBackRef}
            goBack={() => navigation.goBack()}
            continueToEdit={() => sheetBackRef.current.close()}
          />
        </View>
      </ScrollView>
      <Loading visible={loading || loadingPost} />
      <WarningAnimatedMessage isShow={typeUser} />
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    position: 'relative'
  },
  input: {
    backgroundColor: COLORS.gray110,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 100,
    justifyContent: 'flex-start',
    overflow: 'scroll'
  },
  hashtagText: {
    color: COLORS.gray410,
    fontSize: 14,
    fontFamily: fonts.inter[400]
  },
  listText: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: fonts.inter[400]
  },
  label: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold'
  },
  desc: {fontSize: 14, fontFamily: fonts.poppins[400]},
  labelButtonAddMedia: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    fontWeight: 'bold'
  },
  listTopic: {
    flexDirection: 'row',
    marginLeft: 10,
    zIndex: 999,
    paddingTop: 11,
    paddingBottom: 13
  },
  userTarget: {
    color: COLORS.bondi_blue,
    fontSize: 14,
    fontFamily: fonts.poppins[400]
  },
  height: (height) => ({
    height
  }),
  reminderContainer: {
    backgroundColor: COLORS.anon_secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  reminderText: {
    color: COLORS.white,
    fontSize: normalizeFontSize(10),
    textAlign: 'center'
  },
  btnPost: (isAnonym) => ({
    backgroundColor: isAnonym ? COLORS.anon_primary : COLORS.signed_primary
  })
});
