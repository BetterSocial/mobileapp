import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const WriteComment = ({value = null, onPress, onChangeText}) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/images/ProfileDefault.png')}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.lightgrey,
          marginLeft: 10,
          borderRadius: 5,
          paddingHorizontal: 15,
          marginEnd: 24,
        }}>
        <TextInput
          placeholder="Add a comment"
          multiline={true}
          style={styles.text}
          onChangeText={onChangeText}
          value={value}
        />
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              backgroundColor: '#00ADB5',
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderRadius: 8,
              width: 80,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontFamily: fonts.inter[400]}}>
              Reply
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WriteComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 22,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 32,
    height: 32,
  },
  text: {
    flex: 1,
  },
});
