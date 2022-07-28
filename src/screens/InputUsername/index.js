import * as React from 'react';
import _ from 'lodash';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/core';

import BottomSheetChooseImage from './elements/BottomSheetChooseImage';
import MemoOnboardingChangeProfilePlusIcon from '../../assets/icon/OnboardingChangeProfilePlusIcon';
import StringConstant from '../../utils/string/StringConstant';
import { Button } from '../../components/Button';
import { Context } from '../../context';
import { DEFAULT_PROFILE_PIC_PATH } from '../../utils/constants';
import { Input } from '../../components/Input';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import {
  requestCameraPermission,
  requestExternalStoragePermission,
} from '../../utils/permission';
import { setCapitalFirstLetter } from '../../utils/Utils';
import { setImage, setUsername } from '../../context/actions/users';
import { verifyUsername } from '../../service/users';

const {width} = Dimensions.get('screen');

const ChooseUsername = () => {
  const navigation = useNavigation();
  const bottomSheetChooseImageRef = React.useRef();
  const [users, dispatch] = React.useContext(Context).users;
  const [username, setUsernameState] = React.useState('');
  const [typeFetch, setTypeFetch] = React.useState('');
  const [showInfo, setShowInfo] = React.useState(false)
  const [fadeInfo] = React.useState(new Animated.Value(0))

  const verifyUsernameDebounce = React.useCallback(_.debounce(async (text) => {
    const user = await verifyUsername(text);
    setTypeFetch('max');
    if (user.data && text.length > 2) {
      setTypeFetch('notavailable');
    } else {
      setTypeFetch('available');
    }
  }, 500), [])

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', hideInfo)
    Keyboard.addListener('keyboardDidHide', showInfoHandle)
  }, [])

  const hideInfo = () => {
    Animated.timing(fadeInfo, {
      toValue: 0,
      duration: 500
    }).start()
  }
  const showInfoHandle = () => {
    Animated.timing(fadeInfo, {
      toValue: 1,
      duration: 500
    }).start()
  }

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChooseUsername',
      screen_name: 'onb_user_profilepic',
    });
  }, []);

  const onPhoto = () => {
    analytics().logEvent('btn_take_photo_profile', {
      id: 2,
    });
    bottomSheetChooseImageRef.current.open();
  };

  const handleOpenCamera = async () => {
    const { success, message } = await requestCameraPermission();
    if (success) {
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          selectionLimit: 1,
        },
        (res) => {
          if (res.base64) {
            setImage(`${res.base64}`, dispatch);
            bottomSheetChooseImageRef.current.close();
          }
        },
      );
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const handleOpenGallery = async () => {
    const { success, message } = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (res) => {
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
    const value = v.replace(/[^a-zA-Z0-9-_]/g, '');
    // const value = setCapitalFirstLetter(v);
    setTypeFetch('typing');
    setUsernameState(value);
    if (value.length <= 15) {
      if (value.length > 2) {
        if (isNaN(v)) {
          setTypeFetch('fetch');
          verifyUsernameDebounce(value)
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

  const onTextBlur = () => {
    console.log('on blur')
    let value = username.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    value = setCapitalFirstLetter(value);
    setUsernameState(value);
  }

  const next = () => {
    if (username && username.length > 2 && typeFetch === 'available') {
      setUsername(username, dispatch);
      navigation.navigate('LocalCommunity');
    } else {
      if (!username) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameErrorCannotBeEmpty,
          type: 'danger',
          backgroundColor: colors.red,
        });
      }

      if (username.length <= 2) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelMinimumChar,
          type: 'danger',
          backgroundColor: colors.red,
        });
      }

      if (username.length > 15) {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelMaximumChar,
          type: 'danger',
          backgroundColor: colors.red,
        });
      }

      if (typeFetch === 'notavailable') {
        return showMessage({
          message:
            StringConstant.onboardingChooseUsernameLabelUserTaken(username),
          type: 'danger',
          backgroundColor: colors.red,
        });
      }

      if (typeFetch === 'nan') {
        return showMessage({
          message: StringConstant.onboardingChooseUsernameLabelJustANumber,
          type: 'danger',
          backgroundColor: colors.red,
        });
      }
    }
  };
  const messageTypeFetch = (type, user) => {
    switch (type) {
      case 'fetch':
        return (
          <Text style={styles.textMessage('#BDBDBD', true)}>
            {` ${StringConstant.onboardingChooseUsernameLabelCheckingAvailability}`}
          </Text>
        );
      case 'available':
        return (
          <Text style={styles.textMessage(colors.holytosca, true)}>
            {` ${StringConstant.onboardingChooseUsernameLabelUserAvailable(
              user,
            )}`}
          </Text>
        );
      case 'notavailable':
        return (
          <Text style={styles.textMessage(colors.red, true)}>
            {` ${StringConstant.onboardingChooseUsernameLabelUserTaken(user)}`}
          </Text>
        );
      case 'typing':
        return (
          <Text style={styles.textMessage(colors.red, true)}>
            {` ${StringConstant.onboardingChooseUsernameLabelMinimumChar}`}
          </Text>
        );
      case 'max':
        return (
          <Text style={styles.textMessage(colors.red, false)}>
            {` ${StringConstant.onboardingChooseUsernameLabelMaximumChar}`}
          </Text>
        );
      case 'nan':
        return (
          <Text style={styles.textMessage(colors.red, false)}>
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

      <KeyboardAvoidingView
        style={styles.keyboardavoidingview}
        behavior={'height'}
        keyboardVerticalOffset={18}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
          <View style={styles.content}>
            <ProgressBar isStatic={true} value={25} />
            <Text style={styles.title}>
              {StringConstant.onboardingChooseUsernameHeadline}
            </Text>
            <Text style={styles.desc}>
              {StringConstant.onboardingChooseUsernameSubHeadline}
            </Text>
            <View style={styles.containerInput}>
              <TouchableOpacity
                style={styles.containerAddIcon}
                onPress={() => onPhoto()}>
                <View style={{}}>
                  <Image
                    source={{
                      uri: users.photo
                        ? `data:image/png;base64,${users.photo}`
                        : DEFAULT_PROFILE_PIC_PATH,
                      cache: 'reload',
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
                {messageTypeFetch(typeFetch, username)}
              </View>
            </View>
            {/* <Animated.View style={[styles.constainerInfo, {opacity: fadeInfo}]}>
            <View style={styles.parentIcon} >
            <View style={styles.containerIcon}>
              <IconFontAwesome5 name="exclamation" size={12} color="#2F80ED" />
            </View>
            </View>
              <View style={styles.parentInfo} >
              <Text style={styles.infoText}>
              {StringConstant.onboardingChooseUsernameBlueBoxHint}
            </Text>
              </View>
            
          </Animated.View> */}

          </View>
        </TouchableWithoutFeedback>

        <View style={styles.gap} />
        <View style={styles.footer} >
          <Text
            style={
              styles.textSmall
            }>No matter your username, you can always post anonymously</Text>
          <Button onPress={() => next()}>
            {StringConstant.onboardingChooseUsernameButtonStateNext}
          </Button>
        </View>

      </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
  btnNext: { marginTop: 16 },
  gap: { flex: 1 },
  icon: {
    width: 14,
    height: 14,
    position: 'absolute',
    bottom: -5,
    left: 19,
  },
  image: {
    height: 52,
    width: 52,
    borderRadius: 26,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 43.57,
    color: '#11243D',
    marginTop: 24,
  },
  desc: {
    fontSize: 14,
    color: 'rgba(130,130,130,0.84)',
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 24,
  },
  btnImage: {
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'normal',
    fontSize: 14,
    color: 'rgba(47, 128, 237, 1)',
    // marginLeft: 12,
    lineHeight: 24,
    paddingHorizontal: 4
    // width: width - 95,
    // backgroundColor: 'red'
  },
  containerAddIcon: {
    marginRight: 13,
  },
  content: {
    paddingHorizontal: 20
  },
  keyboardavoidingview: {
    flex: 1,
    // paddingHorizontal: 20,
    paddingTop: 75,
    // paddingBottom: 32,
    justifyContent: 'flex-end',
  },
  textMessage: (color, marginTop) => ({
    fontSize: 12,
    color,
    fontFamily: fonts.inter[400],
    marginTop: marginTop ? 6 : 0,
  }),
  parentIcon: {
    width: '10%',
    alignItems: 'center'
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
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    height: 112,

  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'center',
    color: colors.emperor,
    marginBottom: 20,
    marginTop: 10,
  }
});
