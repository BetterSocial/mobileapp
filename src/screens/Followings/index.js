import React from 'react';
import {useEffect, useState} from 'react';
import {
  StatusBar,
  Dimensions,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  FlatList,
  Image,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Loading from '../Loading';
import {getFollowing, setFollow, setUnFollow} from '../../service/profile';
import {useNavigation} from '@react-navigation/core';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {getAccessToken} from '../../data/local/accessToken';
import jwtDecode from 'jwt-decode';

const width = Dimensions.get('screen').width;

const Followings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [user_id, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataFollowing, setDataFollowing] = useState([]);

  const {params} = route;

  useEffect(() => {
    setUserId(params.user_id);
    setUsername(params.username);
    fetchFollowing(true);
  }, [params.user_id]);

  const fetchFollowing = async (withLoading) => {
    withLoading ? setIsLoading(true) : null;
    const token = await getAccessToken();
    const userId = await jwtDecode(token).user_id;
    const result = await getFollowing(userId);
    console.log(result);
    if (result.code === 200) {
      withLoading ? setIsLoading(false) : null;
      setDataFollowing(result.data);
      navigation.setOptions({
        title : `Users (${result.data.length})`
      })
    }
  };

  const goToOtherProfile = (value) => {
    // let data = {
    //   user_id,
    //   other_id: value.user_id_followed,
    //   username,
    // };

    let data = {
      user_id,
      other_id : value.user_id_followed,
      username : value.user.username
    }

    navigation.navigate('OtherProfile', {data});
  };

  const handleSetUnFollow = async (index) => {
    let newDataFollowing = [...dataFollowing]
    let singleDataFollowing = newDataFollowing[index]
    newDataFollowing[index].isunfollowed = true
    setDataFollowing(newDataFollowing)

    let data = {
      user_id_follower: user_id,
      user_id_followed: singleDataFollowing.user.user_id,
      follow_source: 'other-profile',
    };

    const result = await setUnFollow(data);
    // if (result.code == 200) {
      // fetchOtherProfile(user_id, other_id, false);
      // fetchFollowing()
    // }
  };

  const handleSetFollow = async (index) => {
    let newDataFollowing = [...dataFollowing]
    let singleDataFollowing = newDataFollowing[index]
    delete newDataFollowing[index].isunfollowed
    setDataFollowing(newDataFollowing)

    let data = {
      user_id_follower: user_id,
      user_id_followed: singleDataFollowing.user.user_id,
      follow_source: 'other-profile',
    };
    const result = await setFollow(data);
    // if (result.code == 200) {
      // fetchOtherProfile(user_id, other_id, false);
      // fetchFollowing()
    // }
  };

  const renderItem = ({item, index}) => {
    return <TouchableNativeFeedback
      onPress={(event) => {
        event.preventDefault();
        goToOtherProfile(item);
      }}>
      <View style={styles.card}>
        <View style={styles.wrapProfile}>
          <Image source={{
            uri : item.user.profile_pic_path
          }} style={styles.profilepicture} width={48} height={48}/>
          <View style={styles.wrapTextProfile}>
            <Text style={styles.textProfileUsername}>{item.user.username}</Text>
            <Text style={styles.textProfileFullName} numberOfLines={1} ellipsizeMode={'tail'}>
              {item.user.bio ? item.user.bio : ''}
            </Text>
          </View>
        </View>
        { item.hasOwnProperty("isunfollowed") ?
        <TouchableNativeFeedback
          onPress={() => handleSetFollow(index)}>
          <View style={styles.buttonFollow}>
            <Text style={styles.textButtonFollow}>
              Follow
            </Text>
          </View>
        </TouchableNativeFeedback> :
        <TouchableNativeFeedback onPress={() => handleSetUnFollow(index)}>
          <View style={styles.buttonFollowing}>
            <Text style={styles.textButtonFollowing}>Following</Text>
          </View>
        </TouchableNativeFeedback> 
        }
      </View>
    </TouchableNativeFeedback>
  };

  return (
    <>
      {/* <StatusBar barStyle="dark-content" /> */}
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.header}>
          <View style={styles.floatLeft}>
            <TouchableNativeFeedback onPress={() => navigation.goBack()}>
              <View style={{padding : 12}}>
                <ArrowLeftIcon width={20} height={12} fill="#000"/>
              </View>
            </TouchableNativeFeedback>
          </View>
          <Text style={styles.textUsername}>{username}</Text>
        </View> */}
        {/* <View style={styles.tabs}>
          <View style={styles.wrapTextTabs}>
            <Text style={styles.textTabs}>
              Following ({dataFollowing.length})
            </Text>
          </View>
        </View> */}
        {dataFollowing.length > 0 ? 
          <View style={styles.content}>
            <FlatList
              data={dataFollowing}
              renderItem={renderItem}
              keyExtractor={(item) => item.follow_action_id}
            /> 
          </View> :
          <View style={styles.nousercontent}>
            <Text style={styles.nousertext}>{`You are not following anyone.\n Find interesting people to follow.\n Others cannot see whom you are following`}</Text>
          </View>
        }
        <Loading visible={isLoading} />
      </SafeAreaView>
    </>
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
    paddingBottom : 150
  },
  nousercontent : {
    flexDirection : "column",
    flex : 1,
    justifyContent : 'center'
  },
  nousertext : {
    alignSelf : "center",
    textAlign : "center",
    marginHorizontal : 36
  },
  card: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width : '100%',
    paddingHorizontal : 20,
    marginVertical : 10
  },
  wrapProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    width : '100%',
    flex : 1,
    marginEnd : 16
  },
  imageProfile: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  wrapTextProfile: {
    marginLeft: 12,
    flexDirection: 'column',
    flex : 1,
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
    flexWrap : 'wrap'
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8
  },
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue
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
  profilepicture : {
    width : 48,
    height : 48,
    backgroundColor : colors.bondi_blue,
    borderRadius : 24,
    resizeMode : 'cover'
  }
});
export default Followings;
