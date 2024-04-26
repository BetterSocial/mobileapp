import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Alert, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Comment from './Comment';
import ConnectorWrapper from './ConnectorWrapper';
import LoadingComment from '../LoadingComment';
import StringConstant from '../../utils/string/StringConstant';
import useContainerComment from './hooks/useContainerComment';
import useReplyComment from './hooks/useReplyComment';
import usePostContextHook, {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {deleteComment} from '../../service/comment';
import {getUserId} from '../../utils/users';
import usePostDetail from '../PostPageDetail/hooks/usePostDetail';
import {COLORS} from '../../utils/theme';
import {fonts, normalize} from '../../utils/fonts';

export const ContainerReply = ({children, isGrandchild}) => (
  <View style={[{borderColor: isGrandchild ? COLORS.almostBlack : COLORS.balance_gray}]}>
    {children}
  </View>
);

export const ReplyComment = ({
  indexFeed,
  data,
  countComment,
  hideLeftConnector,
  findCommentAndUpdate,
  onCommentLongPressed = () => {},
  updateVote,
  feedId,
  level = 1,
  onReplyButtonClick
}) => {
  const {isLast} = useReplyComment();
  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => (
        <React.Fragment key={`c-${index}`}>
          {item.user ? (
            <ConnectorWrapper index={index} level={level}>
              <TouchableWithoutFeedback onLongPress={() => onCommentLongPressed(item, 1)}>
                <View key={`c${index}`} style={styles.levelOneCommentWrapper}>
                  <Comment
                    feedId={feedId}
                    indexFeed={indexFeed}
                    key={`c${index}`}
                    comment={item}
                    onLongPress={() => onCommentLongPressed(item, 1)}
                    user={item.user}
                    level={level}
                    photo={item.user?.data?.profile_pic_url}
                    time={item.created_at || moment().format()}
                    isLast={isLast(item, index, countComment)}
                    findCommentAndUpdate={findCommentAndUpdate}
                    updateVote={updateVote}
                    onPress={(reactionId, replyUsername) =>
                      onReplyButtonClick(reactionId, replyUsername, level)
                    }
                  />
                  {item.children_counts.comment > 0 && (
                    <ReplyComment
                      feedId={feedId}
                      hideLeftConnector={true}
                      data={item.latest_children.comment}
                      countComment={item.children_counts.comment}
                      indexFeed={indexFeed}
                      findCommentAndUpdate={findCommentAndUpdate}
                      onCommentLongPressed={onCommentLongPressed}
                      updateVote={updateVote}
                      level={2}
                      onReplyButtonClick={onReplyButtonClick}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </ConnectorWrapper>
          ) : null}
        </React.Fragment>
      ))}
    </ContainerReply>
  );
};

const ListComment = ({
  indexFeed,
  index,
  onCommentLongPressed,
  item,
  isLast,
  isLastInParent,
  comments,
  findCommentAndUpdate,
  hideLeftConnector,
  updateVote,
  feedId,
  onReplyButtonClick
}) => {
  return (
    <TouchableWithoutFeedback key={index} onLongPress={() => onCommentLongPressed(item, 0)}>
      <View>
        <View key={`p${index}`}>
          {item.user ? (
            <Comment
              feedId={feedId}
              indexFeed={indexFeed}
              key={`p${index}`}
              comment={item}
              user={item.user}
              level={0}
              time={item.created_at}
              photo={item.user.data?.profile_pic_url}
              isLast={isLast(index, item, comments)}
              isLastInParent={isLastInParent(index, comments)}
              showLeftConnector={false}
              findCommentAndUpdate={findCommentAndUpdate}
              onLongPress={onCommentLongPressed}
              updateVote={updateVote}
              onPress={(reactionId, replyUsername) =>
                onReplyButtonClick(reactionId, replyUsername, 0)
              }
            />
          ) : null}
        </View>
        {item?.children_counts?.comment > 0 && (
          <ReplyComment
            feedId={feedId}
            hideLeftConnector={hideLeftConnector(index, item, comments)}
            data={item.latest_children.comment}
            countComment={item.children_counts.comment}
            indexFeed={indexFeed}
            findCommentAndUpdate={findCommentAndUpdate}
            onCommentLongPressed={onCommentLongPressed}
            updateVote={updateVote}
            onReplyButtonClick={onReplyButtonClick}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const ContainerComment = ({
  feedId,
  comments,
  indexFeed,
  isLoading,
  refreshComment,
  findCommentAndUpdate,
  contextSource = CONTEXT_SOURCE.FEEDS,
  itemParent,
  updateVote,
  isShortText,
  onReplyButtonClick
}) => {
  const [, setSelectedCommentForDelete] = React.useState(null);
  const [selectedCommentLevelForDelete, setSelectedCommentLevelForDelete] = React.useState(0);
  const {isLast, isLastInParent, hideLeftConnector} = useContainerComment();
  const {calculationText, calculatedSizeScreen, calculatePaddingBtm} = usePostDetail();
  const {deleteCommentFromContext} = usePostContextHook(contextSource);
  const onDeleteCommentClicked = async (item) => {
    const response = await deleteComment(item?.id);
    if (response?.success) {
      deleteCommentFromContext(feedId, item?.id, selectedCommentLevelForDelete);
      refreshComment();
      SimpleToast.show('Comment has been deleted successfully');
    }
  };
  const onCommentLongPressed = async (item, level = 0) => {
    const selfId = await getUserId();
    if (selfId === item?.user_id || item?.is_you) {
      setSelectedCommentForDelete(item);
      setSelectedCommentLevelForDelete(level);
      Alert.alert('', StringConstant.feedDeleteCommentConfirmation, [
        {
          text: 'No, cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => onDeleteCommentClicked(item)
        }
      ]);
    }
  };

  const calculateMinHeight = () => {
    return (
      Dimensions.get('window').height -
      calculatedSizeScreen -
      calculationText(itemParent?.message, itemParent?.post_type, itemParent?.images_url)
        .containerHeight
    );
  };

  const handleUpdateVote = () => {
    if (updateVote && typeof updateVote === 'function') {
      updateVote();
    }
  };

  return (
    <View>
      <View style={styles.floatingBackground}>
        {isShortText && (
          <LinearGradient
            colors={['#275D8A', '#275D8A']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12
            }}
          />
        )}
      </View>
      <View
        style={{
          paddingHorizontal: 12,
          minHeight: calculateMinHeight() + calculatePaddingBtm(),
          paddingBottom: calculatePaddingBtm() - normalize(16)
        }}>
        <View style={[styles.container]}>
          <View
            style={{
              paddingVertical: normalize(8),
              paddingLeft: normalize(12),
              borderBottomWidth: 1,
              borderBottomColor: COLORS.gray410
            }}>
            <Text
              style={{
                fontFamily: fonts.inter[600],
                fontSize: 16,
                color: COLORS.gray410,
                lineHeight: 24
              }}>
              Comments
            </Text>
          </View>
          <View style={{paddingLeft: 22}}>
            <View style={[styles.containerComment]}>
              <View style={styles.lastConnectorBlocker} />
              <View style={styles.lineBeforeProfile} />
              {comments.map((item, index) => (
                <View key={`p${index}`} style={{zIndex: 10}}>
                  {item.user ? (
                    <ListComment
                      indexFeed={indexFeed}
                      index={index}
                      onCommentLongPressed={onCommentLongPressed}
                      item={item}
                      isLast={isLast}
                      isLastInParent={isLastInParent}
                      comments={comments}
                      findCommentAndUpdate={findCommentAndUpdate}
                      hideLeftConnector={hideLeftConnector}
                      updateVote={handleUpdateVote}
                      feedId={feedId}
                      onReplyButtonClick={onReplyButtonClick}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          {isLoading ? <LoadingComment /> : null}
        </View>
      </View>
    </View>
  );
};

export const isEqual = (prevProps, nextProps) => prevProps.comments === nextProps.comments;

export default React.memo(ContainerComment, isEqual);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.almostBlack,
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: COLORS.gray410
  },
  lineBeforeProfile: {
    height: 8.5
  },
  levelOneCommentWrapper: {
    flex: 1,
    marginLeft: 0
  },
  containerComment: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.gray210,
    marginTop: 0
  },
  floatingBackground: {
    height: normalize(28),
    backgroundColor: COLORS.almostBlack,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.darkGray,
    position: 'absolute',
    width: '100%'
  },
  lastConnectorBlocker: {
    position: 'absolute',
    width: '100%',
    height: 100,
    bottom: 0,
    zIndex: 2,
    left: -2,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.almostBlack
  }
});
