import * as React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import Toast from 'react-native-simple-toast';
import { launchImageLibrary } from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';

import { createChannel } from '../../service/chat';

import { Avatar, Gap } from '../../components';
import { COLORS, FONTS, SIZES } from '../../utils/theme';
import GroupName from './elements/GroupName';
import StringConstant from '../../utils/string/StringConstant';
import Header from './elements/Header';
import { getUserId } from '../../utils/users';
import { requestExternalStoragePermission } from '../../utils/permission';

const DUMMY = [
  {
    id: '88353551-b9bd-4cf5-a89e-ce6197b880c0',
    name: 'fajarism',
    icon: 'https://res.cloudinary.com/hpjivutj2/image/upload/v1625213019/i3u9uptxnylfmfqevabf.jpg',
  },
  {
    id: 'c8a7d99d-51b5-4bb4-b9c8-cf936156f887',
    name: 'bas_v1-4',
    icon: 'http://res.cloudinary.com/hpjivutj2/image/upload/v1623291797/t4girkwj1qfqxhr72rgn.jpg',
  },
  {
    id: 'c8c39e52-5484-465c-b635-3c46384b6f2e',
    name: 'eka',
    icon: 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
  },
];

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = React.useState(null);
  const [groupIcon, setGroupIcon] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    const getUser = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    getUser();
  }, []);

  const handleImageLibrary = async () => {
    analytics().logEvent('btn_take_photo_profile', {
      id: 2,
    });
    let { success, message } = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({ mediaType: 'photo' }, (res) => {
        let image = {
          uri: res.uri,
          type: res.type, // or photo.type
          name: res.fileName,
        };
        setGroupIcon(image);
        // if (res.base64) {
        //   // setImage(`${res.base64}`, dispatch);
        //   setGroupIcon(`data:image/png;base64,${res.base64}`);
        // }
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const createNewChannel = async () => {
    try {
      const members = DUMMY.map((item) => item.id);
      members.push(userId);
      await createChannel('messaging', members, groupName);
      alert('success create group');
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={false} />
      <Header
        title={StringConstant.chatTabHeaderCreateChatButtonText}
        containerStyle={{ marginHorizontal: 16 }}
        subTitle={groupName ? 'Finish' : 'Skip'}
        subtitleStyle={{ color: COLORS.holyTosca }}
        onPressSub={() => createNewChannel()}
        onPress={() => navigation.goBack()}

      />
      <GroupName
        onPress={() => handleImageLibrary()}
        onChangeText={(text) => setGroupName(text)}
        groupIcon={groupIcon}
      />

      <View style={{ marginHorizontal: 16, marginTop: SIZES.base }}>
        <Text style={{ ...FONTS.h2, color: COLORS.holyTosca }}>Participants</Text>
      </View>

      <View style={{ marginHorizontal: 16, marginTop: SIZES.base }}>
        <FlatList
          data={DUMMY}
          renderItem={({ item, index }) => {
            return (
              <View
                key={index}
                style={{ flexDirection: 'row', marginBottom: SIZES.base * 2 }}>
                <Avatar image={item.icon} />
                <Gap width={SIZES.base} />
                <View style={{ justifyContent: 'center' }}>
                  <Text>{item.name}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default CreateGroupScreen;
