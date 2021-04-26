import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from '../../components/Header';
import {Button, ButtonAddMedia} from '../../components/Button';
import UserProfile from '../../elements/Post/UserProfile';
import {colors} from '../../utils/colors';
import Gap from '../../components/Gap';
import ListItem from '../../components/MenuPostItem';
import MemoIc_hastag from '../../assets/icons/Ic_hastag';
import Timer from '../../assets/icons/Ic_timer';
import Location from '../../assets/icons/Ic_location';
import World from '../../assets/icons/Ic_world';
import {fonts} from '../../utils/fonts';
import SheetMedia from '../../elements/Post/SheetMedia';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ShowMedia from '../../elements/Post/ShowMedia';
import SheetAddTopic from '../../elements/Post/SheetAddTopic';
import TopicItem from '../../components/TopicItem';
import SheetExpiredPost from '../../elements/Post/SheetExpiredPost';
import SheetGeographic from '../../elements/Post/SheetGeographic';
import SheetPrivacy from '../../elements/Post/SheetPrivacy';
import MemoIc_world from '../../assets/icons/Ic_world';
import MemoIc_user_group from '../../assets/icons/Ic_user_group';
import SheetCloseBtn from '../../elements/Post/SheetCloseBtn';
import {useNavigation} from '@react-navigation/core';
import {createPost, ShowingAudience} from '../../service/post';
import Loading from '../Loading';
import {showMessage} from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';
import CreatePollContainer from '../../elements/Post/CreatePollContainer';
import {
  MAX_POLLING_ALLOWED,
  MIN_POLLING_ALLOWED,
} from '../../helpers/constants';
import {createPollPost} from '../../service/post';
import {getAccessToken, getToken} from '../../data/local/accessToken';
import JWTDecode from 'jwt-decode';
import {getMyProfile} from '../../service/profile';
import ProfileDefault from '../../assets/images/ProfileDefault.png';
// import CreatePollContainer from '../../elements/Post/CreatePollContainer';
const MemoShowMedia = React.memo(ShowMedia, compire);
function compire(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const CreatePost = () => {
  let defaultPollItem = [{text: ''}, {text: ''}];
  const navigation = useNavigation();
  const sheetMediaRef = useRef();
  const sheetTopicRef = useRef();
  const sheetExpiredRef = useRef();
  const sheetGeoRef = useRef();
  const sheetPrivacyRef = useRef();
  const sheetBackRef = useRef();

  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [mediaStorage, setMediaStorage] = useState([]);
  const [topic, setTopic] = useState('');
  const [listTopic, setListTopic] = useState([]);
  const [isPollShown, setIsPollShown] = useState(false);
  const [polls, setPolls] = useState([...defaultPollItem]);
  const [isPollMultipleChoice, setIsPollMultipleChoice] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    day: 1,
    hour: 0,
    minute: 0,
  });

  const [expiredSelect, setExpiredSelect] = useState(1);
  const [postExpired, setPostExpired] = useState([
    {
      label: '24 hours',
      value: '24',
    },
    {
      label: '7 days',
      value: '7',
    },
    {
      label: '30 days',
      value: '30',
    },
    {
      label: 'Never',
      value: 'never',
    },
  ]);
  // const [geoList, setGeoList] = useState([
  //   'Everywhere',
  //   'Massachusetts',
  //   'Cambridge',
  // ]);
  const [geoList, setGeoList] = useState([]);
  let location = [
    {
      location_id: 'everywhere',
      neighborhood: 'Everywhere',
    },
  ];
  const [geoSelect, setGeoSelect] = useState(0);
  let listPrivacy = [
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
  const [audienceEstimations, setAudienceEstimations] = useState(0);
  const [privacySelect, setPrivacySelect] = useState(0);
  const [dataImage, setDataImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeUser, setTypeUser] = useState(false);
  const [dataProfile, setDataProfile] = useState({});

  const fetchMyProfile = async () => {
    setLoading(true);
    let token = await getAccessToken();
    if (token) {
      var decoded = await JWTDecode(token);
      const result = await getMyProfile(decoded.user_id);
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

        // setGeoList((val) => [...val, result.data.locations]);
        // (val) => [...val, topic];
        // console.log('isi result ', result.data.locations);
      }

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyProfile();
    analytics().logScreenView({
      screen_class: 'ChooseUsername',
      screen_name: 'ChooseUsername',
    });
  }, []);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, [message]);
  const getEstimationsAudience = async (privacy, location) => {
    const data = await ShowingAudience(privacy, location);
    setAudienceEstimations(data.data);
    console.log('count ', data.data);
  };
  const uploadMediaFromLibrary = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
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
  };
  const takePhoto = () => {
    launchCamera({mediaType: 'photo', includeBase64: true}, (res) => {
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
  };
  const onRemoveItem = (v) => {
    let deleteItem = mediaStorage.filter((item) => item.id !== v);
    setMediaStorage(deleteItem);
  };

  const onRemoveAllMedia = () => {
    setMediaStorage([]);
  };
  const submitTopic = () => {
    setListTopic((val) => [...val, topic]);
    setTopic('');
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
  const onBack = () => {
    console.log(message);
    if (message) {
      sheetBackRef.current.open();
      return true;
    }
    console.log('back = ', message);
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
          message: 'Post messages cannot be empty',
          type: 'danger',
        });
        return true;
      }
      if (listTopic.length === 0) {
        showMessage({
          message: 'topic cannot be empty',
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
      let res = await createPost(data);
      if (res.code === 200) {
        showMessage({
          message: 'success create a new post',
          type: 'success',
        });
        setLoading(false);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        setLoading(false);
        showMessage({
          message: 'failed to create new posts',
          type: 'danger',
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'failed to create new posts',
        type: 'danger',
      });
      setLoading(false);
    }
  };
  const randerComponentMedia = () => {
    if (isPollShown) return <View />;
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
    if (isPollNotEmpty)
      return Alert.alert(
        'Are you sure',
        "Removing the poll will discard what you've typed.",
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            onPress: () => {
              setIsPollShown(false);
              setPolls(defaultPollItem);
            },
          },
        ],
      );
    else {
      setIsPollShown(false);
      setPolls(defaultPollItem);
    }
  };

  const addNewPollItem = () => {
    if (polls.length >= MAX_POLLING_ALLOWED) return;
    setPolls([...polls, {text: ''}]);
  };

  const removeSinglePollByIndex = (index) => {
    if (polls.length <= MIN_POLLING_ALLOWED) return;
    polls.splice(index, 1);
    setPolls([...polls]);
  };

  const onSinglePollChanged = (item, index) => {
    polls[index] = item;
    setPolls([...polls]);
  };

  const isPollButtonDisabled = () => {
    let reducedPoll = polls.reduce((acc, current) => {
      if (current.text !== '') acc.push(current);
      return acc;
    }, []);

    return reducedPoll.length < 2;
  };

  const sendPollPost = async () => {
    setLoading(true);
    let reducedPoll = polls.reduce((acc, current) => {
      if (current.text !== '') acc.push(current);
      return acc;
    }, []);

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
      polls: reducedPoll,
      pollsduration: selectedTime,
      multiplechoice: isPollMultipleChoice,
    };

    try {
      // let createTokenResponse = await createToken()
      // if(createTokenResponse.hasOwnProperty("token")) {

      //   console.log(response)
      // }
      let response = await createPollPost(data);
      if (response.status) {
        navigation.goBack();
        setLoading(false);
      }
    } catch (e) {
      console.log('Error');
      Alert.alert('Error', 'error');
      setLoading(false);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Create a post" onPress={() => onBack()} />
        <UserProfile
          typeUser={typeUser}
          setTypeUser={setTypeUser}
          username={
            dataProfile.username ? dataProfile.username : 'Loading . . .'
          }
          photo={
            dataProfile.profile_pic_path
              ? {uri: dataProfile.profile_pic_path}
              : ProfileDefault
          }
        />
        <Gap style={{height: 8}} />
        <TextInput
          onChangeText={(v) => setMessage(v)}
          value={message}
          multiline={true}
          style={styles.input}
          textAlignVertical="top"
          placeholder={
            'What’s on your mind?\nRemember to be respectful .\nDownvotes  & Blocks harm all your posts’ visibility.'
          }
          value={message}
          onChangeText={(value) => setMessage(value)}
        />

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
          />
        )}
        <Gap style={{height: 26}} />
        {randerComponentMedia()}
        <Gap style={{height: 29}} />
        <Text style={styles.label}>Advanced Settings</Text>
        <Gap style={{height: 12}} />
        <ListItem
          icon={<MemoIc_hastag width={16.67} height={16.67} />}
          topic={listTopic.length > 0}
          listTopic={renderListTopic()}
          label="Add Topics"
          labelStyle={styles.hastagText}
          onPress={() => sheetTopicRef.current.open()}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<Timer width={16.67} height={16.67} />}
          label={postExpired[expiredSelect].label}
          labelStyle={styles.listText}
          onPress={() => sheetExpiredRef.current.open()}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<Location width={16.67} height={16.67} />}
          label={
            geoList.length == 0 ? 'Loading...' : geoList[geoSelect].neighborhood
          }
          labelStyle={styles.listText}
          onPress={() => sheetGeoRef.current.open()}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<World width={16.67} height={16.67} />}
          label={listPrivacy[privacySelect].label}
          labelStyle={styles.listText}
          onPress={() => sheetPrivacyRef.current.open()}
        />
        <Gap style={{height: 16}} />
        <Text style={styles.desc}>
          Your post targets{' '}
          <Text style={styles.userTarget}>~ {audienceEstimations}</Text> users.
        </Text>
        <Gap style={{height: 25}} />
        {isPollShown ? (
          <Button
            disabled={isPollButtonDisabled()}
            onPress={() => sendPollPost()}>
            Post
          </Button> /* Poll Button */
        ) : (
          <Button onPress={() => postTopic()}>Post</Button>
        )}
        <Gap style={{height: 18}} />
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
        {/* <SheetCloseBtn
          backRef={sheetBackRef}
          goBack={() => navigation.goBack()}
          continueToEdit={() => sheetBackRef.current.close()}
        /> */}
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
  desc: {fontSize: 14, fontFamily: fonts.poppins[400]},
  labelButtonAddMedia: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    fontWeight: 'bold',
  },
  listTopic: {
    flexDirection: 'row',
    marginLeft: 10,
    zIndex: 99,
    paddingTop: 11,
    paddingBottom: 13,
  },
  userTarget: {
    color: colors.bondi_blue,
    fontSize: 14,
    fontFamily: fonts.poppins[400],
  },
});
