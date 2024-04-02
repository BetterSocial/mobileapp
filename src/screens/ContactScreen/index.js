import * as React from 'react';
import PropTypes from 'prop-types';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {Dimensions, RefreshControl, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
/* eslint-disable no-param-reassign */
import {debounce} from 'lodash';
import axios from 'axios';
import {useRoute} from '@react-navigation/core';
import ContactPreview from './elements/ContactPreview';
import Header from '../../components/Header/HeaderContact';
import ItemUser from './elements/ItemUser';
import SearchRecyclerView from './elements/SearchRecyclerView';
import StringConstant from '../../utils/string/StringConstant';
import useCreateChat from '../../hooks/screen/useCreateChat';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Loading} from '../../components';
import {Search} from './elements';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {ANONYMOUS} from '../../hooks/core/constant';
import DiscoveryRepo from '../../service/discovery';
import DiscoveryAction from '../../context/actions/discoveryAction';
import useGroupInfo from '../GroupInfo/hooks/useGroupInfo';

const {width} = Dimensions.get('screen');

const ContactScreen = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [profile] = React.useContext(Context).profile;
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataProvider, setDataProvider] = React.useState(null);
  const [text, setText] = React.useState('');
  const [debouncedText, setDebouncedText] = React.useState('');
  const [followed, setFollowed] = React.useState([profile.myProfile.user_id]);
  const [usernames, setUsernames] = React.useState([profile.myProfile.username]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [userPage, setUserPage] = React.useState({
    currentPage: 1,
    limitPage: 1
  });
  const [isLoadingSearchResult, setIsLoadingSearchResult] = React.useState(false);
  const {createSignChat, createAnonymousChat, loadingCreateChat} = useCreateChat();
  const [discoveryData, discoveryDispatch] = React.useContext(Context).discovery;
  const cancelTokenRef = React.useRef(axios.CancelToken.source());
  const route = useRoute();
  const {from: sourceScreen, isAddParticipant, channelId, existParticipants} = route?.params || {};
  const isAnon = sourceScreen === ANONYMOUS;
  const VIEW_TYPE_LABEL = 1;
  const VIEW_TYPE_DATA = 2;
  const newChatTitleScreen = isAnon
    ? StringConstant.chatTabHeaderCreateAnonChatButtonText
    : StringConstant.chatTabHeaderCreateChatButtonText;

  const {onAddMember} = useGroupInfo(channelId);

  const getDiscoveryUser = async () => {
    const initialData = await DiscoveryRepo.fetchInitialDiscoveryUsers(
      50,
      parseInt(userPage.currentPage, 10),
      isAnon
    );
    setUserPage({
      currentPage: initialData.page,
      totalPage: initialData.total_page
    });
    DiscoveryAction.setDiscoveryInitialUsers(
      [...discoveryData.initialUsers, ...initialData.suggestedUsers],
      discoveryDispatch
    );
    const userData = discoveryData.initialUsers.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));

    setUsers(
      userData?.filter((item) =>
        isAddParticipant ? !existParticipants.includes(item.username) : item
      )
    );
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const cancelToken = cancelTokenRef?.current?.token;
      const data = await DiscoveryRepo.fetchDiscoveryDataUser(text, isAnon, {cancelToken});
      console.warn('data', JSON.stringify(data));
      if (data.success) {
        const followedUsers =
          data?.followedUsers?.map((item) => ({
            ...item,
            following: item.user_id_follower !== null
          })) || [];
        const unfollowedUsers =
          data?.unfollowedUsers?.map((item) => ({
            ...item,
            following: item.user_id_follower !== null
          })) || [];

        const dataUser = [...followedUsers, ...unfollowedUsers];
        setUsers(
          dataUser?.filter((item) =>
            isAddParticipant ? !existParticipants.includes(item.username) : item
          )
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const debounced = React.useCallback(
    debounce((changedText) => {
      handleSearch();
      setDebouncedText(changedText);
    }, 1000),
    []
  );

  React.useEffect(() => {
    try {
      setLoading(true);
      getDiscoveryUser();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
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
                dim.height = 64;
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
      const mappingUserId = selectedUsers?.map((user) => user?.user_id).join(',');
      let image = DEFAULT_PROFILE_PIC_PATH;
      if (selectedUsers.length === 1) {
        image = selectedUsers[0]?.profile_pic_path;
      }
      const dataSelected = {
        user: {
          name: mappingUserName,
          image,
          userId: mappingUserId
        }
      };
      if (isAnon) {
        createAnonymousChat(dataSelected);
      } else {
        createSignChat(followed, dataSelected, 'CONTACT_SCREEN');
      }
    } catch (e) {
      console.log(e, 'error signed chat');
    }
  };

  const handleAddParticipant = () => {
    const newSelectedUsers = selectedUsers;
    setSelectedUsers([]);
    onAddMember(newSelectedUsers);
  };

  const rowRenderer = (type, item, index, extendedState) => (
    <ItemUser
      photo={item.profile_pic_path}
      bio={item.bio}
      username={item.username}
      followed={extendedState.followed}
      userid={item.user_id}
      isAnon={isAnon}
      onPress={() => handleSelected(item)}
    />
  );
  // }
  const handleSelected = (value) => {
    const copyFollowed = isAnon ? [] : [...followed];
    const copyUsername = isAnon ? [] : [...usernames];
    const copyUsers = isAnon ? [] : [...selectedUsers];
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
      getDiscoveryUser();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  }, []);

  const onSearchTextChange = (changedText) => {
    setText(changedText);
    if (changedText.length > 0) {
      debounced(changedText);
    } else {
      debounced.cancel();
    }

    setIsSearchMode(changedText.length > 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <Header
        title={isAddParticipant ? 'Add Participants' : newChatTitleScreen}
        containerStyle={styles.containerStyle}
        subTitle={'Next'}
        subtitleStyle={selectedUsers.length > 0 && styles.subtitleStyle(isAnon)}
        onPressSub={() => (isAddParticipant ? handleAddParticipant() : handleCreateChannel())}
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

      {!isAnon && (
        <View>
          {selectedUsers && (
            <ContactPreview users={selectedUsers} onPress={(user) => handleSelected(user)} />
          )}
        </View>
      )}

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
            refreshControl: (
              <RefreshControl
                tintColor={COLORS.white2}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            )
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
      <Loading visible={loading || loadingCreateChat} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: COLORS.white,
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
  subtitleStyle: (isAnon) => ({
    color: isAnon ? COLORS.anon_primary : COLORS.signed_primary
  })
});

ContactScreen.propTypes = {
  navigation: PropTypes.object
};

export default withInteractionsManaged(ContactScreen);
