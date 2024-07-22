import * as React from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import PropTypes from 'prop-types';
import {ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, View} from 'react-native';
/* eslint-disable no-use-before-define */
import {useNavigation, useRoute} from '@react-navigation/native';

import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import useCreateChat from '../../../hooks/screen/useCreateChat';
import useDiscovery from '../hooks/useDiscovery';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {checkUserBlock, setFollow, setUnFollow} from '../../../service/profile';
import {fonts} from '../../../utils/fonts';
import {getUserId} from '../../../utils/users';

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
  unfollowedUsers = [],
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
  const {exchangeFollower, users, updateFollowDiscoveryContext} = useDiscovery();
  const [loadingDM, setLoadingDM] = React.useState(false);
  const {createSignChat, loadingCreateChat} = useCreateChat();
  const [activeSections, setActiveSections] = React.useState([]);
  const [followedUserIds, setFollowedUserIds] = React.useState([]);
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
    const handleActiveSections = () => {
      if (!searchText) return;

      if (searchText.length === 0) {
        setActiveSections([]);
      } else if (searchText?.length >= 0 && followedUsers?.length > 0) {
        setActiveSections([0]);
      } else {
        setActiveSections([]);
      }
    };
    handleActiveSections();
  }, [searchText, followedUsers]);

  const handleOnPress = (item) => {
    navigation.push('OtherProfile', {
      data: {
        user_id: myId,
        other_id: item.user_id,
        username: item.username,
        following: followedUserIds.find((userId) => userId === item.user_id) ? true : item.following
      }
    });
  };

  const handleScroll = React.useCallback(() => {
    Keyboard.dismiss();
  });

  const handleUser = async (from, willFollow, item) => {
    updateFollowDiscoveryContext(willFollow, item);
  };

  const rollbackFollow = (followedUserId) => {
    const newFollowedUserIds = followedUserIds;
    const index = followedUserIds.findIndex((userId) => userId === followedUserId);
    newFollowedUserIds.splice(index, 1);
    setFollowedUserIds(newFollowedUserIds);
  };

  const handleFollow = async (from, willFollow, item) => {
    handleUser(from, willFollow, item);
    const followedUserId = item.user ? item.user.user_id : item.user_id;
    const data = {
      user_id_follower: myId,
      user_id_followed: followedUserId,
      username_follower: profile.myProfile.username,
      username_followed: item.username,
      follow_source: 'discoveryScreen'
    };

    const newFollowedUserIds = followedUserIds;
    newFollowedUserIds.push(followedUserId);
    setFollowedUserIds(newFollowedUserIds);

    if (willFollow) {
      try {
        await setFollow(data, client);
      } catch (error) {
        handleUser(from, !willFollow, item);
        rollbackFollow(followedUserId);
      }
    } else {
      try {
        await setUnFollow(data, client);
      } catch (error) {
        handleUser(from, !willFollow, item);
        rollbackFollow(followedUserId);
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
    const followedUserId = item.user ? item.user.user_id : item.user_id;

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
        const userId = item?.user_id || item?.userId || item?.user?.user_id;
        const sendData = {
          user_id: userId
        };
        const members = [];
        members.push(profile?.myProfile?.user_id, userId);
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
            isunfollowed: followedUserIds.find((userId) => userId === followedUserId)
              ? false
              : isUnfollowed,
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

  const initFollowingUsers = React.useMemo(() => {
    const initialFollowingUsers = [];
    users.forEach((item) => {
      if (item.user?.user_id_follower || item.user_id_follower) {
        initialFollowingUsers.push(item);
      }
    });

    return initialFollowingUsers;
  }, [users]);

  const initUnfollowingUsers = React.useMemo(() => {
    const initialUnfollowingUsers = [];
    users.forEach((item) => {
      if (!item.user?.user_id_follower && !item.user_id_follower) {
        initialUnfollowingUsers.push(item);
      }
    });

    return initialUnfollowingUsers;
  }, [users]);

  const peopleYouMightKnowData = React.useMemo(() => {
    if (!isFirstTimeOpen && unfollowedUsers.length === 0) {
      return [];
    }

    if (!isFirstTimeOpen && unfollowedUsers) {
      return [{separator: true}, ...unfollowedUsers];
    }

    if (!withoutRecent) {
      return [{separator: true}, ...initUnfollowingUsers];
    }

    if (initialUsers.length === 0) {
      return [{separator: true}, ...initUnfollowingUsers];
    }

    return initialUsers;
  }, [users, unfollowedUsers]);

  const initialAccordionData = React.useMemo(() => {
    if (!isFirstTimeOpen && unfollowedUsers.length !== 0) {
      return [...followedUsers];
    }

    if (!isFirstTimeOpen) {
      return followedUsers;
    }

    if (!withoutRecent) {
      return [...initFollowingUsers];
    }

    if (initialUsers.length !== 0) {
      return initialUsers;
    }

    return [...initFollowingUsers];
  }, [users, unfollowedUsers, initialUsers]);

  const renderUsersItem = () => {
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
              data={initialAccordionData}
              renderItem={renderItem}
              activeSections={activeSections}
              setActiveSections={setActiveSections}
            />
          </>
        )}
        onMomentumScrollBegin={handleScroll}
        contentContainerStyle={{paddingBottom: 100}}
        data={peopleYouMightKnowData || []}
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
  unfollowedUsers: PropTypes.array,
  setSearchText: PropTypes.func,
  setIsFirstTimeOpen: PropTypes.func,
  withoutRecent: PropTypes.bool,
  showRecentSearch: PropTypes.bool,
  fetchData: PropTypes.func,
  searchText: PropTypes.string
};

export default UsersFragment;
