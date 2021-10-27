import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/core';

import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const ButtonAddPost = () => {
  const navigator = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigator.navigate('CreatePost');
      }}>
      <MemoIc_pencil
        width={normalize(20)}
        height={normalize(20)}
        color={COLORS.white}
        style={{
          alignSelf: 'center',
        }}
      />
      {/* <Text style={styles.text}>New post</Text> */}
    </TouchableOpacity>
  );
};

export default ButtonAddPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#23C5B6',
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(50),
    justifyContent: 'center',
    position: 'absolute',
    bottom: normalize(61),
    right: normalize(20),
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  text: {
    fontFamily: fonts.inter[500],
    color: '#fff',
    fontSize: 12,
    marginLeft: 9.67,
  },
});
