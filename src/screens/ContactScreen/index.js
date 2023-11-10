/* eslint-disable no-param-reassign */
import * as React from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {debounce} from 'lodash';
import {generateRandomId} from 'stream-chat-react-native-core';
import {showMessage} from 'react-native-flash-message';
import PropTypes from 'prop-types';
import ContactPreview from './elements/ContactPreview';
import Header from '../../components/Header/HeaderContact';
import ItemUser from './elements/ItemUser';
import SearchRecyclerView from './elements/SearchRecyclerView';
import StringConstant from '../../utils/string/StringConstant';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {Loading} from '../../components';
import {Search} from './elements';
import {setChannel} from '../../context/actions/setChannel';
import {userPopulate} from '../../service/users';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import useCreateChat from '../../hooks/screen/useCreateChat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';

const {width} = Dimensions.get('screen');

const ContactScreen = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [profile] = React.useContext(Context).profile;
  const [, dispatchChannel] = React.useContext(Context).channel;
  const [client] = React.useContext(Context).client;
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataProvider, setDataProvider] = React.useState(null);
  const [cacheUsers, setCacheUser] = React.useState([]);
  const [text, setText] = React.useState(null);
  const [debouncedText, setDebouncedText] = React.useState('');
  const [followed, setFollowed] = React.useState([profile.myProfile.user_id]);
  const [usernames, setUsernames] = React.useState([profile.myProfile.username]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [isLoadingSearchResult, setIsLoadingSearchResult] = React.useState(false);
  const {createSignChat} = useCreateChat();
  const debounced = React.useCallback(
    debounce((changedText) => {
      // handleSearch(changedText)
      setDebouncedText(changedText);
    }, 1000),
    []
  );

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
      }
    };
    getUserPopulate();
  }, []);

  React.useEffect(() => {
    if (users.length > 0) {
      const dProvider = new DataProvider((row1, row2) => row1 !== row2);
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
              case VIEW_TYPE_DATA:
                dim.width = width;
                dim.height = 72;
                break;

              case VIEW_TYPE_LABEL:
              default:
                dim.width = width;
                dim.height = 40;
                break;
            }
          }
        )
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
      const mappingUserName = selectedUsers?.map((user) => user?.username).join(',');
      const dataSelected = {
        user: {
          name: mappingUserName,
          image: DEFAULT_PROFILE_PIC_PATH
        }
      };
      createSignChat(followed, dataSelected);
    } catch (e) {
      console.log(e, 'error signed chat');
    }
  };

  const rowRenderer = (type, item, index, extendedState) => (
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
  const handleSelected = (value) => {
    const copyFollowed = [...followed];
    const copyUsername = [...usernames];
    const copyUsers = [...selectedUsers];
    const index = copyFollowed.indexOf(value.user_id);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value.user_id);
    }

    const indexName = copyUsername.indexOf(value.username);
    if (indexName > -1) {
      copyUsername.splice(index, 1);
    } else {
      copyUsername.push(value.username);
    }

    const indexSelectedUser = copyUsers.findIndex((item) => item.user_id === value.user_id);
    if (indexSelectedUser > -1) {
      copyUsers.splice(indexSelectedUser, 1);
    } else {
      copyUsers.push(value);
    }

    setSelectedUsers(copyUsers);
    setFollowed(copyFollowed);
    setUsernames(copyUsername);
  };

  const onRefresh = React.useCallback(async () => {
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

  const setDefaultPopulateUsers = () => {
    setUsers(cacheUsers);
  };

  const onSearchTextChange = (changedText) => {
    setText(changedText);
    if (changedText.length > 0) {
      debounced(changedText);
    } else {
      debounced.cancel();
      setDefaultPopulateUsers();
    }

    setIsSearchMode(changedText.length > 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <StatusBar translucent={false} />
        <Header
          title={StringConstant.chatTabHeaderCreateChatButtonText}
          containerStyle={styles.containerStyle}
          subTitle={'Next'}
          onPressSub={() => handleCreateChannel()}
          onPress={() => navigation.goBack()}
          disabledNextBtn={selectedUsers.length <= 0}
        />

        <Search
          text={text}
          style={styles.containerStyle}
          onChangeText={onSearchTextChange}
          onClearText={() => onSearchTextChange('')}
          isLoading={isLoadingSearchResult}
          // onPress={handleSearch}
        />

        <View>
          {selectedUsers && (
            <ContactPreview users={selectedUsers} onPress={(user) => handleSelected(user)} />
          )}
        </View>

        {isRecyclerViewShown && !isSearchMode && (
          <RecyclerListView
            style={styles.recyclerview}
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            extendedState={{
              followed
            }}
            rowRenderer={rowRenderer}
            scrollViewProps={{
              refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }}
          />
        )}

        {isSearchMode && (
          <SearchRecyclerView
            text={debouncedText}
            followed={followed}
            selectedUsers={selectedUsers}
            usernames={usernames}
            setLoading={setIsLoadingSearchResult}
            onHandleSelected={(value) => handleSelected(value)}
          />
        )}
        <Loading visible={loading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  recyclerview: {
    // paddingBottom: 100,
    // height: height - 180,
    flex: 1
  },
  containerStyle: {
    marginHorizontal: 16
  },
  subtitleStyle: (selectedUsers) => ({
    color: selectedUsers.length > 0 ? COLORS.holyTosca : COLORS.gray4,
    marginEnd: 8
  })
});

ContactScreen.propTypes = {
  navigation: PropTypes.object
};

export default withInteractionsManaged(ContactScreen);
