import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';
import jwtDecode from 'jwt-decode';

import {createChannel} from '../../service/chat';

import {Avatar, Gap} from '../../components';
import {COLORS, SIZES} from '../../utils/theme';
import StringConstant from '../../utils/string/StringConstant';
import Header from './elements/Header';
import {getAccessToken} from '../../utils/token';
import {Search, RenderItem} from './elements';
import MemoIc_Checklist from '../../assets/icons/Ic_Checklist';

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
  {
    id: '5f3ac81e-bcde-490b-b82c-a37e138869bc',
    name: 'bayu',
    icon: 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
  },
  {
    id: 'ef6034d3-4b73-417b-81cb-47bd001816d5',
    name: 'lukmanfrdass',
    icon: 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
  },
];

const ContactScreen = ({navigation}) => {
  const [userId, setUserId] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  React.useEffect(() => {
    const getUserId = async () => {
      const token = await getAccessToken();
      jwtDecode;
      const id = await jwtDecode(token).user_id;
      setUserId(id);
    };
    getUserId();
  }, []);

  function isInArray(value, array) {
    return array.indexOf(value);
  }

  const handleCreateChannel = async (users) => {
    try {
      let members = DUMMY.map((item) => item.id);
      members.push(userId);
      console.log(members);
      let res = await createChannel('messaging', members, '');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header
        title={StringConstant.chatTabHeaderCreateChatButtonText}
        containerStyle={{marginHorizontal: 16}}
        subTitle={'Next'}
        subtitleStyle={{color: COLORS.holyTosca}}
        onPressSub={() => handleCreateChannel(selectedUsers)}
        onPress={() => navigation.goBack()}
      />

      <Search style={{marginHorizontal: 16}} />

      <View style={{marginTop: SIZES.base}}>
        <FlatList
          data={DUMMY}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  let isAvailable = isInArray(item, selectedUsers);
                  if (isAvailable > -1) {
                    selectedUsers.splice(isAvailable, 1);
                    setSelectedUsers(selectedUsers);
                  } else {
                    selectedUsers.push(item);
                    setSelectedUsers(selectedUsers);
                  }
                }}
                style={{
                  paddingHorizontal: SIZES.base * 2,
                  flexDirection: 'row',
                  paddingVertical: SIZES.base,
                  backgroundColor:
                    isInArray(item, selectedUsers) > -1
                      ? 'rgba(0, 173, 181, 0.15)'
                      : '#FFFFFF',
                }}>
                <Avatar image={item.icon} />
                <Gap width={SIZES.base * 2} />
                <View style={{justifyContent: 'center'}}>
                  <Text>{item.name}</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flex: 1,
                  }}>
                  {isInArray(item, selectedUsers) > -1 ? (
                    <MemoIc_Checklist />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ContactScreen;
