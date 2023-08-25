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
import MemoOnboardingChangeProfilePlusIcon from '../../assets/icon/OnboardingChangeProfilePlusIcon';
import StringConstant from '../../utils/string/StringConstant';
import WarningIcon from '../../assets/icon-svg/warning_circle_blue.svg';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Header} from '../../components';
import {Input} from '../../components/Input';
import {ProgressBar} from '../../components/ProgressBar';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
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
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          selectionLimit: 1
        },
        (res) => {
          if (res.uri) setImageUrl(res.uri, dispatch);
          if (res.base64) {
            setImage(`${res.base64}`, dispatch);
            bottomSheetChooseImageRef.current.close();
          }
        }
      );
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const handleOpenGallery = async () => {
    const {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
        if (res.uri) setImageUrl(res.uri, dispatch);
        if (res.base64) {
          setImage(`${res.base64}`, dispatch);
          bottomSheetChooseImageRef.current.close();
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

  const showAlertProfilePicture = () => {
    Alert.alert(
      StringConstant.onboardingChooseUsernameAlertProfilePictureTitle,
      StringConstant.onboardingChooseUsernameAlertProfilePictureDesc,
      [
        {
          text: 'Add profile picture',
          onPress: () => onPhoto()
        },
        {
          text: 'Skip',
          style: 'cancel',
          onPress: () => next()
        }
      ]
    );
  };

  const checkProfilePicture = () => {
    if (users.photo) {
      next();
    } else {
      showAlertProfilePicture();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <Header />
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
              <View style={{flex: 1}}>
                <Input
                  placeholder="Username"
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
            <View style={styles.constainerInfo}>
              <View style={styles.parentIcon}>
                <WarningIcon />
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
        <View style={styles.footer}>
          <Button disabled={isNextButtonDisabled()} onPress={() => checkProfilePicture()}>
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#BDBDBD',
    paddingHorizontal: 23,
    paddingVertical: 13,
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    color: colors.gray,
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 12
  },
  btnImage: {
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  constainerInfo: {
    backgroundColor: 'rgba(47, 128, 237, 0.2)',
    flexDirection: 'row',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 7,
    paddingVertical: 8
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
    paddingTop: 20,
    paddingHorizontal: 20
  },
  keyboardavoidingview: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingTop: 75,
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
    justifyContent: 'flex-end'
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
