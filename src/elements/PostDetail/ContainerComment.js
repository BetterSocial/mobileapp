import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Comment from './Comment';

const ContainerComment = () => {
  return (
    <View style={styles.container}>
      <Comment />
    </View>
  );
};

export default ContainerComment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
});
