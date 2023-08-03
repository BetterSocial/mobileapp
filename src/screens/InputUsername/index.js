import * as React from 'react';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import {
  Animated,
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
import ImagePicker from 'react-native-image-crop-picker';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';

import BottomSheetChooseImage from './elements/BottomSheetChooseImage';
import MemoOnboardingChangeProfilePlusIcon from '../../assets/icon/OnboardingChangeProfilePlusIcon';
import WarningIcon from '../../../assets/icons/warning-circle-blue.svg';
import StringConstant from '../../utils/string/StringConstant';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Input} from '../../components/Input';
import {ProgressBar} from '../../components/ProgressBar';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import {setCapitalFirstLetter} from '../../utils/Utils';
import {setImage, setUsername} from '../../context/actions/users';
import {verifyUsername} from '../../service/users';
import {COLORS} from '../../utils/theme';

const MAXIMUM_USERNAME_LENGTH = 19;
const MINIMUM_USERNAME_LENGTH = 3;

const ChooseUsername = () => {
  const navigation = useNavigation();
  const bottomSheetChooseImageRef = React.useRef();
  const [users, dispatch] = React.useContext(Context).users;
  const [username, setUsernameState] = React.useState('');
  const [typeFetch, setTypeFetch] = React.useState('');
  const [fadeInfo] = React.useState(new Animated.Value(0));

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

  const hideInfo = () => {
    Animated.timing(fadeInfo, {
      toValue: 0,
      duration: 500
    }).start();
  };
  const showInfoHandle = () => {
    Animated.timing(fadeInfo, {
      toValue: 1,
      duration: 500
    }).start();
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', hideInfo);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', showInfoHandle);

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onPhoto = () => {
    Analytics.logEvent('btn_take_photo_profile', {
      id: 2
    });
    bottomSheetChooseImageRef.current.open();
  };

  const handleOpenCamera = async () => {
    const {success, message} = await requestCameraPermission();
    if (success) {
      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      })
        .then((imageRes) => {
          setImage(imageRes.data, dispatch);
          bottomSheetChooseImageRef.current.close();
        })
        .catch((e) => {
          if (__DEV__) {
            console.log('error', e);
          }
        });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const handleOpenGallery = async () => {
    const {success, message} = await requestExternalStoragePermission();
    if (success) {
      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true
      })
        .then((imageRes) => {
          setImage(imageRes.data, dispatch);
          bottomSheetChooseImageRef.current.close();
        })
        .catch((e) => {
          if (__DEV__) {
            console.log('error', e);
          }
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
          backgroundColor: colors.red
        });
      }

      if (username.length < MINIMUM_USERNAME_LENGTH) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelMinimumChar,
          type: 'danger',
          backgroundColor: colors.red
        });
      }

      if (username.length > MAXIMUM_USERNAME_LENGTH) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelMaximumChar,
          type: 'danger',
          backgroundColor: colors.red
        });
      }

      if (typeFetch === 'notavailable') {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelUserTaken(username),
          type: 'danger',
          backgroundColor: colors.red
        });
      }

      if (typeFetch === 'nan') {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelJustANumber,
          type: 'danger',
          backgroundColor: colors.red
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
          <Text style={styles.textMessage('#BDBDBD')}>
            {` ${StringConstant.onboardingChooseUsernameLabelCheckingAvailability}`}
          </Text>
        );
      case 'available':
        return (
          <Text style={styles.textMessage(colors.holytosca)}>
            {` ${StringConstant.onboardingChooseUsernameLabelUserAvailable(user)}`}
          </Text>
        );
      case 'notavailable':
        return (
          <Text style={styles.textMessage(colors.red)}>
            {` ${StringConstant.onboardingChooseUsernameLabelUserTaken(user)}`}
          </Text>
        );
      case 'typing':
        return (
          <Text style={styles.textMessage(colors.red)}>
            {` ${StringConstant.onboardingChooseUsernameLabelMinimumChar}`}
          </Text>
        );
      case 'max':
        return (
          <Text style={styles.textMessage(colors.red)}>
            {` ${StringConstant.onboardingChooseUsernameLabelMaximumChar}`}
          </Text>
        );
      case 'nan':
        return (
          <Text style={styles.textMessage(colors.red)}>
            {` ${StringConstant.onboardingChooseUsernameLabelJustANumber}`}
          </Text>
        );
      default:
        return <Text />;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />

      <View style={styles.keyboardavoidingview}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <ProgressBar isStatic={true} value={25} />
            <Text style={styles.title}>{StringConstant.onboardingChooseUsernameHeadline}</Text>
            <Text style={styles.desc}>{StringConstant.onboardingChooseUsernameSubHeadline}</Text>
            <View style={styles.containerInput}>
              <TouchableOpacity style={styles.containerAddIcon} onPress={() => onPhoto()}>
                <View style={{}}>
                  <Image
                    source={{
                      uri: users.photo
                        ? `data:image/png;base64,${users.photo}`
                        : DEFAULT_PROFILE_PIC_PATH,
                      cache: 'reload'
                    }}
                    width={52}
                    height={52}
                    style={styles.image}
                  />
                  <View style={styles.icon}>
                    <MemoOnboardingChangeProfilePlusIcon />
                  </View>
                </View>
              </TouchableOpacity>
              <View>
                <Input
                  placeholder="Username"
                  onChangeText={checkUsername}
                  onBlur={onTextBlur}
                  value={username}
                  autoCompleteType="username"
                  textContentType="username"
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  autoFocus
                />
                {messageTypeFetch(typeFetch, formatUsernameString())}
              </View>
            </View>
            <Animated.View style={[styles.constainerInfo, {opacity: fadeInfo}]}>
              <View style={styles.parentIcon}>
                <View style={styles.containerIcon}>
                  <WarningIcon />
                </View>
              </View>
              <View style={styles.parentInfo}>
                <Text style={styles.infoText}>
                  {StringConstant.onboardingChooseUsernameBlueBoxHint}
                </Text>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.gap} />
        <View style={styles.footer}>
          <Text style={styles.textSmall}>
            No matter your username, you can always post anonymously
          </Text>
          <Button disabled={isNextButtonDisabled()} onPress={() => next()}>
            {StringConstant.onboardingChooseUsernameButtonStateNext}
          </Button>
        </View>
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
    marginTop: 28,
    marginBottom: 20
  },
  container: {
    flex: 1
  },
  btnNext: {marginTop: 16},
  gap: {flex: 1},
  icon: {
    width: 14,
    height: 14,
    position: 'absolute',
    bottom: -5,
    left: 19
  },
  image: {
    height: 52,
    width: 52,
    borderRadius: 26
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 43.57,
    color: '#11243D',
    marginTop: 24
  },
  desc: {
    fontSize: 14,
    color: 'rgba(130,130,130,0.84)',
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 24
  },
  btnImage: {
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  constainerInfo: {
    backgroundColor: 'rgba(85, 194, 255, 0.3)',
    flexDirection: 'row',
    borderRadius: 4,
    width: '100%',
    paddingHorizontal: 7,
    paddingVertical: 13
  },
  containerIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: 'rgba(47,128,237,0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    marginTop: 3
    // marginRight: 7
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: COLORS.blue,
    // marginLeft: 12,
    lineHeight: 24,
    paddingHorizontal: 4
    // width: width - 95,
    // backgroundColor: 'red'
  },
  containerAddIcon: {
    marginRight: 13
  },
  content: {
    paddingHorizontal: 20
  },
  keyboardavoidingview: {
    flex: 1,
    // paddingHorizontal: 20,
    paddingTop: 75,
    // paddingBottom: 32,
    justifyContent: 'flex-end'
  },
  textMessage: (color) => ({
    fontSize: 12,
    color,
    fontFamily: fonts.inter[400],
    marginTop: 6
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    height: 112
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'center',
    color: colors.emperor,
    marginBottom: 20,
    marginTop: 10
  }
});
