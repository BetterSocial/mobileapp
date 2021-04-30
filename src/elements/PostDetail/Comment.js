import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../utils/colors';

const Comment = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ProfileDefault.png')}
        style={styles.image}
      />
      <Text>Marlyn • 4h</Text>
      <Text>How many color variants are there?</Text>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
  },
  container: {
    borderLeftColor: colors.gray1,
    borderLeftWidth: 1,
  },
});
