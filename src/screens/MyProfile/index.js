import React from 'react';
import {useState, useRef} from 'react';
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
  TextInput,
} from 'react-native';
import SeeMore from 'react-native-see-more-inline';
import {useNavigation} from '@react-navigation/core';
import ShareIcon from '../../assets/icons/images/share.svg';
import SettingIcon from '../../assets/icons/images/setting.svg';
import UserIcon from '../../assets/icons/images/user.svg';
import MediaIcon from '../../assets/icons/images/media.svg';
import CameraIcon from '../../assets/icons/images/camera.svg';
import TrashIcon from '../../assets/icons/images/trash.svg';
import {Button} from '../../components/Button';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {BottomSheet} from '../../components/BottomSheet';

const width = Dimensions.get('screen').width;

let VERY_LARGE_TEXT =
  'Ullamco ullamco aute ad dolor enim quis. Mollit mollit eiusmod esse est nostrud est culpa. Dolor nisi deserunt non laboris adipisicing sunt. Ullamco veniam irure cupidatat veniam proident. Enim aliquip deserunt veniam ea. Irure eiusmod cupidatat deserunt officia consectetur. Ea reprehenderit mollit occaecat reprehenderit irure magna tempor aliqua culpa. Pariatur Lorem quis anim voluptate velit eu consectetur amet duis sit quis enim. Cillum magna eu magna elit nisi anim enim mollit ex.';

const MyProfile = () => {
  const navigation = useNavigation();
  const bottomSheetNameRef = useRef();
  const bottomSheetProfilePictureRef = useRef();

  const [fullName, setFullName] = useState('Ali Irawan');
  const [tempFullName, setTempFullName] = useState('');

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://www.example.better-social.com/van_darmawan2204',
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

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  const goToFollowings = () => {
    navigation.navigate('Followings');
  };

  const changeName = () => {
    bottomSheetNameRef.current.open();
    setTempFullName(fullName);
  };

  const changeImage = () => {
    bottomSheetProfilePictureRef.current.open();
  };

  const handleSave = () => {
    setFullName(tempFullName);
    bottomSheetNameRef.current.close();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.textUsername}>van_darmawan2204</Text>
            <View style={styles.wrapHeaderButton}>
              <View style={{marginRight: 20}}>
                <TouchableNativeFeedback onPress={onShare}>
                  <ShareIcon width={20} height={20} fill="#000" />
                </TouchableNativeFeedback>
              </View>
              <TouchableNativeFeedback onPress={goToSettings}>
                <SettingIcon width={20} height={20} fill="#000" />
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.wrapImageProfile}>
            <TouchableNativeFeedback onPress={changeImage}>
              <Image
                style={styles.profileImage}
                source={{
                  uri:
                    'https://avatars.githubusercontent.com/u/811536?s=400&u=32007a4167b7250b321e81ab182116018fbee7b6&v=4',
                }}
              />
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={changeName}>
              <Text style={styles.nameProfile}>{fullName}</Text>
            </TouchableNativeFeedback>
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
        <BottomSheet
          ref={bottomSheetNameRef}
          closeOnPressMask={true}
          height={300}>
          <View style={styles.containerBottomSheet}>
            <Text style={styles.textYourName}>Your name</Text>
            <TextInput
              autoFocus={true}
              style={styles.inputYourName}
              onChangeText={(text) => setTempFullName(text)}
              value={tempFullName}
              placeholder="Your Name"
              placeholderTextColor={colors.silver}
            />
            <Text style={styles.descriptionYourname}>
              Providing a common or real name is fully optional, but might make
              it easier for others to find you.
            </Text>
            <Button
              style={styles.button}
              textStyling={styles.textStyling}
              onPress={() => handleSave()}>
              Save
            </Button>
          </View>
        </BottomSheet>

        <BottomSheet
          ref={bottomSheetProfilePictureRef}
          closeOnPressMask={true}
          height={300}>
          <View style={styles.containerBottomSheet}>
            <View style={styles.card}>
              <UserIcon width={16.67} height={16.67} fill="#000" />
              <Text style={styles.textCard}>View profile picture</Text>
            </View>
            <View style={styles.card}>
              <MediaIcon width={16.67} height={16.67} fill="#000" />
              <Text style={styles.textCard}>Upload from library</Text>
            </View>
            <View style={styles.card}>
              <CameraIcon width={16.67} height={16.67} fill="#000" />
              <Text style={styles.textCard}>Take a photo</Text>
            </View>
            <View style={styles.card}>
              <TrashIcon width={16.67} height={16.67} fill="#000" />
              <Text style={styles.textCard}>Remove current picture</Text>
            </View>
          </View>
        </BottomSheet>
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
  wrapHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 50,
  },
  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
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
  containerBottomSheet: {
    flexDirection: 'column',
  },
  textYourName: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.black,
    marginBottom: 16,
  },
  inputYourName: {
    height: 52,
    backgroundColor: colors.wildSand,
    color: colors.black,
    fontFamily: fonts.inter[400],
    fontSize: 18,
  },
  descriptionYourname: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    lineHeight: 24,
  },
  button: {
    marginTop: 50,
    backgroundColor: colors.bondi_blue,
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: colors.white,
  },
  card: {
    height: 52,
    backgroundColor: colors.wildSand,
    borderRadius: 8,
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 17,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textCard: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
    paddingLeft: 9,
  },
});
export default MyProfile;
