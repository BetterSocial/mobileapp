import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 5
  }
});

const TopicHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text>{"Others cannot see which communities you're in"}</Text>
    </View>
  );
};

export default memo(TopicHeader);
