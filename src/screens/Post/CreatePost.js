import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Header from '../../components/Header';
import {Button, ButtonAddMedia} from '../../components/Button';
import UserProfile from '../../Elements/Post/UserProfile';
import {colors} from '../../utils/colors';
import Gap from '../../components/Gap';
import ListItem from '../../components/ListItem';
import MemoIc_hastag from '../../assets/icons/Ic_hastag';
import Timer from '../../assets/icons/Ic_timer';
import Location from '../../assets/icons/Ic_location';
import World from '../../assets/icons/Ic_world';
import {fonts} from '../../utils/fonts';
import SheetMedia from '../../Elements/Post/SheetMedia';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ShowMedia from '../../Elements/Post/ShowMedia';

const CreatePost = () => {
  const sheetMediaRef = useRef();
  const [mediaStorage, setMediaStorage] = useState([]);
  const uploadMediaFromLibrary = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
      // console.log(res.base64);
      let newArr = {
        id: mediaStorage.length,
        data: res.base64,
      };
      setMediaStorage((val) => [...val, newArr]);
      sheetMediaRef.current.close();
    });
  };
  const takePhoto = () => {
    launchCamera({mediaType: 'photo', includeBase64: true}, (res) => {
      let newArr = {
        id: mediaStorage.length,
        data: res.base64,
      };
      setMediaStorage((val) => [...val, newArr]);
      sheetMediaRef.current.close();
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
  const randerComponentMedia = () => {
    if (mediaStorage.length > 0) {
      return (
        <ShowMedia
          data={mediaStorage}
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
        <Gap style={{height: 26}} />
        {randerComponentMedia()}
        <Gap style={{height: 29}} />
        <Text style={styles.label}>Advanced Settings</Text>
        <Gap style={{height: 12}} />
        <ListItem
          icon={<MemoIc_hastag width={16.67} height={16.67} />}
          label="Add Topics"
          labelStyle={styles.hastagText}
          onPress={() => {}}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<Timer width={16.67} height={16.67} />}
          label="24 Hours"
          labelStyle={styles.listText}
          onPress={() => {}}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<Location width={16.67} height={16.67} />}
          label="Everywhere"
          labelStyle={styles.listText}
          onPress={() => {}}
        />
        <Gap style={{height: 16}} />
        <ListItem
          icon={<World width={16.67} height={16.67} />}
          label="Public"
          labelStyle={styles.listText}
          onPress={() => {}}
        />
        <Gap style={{height: 16}} />
        <Text style={styles.desc}>Your post targets {} users. </Text>
        <Gap style={{height: 25}} />
        <Button>Post</Button>
        <Gap style={{height: 18}} />
        <SheetMedia
          refMedia={sheetMediaRef}
          uploadFromMedia={() => uploadMediaFromLibrary()}
          takePhoto={() => takePhoto()}
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
});
