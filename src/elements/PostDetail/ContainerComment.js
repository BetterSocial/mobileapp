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
          <>
            <Comment
              key={'p' + index}
              comment={item.data.text}
              username={item.user.data.username}
              onPress={() => navigation.navigate('ReplyComment', {item: item})}
            />
            {item.children_counts.comment > 0 && (
              <ReplyComment
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
              />
            )}
          </>
        );
      })}
    </View>
  );
};
const ReplyComment = ({data, countComment, navigation}) => {
  return (
    <ContainerReply>
      {data.map((item, index) => {
        console.log('count repy', item.children_counts.comment);
        return (
          <>
            <Comment
              key={'c' + index}
              comment={item.data.text}
              username={item.user.data.username}
              onPress={() => navigation.navigate('ReplyComment', {item: item})}
              isLast={
                index === countComment - 1 && item.children_counts.comment === 0
              }
            />
            {item.children_counts.comment > 0 && (
              <ReplyCommentChild
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
              />
            )}
          </>
        );
      })}
    </ContainerReply>
  );
};

const ReplyCommentChild = ({data, countComment, navigation, isLast}) => {
  return (
    <ContainerReply isGrandchild={countComment === 1}>
      {data.map((item, index) => {
        return (
          <Comment
            key={'c' + index}
            comment={item.data.text}
            username={item.user.data.username}
            onPress={() => navigation.navigate('ReplyComment', {item: item})}
            isLast={index === countComment - 1}
          />
        );
      })}
    </ContainerReply>
  );
};

const ContainerReply = ({children, isGrandchild}) => {
  return (
    <View
      style={[
        styles.containerReply,
        {borderColor: isGrandchild ? '#fff' : colors.gray1},
      ]}>
      {children}
    </View>
  );
};
export default ContainerComment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
  containerReply: {
    borderLeftWidth: 1,
    paddingLeft: 30,
  },
});
