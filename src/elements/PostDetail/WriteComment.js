import React from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {colors} from '../../utils/colors';

const WriteComment = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/images/ProfileDefault.png')}
      />
      <TextInput
        placeholder="Add a comment"
        style={styles.text}
        multiline={true}
      />
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
    backgroundColor: colors.lightgrey,
    flex: 1,
    marginLeft: 10,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
});
