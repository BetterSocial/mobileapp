import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../utils/colors';
import Comment from './Comment';

const ContainerComment = () => {
  return (
    <View style={styles.container}>
      <Comment />
      <View style={styles.containerReply}>
        <ReplayComment />
      </View>
      <Comment />
      <ContainerReply>
        <ReplayComment />
      </ContainerReply>
    </View>
  );
};
const ReplayComment = () => {
  return (
    <View>
      <Comment />
      <ContainerReply>
        <Comment />
      </ContainerReply>
    </View>
  );
};
const ContainerReply = ({children}) => {
  return <View style={styles.containerReply}>{children}</View>;
};
export default ContainerComment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    marginBottom: 70,
  },
  containerReply: {
    borderLeftColor: colors.gray1,
    borderLeftWidth: 1,
    paddingLeft: 30,
  },
});
