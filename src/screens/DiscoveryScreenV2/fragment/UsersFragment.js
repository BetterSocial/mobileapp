/* eslint-disable no-use-before-define */
import * as React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import StringConstant from '../../../utils/string/StringConstant';
import useIsReady from '../../../hooks/useIsReady';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {getUserId} from '../../../utils/users';
import {setFollow, setUnFollow} from '../../../service/profile';

const FROM_FOLLOWED_USERS = 'fromfollowedusers';
const FROM_FOLLOWED_USERS_INITIAL = 'fromfollowedusersinitial';
const FROM_UNFOLLOWED_USERS = 'fromunfollowedusers';
const FROM_UNFOLLOWED_USERS_INITIAL = 'fromunfollowedusersinitial';
const FROM_USERS_INITIAL = 'fromusersinitial';

const UsersFragment = ({
  isLoadingDiscoveryUser = false,
  isFirstTimeOpen,
  initialUsers = [],
  setInitialUsers = () => {},
  followedUsers = [],
  setFollowedUsers = () => {},
  unfollowedUsers = [],
  setUnfollowedUsers = () => {},
  setSearchText = () => {},
  setIsFirstTimeOpen = () => {},
  withoutRecent = false,
  showRecentSearch = true,
  fetchData = () => {},
  searchText
}) => {
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;
  const [profile] = React.useContext(Context).profile;
  const navigation = useNavigation();
  const [client] = React.useContext(Context).client;

  const route = useRoute();

  const [myId, setMyId] = React.useState('');

  const isReady = useIsReady();

  const users = React.useMemo(() => {
    return discovery.initialUsers.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery]);

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setMyId(id);
      }
    };
    parseToken();
  }, []);

  const handleOnPress = (item) => {
    navigation.push('OtherProfile', {
      data: {
        user_id: myId,
        other_id: item.user_id,
        username: item.username,
        users
      }
    });
  };

  const exhangeFollower = (newUserLists, willFollow, userId) => {
    const indexUser = newUserLists.findIndex((item) =>
      item.user ? item.user.user_id === userId : item.user_id === userId
    );
    if (newUserLists[indexUser].user) {
      newUserLists[indexUser].user.following = !!willFollow;
      newUserLists[indexUser].user.user_id_follower = myId;
    } else {
      newUserLists[indexUser].following = !!willFollow;
      newUserLists[indexUser].user_id_follower = myId;
    }
    return newUserLists[indexUser];
  };

  const mapUser = (newUser) => {
    return discovery.initialUsers.map((user) => {
      if (user.user) {
        if (user.user.user_id === newUser.user.user_id) return newUser;
      } else if (user.user_id === newUser.user_id) return newUser;
      return user;
    });
  };

  const handleUser = async (from, willFollow, item) => {
    if (from === FROM_FOLLOWED_USERS_INITIAL || from === FROM_UNFOLLOWED_USERS_INITIAL) {
      const newFollowedUsers = [...users];
      const newUser = exhangeFollower(
        newFollowedUsers,
        willFollow,
        item.user ? item.user.user_id : item.user_id
      );

      DiscoveryAction.setDiscoveryInitialUsers(mapUser(newUser), discoveryDispatch);
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

    if (from === FROM_USERS_INITIAL) {
      const newFollowedUsers = [...initialUsers];
      exhangeFollower(newFollowedUsers, willFollow, item.user ? item.user.user_id : item.user_id);

      setInitialUsers(newFollowedUsers);
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

  const renderDiscoveryItem = (from, key, item, index) => {
    const isUnfollowed = item.user ? !item.user.following : !item.following;

    if (
      (route.name === 'Followings' && item.user_id_follower !== null) ||
      route.name !== 'Followings'
    ) {
      return (
        <DomainList
          key={`${key}-${index}`}
          onPressBody={() => handleOnPress(item.user || item)}
          handleSetFollow={() => handleFollow(from, true, item.user || item)}
          handleSetUnFollow={() => handleFollow(from, false, item.user || item)}
          item={{
            name: item.user ? item.user.username : item.username,
            image: item.user ? item.user.profile_pic_path : item.profile_pic_path,
            isunfollowed: isUnfollowed,
            description: item.user ? item.user.bio : item.bio,
            karmaScore: item.user ? item.user.karma_score : item.karma_score
          }}
        />
      );
    }
    return null;
  };

  const renderUsersItem = () => {
    if (isFirstTimeOpen) {
      if (withoutRecent) {
        if (initialUsers.length !== 0 || route.name === 'TopicMemberScreen') {
          return [
            initialUsers.map((item, index) =>
              renderDiscoveryItem(FROM_USERS_INITIAL, 'topicUsers', item, index)
            )
          ];
        }
        return [
          users.map((item, index) =>
            renderDiscoveryItem(FROM_FOLLOWED_USERS_INITIAL, 'followedUsers', item, index)
          )
        ];
      }

      const followingUsers = [];
      const unfollowingUsers = [];

      users.forEach((item) => {
        if (item.user?.user_id_follower || item.user_id_follower) {
          followingUsers.push(item);
        } else {
          unfollowingUsers.push(item);
        }
      });

      return [
        followingUsers.map((item, index) =>
          renderDiscoveryItem(FROM_FOLLOWED_USERS_INITIAL, 'followedUsers', item, index)
        )
      ]
        .concat([
          route.name !== 'Followings' && (
            <DiscoveryTitleSeparator key="user-title-separator" text="Suggested Users" />
          )
        ])
        .concat([
          unfollowingUsers.map((item, index) =>
            renderDiscoveryItem(
              FROM_FOLLOWED_USERS_INITIAL,
              'followedUsers',
              item,
              index + followingUsers.length
            )
          )
        ]);
    }

    return (
      <>
        {followedUsers.map((item, index) =>
          renderDiscoveryItem(FROM_FOLLOWED_USERS, 'followedUsers', item, index)
        )}

        {route.name !== 'Followings' &&
          unfollowedUsers.length > 0 &&
          followedUsers.length > 0 &&
          !withoutRecent && (
            <View style={styles.unfollowedHeaderContainer}>
              <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreUsers}</Text>
            </View>
          )}
        {route.name !== 'Followings' &&
          unfollowedUsers.map((item, index) =>
            renderDiscoveryItem(FROM_UNFOLLOWED_USERS, 'unfollowedUsers', item, index)
          )}
      </>
    );
  };

  if (!isReady) return <></>;

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
      {!withoutRecent && (
        <RecentSearch
          shown={showRecentSearch || isFirstTimeOpen}
          setSearchText={setSearchText}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
        />
      )}
      {renderUsersItem()}
    </View>
  );
};

const styles = StyleSheet.create({
  fragmentContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600]
  },
  unfollowedHeaderContainer: {
    backgroundColor: COLORS.lightgrey,
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
