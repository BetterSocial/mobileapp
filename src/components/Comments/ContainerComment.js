import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import StringConstant from '../../utils/string/StringConstant';
import {colors} from '../../utils/colors';
import ConnectorWrapper from './ConnectorWrapper';
import Comment from '../../components/Comments/Comment';

const ContainerComment = ({comments}) => {
  const navigation = useNavigation();
  let isLast = (index, item) => {
    return (
      index === comments.length - 1 && (item.children_counts.comment || 0) === 0
    );
  };

  let isLastInParent = (index, item) => {
    return index === comments.length - 1;
  };

  let hideLeftConnector = (index, item) => {
    return index === comments.length - 1;
    // return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.lineBeforeProfile} />
      {comments.map((item, index) => {
        (item.latest_children.comment || []).sort((current, next) => {
          let currentMoment = moment(current.updated_at);
          let nextMoment = moment(next.updated_at);
          return currentMoment.diff(nextMoment);
        });

        console.log(item.user);
        return (
          <View>
            <View key={'p' + index}>
              <Comment
                key={'p' + index}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={0}
                time={item.created_at}
                photo={item.user.data.profile_pic_url}
                isLast={isLast(index, item)}
                isLastInParent={isLastInParent(index, item)}
                onPress={() => {
                  navigation.navigate('ReplyComment', {item: item, level: 0});
                }}
              />
            </View>
            {item.children_counts.comment > 0 && (
              <ReplyComment
                hideLeftConnector={hideLeftConnector(index, item)}
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
const ReplyComment = ({data, countComment, navigation, hideLeftConnector}) => {
  let isLast = (item, index) => {
    return (
      index === countComment - 1 && (item.children_counts.comment || 0) === 0
    );
  };

  let isLastInParent = (index) => {
    return index === countComment - 1;
  };

  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => {
        const showCommentView = () =>
          navigation.navigate('ReplyComment', {item: item, level: 1});

        const showChildCommentView = () =>
          navigation.navigate('ReplyComment', {item: item, level: 2});

        return (
          <ConnectorWrapper index={index}>
            <View key={'c' + index} style={styles.levelOneCommentWrapper}>
              <Comment
                key={'c' + index}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={1}
                photo={item.user.data.profile_pic_url}
                time={item.created_at}
                onPress={showCommentView}
                isLast={isLast(item, index)}
              />
              {item.children_counts.comment > 0 && (
                <>
                  <View
                    style={styles.seeRepliesContainer(isLastInParent(index))}>
                    <View style={styles.connector} />
                    <TouchableOpacity onPress={showChildCommentView}>
                      <Text style={styles.seeRepliesText}>
                        {StringConstant.postDetailPageSeeReplies(
                          item.children_counts.comment || 0,
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ConnectorWrapper>
        );
      })}
    </ContainerReply>
  );
};
const ContainerReply = ({children, isGrandchild, hideLeftConnector}) => {
  return (
    <View
      style={[
        styles.containerReply(hideLeftConnector),
        {borderColor: isGrandchild ? '#fff' : colors.gray1},
      ]}>
      {children}
    </View>
  );
};
export default ContainerComment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  lineBeforeProfile: {
    height: 8.5,
    borderLeftWidth: 1,
    borderLeftColor: '#C4C4C4',
  },
  containerReply: (hideLeftConnector) => ({
    borderLeftWidth: 1,
  }),
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? 'transparent' : colors.gray1,
    borderLeftWidth: 1,
  }),
  seeRepliesText: {
    color: colors.blue,
  },
  connector: {
    width: 15,
    height: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 21,
    borderLeftColor: colors.gray1,
    borderBottomColor: colors.gray1,
    marginRight: 4,
    marginLeft: -1,
  },
  levelOneCommentWrapper: {
    flex: 1,
    marginLeft: 0,
  },
});
