import * as React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';

import DomainList from './elements/RenderList';
import Loading from '../Loading';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { getFollowing, setFollow, setUnFollow } from '../../service/profile';
import { getUserId } from '../../utils/users';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const width = Dimensions.get('screen').width;

const Followings = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [user_id, setUserId] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataFollowing, setDataFollowing] = React.useState([]);

  const { params } = route;

  React.useEffect(() => {
    if (params.user_id) {
      setUserId(params.user_id);
      setUsername(params.username);
    }

  }, [params.user_id]);

  React.useEffect(() => {
    if (user_id) {
      fetchFollowing(true);
    }
  }, [user_id])

  const fetchFollowing = async (withLoading) => {
    withLoading ? setIsLoading(true) : null;
    // const userId = await getUserId();
    const result = await getFollowing(user_id);
    if (result.code === 200) {
      const newData = result.data.map((data) => ({ ...data, name: data.user.username, image: data.user.profile_pic_path, description: null }))
      setDataFollowing(newData);
      withLoading ? setIsLoading(false) : null;
      navigation.setOptions({
        title: `Users (${newData.length})`,
      });
    }
  };

  const goToOtherProfile = (value) => {
    let data = {
      user_id,
      other_id: value.user_id_followed,
      username: value.user.username,
    };

    navigation.navigate('OtherProfile', { data });
  };

  const handleSetUnFollow = async (index) => {
    let newDataFollowing = [...dataFollowing];
    let singleDataFollowing = newDataFollowing[index];
    newDataFollowing[index].isunfollowed = true;
    setDataFollowing(newDataFollowing);

    let data = {
      user_id_follower: user_id,
      user_id_followed: singleDataFollowing.user.user_id,
      follow_source: 'other-profile',
    };

    const result = await setUnFollow(data);
  };

  const handleSetFollow = async (index) => {
    let newDataFollowing = [...dataFollowing];
    let singleDataFollowing = newDataFollowing[index];
    delete newDataFollowing[index].isunfollowed;
    setDataFollowing(newDataFollowing);

    let data = {
      user_id_follower: user_id,
      user_id_followed: singleDataFollowing.user.user_id,
      follow_source: 'other-profile',
    };
    const result = await setFollow(data);
  };

  const renderItem = ({ item, index }) => {
    return (
      <DomainList item={item} onPressBody={() => goToOtherProfile(item)} handleSetFollow={() => handleSetFollow(index)} handleSetUnFollow={() => handleSetUnFollow(index)} />
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={dataFollowing}
          renderItem={renderItem}
          keyExtractor={(item) => item.follow_action_id}
          refreshing={isLoading}
          // contentContainerStyle={{ flex: 1 }}
          onRefresh={fetchFollowing}
          ListEmptyComponent={isLoading ? null : <View style={styles.nousercontent}>
            <Text style={styles.nousertext}>
              You are not following anyone.\n Find interesting people to follow.\n Others cannot see whom you are following.
            </Text>
          </View>}

        />

      </View>
      {/* <Loading visible={isLoading} /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingBottom: 16,
    paddingTop: 16,
    position: 'relative',
  },
  textUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.black,
  },
  floatLeft: {
    position: 'absolute',
    left: 20,
    top: 10,
  },
  tabs: {
    width: width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginTop: 14,
  },
  wrapTextTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 2,
    borderBottomColor: colors.bondi_blue,
  },
  textTabs: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  content: {
    flexDirection: 'column',
    flex: 1
    // paddingBottom: 150,
  },
  nousercontent: {
    // flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  nousertext: {
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 36,
  },
  card: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  wrapProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginEnd: 16,
  },
  imageProfile: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  wrapTextProfile: {
    marginLeft: 12,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  textProfileUsername: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  textProfileFullName: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    flexWrap: 'wrap',
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8,
  },
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue,
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white,
  },
  profilepicture: {
    width: 48,
    height: 48,
    // backgroundColor: colors.bondi_blue,
    borderRadius: 24,
    resizeMode: 'cover',
    borderColor: colors.lightgrey,
    borderWidth: 1
  },
});
export default (Followings);
