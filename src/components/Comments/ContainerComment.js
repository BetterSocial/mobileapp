import * as React from 'react';
import moment from 'moment';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Comment from '../../components/Comments/Comment';
import ConnectorWrapper from './ConnectorWrapper';
import LoadingComment from '../LoadingComment';
import StringConstant from '../../utils/string/StringConstant';
import {DATALOADING} from '../../utils/string/LoadingComment';
import {colors} from '../../utils/colors';

const ContainerComment = ({comments, indexFeed, isLoading, refreshComment, refreshChildComment, navigateToReplyView}) => {
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.lineBeforeProfile} />
      {comments.map((item, index) => {
        return (
          <View key={index} >
            <View key={'p' + index}>
              <Comment
                indexFeed={indexFeed}
                key={'p' + index}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={0}
                time={item.created_at}
                photo={item.user.data.profile_pic_url}
                isLast={isLast(index, item)}
                isLastInParent={isLastInParent(index, item)}
                onPress={() => navigateToReplyView({
                  item: item,
                  level: 0,
                  indexFeed: indexFeed,
                })}
                refreshComment={refreshComment}
              />
            </View>
            {item.children_counts.comment > 0 && (
              <ReplyComment
                hideLeftConnector={hideLeftConnector(index, item)}
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
                indexFeed={indexFeed}
                navigateToReplyView={navigateToReplyView}
                refreshComment={(children) => refreshChildComment({parent: item, children: children.data})}
              />
            )}
          </View>
        );
      })}
      {isLoading ? <LoadingComment /> : null}
    </View>
  );
};

const ReplyComment = ({
  indexFeed,
  data,
  countComment,
  navigation,
  hideLeftConnector,
  refreshComment,
  navigateToReplyView
}) => {
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
          navigateToReplyView({
            item: item,
            level: 1,
            indexFeed: indexFeed,
          });

        const showChildCommentView = () =>
          navigateToReplyView({
            item: item,
            level: 2,
            indexFeed: indexFeed,
          });

        return (
          <ConnectorWrapper index={index}>
            <View key={'c' + index} style={styles.levelOneCommentWrapper}>
              <Comment
                indexFeed={indexFeed}
                key={'c' + index}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={1}
                photo={item.user.data.profile_pic_url}
                time={item.created_at}
                onPress={showCommentView}
                isLast={isLast(item, index)}
                refreshComment={refreshComment}
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
    paddingLeft: 30,
    paddingRight: 8,
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
