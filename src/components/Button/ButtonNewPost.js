import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';
import {fonts, normalizeFontSize} from '../../utils/fonts';

const ButtonAddPost = () => {
  const navigator = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigator.navigate('CreatePost');
      }}>
      <MemoIc_pencil
        width={dimen.normalizeDimen(21)}
        height={dimen.normalizeDimen(21)}
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
    width: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    height: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center',
    position: 'absolute',
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    right: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT,
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
