import * as React from 'react';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';

import BottomSheetChooseImage from './elements/BottomSheetChooseImage';
import IconWarningCircleBlue from '../../assets/icon/IconWarningCircleBlue';
import MemoOnboardingChangeProfilePlusIcon from '../../assets/icon/OnboardingChangeProfilePlusIcon';
import StringConstant from '../../utils/string/StringConstant';
import dimen from '../../utils/dimen';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Header} from '../../components';
import {Input} from '../../components/Input';
import {ProgressBar} from '../../components/ProgressBar';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import {setCapitalFirstLetter} from '../../utils/Utils';
import {setImage, setImageUrl, setUsername} from '../../context/actions/users';
import {verifyUsername} from '../../service/users';

const MAXIMUM_USERNAME_LENGTH = 19;
const MINIMUM_USERNAME_LENGTH = 3;

const ChooseUsername = () => {
  const navigation = useNavigation();
  const bottomSheetChooseImageRef = React.useRef();
  const [users, dispatch] = React.useContext(Context).users;
  const [username, setUsernameState] = React.useState('');
  const [typeFetch, setTypeFetch] = React.useState('');

  const verifyUsernameDebounce = React.useCallback(
    _.debounce(async (text) => {
      if (text?.length < MINIMUM_USERNAME_LENGTH) return setTypeFetch('min');
      if (text?.length > MAXIMUM_USERNAME_LENGTH) return setTypeFetch('max');
      const user = await verifyUsername(text);
      if (user.data) {
        return setTypeFetch('notavailable');
      }

      return setTypeFetch('available');
    }, 500),
    []
  );

  const onPhoto = () => {
    Analytics.logEvent('btn_take_photo_profile', {
      id: 2
    });
    bottomSheetChooseImageRef.current.open();
  };

  const handleOpenCamera = async () => {
    const {success, message} = await requestCameraPermission();
    if (success) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_CAMERA_SELECT
      );
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          selectionLimit: 1
        },
        (res) => {
          const uri = res?.assets?.[0]?.uri;
          const base64 = res?.assets?.[0]?.base64;
          if (uri) setImageUrl(uri, dispatch);
          if (base64) {
            setImage(`${base64}`, dispatch);
            bottomSheetChooseImageRef.current.close();
          }
          AnalyticsEventTracking.eventTrack(
            BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_IMAGE_CHANGED
          );
        }
      );
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const handleOpenGallery = async () => {
    const {success, message} = await requestExternalStoragePermission();
    if (success) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_LIBRARY_SELECT
      );
      launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
        const uri = res?.assets?.[0]?.uri;
        const base64 = res?.assets?.[0]?.base64;
        if (uri) setImageUrl(uri, dispatch);
        if (base64) {
          setImage(`${base64}`, dispatch);
          bottomSheetChooseImageRef.current.close();
        }
        AnalyticsEventTracking.eventTrack(
          BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_IMAGE_CHANGED
        );
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const checkUsername = async (v) => {
    verifyUsernameDebounce.cancel();
    const value = v.replace(/[^a-zA-Z0-9-_]/g, '');
    setTypeFetch('typing');
    setUsernameState(value);
    if (value.length <= MAXIMUM_USERNAME_LENGTH) {
      if (value.length >= MINIMUM_USERNAME_LENGTH) {
        if (!Number.isNaN(v)) {
          setTypeFetch('fetch');
          verifyUsernameDebounce(value);
        } else {
          setTypeFetch('nan');
        }
      } else {
        setTypeFetch('typing');
      }
    } else {
      setTypeFetch('max');
    }
  };

  const formatUsernameString = () => {
    if (username && typeof username === 'string') {
      let value = username.toLowerCase().replace(/[^a-z0-9-_]/g, '');
      value = setCapitalFirstLetter(value);
      return value;
    }
    return '';
  };

  const onTextBlur = () => {
    const value = formatUsernameString();
    setUsernameState(value);
  };

  // eslint-disable-next-line consistent-return
  const next = () => {
    if (username && username.length >= MINIMUM_USERNAME_LENGTH && typeFetch === 'available') {
      setUsername(username, dispatch);
      navigation.navigate('LocalCommunity');
    } else {
      if (!username) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameErrorCannotBeEmpty,
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (username.length < MINIMUM_USERNAME_LENGTH) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelMinimumChar,
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (username.length > MAXIMUM_USERNAME_LENGTH) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelMaximumChar,
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (typeFetch === 'notavailable') {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelUserTaken(username),
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (typeFetch === 'nan') {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelJustANumber,
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }
    }
  };

  const isNextButtonDisabled = () => {
    return typeFetch !== 'available';
  };

  const messageTypeFetch = (type, user) => {
    switch (type) {
      case 'fetch':
        return (
          <Text style={styles.textMessage(COLORS.gray410)}>
            {` ${StringConstant.onboardingChooseUsernameLabelCheckingAvailability}`}
          </Text>
        );
      case 'available':
        return (
          <Text style={styles.textMessage(COLORS.signed_primary)}>
            {` ${StringConstant.onboardingChooseUsernameLabelUserAvailable(user)}`}
          </Text>
        );
      case 'notavailable':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${StringConstant.onboardingChooseUsernameLabelUserTaken(user)}`}
          </Text>
        );
      case 'typing':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${StringConstant.onboardingChooseUsernameLabelMinimumChar}`}
          </Text>
        );
      case 'max':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${StringConstant.onboardingChooseUsernameLabelMaximumChar}`}
          </Text>
        );
      case 'nan':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${StringConstant.onboardingChooseUsernameLabelJustANumber}`}
          </Text>
        );
      default:
        return <Text />;
    }
  };

  const showAlertProfilePicture = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.ONBOARDING_USERNAME_NEXT_BUTTON_NO_PROFILE_PIC
    );

    Alert.alert(
      StringConstant.onboardingChooseUsernameAlertProfilePictureTitle,
      StringConstant.onboardingChooseUsernameAlertProfilePictureDesc,
      [
        {
          text: 'Add profile picture',
          style: 'cancel',
          onPress: () => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_ALERT_ADD_PHOTO
            );
            onPhoto();
          }
        },
        {
          text: 'Skip',
          onPress: () => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_ALERT_SKIP
            );
            next();
          }
        }
      ]
    );
  };

  const checkProfilePicture = () => {
    if (users.photo) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.ONBOARDING_USERNAME_NEXT_BUTTON_WITH_PROFILE_PIC
      );

      next();
    } else {
      showAlertProfilePicture();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <Header />
      <View style={styles.keyboardavoidingview}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <ProgressBar isStatic={true} value={25} />
            <Text style={styles.title}>{StringConstant.onboardingChooseUsernameHeadline}</Text>
            <Text style={styles.desc}>{StringConstant.onboardingChooseUsernameSubHeadline}</Text>
            <View style={styles.containerInput}>
              <TouchableOpacity
                style={styles.containerAddIcon}
                onPress={() => {
                  AnalyticsEventTracking.eventTrack(
                    BetterSocialEventTracking.ONBOARDING_USERNAME_PROFILE_PIC_CLICKED
                  );
                  onPhoto();
                }}>
                <View style={{}}>
                  <Image
                    source={{
                      uri: users.photo
                        ? `data:image/png;base64,${users.photo}`
                        : DEFAULT_PROFILE_PIC_PATH,
                      cache: 'reload'
                    }}
                    width={dimen.normalizeDimen(52)}
                    height={dimen.normalizeDimen(52)}
                    style={styles.image}
                  />
                  <View style={styles.icon}>
                    <MemoOnboardingChangeProfilePlusIcon fill={COLORS.signed_primary} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Input
                  placeholder="Username"
                  placeholderTextColor={COLORS.gray410}
                  onChangeText={checkUsername}
                  onBlur={onTextBlur}
                  value={username}
                  autoCompleteType="username"
                  textContentType="username"
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  style={styles.input}
                  autoFocus={false}
                />
                {messageTypeFetch(typeFetch, formatUsernameString())}
              </View>
            </View>
            <View style={styles.containerInfo}>
              <View style={styles.parentIcon}>
                <IconWarningCircleBlue fill={COLORS.white} fillIcon={COLORS.signed_primary} />
              </View>
              <View style={styles.parentInfo}>
                <Text style={styles.infoText}>
                  {StringConstant.onboardingChooseUsernameBlueBoxHint}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.gap} />
      </View>
      <View style={styles.footer}>
        <View style={styles.textSmallContainer} />
        <Button disabled={isNextButtonDisabled()} onPress={() => checkProfilePicture()}>
          {StringConstant.onboardingChooseUsernameButtonStateNext}
        </Button>
      </View>
      <BottomSheetChooseImage
        ref={bottomSheetChooseImageRef}
        onOpenCamera={handleOpenCamera}
        onOpenImageGalery={handleOpenGallery}
      />
    </SafeAreaView>
  );
};

export default ChooseUsername;

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    marginTop: dimen.normalizeDimen(28),
    marginBottom: dimen.normalizeDimen(20)
  },
  input: {
    borderWidth: dimen.normalizeDimen(1),
    borderRadius: dimen.normalizeDimen(8),
    borderColor: COLORS.gray210,
    backgroundColor: COLORS.gray110,
    color: COLORS.white,
    paddingHorizontal: dimen.normalizeDimen(23),
    paddingVertical: dimen.normalizeDimen(13),
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  btnNext: {marginTop: dimen.normalizeDimen(16)},
  gap: {flex: 1},
  icon: {
    width: dimen.normalizeDimen(14),
    height: dimen.normalizeDimen(14),
    position: 'absolute',
    bottom: dimen.normalizeDimen(-5),
    left: dimen.normalizeDimen(19)
  },
  image: {
    height: dimen.normalizeDimen(52),
    width: dimen.normalizeDimen(52),
    borderRadius: dimen.normalizeDimen(26)
  },
  title: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(36),
    lineHeight: normalizeFontSize(43.57),
    color: COLORS.white,
    marginTop: dimen.normalizeDimen(24)
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray510,
    marginTop: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(12)
  },
  containerInfo: {
    backgroundColor: COLORS.signed_secondary,
    flexDirection: 'row',
    borderRadius: dimen.normalizeDimen(8),
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(7),
    paddingVertical: dimen.normalizeDimen(8)
  },
  infoText: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    color: COLORS.white,
    lineHeight: normalizeFontSize(24),
    paddingHorizontal: dimen.normalizeDimen(4)
  },
  containerAddIcon: {
    marginRight: dimen.normalizeDimen(13)
  },
  content: {
    paddingTop: dimen.normalizeDimen(20),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  keyboardavoidingview: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textMessage: (color) => ({
    fontSize: normalizeFontSize(12),
    color,
    fontFamily: fonts.inter[400],
    marginTop: dimen.normalizeDimen(6)
  }),
  parentIcon: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  parentInfo: {
    width: '90%'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: dimen.normalizeDimen(112),
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmallContainer: {flex: 1}
});
