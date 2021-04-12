import React from 'react';
import {useState, useRef, useEffect} from 'react';
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
  ScrollView,
} from 'react-native';
import {LogBox} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import JWTDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STREAM_API_KEY, STREAM_APP_ID} from '@env';
import {StreamApp, FlatFeed} from 'react-native-activity-feed';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/core';
import {showMessage} from 'react-native-flash-message';
import {
  getMyProfile,
  getPost,
  changeRealName,
  updateImageProfile,
  removeImageProfile,
  updateBioProfile,
} from '../../service/profile';
import ShareIcon from '../../assets/icons/images/share.svg';
import SettingIcon from '../../assets/icons/images/setting.svg';
import ArrowUpWhiteIcon from '../../assets/icons/images/arrow-up-white.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import Loading from '../Loading';
import RenderActivity from './RenderActivity';
import BottomSheetImage from './BottomSheetImage';
import BottomSheetRealname from './BottomSheetRealname';
import BottomSheetBio from './BottomSheetBio';
import {trimString} from '../../helpers/stringSplit';
import {getToken} from '../../helpers/getToken';

const width = Dimensions.get('screen').width;

let token_JWT = '';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const bottomSheetNameRef = useRef();
  const bottomSheetBioRef = useRef();
  const bottomSheetProfilePictureRef = useRef();
  const postRef = useRef(null);
  const scrollViewReff = useRef(null);

  const [tokenParse, setTokenParse] = useState({});
  const [dataMain, setDataMain] = useState({});
  const [tempFullName, setTempFullName] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [isOffsetScroll, setIsOffsetScroll] = useState(false);
  const [isShowButton, setIsShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isChangeRealName, setIsChangeRealName] = useState(false);
  const [isLoadingRemoveImage, setIsLoadingRemoveImage] = useState(false);
  const [isLoadingUpdateBio, setIsLoadingUpdateBio] = useState(false);
  const [errorBio, setErrorBio] = useState('');
  const [postLenght, setPostLenght] = useState(0);
  const [isLoadingUpdateImageGalery, setIsLoadingUpdateImageGalery] = useState(
    false,
  );
  const [isLoadingUpdateImageCamera, setIsLoadingUpdateImageCamera] = useState(
    false,
  );
  const [errorChangeRealName, setErrorChangeRealName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    fetchMyProfile(true);
    // setToken()
  }, []);

  // const setToken = async () => {
  //   try {
  //     await AsyncStorage.setItem('tkn-getstream', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjg4ZDU2NzktNmM2OC00MWVjLWJlODMtN2YxNWE0ZTgyZDNkIn0.0YNINzuHdf2afDN0ew3x0DRT0uJFzvBD0CbYL_Exm9c")
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  const fetchMyProfile = async (withLoading) => {
    const value = await AsyncStorage.getItem('tkn-getstream');
    if (value) {
      var decoded = await JWTDecode(value);
      setTokenParse(decoded);
      withLoading ? setIsLoading(true) : null;
      const result = await getMyProfile(decoded.user_id);
      console.log('isi result ', result);
      if (result.code == 200) {
        withLoading ? setIsLoading(false) : null;
        setDataMain(result.data);
      }
    }
  };

  async function buildLink() {
    const link = await dynamicLinks().buildLink(
      {
        link: `https://dev.bettersocial.org/${dataMain.username}`,
        domainUriPrefix: 'https://bettersocialapp.page.link',
        analytics: {
          campaign: 'banner',
        },
        navigation: {
          forcedRedirectEnabled: false,
        },
        // ios: {
        //   bundleId: '',
        //   // customScheme: 'giftit',
        //   appStoreId: '',
        // },
        android: {
          packageName: 'org.bettersocial.dev',
        },
      },
      'SHORT',
    );
    return link;
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: await buildLink(),
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

  const goToFollowings = (user_id, username) => {
    if (dataMain.following > 0) {
      navigation.navigate('Followings', {user_id, username});
    }
  };

  const changeName = () => {
    bottomSheetNameRef.current.open();
    setTempFullName(dataMain.real_name ? dataMain.real_name : '');
  };

  const changeImage = () => {
    bottomSheetProfilePictureRef.current.open();
  };

  const handleSave = async () => {
    setIsChangeRealName(true);
    const result = await changeRealName(dataMain.user_id, tempFullName);
    if (result.code == 200) {
      fetchMyProfile();
      setIsChangeRealName(false);
      bottomSheetNameRef.current.close();
    } else {
      setErrorChangeRealName(result.message);
    }
  };

  const handleScroll = (event) => {
    postRef.current.measure((x, y, width, height, pagex, pagey) => {
      if (pagey < 0) {
        setIsOffsetScroll(true);
      } else {
        setIsOffsetScroll(false);
      }
    });

    const currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset < 70) {
      setOpacity(0);
      setIsShowButton(false);
    } else if (currentOffset >= 70 && currentOffset <= 270) {
      setIsShowButton(true);
      setOpacity((currentOffset - 70) * (1 / 100));
    } else if (currentOffset > 270) {
      setOpacity(1);
      setIsShowButton(true);
    }
  };

  const toTop = () => {
    scrollViewReff.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const onOpenImageGalery = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
      if (res.didCancel) {
      } else {
        setImage(res.base64);
        handleUpdateImage('data:image/jpeg;base64,' + res.base64, 'gallery');
      }
    });
  };

  const onOpenCamera = () => {
    launchCamera({mediaType: 'photo', includeBase64: true}, (res) => {
      if (res.didCancel) {
      } else {
        setImage(res.base64);
        handleUpdateImage('data:image/jpeg;base64,' + res.base64, 'camera');
      }
    });
  };

  const handleUpdateImage = (value, type) => {
    if (type === 'gallery') {
      setIsLoadingUpdateImageGalery(true);
    } else {
      setIsLoadingUpdateImageCamera(true);
    }

    let data = {
      profile_pic_path: value,
    };

    updateImageProfile(dataMain.user_id, data)
      .then((res) => {
        if (type === 'gallery') {
          setIsLoadingUpdateImageGalery(false);
        } else {
          setIsLoadingUpdateImageCamera(false);
        }
        if (res.code === 200) {
          bottomSheetProfilePictureRef.current.close();
          fetchMyProfile(false);
        }
      })
      .catch(() => {
        if (type === 'gallery') {
          setIsLoadingUpdateImageGalery(false);
        } else {
          setIsLoadingUpdateImageCamera(false);
        }
      });
  };

  const handleRemoveImageProfile = async () => {
    setIsLoadingRemoveImage(true);
    removeImageProfile(dataMain.user_id)
      .then((res) => {
        setIsLoadingRemoveImage(false);
        if (res.code === 200) {
          bottomSheetProfilePictureRef.current.close();
          fetchMyProfile(false);
        }
      })
      .catch(() => {
        setIsLoadingRemoveImage(false);
        showMessage({
          message: 'Remove image profile error',
          type: 'danger',
        });
      });
  };

  const changeBio = () => {
    if (dataMain.bio !== null || dataMain.bio !== undefined) {
      setTempBio(dataMain.bio);
    }
    bottomSheetBioRef.current.open();
  };

  const handleSaveBio = () => {
    setIsLoadingUpdateBio(true);
    let data = {
      bio: tempBio,
    };
    updateBioProfile(dataMain.user_id, data)
      .then((res) => {
        setIsLoadingUpdateBio(false);
        if (res.code === 200) {
          bottomSheetBioRef.current.close();
          fetchMyProfile(false);
        }
      })
      .catch(() => {
        setIsLoadingUpdateBio(false);
        showMessage({
          message: 'Update bio profile error',
          type: 'danger',
        });
      });
  };

  const onChangeTempBio = (text) => {
    if (text.length < 350) {
      setErrorBio('');
    } else {
      setErrorBio('Max length bio 350');
    }
    setTempBio(text);
  };

  const renderBio = (string) => {
    return (
      <TouchableNativeFeedback onPress={() => changeBio()}>
        <View style={styles.containerBio}>
          {string === null || string === undefined ? (
            <Text>Add Bio</Text>
          ) : (
            <Text linkStyle={styles.seeMore}>
              {trimString(string, 121)}{' '}
              {string.length > 121 ? (
                <Text style={{color: colors.blue}}>see more</Text>
              ) : null}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    );
  };

  getToken().then((val) => {
    token_JWT = val;
  });

  console.log('token jwt ', token_JWT);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
        {isOffsetScroll ? (
          <View style={styles.tabsFixed}>
            <Text style={styles.postText}>Post ({})</Text>
          </View>
        ) : null}

        <ScrollView onScroll={handleScroll} ref={scrollViewReff}>
          {token_JWT !== '' && (
            <StreamApp
              apiKey={STREAM_API_KEY}
              appId={STREAM_APP_ID}
              token={token_JWT}>
              {!isLoading ? (
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.textUsername}>{dataMain.username}</Text>
                    <View style={styles.wrapHeaderButton}>
                      <View style={{marginRight: 20}}>
                        <TouchableNativeFeedback onPress={onShare}>
                          <ShareIcon
                            width={20}
                            height={20}
                            fill={colors.black}
                          />
                        </TouchableNativeFeedback>
                      </View>
                      <TouchableNativeFeedback onPress={goToSettings}>
                        <SettingIcon
                          width={20}
                          height={20}
                          fill={colors.black}
                        />
                      </TouchableNativeFeedback>
                    </View>
                  </View>
                  <View style={styles.wrapImageProfile}>
                    <TouchableNativeFeedback onPress={changeImage}>
                      <Image
                        style={styles.profileImage}
                        source={{
                          uri: dataMain.profile_pic_path
                            ? dataMain.profile_pic_path
                            : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
                        }}
                      />
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={changeName}>
                      <Text style={styles.nameProfile}>
                        {dataMain.real_name
                          ? dataMain.real_name
                          : 'no name specifics'}
                      </Text>
                    </TouchableNativeFeedback>
                  </View>
                  <View style={{...styles.wrapFollower, marginTop: 12}}>
                    <View style={styles.wrapRow}>
                      <Text style={styles.textTotal}>
                        {dataMain.follower_symbol}
                      </Text>
                      <Text style={styles.textFollow}>Followers</Text>
                    </View>
                    <View style={{marginLeft: 18}}>
                      <TouchableNativeFeedback
                        onPress={() =>
                          goToFollowings(dataMain.user_id, dataMain.username)
                        }>
                        <View style={styles.wrapRow}>
                          <Text style={styles.textTotal}>
                            {dataMain.following_symbol}
                          </Text>
                          <Text style={styles.textFollow}>Following</Text>
                        </View>
                      </TouchableNativeFeedback>
                    </View>
                  </View>

                  {renderBio(dataMain.bio)}
                </View>
              ) : null}

              {!isLoading ? (
                <View>
                  <View style={styles.tabs} ref={postRef}>
                    <Text style={styles.postText}>Post ({})</Text>
                  </View>
                  <View style={styles.containerFlatFeed}>
                    <FlatFeed
                      feedGroup="main_feed"
                      userId={tokenParse.user_id}
                      Activity={(props, index) => {
                        return RenderActivity(props, dataMain);
                      }}
                      notify
                    />
                  </View>
                </View>
              ) : null}

              <BottomSheetBio
                ref={bottomSheetBioRef}
                value={tempBio}
                onChangeText={(text) => onChangeTempBio(text)}
                handleSave={() => handleSaveBio()}
                isLoadingUpdateBio={isLoadingUpdateBio}
                error={errorBio}
              />
              <BottomSheetRealname
                ref={bottomSheetNameRef}
                setTempFullName={(text) => setTempFullName(text)}
                tempFullName={tempFullName}
                errorChangeRealName={errorChangeRealName}
                isChangeRealName={isChangeRealName}
                handleSave={() => handleSave()}
              />
              <BottomSheetImage
                ref={bottomSheetProfilePictureRef}
                onOpenImageGalery={() => onOpenImageGalery()}
                onOpenCamera={() => onOpenCamera()}
                handleRemoveImageProfile={() => handleRemoveImageProfile()}
                isLoadingUpdateImageGalery={isLoadingUpdateImageGalery}
                isLoadingUpdateImageCamera={isLoadingUpdateImageCamera}
                isLoadingRemoveImage={isLoadingRemoveImage}
              />
            </StreamApp>
          )}
        </ScrollView>

        {isShowButton ? (
          <TouchableNativeFeedback onPress={toTop}>
            <View style={{...styles.btnBottom, opacity}}>
              <ArrowUpWhiteIcon width={12} height={20} fill={colors.white} />
            </View>
          </TouchableNativeFeedback>
        ) : null}
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
  postText: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.bondi_blue,
  },
  containerFlatFeed: {
    padding: 20,
    flex: 1,
  },
  btnBottom: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 20,
    bottom: 50,
    backgroundColor: colors.bondi_blue,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  tabsFixed: {
    width: width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    zIndex: 2000,
    backgroundColor: colors.white,
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
});
export default ProfileScreen;
