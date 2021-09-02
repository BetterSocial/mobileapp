import * as React from 'react';
import {View, StyleSheet, RefreshControl, Dimensions} from 'react-native';

import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';
import {userPopulate} from '../../service/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';

import StringConstant from '../../utils/string/StringConstant';
import {COLORS} from '../../utils/theme';
import Header from './elements/Header';
import {Search} from './elements';
import {Alert} from 'react-native';
import Label from './elements/Label';
import ItemUser from './elements/ItemUser';
import {Loading} from '../../components';

const width = Dimensions.get('screen').width;

const ContactScreen = ({navigation}) => {
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
  const [usernames, setUsernames] = React.useState([]);

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

  const handleCreateChannel = async () => {
    try {
      console.log(followed[0]);
      if (followed.length < 1) {
        Alert.alert('Warning', 'Please choose min one user');
      }
      setLoading(true);
      let members = followed;
      members.push(profile.user_id);
      let channelName = usernames;
      channelName.push(profile.username);
      let typeChannel = 0;

      if (members.length > 2) {
        typeChannel = 1;
      }

      const clientChat = await client.client;
      const channelChat = await clientChat.channel('messaging', {
        name: channelName.toString(),
        members: members,
        typeChannel,
      });
      await channelChat.create();
      setChannel(channelChat, dispatchChannel);
      setFollowed([]);
      setUsernames([]);
      setLoading(false);
      await navigation.navigate('ChatDetailPage');
    } catch (error) {
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
            onPress={() => handleSelected(item)}
          />
        );
    }
  };

  const handleSelected = (value) => {
    let copyFollowed = [...followed];
    let copyUsername = [...usernames];
    let index = followed.indexOf(value.user_id);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value.user_id);
    }

    let indexName = usernames.indexOf(value.username);
    if (indexName > -1) {
      copyUsername.splice(index, 1);
    } else {
      copyUsername.push(value.username);
    }
    setFollowed(copyFollowed);
    setUsernames(copyUsername);
  };

  const _onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await userPopulate();
      setUsers(res);
      setCacheUser(res);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  }, []);

  const _handleSearch = () => {
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
        containerStyle={styles.containerStyle}
        subTitle={'Next'}
        subtitleStyle={{color: COLORS.holyTosca, marginEnd: 8}}
        onPressSub={() => handleCreateChannel(selectedUsers)}
        onPress={() => navigation.goBack()}
      />

      <Search
        text={text}
        style={styles.containerStyle}
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
  containerStyle: {
    marginHorizontal: 16,
  },
});

export default ContactScreen;
