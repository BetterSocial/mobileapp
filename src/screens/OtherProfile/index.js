import React from 'react';
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
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import ShareIcon from '../../assets/icons/images/share.svg';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import BlockBlueIcon from '../../assets/icons/images/block-blue.svg';
import EnveloveBlueIcon from '../../assets/icons/images/envelove-blue.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const width = Dimensions.get('screen').width;

let VERY_LARGE_TEXT =
  'Ullamco ullamco aute ad dolor enim quis. Mollit mollit eiusmod esse est nostrud est culpa. Dolor nisi deserunt non laboris adipisicing sunt. Ullamco veniam irure cupidatat veniam proident. Enim aliquip deserunt veniam ea. Irure eiusmod cupidatat deserunt officia consectetur. Ea reprehenderit mollit occaecat reprehenderit irure magna tempor aliqua culpa. Pariatur Lorem quis anim voluptate velit eu consectetur amet duis sit quis enim. Cillum magna eu magna elit nisi anim enim mollit ex.';

const OtherProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {params} = route;
  console.log('isi params ', params);
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

  const goToFollowings = () => {
    navigation.navigate('Followings');
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
              <Text style={styles.textUsername}>{params.data.username}</Text>
            </View>
            <TouchableNativeFeedback onPress={onShare}>
              <ShareIcon width={20} height={20} fill="#000" />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.wrapImageProfile}>
            <View style={styles.wrapImageAndStatus}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: params.data.image_path,
                }}
              />
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
                <TouchableNativeFeedback
                  onPress={() => {
                    console.log('inner press');
                  }}>
                  <View style={styles.buttonFollowing}>
                    <Text style={styles.textButtonFollowing}>Following</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
            <Text style={styles.nameProfile}>{params.data.full_name}</Text>
          </View>
          <View style={{...styles.wrapFollower, marginTop: 12}}>
            <View style={styles.wrapRow}>
              <Text style={styles.textTotal}>{'>10'}</Text>
              <Text style={styles.textFollow}>Followers</Text>
            </View>
            <View style={{marginLeft: 18}}>
              <TouchableNativeFeedback onPress={goToFollowings}>
                <View style={styles.wrapRow}>
                  <Text style={styles.textTotal}>{'>50'}</Text>
                  <Text style={styles.textFollow}>Following</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.containerBio}>
            <SeeMore numberOfLines={3} linkStyle={styles.seeMore}>
              {VERY_LARGE_TEXT}
            </SeeMore>
          </View>
        </View>
        <View style={styles.tabs}>
          <Text style={styles.postText}>Post (12)</Text>
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
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
  },
});
export default OtherProfile;
