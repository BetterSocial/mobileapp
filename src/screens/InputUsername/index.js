import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {showMessage} from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';

import {ProgressBar} from '../../components/ProgressBar';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {Context} from '../../context';
import {setImage, setUsername} from '../../context/actions/users';
import {verifyUsername} from '../../service/users';
import {fonts} from '../../utils/fonts';
import {colors} from '../../utils/colors';
import {
  requestCameraPermission,
  requestExternalStoragePermission,
} from '../../utils/permission';
import StringConstant from '../../utils/string/StringConstant';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import MemoOnboardingChangeProfilePlusIcon from '../../assets/icon/OnboardingChangeProfilePlusIcon';
import BottomSheetChooseImage from './elements/BottomSheetChooseImage';
import {setCapitalFirstLetter} from '../../utils/Utils';

const width = Dimensions.get('screen').width;

const ChooseUsername = () => {
  const navigation = useNavigation();
  const bottomSheetChooseImageRef = React.useRef();
  const [users, dispatch] = React.useContext(Context).users;
  const [username, setUsernameState] = React.useState('');
  const [typeFetch, setTypeFetch] = React.useState('');

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
    let {success, message} = await requestCameraPermission();
    console.log(success);
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
    let {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
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
    let value = v.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    value = setCapitalFirstLetter(value);
    setTypeFetch('typing');
    setUsernameState(value);
    if (value.length <= 15) {
      if (value.length > 2) {
        if (isNaN(v)) {
          setTypeFetch('fetch');
          const user = await verifyUsername(value);
          // console.log(user)
          setTypeFetch('max');
          if (user.data && v.length > 2) {
            setTypeFetch('notavailable');
          } else {
            setTypeFetch('available');
          }
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
  const next = () => {
    if (username && username.length > 2 && typeFetch === 'available') {
      setUsername(username, dispatch);
      navigation.navigate('LocalComunity');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={18}
        enabled>
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
                onChangeText={(v) => checkUsername(v)}
                value={username}
                autoCompleteType="username"
                textContentType="username"
                autoCapitalize
                autoCorrect={false}
              />
              {messageTypeFetch(typeFetch, username)}
            </View>
          </View>
          <View style={styles.constainerInfo}>
            <View style={styles.containerIcon}>
              <IconFontAwesome5 name="exclamation" size={14} color="#2F80ED" />
            </View>
            <Text style={styles.infoText}>
              {StringConstant.onboardingChooseUsernameBlueBoxHint}
            </Text>
          </View>
        </View>
        <View style={styles.gap} />
        <Button style={styles.btnNext} onPress={() => next()}>
          {StringConstant.onboardingChooseUsernameButtonStateNext}
        </Button>
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
  btnNext: {marginTop: 16},
  gap: {flex: 1},
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
    backgroundColor: 'rgba(47,128,237,0.2)',
    flexDirection: 'row',
    borderRadius: 4,
    width: '100%',
    paddingLeft: 14,
    paddingTop: 13,
    paddingRight: 11,
    paddingBottom: 11,
  },
  containerIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(47,128,237,0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: colors.blue,
    marginLeft: 12,
    lineHeight: 24,
    width: width - 95,
  },
  containerAddIcon: {
    marginRight: 13,
  },
  content: {},
  keyboardavoidingview: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 32,
    justifyContent: 'flex-end',
  },
  textMessage: (color, marginTop) => ({
    fontSize: 12,
    color: color,
    fontFamily: fonts.inter[400],
    marginTop: marginTop ? 6 : 0,
  }),
});
