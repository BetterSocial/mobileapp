/* eslint-disable no-use-before-define */
import {useNavigation, useRoute} from '@react-navigation/native';
import PropTypes from 'prop-types';
import * as React from 'react';
import {ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, View} from 'react-native';

import {useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import {Context} from '../../../context/Store';
import useCreateChat from '../../../hooks/screen/useCreateChat';
import {checkUserBlock, setFollow, setUnFollow} from '../../../service/profile';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import {getUserId} from '../../../utils/users';
import DomainList from '../elements/DiscoveryItemList';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import RecentSearch from '../elements/RecentSearch';
import useDiscovery from '../hooks/useDiscovery';

const FROM_FOLLOWED_USERS = 'fromfollowedusers';
const FROM_FOLLOWED_USERS_INITIAL = 'fromfollowedusersinitial';
const FROM_UNFOLLOWED_USERS = 'fromunfollowedusers';
const FROM_UNFOLLOWED_USERS_INITIAL = 'fromunfollowedusersinitial';
const FROM_USERS_INITIAL = 'fromusersinitial';

const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...'
  }
];

const AccordionView = ({data, renderItem, setActiveSections, activeSections}) => {
  const renderSectionTitle = () => {
    return <View style={styles.content}></View>;
  };

  const renderHeader = (_, index) => {
    return (
      <DiscoveryTitleSeparator
        withBorderBottom={true}
        key="user-title-separator"
        text="People you follow"
        showArrow
        rotateArrow={activeSections?.some((actived) => actived === index)}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>{data?.map((item, index) => renderItem({index, item}))}</View>
    );
  };

  const updateSections = (activeSectionsParams) => {
    setActiveSections(activeSectionsParams);
  };

  return (
    <Accordion
      sections={SECTIONS}
      activeSections={activeSections}
      renderSectionTitle={renderSectionTitle}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}
    />
  );
};

const UsersFragment = ({
  isLoadingDiscoveryUser = false,
  isFirstTimeOpen,
  initialUsers = [],
  followedUsers = [],
  setFollowedUsers = () => {},
  unfollowedUsers = [],
  setUnfollowedUsers = () => {},
  setSearchText = () => {},
  setIsFirstTimeOpen = () => {},
  withoutRecent = false,
  showRecentSearch = true,
  fetchData = () => {},
  searchText,
  isUser
}) => {
  const [profile] = React.useContext(Context).profile;
  const navigation = useNavigation();
  const [client] = React.useContext(Context).client;
  const {exhangeFollower, users, updateFollowDiscoveryContext} = useDiscovery();
  const [loadingDM, setLoadingDM] = React.useState(false);
  const {createSignChat, loadingCreateChat} = useCreateChat();
  const [activeSections, setActiveSections] = useState([]);

  const route = useRoute();

  const [myId, setMyId] = React.useState('');

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setMyId(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    if (searchText?.length === 0) {
      setActiveSections([]);
    } else if (searchText?.length >= 0 && followedUsers?.length > 0) {
      setActiveSections([0]);
    } else {
      setActiveSections([]);
    }
  }, [searchText, followedUsers]);

  const handleOnPress = (item) => {
    navigation.push('OtherProfile', {
      data: {
        user_id: myId,
        other_id: item.user_id,
        username: item.username,
        following: item.following
      }
    });
  };

  const handleScroll = React.useCallback(() => {
    Keyboard.dismiss();
  });

  const handleUser = async (from, willFollow, item) => {
    if (from === FROM_FOLLOWED_USERS_INITIAL || from === FROM_UNFOLLOWED_USERS_INITIAL) {
      updateFollowDiscoveryContext(willFollow, item);
    }

    if (from === FROM_FOLLOWED_USERS) {
      const newFollowedUsers = [...followedUsers];
      exhangeFollower(newFollowedUsers, willFollow, item.user ? item.user.user_id : item.user_id);
      setFollowedUsers(newFollowedUsers);
    }
    if (from === FROM_UNFOLLOWED_USERS) {
      const newUnfollowedUsers = [...unfollowedUsers];
      exhangeFollower(newUnfollowedUsers, willFollow, item.user ? item.user.user_id : item.user_id);
      setUnfollowedUsers(newUnfollowedUsers);
    }
  };

  const handleFollow = async (from, willFollow, item) => {
    handleUser(from, willFollow, item);
    const data = {
      user_id_follower: myId,
      user_id_followed: item.user ? item.user.user_id : item.user_id,
      username_follower: profile.myProfile.username,
      username_followed: item.username,
      follow_source: 'discoveryScreen'
    };

    if (willFollow) {
      try {
        await setFollow(data, client);
      } catch (error) {
        handleUser(from, !willFollow, item);
      }
    } else {
      try {
        await setUnFollow(data, client);
      } catch (error) {
        handleUser(from, !willFollow, item);
      }
    }
    if (searchText.length > 0) fetchData();
  };

  const renderDiscoveryItem = ({from, item, index}) => {
    if (item.separator) {
      return (
        <>
          <DiscoveryTitleSeparator key="user-title-separator" text="People you might know" />
        </>
      );
    }

    const isUnfollowed = item.user ? !item.user.following : !item.following;

    const handleOpenProfile = async (profileItem) => {
      if (profile?.myProfile?.user_id === profileItem?.user_id) {
        return null;
      }

      return navigation.push('OtherProfile', {
        data: {
          user_id: profile.myProfile.user_id,
          other_id: profileItem?.user_id || profileItem?.userId,
          username: profileItem?.user?.name || profileItem?.user?.username || profileItem.username
        }
      });
    };

    const checkUserIsBlockHandle = async () => {
      try {
        setLoadingDM(true);
        const sendData = {
          user_id: item?.user_id || item?.userId
        };
        const members = [];
        members.push(profile?.myProfile?.user_id, item?.user_id || item?.userId);
        const processGetBlock = await checkUserBlock(sendData);
        if (!processGetBlock.data.data.blocked && !processGetBlock.data.data.blocker) {
          setLoadingDM(false);
          return createSignChat(members, item);
        }
        setLoadingDM(false);
        return handleOpenProfile(item);
      } catch (e) {
        console.log('error:', e);
      }
    };

    return (
      <>
        <DomainList
          isFromUserFragment={true}
          key={index}
          onPressBody={() => handleOnPress(item.user || item)}
          handleSetFollow={() => handleFollow(from, true, item.user || item)}
          handleSetUnFollow={() => {
            checkUserIsBlockHandle();
          }}
          item={{
            name: item.user ? item.user.username : item.username,
            image: item.user ? item.user.profile_pic_path : item.profile_pic_path,
            user_id_follower: item.user ? item.user.user_id_follower : item.user_id_follower,
            isunfollowed: isUnfollowed,
            description: item.user ? item.user.bio : item.bio,
            karmaScore: item.user ? item.user.karma_score : item.karma_score,
            comumnityInfo: item.user ? item.user.community_info || [] : item.community_info || [],
            routeName: route.name,
            isUser
          }}
          withKarma
        />
      </>
    );
  };

  const renderItem = ({index, item}) => {
    let result;

    if (isFirstTimeOpen) {
      if (withoutRecent) {
        if (initialUsers.length !== 0) {
          result = FROM_USERS_INITIAL;
        } else {
          result = FROM_FOLLOWED_USERS_INITIAL;
        }
      } else {
        result = FROM_FOLLOWED_USERS_INITIAL;
      }
    } else if (unfollowedUsers.length !== 0) {
      if (index > followedUsers.length) {
        result = FROM_UNFOLLOWED_USERS;
      } else {
        result = FROM_FOLLOWED_USERS;
      }
    } else if (index > followedUsers.length) {
      result = FROM_UNFOLLOWED_USERS;
    } else {
      result = FROM_FOLLOWED_USERS;
    }

    return renderDiscoveryItem({
      from: result,
      item,
      index
    });
  };

  const renderUsersItem = () => {
    const initFollowingUsers = [];
    const initUnfollowingUsers = [];

    users.forEach((item) => {
      if (item.user?.user_id_follower || item.user_id_follower) {
        initFollowingUsers.push(item);
      } else {
        initUnfollowingUsers.push(item);
      }
    });

    const data = isFirstTimeOpen
      ? withoutRecent
        ? initialUsers.length !== 0
          ? initialUsers
          : [{separator: true}, ...initUnfollowingUsers]
        : [{separator: true}, ...initUnfollowingUsers]
      : unfollowedUsers.length !== 0
      ? [{separator: true}, ...unfollowedUsers]
      : [];

    const firstData = isFirstTimeOpen
      ? withoutRecent
        ? initialUsers.length !== 0
          ? initialUsers
          : [...initFollowingUsers]
        : [...initFollowingUsers]
      : unfollowedUsers.length !== 0
      ? [...followedUsers]
      : followedUsers;

    return (
      <FlatList
        ListHeaderComponent={() => (
          <>
            {!withoutRecent && (
              <RecentSearch
                shown={showRecentSearch || isFirstTimeOpen}
                setSearchText={setSearchText}
                setIsFirstTimeOpen={setIsFirstTimeOpen}
              />
            )}

            <AccordionView
              data={firstData}
              renderItem={renderItem}
              activeSections={activeSections}
              setActiveSections={setActiveSections}
            />
          </>
        )}
        onMomentumScrollBegin={handleScroll}
        contentContainerStyle={{paddingBottom: 100}}
        data={data || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => fetchData()}
        onEndReachedThreshold={0.6}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        style={{backgroundColor: COLORS.almostBlack}}
      />
    );
  };

  if (isLoadingDiscoveryUser)
    return (
      <View style={styles.fragmentContainer}>
        <LoadingWithoutModal />
      </View>
    );
  if (followedUsers.length === 0 && unfollowedUsers.length === 0 && !isFirstTimeOpen)
    return (
      <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No users found</Text>
      </View>
    );
  return (
    <View>
      {(loadingDM || loadingCreateChat) && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center'
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {renderUsersItem()}
    </View>
  );
};

const styles = StyleSheet.create({
  fragmentContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600],
    color: COLORS.white
  },
  unfollowedHeaderContainer: {
    backgroundColor: COLORS.gray110,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  unfollowedHeaders: {
    fontFamily: fonts.inter[600],
    marginLeft: 20
  },
  containerHidden: {
    display: 'none'
  }
});

UsersFragment.propTypes = {
  isLoadingDiscoveryUser: PropTypes.bool,
  isFirstTimeOpen: PropTypes.bool,
  initialUsers: PropTypes.array,
  setInitialUsers: PropTypes.func,
  followedUsers: PropTypes.array,
  setFollowedUsers: PropTypes.func,
  unfollowedUsers: PropTypes.array,
  setUnfollowedUsers: PropTypes.func,
  setSearchText: PropTypes.func,
  setIsFirstTimeOpen: PropTypes.func,
  withoutRecent: PropTypes.bool,
  showRecentSearch: PropTypes.bool,
  fetchData: PropTypes.func,
  searchText: PropTypes.string
};

export default UsersFragment;
