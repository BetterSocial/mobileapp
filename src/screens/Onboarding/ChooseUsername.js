import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
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
const ChooseUsername = () => {
  const navigation = useNavigation();
  const [, dispatch] = useContext(Context).users;
  const [username, setUsernameState] = useState('');
  const [typeFetch, setTypeFetch] = useState('');

  const onPhoto = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, (res) => {
      setImage(res.base64, dispatch);
    });
  };
  const checkUsername = async (v) => {
    let value = v.replace(/[^a-zA-Z0-9-_]/g, '');
    setTypeFetch('typing');
    setUsernameState(value);
    if (v.length > 2) {
      setTypeFetch('fetch');
      const user = await verifyUsername(value);
      if (user.data) {
        setTypeFetch('notavailable');
      } else {
        setTypeFetch('available');
      }
    } else {
      setTypeFetch('typing');
    }
  };
  const next = () => {
    if (username && username.length > 2 && typeFetch === 'available') {
      setUsername(username, dispatch);
      navigation.navigate('LocalComunity');
      // showMessage({
      //   message: 'Simple message',
      //   type: 'info',
      // });
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
              color: '#27AE60',
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
              color: '#EB5757',
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
              color: '#EB5757',
              fontFamily: fonts.inter[400],
            }}>
            username min 3 characters
          </Text>
        );
      default:
        return <Text />;
    }
  };
  return (
    <View style={styles.container}>
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
            <MemoIc_btn_add width={48} height={48} />
          </TouchableOpacity>
          <View>
            <Input
              placeholder="Username"
              onChangeText={(v) => checkUsername(v)}
              value={username}
              autoCompleteType="username"
              textContentType="username"
            />
            {messageTypeFetch(typeFetch, username)}
          </View>
        </View>
        <View style={styles.constainerInfo}>
          <View style={styles.containerIcon}>
            <IconFontAwesome5 name="exclamation" size={14} color="#3490cd" />
          </View>
          <Text style={styles.infoText}>
            Remember that whatever your name, you will always be able to post
            anonymously
          </Text>
        </View>
      </View>
      <Button onPress={() => next()}>NEXT</Button>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 32,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 44,
    color: '#11243D',
    marginTop: 24,
  },
  desc: {
    fontSize: 14,
    color: '#828282',
  },
  btnImage: {
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  constainerInfo: {
    backgroundColor: '#ddf2fe',
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
    backgroundColor: '#b6e4fd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: '#258FCB',
    marginLeft: 12,
    lineHeight: 24,
    width: width - 95,
  },
  containerAddIcon: {
    backgroundColor: '#2D9CDB',
    width: 48,
    height: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
});
