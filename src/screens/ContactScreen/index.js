import * as React from 'react';
import PropTypes from 'prop-types';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import SimpleToast from 'react-native-simple-toast';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
/* eslint-disable no-param-reassign */
import {debounce} from 'lodash';
import axios from 'axios';
import {useRoute} from '@react-navigation/core';
import ContactPreview from './elements/ContactPreview';
import Header from '../../components/Header/HeaderContact';
import ItemUser from './elements/ItemUser';
import Label from './elements/Label';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import useCreateChat from '../../hooks/screen/useCreateChat';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH, NavigationConstants} from '../../utils/constants';
import {Loading, Header as HeaderGeneral} from '../../components';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import {Search} from './elements';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {ProgressBar} from '../../components/ProgressBar';
import {ANONYMOUS} from '../../hooks/core/constant';
import DiscoveryRepo from '../../service/discovery';
import DiscoveryAction from '../../context/actions/discoveryAction';
import useGroupInfo from '../GroupInfo/hooks/useGroupInfo';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import MemoIc_share from '../../assets/icons/Ic_share';
import dimen from '../../utils/dimen';
import {Button} from '../../components/Button';
import {inviteCommunityMember} from '../../service/topics';

const {width} = Dimensions.get('screen');

const ContactScreen = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [usersSearch, setUsersSearch] = React.useState([]);
  const [profile] = React.useContext(Context).profile;
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [isRecyclerViewShownSearch, setIsRecyclerViewShownSearch] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [dataProvider, setDataProvider] = React.useState(null);
  const [layoutProviderSearch, setLayoutProviderSearch] = React.useState(() => {});
  const [dataProviderSearch, setDataProviderSearch] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [text, setText] = React.useState('');
  const [followed, setFollowed] = React.useState([profile.myProfile.user_id]);
  const [usernames, setUsernames] = React.useState([profile.myProfile.username]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [userPage, setUserPage] = React.useState({
    currentPage: 1,
    limitPage: 1
  });
  const [isLoadingSearchResult, setIsLoadingSearchResult] = React.useState(false);
  const {createSignChat, createAnonymousChat, loadingCreateChat} = useCreateChat();
  const [discoveryData, discoveryDispatch] = React.useContext(Context).discovery;
  const cancelTokenRef = React.useRef(axios.CancelToken.source());
  const route = useRoute();
  const {
    from: sourceScreen,
    isAddParticipant,
    channelId,
    existParticipants,
    isCreateCommunity,
    topicCommunityId,
    topicCommunityName
  } = route?.params || {};
  const isAnon = sourceScreen === ANONYMOUS;
  const VIEW_TYPE_LABEL = 1;
  const VIEW_TYPE_DATA = 2;
  const newChatTitleScreen = isAnon
    ? StringConstant.chatTabHeaderCreateAnonChatButtonText
    : StringConstant.chatTabHeaderCreateChatButtonText;

  const {onAddMember, isLoadingAddMember} = useGroupInfo(channelId);

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

  const handleSearch = async (searchText) => {
    try {
      setIsLoadingSearchResult(true);

      const cancelToken = cancelTokenRef?.current?.token;
      const data = await DiscoveryRepo.fetchDiscoveryDataUser(searchText, isAnon, {cancelToken});
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
        setUsersSearch(
          dataUser?.filter((item) =>
            isAddParticipant ? !existParticipants.includes(item.username) : item
          )
        );
      }
      setIsLoadingSearchResult(false);
    } catch (error) {
      setIsLoadingSearchResult(false);
    }
  };

  const debounced = React.useCallback(
    debounce((changedText) => {
      handleSearch(changedText);
    }, 1000),
    []
  );

  React.useEffect(() => {
    if (text.length === 0) {
      try {
        setLoading(true);
        getDiscoveryUser();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  }, [text]);

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
    if (usersSearch.length > 0) {
      const dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProviderSearch(
        new LayoutProvider(
          (index) => {
            if (usersSearch.length < 1) {
              return 0;
            }
            if (usersSearch[index].viewtype === 'label') {
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
              default:
                dim.width = width;
                dim.height = 72;
                break;
            }
          }
        )
      );
      setDataProviderSearch(dProvider.cloneWithRows(usersSearch));
    }
  }, [usersSearch]);

  React.useEffect(() => {
    if (dataProvider) {
      setIsRecyclerViewShown(true);
    }
  }, [dataProvider]);

  React.useEffect(() => {
    if (dataProviderSearch) {
      setIsRecyclerViewShownSearch(true);
    }
  }, [dataProviderSearch]);

  const handleCreateChannel = async () => {
    try {
      const mappingUserName = selectedUsers?.map((user) => user?.username).join(', ');
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
    if (!isLoadingAddMember) {
      onAddMember(selectedUsers);
    }
  };

  const handleInviteCommunityMember = async () => {
    if (selectedUsers.length > 0) {
      try {
        const response = await inviteCommunityMember(
          topicCommunityId.toString(),
          selectedUsers?.map((user) => user?.user_id)
        );
        if (response.success) {
          navigation.replace(NavigationConstants.CREATE_POST_SCREEN, {
            isCreateCommunity: true,
            topic: topicCommunityName
          });
        } else {
          SimpleToast.show(response?.message, SimpleToast.SHORT);
        }
      } catch (e) {
        if (__DEV__) {
          console.log('error handleInviteCommunityMember: ', e);
        }
      }
    } else {
      navigation.push(NavigationConstants.CREATE_POST_SCREEN, {
        isCreateCommunity: true,
        topic: topicCommunityName
      });
    }
  };

  const onCommunityShare = () => {
    ShareUtils.shareCommunity(topicCommunityName);
  };

  const rowRendererSearch = (type, item, index, extendedState) => {
    switch (type) {
      case VIEW_TYPE_LABEL:
        return <Label label={item?.label} />;
      case VIEW_TYPE_DATA:
      default:
        return (
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
    }
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
      setUsersSearch([]);
      debounced.cancel();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      {isCreateCommunity ? (
        <Header
          title="Create Community"
          onPress={() => navigation.goBack()}
          titleStyle={{
            alignSelf: 'center'
          }}
          containerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray210,
            marginHorizontal: 16
          }}
        />
      ) : (
        <Header
          title={isAddParticipant ? 'Add Participants' : newChatTitleScreen}
          containerStyle={styles.containerStyle}
          subTitle={'Next'}
          subtitleStyle={selectedUsers.length > 0 && styles.subtitleStyle(isAnon)}
          onPressSub={() => (isAddParticipant ? handleAddParticipant() : handleCreateChannel())}
          onPress={() => navigation.goBack()}
          disabledNextBtn={selectedUsers.length <= 0}
        />
      )}

      {isCreateCommunity && (
        <View style={styles.containerHeader}>
          <ProgressBar isStatic={true} value={100} />
          <TouchableOpacity style={styles.info} onPress={onCommunityShare}>
            <View style={styles.iconCircle}>
              <MemoIc_share height={20} width={21} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.title}>Share invitation link</Text>
              <Text style={styles.desc}>Who is interested in your community?</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <Search
        text={text}
        style={[isCreateCommunity ? {borderBottomWidth: 0, borderTopWidth: 0} : {}]}
        onChangeText={onSearchTextChange}
        onClearText={() => onSearchTextChange('')}
        isLoading={isLoadingSearchResult}
      />

      {!isAnon && (
        <View>
          {selectedUsers && (
            <ContactPreview users={selectedUsers} onPress={(user) => handleSelected(user)} />
          )}
        </View>
      )}

      {isRecyclerViewShown && usersSearch.length <= 0 && !isLoadingSearchResult && (
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
                tintColor={COLORS.white}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            )
          }}
        />
      )}

      {isRecyclerViewShownSearch && usersSearch.length > 0 && !isLoadingSearchResult && (
        <RecyclerListView
          style={styles.recyclerview}
          layoutProvider={layoutProviderSearch}
          dataProvider={dataProviderSearch}
          extendedState={{
            followed
          }}
          rowRenderer={rowRendererSearch}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                tintColor={COLORS.white}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            )
          }}
        />
      )}

      {isLoadingSearchResult && <LoadingWithoutModal />}
      <Loading visible={loading || loadingCreateChat || isLoadingAddMember} />
      {isCreateCommunity && (
        <View style={styles.footer}>
          <View style={styles.textSmallContainer}>
            <Text style={styles.textSmall}>
              You{"'"}ll appear as the first member of this community. You can switch your
              membership to incognito at any time from the community page.
            </Text>
          </View>
          <Button onPress={handleInviteCommunityMember}>Next</Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: COLORS.almostBlack,
    flex: 1
  },
  recyclerview: {
    // paddingBottom: 100,
    // height: height - 180,
    flex: 1
  },
  containerHeader: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 10
  },
  containerStyle: {
    marginHorizontal: 16
  },
  subtitleStyle: (isAnon) => ({
    color: isAnon ? COLORS.anon_primary : COLORS.signed_primary
  }),
  info: {
    flexDirection: 'row',
    marginTop: dimen.normalizeDimen(16)
  },
  iconCircle: {
    backgroundColor: COLORS.signed_primary,
    borderRadius: 100,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimen.normalizeDimen(8)
  },
  title: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(16),
    color: COLORS.signed_primary
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray510,
    marginTop: dimen.normalizeDimen(4)
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: dimen.normalizeDimen(112),
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontSize: normalizeFontSize(10),
    fontFamily: fonts.inter[400],
    textAlign: 'center',
    color: COLORS.gray510
  }
});

ContactScreen.propTypes = {
  navigation: PropTypes.object
};

export default withInteractionsManaged(ContactScreen);
