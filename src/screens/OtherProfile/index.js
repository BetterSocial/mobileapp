import React from 'react';
import {useEffect, useState} from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  Share,
} from 'react-native';
import SeeMore from 'react-native-see-more-inline';
import {getOtherProfile, setUnFollow, setFollow} from '../../service/profile';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import MemoIc_btn_add from '../../assets/icons/Ic_btn_add';
import ShareIcon from '../../assets/icons/images/share.svg';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import BlockBlueIcon from '../../assets/icons/images/block-blue.svg';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import Loading from '../Loading';

const width = Dimensions.get('screen').width;

let VERY_LARGE_TEXT =
  'Ullamco ullamco aute ad dolor enim quis. Mollit mollit eiusmod esse est nostrud est culpa. Dolor nisi deserunt non laboris adipisicing sunt. Ullamco veniam irure cupidatat veniam proident. Enim aliquip deserunt veniam ea. Irure eiusmod cupidatat deserunt officia consectetur. Ea reprehenderit mollit occaecat reprehenderit irure magna tempor aliqua culpa. Pariatur Lorem quis anim voluptate velit eu consectetur amet duis sit quis enim. Cillum magna eu magna elit nisi anim enim mollit ex.';

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [dataMain, setDataMain] = useState({});
  const [user_id, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [other_id, setOtherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {params} = route;

  useEffect(() => {
    setUserId(params.data.user_id);
    setOtherId(params.data.other_id);
    setUsername(params.data.username);
    fetchOtherProfile(params.data.user_id, params.data.other_id, true);
  }, [params.data]);

  const fetchOtherProfile = async (userId, otherId, withLoading) => {
    withLoading ? setIsLoading(true) : null;
    const result = await getOtherProfile(userId, otherId);
    if (result.code == 200) {
      withLoading ? setIsLoading(false) : null;
      setDataMain(result.data);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://www.google.com/',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSetUnFollow = async () => {
    let data = {
      user_id_follower: user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile',
    };
    const result = await setUnFollow(data);
    if (result.code == 200) {
      fetchOtherProfile(user_id, other_id, false);
    }
  };

  const handleSetFollow = async () => {
    let data = {
      user_id_follower: user_id,
      user_id_followed: other_id,
      follow_source: 'other-profile',
    };
    const result = await setFollow(data);
    if (result.code == 200) {
      fetchOtherProfile(user_id, other_id, false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.wrapNameAndbackButton}>
              <TouchableNativeFeedback onPress={() => navigation.goBack()}>
                <ArrowLeftIcon width={20} height={12} fill="#000" />
              </TouchableNativeFeedback>
              <Text style={styles.textUsername}>{username}</Text>
            </View>
            <TouchableNativeFeedback onPress={onShare}>
              <ShareIcon width={20} height={20} fill="#000" />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.wrapImageProfile}>
            <View style={styles.wrapImageAndStatus}>
              <View style={styles.wrapImageProfile}>
                {dataMain.profile_pic_path ? (
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri: dataMain.profile_pic_path,
                    }}
                  />
                ) : (
                  <MemoIc_btn_add width={100} height={100} />
                )}

                <Text style={styles.nameProfile}>
                  {dataMain.real_name
                    ? dataMain.real_name
                    : 'no name specifics'}
                </Text>
              </View>
              <View style={styles.wrapButton}>
                <TouchableNativeFeedback>
                  <BlockBlueIcon
                    width={20}
                    height={20}
                    fill={colors.bondi_blue}
                  />
                </TouchableNativeFeedback>
                <TouchableNativeFeedback>
                  <EnveloveBlueIcon
                    width={20}
                    height={16}
                    fill={colors.bondi_blue}
                  />
                </TouchableNativeFeedback>
                {dataMain.is_following ? (
                  <TouchableNativeFeedback onPress={() => handleSetUnFollow()}>
                    <View style={styles.buttonFollowing}>
                      <Text style={styles.textButtonFollowing}>Following</Text>
                    </View>
                  </TouchableNativeFeedback>
                ) : (
                  <TouchableNativeFeedback
                    onPress={() => handleSetFollow()}>
                    <View style={styles.buttonFollow}>
                      <Text style={styles.textButtonFollow}>Follow</Text>
                    </View>
                  </TouchableNativeFeedback>
                )}
              </View>
            </View>
            <Text style={styles.nameProfile}>{params.data.full_name}</Text>
          </View>
          <View style={{...styles.wrapFollower, marginTop: 12}}>
            <View style={styles.wrapRow}>
              <Text style={styles.textTotal}>{dataMain.follower_symbol}</Text>
              <Text style={styles.textFollow}>Followers</Text>
            </View>
            <View style={{marginLeft: 18}}>
              <View style={styles.wrapRow}>
                <Text style={styles.textTotal}>
                  {dataMain.following_symbol}
                </Text>
                <Text style={styles.textFollow}>Following</Text>
              </View>
            </View>
          </View>
          <View style={styles.containerBio}>
            <SeeMore numberOfLines={3} linkStyle={styles.seeMore}>
              {VERY_LARGE_TEXT}
            </SeeMore>
          </View>
        </View>
        <View style={styles.tabs}>
          <Text style={styles.postText}>Post (0)</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
    marginLeft: 18,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 12,
  },
  wrapImageProfile: {
    marginTop: 24,
    flexDirection: 'column',
  },
  nameProfile: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  wrapFollower: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTotal: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.bondi_blue,
    paddingRight: 4,
  },
  textFollow: {
    fontFamily: fonts.inter[800],
    fontSize: 14,
    color: colors.black,
    paddingRight: 4,
  },
  containerBio: {
    marginTop: 8,
  },
  seeMore: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
  },
  tabs: {
    width: width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  postText: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.bondi_blue,
  },
  wrapNameAndbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapImageAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 180,
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
});
export default OtherProfile;
