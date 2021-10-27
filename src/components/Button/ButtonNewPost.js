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
        width={normalize(19)}
        height={normalize(19)}
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
    flexDirection: 'row',
    bottom: normalize(61),
    right: normalize(20),
    zIndex: 1,
  },
  text: {
    fontFamily: fonts.inter[500],
    color: '#fff',
    fontSize: 12,
    marginLeft: 9.67,
  },
});
