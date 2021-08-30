import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import jwtDecode from 'jwt-decode';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

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
import Label from './elements/Label';
import ItemUser from './elements/ItemUser';

const width = Dimensions.get('screen').width;

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
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataProvider, setDataProvider] = React.useState(null);
  const [followed, setFollowed] = React.useState([]);
  const [cacheUsers, setCacheUser] = React.useState([]);
  const [text, setText] = React.useState(null);

  const create = useClientGetstream();
  const filterItems = (needle, items) => {
    let query = needle.toLowerCase();
    let result = items.filter((item) => item.toLowerCase().indexOf(query) > -1);
    console.log(result.length);
    return result;
  };

  const VIEW_TYPE_LABEL = 1;
  const VIEW_TYPE_DATA = 2;

  React.useEffect(() => {
    const getUserId = async () => {
      const token = await getAccessToken();
      jwtDecode;
      const id = await jwtDecode(token).user_id;
      setUserId(id);
    };
    create();
    getUserId();
  }, [create, profile]);

  React.useEffect(() => {
    const getUserPopulate = async () => {
      try {
        setLoading(true);
        const res = await userPopulate();
        setUsers(res);
        setCacheUser(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getUserPopulate();
  }, []);

  React.useEffect(() => {
    if (users.length > 0) {
      let dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProvider(
        new LayoutProvider(
          (index) => {
            if (users.length < 1) {
              return 0;
            }
            if (users[index].viewtype === 'label') {
              return VIEW_TYPE_LABEL;
            }
            return VIEW_TYPE_DATA;
          },
          (type, dim) => {
            switch (type) {
              case VIEW_TYPE_LABEL:
                dim.width = width;
                dim.height = 40;
                break;

              case VIEW_TYPE_DATA:
                dim.width = width;
                dim.height = 76;
                break;

              default:
                dim.width = width;
                dim.height = 40;
            }
          },
        ),
      );
      setDataProvider(dProvider.cloneWithRows(users));
    }
  }, [users]);

  React.useEffect(() => {
    if (dataProvider) {
      setIsRecyclerViewShown(true);
    }
  }, [dataProvider]);

  function isInArray(value, array) {
    return array.indexOf(value);
  }

  const handleCreateChannel = async () => {
    try {
      if (users.length < 1) {
        Alert.alert('Warning', 'Please choose min one user');
      }
      setLoading(true);
      let members = selectedUsers;
      console.log(members);
      members.push(profile.user_id);
      console.log(members);
      let channelName = users.map((item) => {
        return item.username;
      });
      channelName.push(profile.username);
      let typeChannel = 0;

      if (members.length > 2) {
        typeChannel = 1;
      }

      const clientChat = await client.client;
      const channelChat = await clientChat.channel('messaging', {
        name: channelName,
        members: members,
        typeChannel,
      });
      await channelChat.create();
      setChannel(channelChat, dispatchChannel);
      setLoading(false);
      await navigation.navigate('ChatDetailPage');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const rowRenderer = (type, item, index, extendedState) => {
    switch (type) {
      case VIEW_TYPE_LABEL:
        return <Label label={item.name} />;
      case VIEW_TYPE_DATA:
        return (
          <ItemUser
            photo={item.profile_pic_path}
            bio={item.bio}
            username={item.username}
            followed={extendedState.followed}
            userid={item.user_id}
            onPress={() => handleSelected(item.user_id)}
          />
        );
    }
  };

  const handleSelected = (value) => {
    let copyFollowed = [...followed];
    let index = followed.indexOf(value);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value);
    }
    setFollowed(copyFollowed);
  };

  const _onRefresh = React.useCallback(() => {}, []);

  const _handleSearch = () => {
    console.log(cacheUsers);
    const newUsers = cacheUsers.filter(
      (item) => item.username.toLowerCase().indexOf(text) > -1,
    );
    setUsers(newUsers);
    setText(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title={StringConstant.chatTabHeaderCreateChatButtonText}
        containerStyle={{marginHorizontal: 16}}
        subTitle={'Next'}
        subtitleStyle={{color: COLORS.holyTosca, marginEnd: 8}}
        onPressSub={() => handleCreateChannel(selectedUsers)}
        onPress={() => navigation.goBack()}
      />

      <Search
        text={text}
        style={{marginHorizontal: 16}}
        onChangeText={(t) => {
          setText(t);
        }}
        onPress={() => _handleSearch()}
      />

      {isRecyclerViewShown && (
        <RecyclerListView
          style={styles.recyclerview}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          extendedState={{
            followed,
          }}
          rowRenderer={rowRenderer}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
            ),
          }}
        />
      )}

      <Loading visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  recyclerview: {
    marginBottom: 30,
  },
});

export default ContactScreen;
