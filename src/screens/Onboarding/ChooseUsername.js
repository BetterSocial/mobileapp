import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ProgressBar} from '../../components/ProgressBar';
import {Button} from '../../components/Button';
import IconFontAwesome5 from 'react-native-vector-icons//FontAwesome5';
const width = Dimensions.get('screen').width;
import {launchImageLibrary} from 'react-native-image-picker';
import MemoIc_btn_add from '../../assets/icons/Ic_btn_add';
import {Input} from '../../components/Input';
import {Context} from '../../context';
import {setImage, setUsername} from '../../context/actions/users';
import {useNavigation} from '@react-navigation/core';
import {verifyUsername} from '../../service/users';
import {fonts} from '../../utils/fonts';
import {showMessage} from 'react-native-flash-message';
import {colors} from '../../utils/colors';
import analytics from '@react-native-firebase/analytics';
import BtnAddPhoto from '../../assets/icon-svg/ic_btn_add_photo.svg';
const ChooseUsername = () => {
  const navigation = useNavigation();
  const [, dispatch] = useContext(Context).users;
  const [username, setUsernameState] = useState('');
  const [typeFetch, setTypeFetch] = useState('');
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChooseUsername',
      screen_name: 'onb_user_profilepic',
    });
  }, []);

  const onPhoto = () => {
    analytics().logEvent('btn_take_photo_profile', {
      id: 2,
    });
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
      setImage(res.base64, dispatch);
    });
  };

  const checkUsername = async (v) => {
    let value = v.replace(/[^a-zA-Z0-9-_]/g, '');
    value = value.toLowerCase();
    setTypeFetch('typing');
    setUsernameState(value);
    if (value.length <= 15) {
      if (value.length > 2) {
        if (isNaN(v)) {
          setTypeFetch('fetch');
          const user = await verifyUsername(value);
          console.log(user);
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
      showMessage({
        message: 'username cannot be empty',
        type: 'danger',
      });
    }
  };
  const messageTypeFetch = (type, user) => {
    switch (type) {
      case 'fetch':
        return (
          <Text
            style={{
              fontSize: 12,
              color: '#BDBDBD',
              fontFamily: fonts.inter[400],
            }}>
            Checking availability
          </Text>
        );
      case 'available':
        return (
          <Text
            style={{
              fontSize: 12,
              color: colors.holytosca,
              fontFamily: fonts.inter[400],
            }}>
            {' '}
            Congrats - {user} is still available
          </Text>
        );
      case 'notavailable':
        return (
          <Text
            style={{
              fontSize: 12,
              color: colors.red,
              fontFamily: fonts.inter[400],
            }}>
            Sorry, {user} has already been taken
          </Text>
        );
      case 'typing':
        return (
          <Text
            style={{
              fontSize: 12,
              color: colors.red,
              fontFamily: fonts.inter[400],
            }}>
            Username min. 3 characters
          </Text>
        );
      case 'max':
        return (
          <Text
            style={{
              fontSize: 12,
              color: colors.red,
              fontFamily: fonts.inter[400],
            }}>
            Username maximum 15 characters
          </Text>
        );
      case 'nan':
        return (
          <Text
            style={{
              fontSize: 12,
              color: colors.red,
              fontFamily: fonts.inter[400],
            }}>
            Username cannot be just a number
          </Text>
        );
      default:
        return <Text />;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardavoidingview}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        enabled>
        <View style={styles.content}>
          <ProgressBar isStatic={true} value={25} />
          <Text style={styles.title}>Choose your username</Text>
          <Text style={styles.desc}>
            Ping does not require real names - just make sure your friends will
            find & recognize you
          </Text>
          <View style={styles.containerInput}>
            <TouchableOpacity
              style={styles.containerAddIcon}
              onPress={() => onPhoto()}>
              <BtnAddPhoto width={52} height={57} />
            </TouchableOpacity>
            <View testID="wrapUsername">
              <Input
                testID="usernameInput"
                placeholder="Username"
                onChangeText={(v) => checkUsername(v)}
                value={username}
                autoCompleteType="username"
                textContentType="username"
                autoCapitalize="none"
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
              Whatever your username, you will always be able to post
              anonymously.
            </Text>
          </View>
        </View>

        <View style={{flex: 1}} />
        <Button style={{marginTop: 16}} onPress={() => next()}>
          NEXT
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChooseUsername;

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    marginTop: 28,
    marginBottom: 24,
  },
  container: {
    flex: 1,
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
});
