/* eslint-disable no-use-before-define */
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import useIsReady from '../../../hooks/useIsReady';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {setFollow, setUnFollow} from '../../../service/profile';
import {getAllMemberTopic} from '../../../service/topics';
import {getUserId} from '../../../utils/users';
import DiscoveryItemList from '../../DiscoveryScreenV2/elements/DiscoveryItemList';

const FROM_TOPIC_MEMBER = 'fromtopicmember';

const MemberList = ({isLoading, topicMembers = [], setTopicMembers = () => {}}) => {
  const [profile] = React.useContext(Context).profile;
  const navigation = useNavigation();

  const [myId, setMyId] = React.useState('');

  const isReady = useIsReady();

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
        username: item.username
      }
    });
  };

  const handleFollow = async (willFollow, item, index) => {
    const newFollowedUsers = [...topicMembers];
    newFollowedUsers[index].user_id_follower = willFollow ? myId : null;

    setTopicMembers(newFollowedUsers);

    const data = {
      user_id_follower: myId,
      user_id_followed: item.user_id,
      username_follower: profile.myProfile.username,
      username_followed: item.username,
      follow_source: 'topicMemberScreen'
    };

    if (willFollow) {
      await setFollow(data);
    } else {
      await setUnFollow(data);
    }
  };

  const renderDiscoveryItem = (from, key, item, index) => (
    <DiscoveryItemList
      key={`${key}-${index}`}
      onPressBody={() => handleOnPress(item)}
      handleSetFollow={() => handleFollow(true, item, index)}
      handleSetUnFollow={() => handleFollow(false, item, index)}
      item={{
        name: item.username,
        image: item.profile_pic_path,
        isunfollowed: item.user_id_follower === null,
        description: item.bio
      }}
    />
  );

  const renderUsersItem = () => {
    return (
      <>
        {topicMembers.map((item, index) =>
          renderDiscoveryItem(FROM_TOPIC_MEMBER, 'topicMember', item, index)
        )}
      </>
    );
  };

  if (!isReady) return <></>;

  if (isLoading)
    return (
      <View style={styles.fragmentContainer}>
        <LoadingWithoutModal />
      </View>
    );
  if (topicMembers.length === 0)
    return (
      <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No users found</Text>
      </View>
    );

  return <View>{renderUsersItem()}</View>;
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

export default MemberList;
