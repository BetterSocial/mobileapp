import * as React from 'react';
import Toast from 'react-native-simple-toast';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

import ButtonAddParticipants from '../../components/Button/ButtonAddParticipants';
import EditGroup from './elements/EditGroup';
import HeaderContact from '../../components/Header/HeaderContact';
import Loading from '../Loading';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {ProfileContact} from '../../components/Items';
import {fonts} from '../../utils/fonts';
import {getChatName} from '../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../utils/permission';
import {uploadFile} from '../../service/file';

const width = Dimensions.get('screen').width;

const GroupSetting = ({navigation, route}) => {
  const [groupChatState] = React.useContext(Context).groupChat;
  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const {participants} = groupChatState;
  const {channel} = channelState;
  const [groupName, setGroupName] = React.useState(
    getChatName(route.params.username, profile.username) || 'Set Group Name',
  );
  const [countUser] = React.useState(Object.entries(participants).length);
  const [changeName, setChangeName] = React.useState(false);
  const [changeImage, setChangeImage] = React.useState(false);
  const [base64Profile, setBase64Profile] = React.useState('');
  const [urlImage, setUrlImage] = React.useState(channel?.data?.image);
  const [isLoading, setIsLoading] = React.useState(false);

  let isFocusChatName = route?.params?.focusChatName;

  const updateName = (text) => {
    setGroupName(text);
    setChangeName(true);
  };
  const submitData = async () => {
    let changeImageUrl = '';
    if (changeImage) {
      setIsLoading(true);
      try {
        let res = await uploadFile(`data:image/jpeg;base64,${base64Profile}`);
        changeImageUrl = res.data.url;
      } catch (e) {
        setIsLoading(false);
        return;
      }
    }

    if (changeName || changeImage) {
      setIsLoading(true);
      let dataEdit = {
        name: groupName,
        // ...(changeImage && {image: base64Profile}),
      };
      if (changeImage) {
        dataEdit.image = changeImageUrl;
      } else {
        if (channel?.data?.image) {
          dataEdit.image = channel?.data?.image;
        }
      }

      try {
        await channel.update(dataEdit);
        navigation.navigate('ChannelList');  
      } catch (e) {
        console.log(`error : ${e}`)
      }
      setIsLoading(false);
    } else {
      navigation.goBack();
    }
  };
  const lounchGalery = async () => {
    let {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxHeight: 500,
          maxWidth: 500,
          includeBase64: true,
        },
        (res) => {
          if (!res.didCancel) {
            setChangeImage(true);
            setBase64Profile(res.base64);
            setUrlImage(res.uri);
          }
        },
      );
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const renderHeaderSubtitleText = () => {
    if (changeImage || changeName) {
      return 'Finish';
    }
    return 'Skip';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <HeaderContact
        title={'Settings'}
        containerStyle={styles.containerHeader}
        subTitle={renderHeaderSubtitleText()}
        subtitleStyle={styles.subtitleStyle}
        onPressSub={submitData}
        onPress={() => navigation.goBack()}
      />
      <EditGroup
        imageUri={urlImage}
        editName={groupName}
        setEditName={updateName}
        onUpdateImage={lounchGalery}
        isFocusChatName={isFocusChatName}
      />
      <Loading visible={isLoading} />
      <View style={styles.users}>
        <Text style={styles.countUser}>Participants {countUser}</Text>
        <FlatList
          data={Object.keys(participants)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={{height: 72}}>
              <ProfileContact
                key={item}
                fullname={participants[item].user.name}
                photo={participants[item].user.image}
              />
            </View>
          )}
        />
      </View>
      <ButtonAddParticipants />
    </SafeAreaView>
  );
};

export default GroupSetting;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  subtitleStyle: {
    color: COLORS.holyTosca,
  },
  containerHeader: {marginLeft: 22, marginRight: 20},
  users: {
    paddingTop: 12,
    width: width,
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: COLORS.holytosca,
    marginLeft: 20,
    marginBottom: 4,
  },
});
