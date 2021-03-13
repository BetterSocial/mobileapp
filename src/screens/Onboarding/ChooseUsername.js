import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {ProgressBar} from '../../components/ProgressBar';
import {Button} from '../../components/Button';
import IconFontAwesome5 from 'react-native-vector-icons//FontAwesome5';
const width = Dimensions.get('screen').width;
import {launchImageLibrary} from 'react-native-image-picker';
import MemoIc_btn_add from '../../assets/icons/Ic_btn_add';
const ChooseUsername = () => {
  const [username, setUsername] = useState('');
  const onPhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      console.log(res);
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProgressBar isStatic={true} value={25} />
        <Text style={styles.title}>Find your local community</Text>
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
          <Input
            placeholder="Username"
            onChangeText={(v) => setUsername(v)}
            value={username}
          />
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
      <Button>NEXT</Button>
    </View>
  );
};

export default ChooseUsername;

const Input = ({...props}) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    marginTop: 28,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#BDBDBD',
    paddingHorizontal: 23,
    paddingVertical: 13,
    width: width - 100,
    marginLeft: 13,
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
  },
});
