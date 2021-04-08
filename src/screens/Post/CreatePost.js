import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
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
import {createPost} from '../../service/post';
import Loading from '../Loading';
import {showMessage} from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';

const MemoShowMedia = React.memo(ShowMedia, compire);
function compire(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const CreatePost = () => {
  const navigation = useNavigation();
  const sheetMediaRef = useRef();
  const sheetTopicRef = useRef();
  const sheetExpiredRef = useRef();
  const sheetGeoRef = useRef();
  const sheetPrivacyRef = useRef();
  const sheetBackRef = useRef();
  const [mediaStorage, setMediaStorage] = useState([]);
  const [listTopic, setListTopic] = useState([]);
  const [typeUser, setTypeUser] = useState(false);
  const [postExpired, setPostExpired] = useState([
    {
      label: '24 hours',
      value: 24,
    },
    {
      label: '7 days',
      value: 7,
    },
    {
      label: '30 days',
      value: 30,
    },
    {
      label: 'Never',
      value: 'never',
    },
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
      desc: 'Only those you follow can see your post ',
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
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, [message]);
  const uploadMediaFromLibrary = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
      console.log(res);
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
      console.log(res);
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
  const removeTopic = (v) => {
    let newArr = listTopic.filter((e) => e !== v);
    setListTopic(newArr);
  };
  const onSetExpiredSelect = (v) => {
    setExpiredSelect(v);
    sheetExpiredRef.current.close();
  };
  const onSetGeoSelect = (v) => {
    setGeoSelect(v);
    sheetGeoRef.current.close();
  };
  const onSetPrivacySelect = (v) => {
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
      location: geoList[geoSelect],
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
  };
  const randerComponentMedia = () => {
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
        <UserProfile typeUser={typeUser} setTypeUser={setTypeUser} />
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
        />
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
        <Button onPress={() => postTopic()}>Post</Button>
        <Gap style={{height: 18}} />
        <SheetMedia
          refMedia={sheetMediaRef}
          uploadFromMedia={() => uploadMediaFromLibrary()}
          takePhoto={() => takePhoto()}
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
