import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../utils/colors';
import Comment from './Comment';
import {useNavigation} from '@react-navigation/native';

const ContainerComment = ({comments}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {comments.map((item, index) => {
        return (
          <Comment
            comment={item.data.text}
            username={item.user.data.username}
            onPress={() => navigation.navigate('ReplyComment', {item: item})}
          />
        );
      })}
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
  },
  containerReply: {
    borderLeftColor: colors.gray1,
    borderLeftWidth: 1,
    paddingLeft: 30,
  },
});
