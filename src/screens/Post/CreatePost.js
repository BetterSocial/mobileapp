import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
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
import analytics from '@react-native-firebase/analytics';
import CreatePollContainer from '../../elements/Post/CreatePollContainer';

const MemoShowMedia = React.memo(ShowMedia, compire);
function compire(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const CreatePost = () => {
  const sheetMediaRef = useRef();
  const sheetTopicRef = useRef();
  const sheetExpiredRef = useRef();
  const sheetGeoRef = useRef();
  const sheetPrivacyRef = useRef();
  const [mediaStorage, setMediaStorage] = useState([]);
  const [topic, setTopic] = useState('');
  const [listTopic, setListTopic] = useState([]);
  const [isPollShown, setIsPollShown] = useState(true)
  const [polls, setPolls] = useState([])
  const [postExpired, setPostExpired] = useState([
    '24 hours',
    '7 days',
    '30 days',
    'Never',
  ]);
  const [expiredSelect, setExpiredSelect] = useState(1);
  const [geoList, setGeoList] = useState([
    'Everywhere',
    'Massachusetts',
    'Cambridge',
  ]);
  const [geoSelect, setGeoSelect] = useState(0);
  let listPrivacy = [
    {
      icon: <MemoIc_world height={16.67} width={16.67} />,
      label: 'Public',
      desc: 'Anyone in your geographic target area can see your post',
    },
    {
      icon: <MemoIc_user_group height={16.67} width={16.67} />,
      label: 'People I follow',
      desc: 'Only those you follow in your geographic area can see ',
    },
  ];
  const [privacySelect, setPrivacySelect] = useState(0);
  const [message, setMessage] = useState('');
  const [dataImage, setDataImage] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChooseUsername',
      screen_name: 'ChooseUsername',
    });
  }, []);
  useEffect(() => {
    // BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      // BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, [message]);
  const uploadMediaFromLibrary = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.uri) {
        let newArr = {
          id: mediaStorage.length,
          data: res.base64,
        };
        setMediaStorage((val) => [...val, newArr]);
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
          data: res.base64,
        };
        setMediaStorage((val) => [...val, newArr]);
        sheetMediaRef.current.close();
      } else {
        console.log(res);
      }
    });
    // console.log(mediaStorage);
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
    console.log('topic ', v);
  };
  const randerComponentMedia = () => {
    if (isPollShown) return <View/>
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
    setIsPollShown(true)
    sheetMediaRef.current.close()
  }

  const removeAllPoll = () => {
    Alert.alert(
      "Are you sure",
      "Removing the poll will discard what you've typed.",
      [
        {text : "Cancel", style: 'cancel'},
        {text : "Remove", onPress:() => { 
          setIsPollShown(false)
          setPolls([])
        }},
      ])
  }

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
        <Header title="Create a post" />
        <UserProfile />
        <Gap style={{height: 8}} />
        <TextInput
          multiline={true}
          style={styles.input}
          textAlignVertical="top"
          placeholder={
            'What’s on your mind?\nRemember to be respectful .\nDownvotes  & Blocks harm all your posts’ visibility.'
          }
        />

        { isPollShown && 
          <CreatePollContainer
            onremoveallpoll={() => removeAllPoll()}/> }
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
          label={postExpired[expiredSelect]}
          labelStyle={styles.listText}
          onPress={() => sheetExpiredRef.current.open()}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<Location width={16.67} height={16.67} />}
          label={geoList[geoSelect]}
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
          Your post targets <Text style={styles.userTarget}>~27.000</Text>{' '}
          users.
        </Text>
        <Gap style={{height: 25}} />
        <Button>Post</Button>
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
          onAdd={() => submitTopic()}
          topic={topic}
          onChangeTextTopic={(v) => setTopic(v)}
          listTopic={listTopic}
          removeTopic={removeTopic}
        />
        <SheetExpiredPost
          refExpired={sheetExpiredRef}
          data={postExpired}
          select={expiredSelect}
          onSelect={setExpiredSelect}
        />
        <SheetGeographic
          geoRef={sheetGeoRef}
          data={geoList}
          select={geoSelect}
          onSelect={setGeoSelect}
        />
        <SheetPrivacy
          privacyRef={sheetPrivacyRef}
          data={listPrivacy}
          select={privacySelect}
          onSelect={setPrivacySelect}
        />
      </ScrollView>
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
    height: 246,
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
