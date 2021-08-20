import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';
import jwtDecode from 'jwt-decode';

import {createChannel} from '../../service/chat';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';

import {Avatar, Gap, Loading} from '../../components';
import {COLORS, SIZES} from '../../utils/theme';
import StringConstant from '../../utils/string/StringConstant';
import Header from './elements/Header';
import {getAccessToken} from '../../utils/token';
import {Search, RenderItem} from './elements';
import MemoIc_Checklist from '../../assets/icons/Ic_Checklist';
import {userPopulate} from '../../service/users';
import {Alert} from 'react-native';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';

const ContactScreen = ({navigation}) => {
  const [groupName, setGroupName] = React.useState(null);
  const [groupIcon, setGroupIcon] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [click, setClick] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [profile] = React.useContext(Context).profile;
  const [channel, dispatchChannel] = React.useContext(Context).channel;
  const [client, setClient] = React.useContext(Context).client;
  const create = useClientGetstream();

  React.useEffect(() => {
    const getUserId = async () => {
      const token = await getAccessToken();
      jwtDecode;
      const id = await jwtDecode(token).user_id;
      setUserId(id);
      console.log(profile);
    };
    create();
    getUserId();
  }, []);

  React.useEffect(() => {
    const getUserPopulate = async () => {
      try {
        setLoading(true);
        const res = await userPopulate();
        setUsers(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getUserPopulate();
  }, []);

  const handleImageLibrary = () => {
    analytics().logEvent('btn_take_photo_profile', {
      id: 2,
    });
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      let image = {
        uri: res.uri,
        type: res.type, // or photo.type
        name: res.fileName,
      };
      // console.log(image);
      setGroupIcon(image);
      // if (res.base64) {
      //   // setImage(`${res.base64}`, dispatch);
      //   setGroupIcon(`data:image/png;base64,${res.base64}`);
      // }
    });
  };

  function isInArray(value, array) {
    return array.indexOf(value);
  }

  const handleCreateChannel = async (users) => {
    try {
      if (users.length < 1) {
        Alert.alert('Warning', 'Please choose min one user');
      }
      setLoading(true);
      let members = users.map((item) => item.user_id);
      members.push(profile.user_id);
      let channelName = users.map((item) => {
        return item.username;
      });
      channelName.push(profile.username);

      const clientChat = await client.client;
      const channelChat = await clientChat.channel('messaging', {
        name: channelName,
        members: members,
      });
      await channelChat.create();
      setChannel(channelChat, dispatchChannel);
      setLoading(false);
      await navigation.navigate('ChannelScreen');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={StringConstant.chatTabHeaderCreateChatButtonText}
        containerStyle={{marginHorizontal: 16}}
        subTitle={'Next'}
        subtitleStyle={{color: COLORS.holyTosca}}
        onPressSub={() => handleCreateChannel(selectedUsers)}
        onPress={() => navigation.goBack()}
      />

      <Search
        style={{marginHorizontal: 16}}
        onPress={() => console.log('search users')}
      />

      <View style={{marginTop: SIZES.base}}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={item.user_id}
                onPress={() => {
                  let isAvailable = isInArray(item, selectedUsers);
                  if (isAvailable > -1) {
                    selectedUsers.splice(isAvailable, 1);
                    setSelectedUsers(selectedUsers);
                  } else {
                    selectedUsers.push(item);
                    setSelectedUsers(selectedUsers);
                  }
                  setClick(index);
                  setClick(index);
                  console.log('test');
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
                <Avatar image={item.profile_pic_path} />
                <Gap width={SIZES.base * 2} />
                <View style={{justifyContent: 'center'}}>
                  <Text>{item.username}</Text>
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

      <Loading visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default ContactScreen;
