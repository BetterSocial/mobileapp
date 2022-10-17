import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Comment from "./Comment";
import ConnectorWrapper from './ConnectorWrapper';
import LoadingComment from '../LoadingComment';
import StringConstant from '../../utils/string/StringConstant';
import {colors} from '../../utils/colors';
import ButtonHightlight from '../ButtonHighlight';

const ContainerComment = ({comments, indexFeed, isLoading, refreshComment, refreshChildComment, navigateToReplyView, findCommentAndUpdate, updateVoteLatestChildren}) => {
  const navigation = useNavigation();
  const isLast = (index, item) => (
      index === comments.length - 1 && (item.children_counts.comment || 0) === 0
    );

  const isLastInParent = (index) => index === comments.length - 1;

  const hideLeftConnector = (index) => index === comments.length - 1;
  return (
    <View style={styles.container}>
      <View style={styles.lineBeforeProfile} />
      {comments.map((item, index) => (
          <View key={index} >
            <View key={`p${  index}`}>
              {item.user ? <Comment
                indexFeed={indexFeed}
                key={`p${  index}`}
                comment={item}
                user={item.user}
                level={0}
                time={item.created_at}
                photo={item.user.data.profile_pic_url}
                isLast={isLast(index, item)}
                isLastInParent={isLastInParent(index)}
                onPress={() => navigateToReplyView({
                  item,
                  level: 0,
                  indexFeed,
                })}
                refreshComment={refreshComment}
                findCommentAndUpdate={findCommentAndUpdate}
              /> : null}
              
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
                findCommentAndUpdate={findCommentAndUpdate}
              />
            )}
          </View>
        ))}
      {isLoading ? <LoadingComment /> : null}
    </View>
  );
};

const ReplyComment = ({
  indexFeed,
  data,
  countComment,
  hideLeftConnector,
  refreshComment,
  navigateToReplyView,
  findCommentAndUpdate
}) => {
  const isLast = (item, index) => (
      index === countComment - 1 && (item.children_counts.comment || 0) === 0
    );

  const isLastInParent = (index) => index === countComment - 1;

  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => {
        const showCommentView = () => {
          navigateToReplyView({
            item,
            level: 2,
            indexFeed,
          });
        }
          

        const showChildCommentView = () => {
            navigateToReplyView({
            item,
            level: 2,
            indexFeed,
          });

        }
        return (
          <React.Fragment key={`c-${index}`}>
            {item.user ? <ConnectorWrapper  index={index}>
            <View key={`c${  index}`} style={styles.levelOneCommentWrapper}>
              <Comment
                indexFeed={indexFeed}
                key={`c${  index}`}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={1}
                photo={item.user.data.profile_pic_url}
                time={item.created_at}
                onPress={showCommentView}
                isLast={isLast(item, index)}
                refreshComment={refreshComment}
                findCommentAndUpdate={findCommentAndUpdate}
              />
              {item.children_counts.comment > 0 && (
                <>
                  <View
                    style={styles.seeRepliesContainer(isLastInParent(index))}>
                    <View style={styles.connector} />
                    <ButtonHightlight onPress={showChildCommentView}>
                      <Text style={styles.seeRepliesText}>
                        {StringConstant.postDetailPageSeeReplies(
                          item.children_counts.comment || 0,
                        )}
                      </Text>
                    </ButtonHightlight>
                  </View>
                </>
              )}
            </View>
          </ConnectorWrapper> : null}
            
          </React.Fragment>
          
        );
      })}
    </ContainerReply>
  );
};
const ContainerReply = ({children, isGrandchild, hideLeftConnector}) => (
    <View
      style={[
        styles.containerReply(hideLeftConnector),
        {borderColor: isGrandchild ? '#fff' : colors.gray1},
      ]}>
      {children}
    </View>
  );
export default React.memo (ContainerComment, (prevProps, nextProps) => prevProps.comments === nextProps.comments);

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
