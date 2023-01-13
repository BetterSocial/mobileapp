import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Comment from "./Comment";
import ConnectorWrapper from './ConnectorWrapper';
import LoadingComment from '../LoadingComment';
import StringConstant from '../../utils/string/StringConstant';
import {colors} from '../../utils/colors';
import ButtonHightlight from '../ButtonHighlight';
import useReplyComment from './hooks/useReplyComment';
import useContainerComment from './hooks/useContainerComment';

const ContainerComment = ({comments, indexFeed, isLoading, navigateToReplyView, findCommentAndUpdate}) => {
  const navigation = useNavigation();
  const {isLast, isLastInParent, hideLeftConnector} = useContainerComment()

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
                isLast={isLast(index, item, comments)}
                isLastInParent={isLastInParent(index, comments)}
                onPress={() => navigateToReplyView({
                  item,
                  level: 0,
                  indexFeed,
                })}
                // refreshComment={refreshComment}
                findCommentAndUpdate={findCommentAndUpdate}
              /> : null}
              
            </View>
            {item.children_counts.comment > 0 && (
              <ReplyComment
                hideLeftConnector={hideLeftConnector(index, item, comments)}
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
                indexFeed={indexFeed}
                navigateToReplyView={navigateToReplyView}
                // refreshComment={(children) => refreshChildComment({parent: item, children: children.data})}
                findCommentAndUpdate={findCommentAndUpdate}
              />
            )}
          </View>
        ))}
      {isLoading ? <LoadingComment /> : null}
    </View>
  );
};

export const ReplyComment = ({
  indexFeed,
  data,
  countComment,
  hideLeftConnector,
  navigateToReplyView,
  findCommentAndUpdate
}) => {
  const {isLast, isLastInParent} = useReplyComment()

  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => 
         (
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
                onPress={() => navigateToReplyView({ item, level: 2, indexFeed})}
                isLast={isLast(item, index, countComment)}
                // refreshComment={refreshComment}
                findCommentAndUpdate={findCommentAndUpdate}
              />
              {item.children_counts.comment > 0 && (
                <>
                  <View
                    style={styles.seeRepliesContainer(isLastInParent(index, countComment))}>
                    <View style={styles.connector} />
                      <ButtonHightlight onPress={() => navigateToReplyView({item, level: 2, indexFeed})}>
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
          
        )
      )}
    </ContainerReply>
  );
};
export const ContainerReply = ({children, isGrandchild}) => (
    <View
      style={[
        styles.containerReply,
        {borderColor: isGrandchild ? '#fff' : colors.gray1},
      ]}>
      {children}
    </View>
  );

export const isEqual = (prevProps, nextProps) => prevProps.comments === nextProps.comments

export default React.memo (ContainerComment, isEqual);

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 8,
  },
  lineBeforeProfile: {
    height: 8.5,
    borderLeftWidth: 1,
    borderLeftColor: '#C4C4C4',
  },
  containerReply: {
      borderLeftWidth: 1,
  },
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
