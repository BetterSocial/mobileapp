import * as React from 'react';
import uuid from 'react-native-uuid';
import { Alert } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { generateRandomId } from 'stream-chat-react-native-core';
import { showMessage } from 'react-native-flash-message';

import ContactPreview from './elements/ContactPreview';
import Header from './elements/Header';
import ItemUser from './elements/ItemUser';
import StringConstant from '../../utils/string/StringConstant';
import { COLORS, SIZES } from '../../utils/theme';
import { Context } from '../../context';
import { Loading } from '../../components';
import { Search } from './elements';
import { setChannel } from '../../context/actions/setChannel';
import { userPopulate } from '../../service/users';

const width = Dimensions.get('screen').width;

const ContactScreen = ({ navigation }) => {
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [profile] = React.useContext(Context).profile;
  const [channel, dispatchChannel] = React.useContext(Context).channel;
  const [client, setClient] = React.useContext(Context).client;
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => { });
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataProvider, setDataProvider] = React.useState(null);
  const [followed, setFollowed] = React.useState([profile.myProfile.user_id]);
  const [cacheUsers, setCacheUser] = React.useState([]);
  const [text, setText] = React.useState(null);
  const [usernames, setUsernames] = React.useState([profile.myProfile.username]);

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
                dim.height = 72;
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
      if (followed.length < 1) {
        Alert.alert('Warning', 'Please choose min one user');
      }
      setLoading(true);
      let members = followed;
      let channelName = usernames;
      let typeChannel = 0;

      if (members.length > 2) {
        typeChannel = 1;
      }
      const clientChat = await client.client;
      const filter = { type: 'messaging', members: { $eq: members } };
      const sort = [{ last_message_at: -1 }];
      console.log(filter)
      const findChannels = await clientChat.queryChannels(filter, sort, {
        watch: true,
        state: true,
      });

      console.log('query channel done')

      let generatedChannelId = generateRandomId();
      let memberWithRoles = members.map((item, index) => {
        return {
          user_id: item,
          channel_role: "channel_moderator",
        }
      });

      if (findChannels.length > 0) {
        setChannel(findChannels[0], dispatchChannel);
      } else {
        const channelChat = await clientChat.channel(
          'messaging',
          generatedChannelId,
          {
            name: channelName.join(', '),
            type_channel: typeChannel,
          },
        );
        let err = await channelChat.create();
        await channelChat.addMembers(memberWithRoles)
        setChannel(channelChat, dispatchChannel);
      }
      setFollowed([profile.user_id]);
      setUsernames([profile.username]);
      setLoading(false);
      await navigation.replace('ChatDetailPage');
    } catch (error) {
      console.log('errror create chat', error);
      showMessage({
        message: 'Failed creating new chat',
        type: 'danger',
      });
      setLoading(false);
    }
  };

  const rowRenderer = (type, item, index, extendedState) => {
    // switch (type) {
    // case VIEW_TYPE_LABEL:
    //   return <Label label={item.name} />;
    // case VIEW_TYPE_DATA:
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
    // }
  };

  const handleSelected = (value) => {
    let copyFollowed = [...followed];
    let copyUsername = [...usernames];
    let copyUsers = [...selectedUsers];
    let index = copyFollowed.indexOf(value.user_id);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value.user_id);
    }

    let indexName = copyUsername.indexOf(value.username);
    if (indexName > -1) {
      copyUsername.splice(index, 1);
    } else {
      copyUsername.push(value.username);
    }

    let indexSelectedUser = copyUsers.indexOf(value);
    if (indexSelectedUser > -1) {
      copyUsers.splice(indexSelectedUser, 1);
    } else {
      copyUsers.push(value);
    }

    setSelectedUsers(copyUsers);
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
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <Header
        title={StringConstant.chatTabHeaderCreateChatButtonText}
        containerStyle={styles.containerStyle}
        subTitle={'Next'}
        subtitleStyle={styles.subtitleStyle}
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

      <View>
        {selectedUsers && (
          <ContactPreview
            users={selectedUsers}
            onPress={(user) => handleSelected(user)}
          />
        )}
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  recyclerview: {
    paddingBottom: 80,
    height: '100%',
  },
  containerStyle: {
    marginHorizontal: 16,
  },
  subtitleStyle: {
    color: COLORS.holyTosca,
    marginEnd: 8,
  },
});

export default ContactScreen;
