import * as React from 'react';
import {
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  StatusBar,
  TouchableNativeFeedback
} from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { showMessage } from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { getLinkPreview } from 'link-preview-js';

import Header from '../../components/Header';
import { Button, ButtonAddMedia } from '../../components/Button';
import UserProfile from './elements/UserProfile';
import SheetCloseBtn from './elements/SheetCloseBtn';
import { createPost, ShowingAudience } from '../../service/post';
import Gap from '../../components/Gap';
import ListItem from '../../components/MenuPostItem';
import Loading from '../Loading';
import SheetMedia from './elements/SheetMedia';
import ShowMedia from './elements/ShowMedia';
import SheetAddTopic from './elements/SheetAddTopic';
import TopicItem from '../../components/TopicItem';
import SheetExpiredPost from './elements/SheetExpiredPost';
import SheetGeographic from './elements/SheetGeographic';
import SheetPrivacy from './elements/SheetPrivacy';
import CreatePollContainer from './elements/CreatePollContainer';
import ContentLink from './elements/ContentLink';

import { MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED } from '../../utils/constants';
import { getMyProfile } from '../../service/profile';
import { colors } from '../../utils/colors';
import MemoIc_hastag from '../../assets/icons/Ic_hastag';
import Timer from '../../assets/icons/Ic_timer';
import Location from '../../assets/icons/Ic_location';
import World from '../../assets/icons/Ic_world';
import { fonts } from '../../utils/fonts';
import MemoIc_world from '../../assets/icons/Ic_world';
import MemoIc_user_group from '../../assets/icons/Ic_user_group';
import { createPollPost } from '../../service/post';
import ProfileDefault from '../../assets/images/ProfileDefault.png';
import StringConstant from '../../utils/string/StringConstant';
import { getUserId } from '../../utils/users';
import {
  requestExternalStoragePermission,
  requestCameraPermission,
} from '../../utils/permission';
import { getUrl, isContainUrl, isEmptyOrSpaces } from '../../utils/Utils';
import {
  getDurationId,
  getLocationId,
  getPrivacyId,
  setDurationId,
  setLocationId,
  setPrivacyId,
} from '../../utils/setting';
import { instanceOf } from 'prop-types';
import { getTopics } from '../../service/topics';
import Card from './elements/Card';

import { capitalizeFirstText, convertString } from '../../utils/string/StringUtils';

const MemoShowMedia = React.memo(ShowMedia, compire);
function compire(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const CreatePost = () => {
  let defaultPollItem = [{ text: '' }, { text: '' }];
  const navigation = useNavigation();
  const sheetMediaRef = React.useRef();
  const sheetTopicRef = React.useRef();
  const sheetExpiredRef = React.useRef();
  const sheetGeoRef = React.useRef();
  const sheetPrivacyRef = React.useRef();
  const sheetBackRef = React.useRef();

  const [message, setMessage] = React.useState('');
  const [mediaStorage, setMediaStorage] = React.useState([]);
  const [listTopic, setListTopic] = React.useState([]);
  const [isPollShown, setIsPollShown] = React.useState(false);
  const [polls, setPolls] = React.useState([...defaultPollItem]);
  const [isPollMultipleChoice, setIsPollMultipleChoice] = React.useState(false);
  const [linkPreviewMeta, setLinkPreviewMeta] = React.useState(null);
  const [isLinkPreviewShown, setIsLinkPreviewShown] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState({
    day: 1,
    hour: 0,
    minute: 0,
  });
  const [expiredSelect, setExpiredSelect] = React.useState(0);
  const [postExpired, setPostExpired] = React.useState([
    {
      label: '24 hours',
      value: '1',
      expiredobject: {
        hour: 24,
        day: 1,
      },
    },
    {
      label: '7 days',
      value: '7',
      expiredobject: {
        hour: 24,
        day: 7,
      },
    },
    {
      label: '30 days',
      value: '30',
      expiredobject: {
        hour: 24,
        day: 30,
      },
    },
    {
      label: 'Never',
      value: 'never',
      expiredobject: {
        hour: 24,
        day: 30,
      },
    },
  ]);

  const [audienceEstimations, setAudienceEstimations] = React.useState(0);
  const [privacySelect, setPrivacySelect] = React.useState(0);
  const [dataImage, setDataImage] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [typeUser, setTypeUser] = React.useState(false);
  const [dataProfile, setDataProfile] = React.useState({});
  const [geoList, setGeoList] = React.useState([]);
  const [geoSelect, setGeoSelect] = React.useState(0);
  const [topicSearch, setTopicSearch] = React.useState([]);
  const [isTopicOverlay, setTopicOverlay] = React.useState(false);
  const [positionTopicSearch, setPositionTopicSearch] = React.useState(0);
  const [inPositionSearch, setInPositionSearch] = React.useState([]);


  const listPostExpired = [
    {
      label: '24 hours',
      value: '1',
      expiredobject: {
        hour: 24,
        day: 1,
      },
    },
    {
      label: '7 days',
      value: '7',
      expiredobject: {
        hour: 24,
        day: 7,
      },
    },
    {
      label: '30 days',
      value: '30',
      expiredobject: {
        hour: 24,
        day: 30,
      },
    },
    {
      label: 'Never',
      value: 'never',
      expiredobject: {
        hour: 24,
        day: 30,
      },
    },
  ]

  const listPrivacy = [
    {
      icon: <MemoIc_world height={16.67} width={16.67} />,
      label: 'Public',
      desc: 'Anyone in your geographic target area can see your post',
      key: 'public',
    },
    {
      icon: <MemoIc_user_group height={16.67} width={16.67} />,
      label: 'People I follow',
      desc: 'Only those you follow can see your post',
      key: 'people_i_follow',
    },
  ];

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let privacyId = await getPrivacyId();
    if (privacyId) {
      setPrivacySelect(privacyId);
    }
    let durationId = await getDurationId();
    if (durationId) {
      setExpiredSelect(durationId);
    }
    let locationId = await getLocationId();
    if (locationId) {
      setGeoSelect(locationId);
    }
  };

  const getPreviewUrl = async (link) => {
    let newLink = link;
    if (link.indexOf('https://') < 0) {
      newLink = `https://${link}`;
    }

    let data = await getLinkPreview(newLink);
    if (data) {
      setLinkPreviewMeta({
        domain: data.siteName,
        domainImage: data.favicons[0],
        title: data.title,
        description: data.description,
        image: data.images[0],
        url: data.url,
      });
    } else {
      setLinkPreviewMeta(null);
    }
    setIsLinkPreviewShown(data ? true : false);
  }

  React.useEffect(() => {
    if (isContainUrl(message)) {
      getPreviewUrl(getUrl(message));
    } else {
      setIsLinkPreviewShown(false);
    }
  }, [message]);

  let location = [
    {
      location_id: 'everywhere',
      neighborhood: 'Everywhere',
    },
  ];

  const fetchMyProfile = async () => {
    setLoading(true);
    let userId = await getUserId();
    if (userId) {
      const result = await getMyProfile(userId);
      if (result.code === 200) {
        setDataProfile(result.data);
        setLoading(false);
        await result.data.locations.map((res) => {
          location.push({
            location_id: res.location_id,
            neighborhood: res.neighborhood,
          });
        });
        setGeoList(location);
      }

      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMyProfile();
    analytics().logScreenView({
      screen_class: 'ChooseUsername',
      screen_name: 'ChooseUsername',
    });
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

  const uploadMediaFromLibrary = async () => {
    let { success, message } = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (res) => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.uri) {
          let newArr = {
            id: mediaStorage.length,
            data: res.uri,
          };
          setMediaStorage((val) => [...val, newArr]);
          setDataImage((val) => [...val, res.base64]);
          sheetMediaRef.current.close();
        } else {
          console.log(res);
        }
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const takePhoto = async () => {
    let { success, message } = await requestCameraPermission();
    if (success) {
      launchCamera({ mediaType: 'photo', includeBase64: true }, (res) => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.uri) {
          let newArr = {
            id: mediaStorage.length,
            data: res.uri,
          };
          setMediaStorage((val) => [...val, newArr]);
          setDataImage((val) => [...val, res.base64]);
          sheetMediaRef.current.close();
        }
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const onRemoveItem = (v) => {
    let deleteItem = mediaStorage.filter((item) => item.id !== v);
    setMediaStorage(deleteItem);
  };

  const onRemoveAllMedia = () => {
    setMediaStorage([]);
  };

  const removeTopic = (v) => {
    let newArr = listTopic.filter((e) => e !== v);
    setListTopic(newArr);
  };
  const onSetExpiredSelect = (v) => {
    setExpiredSelect(v);
    sheetExpiredRef.current.close();
  };
  const onSetGeoSelect = (v) => {
    getEstimationsAudience(
      listPrivacy[privacySelect].key,
      geoList[v].location_id,
    );
    setGeoSelect(v);
    sheetGeoRef.current.close();
  };
  const onSetPrivacySelect = (v) => {
    getEstimationsAudience(listPrivacy[v].key, geoList[geoSelect].location_id);
    setPrivacySelect(v);
    sheetPrivacyRef.current.close();
  };

  const getReducedPoll = () => {
    let reducedPoll = polls.reduce((acc, current) => {
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
      return true;
    }
    navigation.goBack();
    return true;
  };

  const onSaveTopic = (v) => {
    setListTopic(v);
    sheetTopicRef.current.close();
  };

  const postTopic = async () => {
    try {
      if (message === '') {
        showMessage({
          message: StringConstant.createPostFailedNoMessage,
          type: 'danger',
        });
        return true;
      }

      setLoading(true);
      let data = {
        topics: listTopic,
        message: message,
        verb: 'tweet',
        feedGroup: 'main_feed',
        privacy: listPrivacy[privacySelect].label,
        anonimity: typeUser,
        location: geoList[geoSelect].neighborhood,
        duration_feed: postExpired[expiredSelect].value,
        images_url: dataImage,
      };

      setLocationId(JSON.stringify(geoSelect));
      setDurationId(JSON.stringify(expiredSelect));
      setPrivacyId(JSON.stringify(privacySelect));

      analytics().logEvent('create_post', {
        id: 6,
        newpost_reach: geoList[geoSelect].neighborhood,
        newpost_privacy: listPrivacy[privacySelect].label,
        num_images: dataImage.length,
        added_poll: false,
        topics_added: listTopic,
        anon: typeUser,
        predicted_audience: audienceEstimations,
      });
      let res = await createPost(data);
      if (res.code === 200) {
        showMessage({
          message: StringConstant.createPostDone,
          type: 'success',
        });
        setLoading(false);
        setTimeout(() => {
          navigation.navigate('HomeTabs', {
            screen: 'Feed',
            params: {
              refresh: true,
            },
          });
        }, 2000);
      } else {
        setLoading(false);
        showMessage({
          message: StringConstant.createPostFailedGeneralError,
          type: 'danger',
        });
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: StringConstant.createPostFailedGeneralError,
        type: 'danger',
      });
      setLoading(false);
    }
  };

  const randerComponentMedia = () => {
    if (isPollShown || isLinkPreviewShown) {
      return <View />;
    }

    if (mediaStorage.length > 0) {
      return (
        <MemoShowMedia
          data={mediaStorage.reverse()}
          onRemoveItem={onRemoveItem}
          onRemoveAll={() => onRemoveAllMedia()}
          onAddMedia={() => sheetMediaRef.current.open()}
        />
      );
    } else {
      return (
        <ButtonAddMedia
          label="+ Add media or poll"
          onPress={() => sheetMediaRef.current.open()}
          labelStyle={styles.labelButtonAddMedia}
        />
      );
    }
  };

  const createPoll = () => {
    setIsPollShown(true);
    sheetMediaRef.current.close();
  };

  const removeAllPoll = () => {
    let isPollNotEmpty = polls.reduce(
      (accumulator, current) => accumulator || current.text !== '',
      false,
    );
    if (isPollNotEmpty) {
      return Alert.alert('Are you sure?', 'This cannot be undone', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            setIsPollShown(false);
            setPolls(defaultPollItem);
          },
        },
      ]);
    } else {
      setIsPollShown(false);
      setPolls(defaultPollItem);
    }
  };

  const addNewPollItem = () => {
    if (polls.length >= MAX_POLLING_ALLOWED) {
      return;
    }
    setPolls([...polls, { text: '' }]);
  };

  const removeSinglePollByIndex = (index) => {
    if (polls.length <= MIN_POLLING_ALLOWED) {
      return;
    }
    polls.splice(index, 1);
    setPolls([...polls]);
  };

  const onSinglePollChanged = (item, index) => {
    polls[index] = item;
    setPolls([...polls]);
  };

  const isPollButtonDisabled = () => {
    return getReducedPoll().length < 2;
  };

  const sendPollPost = async () => {
    setLoading(true);

    let data = {
      message,
      topics: ['poll'],
      verb: 'poll',
      object: {},
      feedGroup: 'main_feed',
      privacy: listPrivacy[privacySelect].label,
      anonimity: typeUser,
      location: geoList[geoSelect].neighborhood,
      duration_feed: postExpired[expiredSelect].value,
      polls: getReducedPoll(),
      pollsduration: selectedTime,
      multiplechoice: isPollMultipleChoice,
    };

    setLocationId(JSON.stringify(geoSelect));
    setDurationId(JSON.stringify(expiredSelect));
    setPrivacyId(JSON.stringify(privacySelect));

    try {
      let response = await createPollPost(data);
      if (response.status) {
        showMessage({
          message: StringConstant.createPostDone,
          type: 'success',
        });
        setTimeout(() => {
          navigation.navigate('HomeTabs', {
            screen: 'Feed',
            params: {
              refresh: true,
            },
          });
        }, 1000);
        setLoading(false);
      } else {
        setLoading(false);
        showMessage({
          message: StringConstant.createPostFailedGeneralError,
          type: 'danger',
        });
      }
    } catch (e) {
      showMessage({
        message: StringConstant.createPostFailedGeneralError,
        type: 'danger',
      });
      setLoading(false);
    }
    analytics().logEvent('create_post', {
      id: 6,
      newpost_reach: geoList[geoSelect].neighborhood,
      newpost_privacy: listPrivacy[privacySelect].label,
      num_images: 0,
      added_poll: true,
      topics_added: listTopic,
      anon: typeUser,
      predicted_audience: audienceEstimations,
    });
  };

  const renderListTopic = () => {
    if (listTopic.length > 0) {
      return (
        <ScrollView
          style={styles.listTopic}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {listTopic.map((value, index) => {
            return (
              <TopicItem key={index} label={value} removeTopic={removeTopic} />
            );
          })}
        </ScrollView>
      );
    }
    return <View />;
  };



  const searchTopic = async (name) => {
    if (!isEmptyOrSpaces(name)) {
      getTopics(name)
        .then(v => {
          setTopicSearch(v.data);
        })
        .catch(err => console.log(err));
    }
  }

  String.prototype.insert = function (index, string) {
    if (index > 0) {
      return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={{ paddingHorizontal: Platform.OS === 'ios' ? 20 : 0 }}>
        <Header title="Create a post" onPress={() => onBack()} />
        <UserProfile
          typeUser={typeUser}
          setTypeUser={setTypeUser}
          username={
            dataProfile.username ? dataProfile.username : 'Loading . . .'
          }
          photo={
            dataProfile.profile_pic_path
              ? { uri: dataProfile.profile_pic_path }
              : ProfileDefault
          }
          onPress={() => {
            setMessage('');
            navigation.navigate('ProfileScreen');
          }}
        />
        <Gap style={styles.height(8)} />
        <TextInput
          onChangeText={(v) => {
            // cek apakah mengndung # apa tidak
            if (v.includes('#')) {
              // ambil posisi #
              let position = v.indexOf('#');
              // cari spasi mulai dari posisi #
              let spaceStatus = v.includes(' ', position);
              if (!spaceStatus) {
                let textSeacrh = v.substring(position + 1);
                setPositionTopicSearch(position);
                searchTopic(textSeacrh);
              }
              // harus ke trigger sebelum ketik spasi setelah 
            }
            setMessage(v)
          }}
          value={message}
          multiline={true}
          style={styles.input}
          textAlignVertical="top"
          placeholder={
            'What’s on your mind?\nRemember to be respectful .\nDownvotes  & Blocks harm all your posts’ visibility.'
          }
          autoCapitalize={'none'}
        />


        <Gap height={16} />

        {
          topicSearch.length > 0 && (
            <Card>
              {topicSearch.map((item, index) => {
                return (
                  <TouchableNativeFeedback onPress={() => {
                    // todo masukan pilihan user kedalam text
                    let topicItem = capitalizeFirstText(convertString(item.name, " ", ""));
                    let oldMessage = message;
                    console.log(positionTopicSearch);
                    let pos = positionTopicSearch + 1;
                    console.log(pos);
                    let s = oldMessage.substring(0, pos);
                    console.log('old message: ', s);
                    let test = (
                      <Text style={{ fontSize: 24 }}>
                        {topicItem}
                      </Text>
                    )
                    let newMessage = s.insert(pos, test);
                    console.log('new message: ', newMessage);
                    setMessage(newMessage);
                    setTopicSearch([]);
                    setInPositionSearch(inPositionSearch.push(positionTopicSearch));
                  }}>
                    <View style={{ marginBottom: 5 }} >
                      <Text style={{
                        color: '#000000',
                        fontFamily: fonts.inter[500],
                        fontWeight: '500',
                        fontSize: 12,
                        lineHeight: 18
                      }}>#{capitalizeFirstText(convertString(item.name, " ", ""))}</Text>
                      {index !== topicSearch.length - 1 && (
                        <View style={{ height: 1, marginTop: 5, backgroundColor: '#C4C4C4' }} />
                      )}
                    </View>
                  </TouchableNativeFeedback>
                )
              })}
            </Card>
          )
        }


        {isLinkPreviewShown && (
          <ContentLink
            og={
              linkPreviewMeta
                ? linkPreviewMeta
                : {
                  domain: '',
                  domainImage: '',
                  title: '',
                  description: '',
                  image: '',
                  url: '',
                }
            }
          />
        )}

        {isPollShown && (
          <CreatePollContainer
            polls={polls}
            onaddpoll={() => addNewPollItem()}
            onsinglepollchanged={(item, index) =>
              onSinglePollChanged(item, index)
            }
            onremovesinglepoll={(index) => removeSinglePollByIndex(index)}
            onremoveallpoll={() => removeAllPoll()}
            ismultiplechoice={isPollMultipleChoice}
            selectedtime={selectedTime}
            ontimechanged={(timeObject) => setSelectedTime(timeObject)}
            onmultiplechoicechanged={(ismultiplechoice) =>
              setIsPollMultipleChoice(ismultiplechoice)
            }
            expiredobject={postExpired[expiredSelect].expiredobject}
          />
        )}
        <Gap style={styles.height(26)} />
        {randerComponentMedia()}
        <Gap style={styles.height(29)} />
        <Text style={styles.label}>Advanced Settings</Text>
        <Gap style={styles.height(12)} />
        <ListItem
          icon={<MemoIc_hastag width={16.67} height={16.67} />}
          topic={listTopic.length > 0}
          listTopic={renderListTopic()}
          label="Add Topics"
          labelStyle={styles.hastagText}
          onPress={() => sheetTopicRef.current.open()}
        />
        <Gap style={styles.height(16)} />
        <ListItem
          icon={<Timer width={16.67} height={16.67} />}
          label={postExpired.length === 0
            ? 'Loading...'
            : listPostExpired[expiredSelect].label}
          labelStyle={styles.listText}
          onPress={() => sheetExpiredRef.current.open()}
        />
        <Gap style={styles.height(16)} />
        <ListItem
          icon={<Location width={16.67} height={16.67} />}
          label={
            geoList.length === 0
              ? 'Loading...'
              : geoList[geoSelect].neighborhood
          }
          labelStyle={styles.listText}
          onPress={() => sheetGeoRef.current.open()}
        />
        <Gap style={styles.height(16)} />
        <ListItem
          icon={<World width={16.67} height={16.67} />}
          label={listPrivacy.length === 0
            ? 'Loading...'
            : listPrivacy[privacySelect].label}
          labelStyle={styles.listText}
          onPress={() => sheetPrivacyRef.current.open()}
        />
        <Gap style={styles.height(16)} />
        <Text style={styles.desc}>
          Your post targets{' '}
          <Text style={styles.userTarget}>~ {audienceEstimations}</Text> users.
        </Text>
        <Gap style={styles.height(25)} />
        {isPollShown ? (
          <Button
            disabled={isPollButtonDisabled()}
            onPress={() => sendPollPost()}>
            Post
          </Button>
        ) : (
          <Button onPress={() => postTopic()}>Post</Button>
        )}
        <Gap style={styles.height(18)} />
        <SheetMedia
          refMedia={sheetMediaRef}
          medias={mediaStorage}
          uploadFromMedia={() => uploadMediaFromLibrary()}
          takePhoto={() => takePhoto()}
          createPoll={() => createPoll()}
        />
        <SheetAddTopic
          refTopic={sheetTopicRef}
          onAdd={(v) => onSaveTopic(v)}
          topics={listTopic}
          onClose={() => sheetTopicRef.current.close()}
          saveOnClose={(v) => setListTopic(v)}
        />
        <SheetExpiredPost
          refExpired={sheetExpiredRef}
          data={postExpired}
          select={expiredSelect}
          onSelect={onSetExpiredSelect}
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
      </ScrollView>
      <Loading visible={loading} />
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    backgroundColor: colors.lightgrey,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 100,
    justifyContent: 'flex-start',
    overflow: 'scroll',
  },
  hastagText: {
    color: colors.gray1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
  },
  listText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.inter[400],
  },
  label: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
  },
  desc: { fontSize: 14, fontFamily: fonts.poppins[400] },
  labelButtonAddMedia: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    fontWeight: 'bold',
  },
  listTopic: {
    flexDirection: 'row',
    marginLeft: 10,
    zIndex: 999,
    paddingTop: 11,
    paddingBottom: 13,
  },
  userTarget: {
    color: colors.bondi_blue,
    fontSize: 14,
    fontFamily: fonts.poppins[400],
  },
  height: (height) => ({
    height,
  }),
});
