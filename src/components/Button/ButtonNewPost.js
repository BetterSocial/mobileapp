import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import {fonts} from '../../utils/fonts';

const ButtonAddPost = () => {
  const navigator = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigator.navigate('CreatePost')}>
      <MemoIc_pencil width={16.67} height={16.67} />
      <Text style={styles.text}>New post</Text>
    </TouchableOpacity>
  );
};

export default ButtonAddPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#23C5B6',
    paddingVertical: 13,
    paddingRight: 12,
    paddingLeft: 13.67,
    width: 109,
    borderRadius: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    flexDirection: 'row',
    bottom: 35,
    right: 20,
  },
  content: {},
  text: {
    fontFamily: fonts.inter[500],
    color: '#fff',
    fontSize: 12,
    marginLeft: 9.67,
  },
});
