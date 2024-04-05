import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Alert, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import moment from 'moment';
import ButtonHightlight from '../ButtonHighlight';
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
import ListComment from './ListComment';
import {COLORS} from '../../utils/theme';

const ContainerComment = ({
  feedId,
  comments,
  indexFeed,
  isLoading,
  refreshComment,
  navigateToReplyView,
  findCommentAndUpdate,
  contextSource = CONTEXT_SOURCE.FEEDS,
  itemParent,
  updateVote
}) => {
  const navigation = useNavigation();
  const [, setSelectedCommentForDelete] = React.useState(null);
  const [selectedCommentLevelForDelete, setSelectedCommentLevelForDelete] = React.useState(0);
  const {isLast, isLastInParent, hideLeftConnector} = useContainerComment();
  const {calculationText, calculatedSizeScreen, calculatePaddingBtm} = usePostDetail();
  const {deleteCommentFromContext} = usePostContextHook(contextSource);
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

  const onDeleteCommentClicked = async (item) => {
    const response = await deleteComment(item?.id);
    if (response?.success) {
      deleteCommentFromContext(feedId, item?.id, selectedCommentLevelForDelete);
      refreshComment();
      SimpleToast.show('Comment has been deleted successfully');
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
    <View style={[styles.container]}>
      <View
        style={[
          styles.containerComment,
          {
            minHeight: calculateMinHeight() + calculatePaddingBtm(),
            paddingBottom: calculatePaddingBtm()
          }
        ]}>
        <View style={styles.lineBeforeProfile} />
        {comments.map((item, index) => (
          <>
            {item.user ? (
              <ListComment
                key={`p${index}`}
                indexFeed={indexFeed}
                index={index}
                onCommentLongPressed={onCommentLongPressed}
                item={item}
                isLast={isLast}
                isLastInParent={isLastInParent}
                comments={comments}
                navigateToReplyView={navigateToReplyView}
                findCommentAndUpdate={findCommentAndUpdate}
                hideLeftConnector={hideLeftConnector}
                navigation={navigation}
                updateVote={handleUpdateVote}
                feedId={feedId}
              />
            ) : null}
          </>
        ))}
      </View>

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
  findCommentAndUpdate,
  onCommentLongPressed = () => {},
  updateVote,
  feedId
}) => {
  const {isLast, isLastInParent} = useReplyComment();
  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => (
        <React.Fragment key={`c-${index}`}>
          {item.user ? (
            <ConnectorWrapper index={index}>
              <TouchableWithoutFeedback onLongPress={() => onCommentLongPressed(item, 1)}>
                <View key={`c${index}`} style={styles.levelOneCommentWrapper}>
                  <Comment
                    feedId={feedId}
                    indexFeed={indexFeed}
                    key={`c${index}`}
                    comment={item}
                    onLongPress={() => onCommentLongPressed(item, 1)}
                    user={item.user}
                    level={1}
                    photo={item.user?.data?.profile_pic_url}
                    time={item.created_at || moment().format()}
                    onPress={() => navigateToReplyView({item, level: 2, indexFeed})}
                    isLast={isLast(item, index, countComment)}
                    findCommentAndUpdate={findCommentAndUpdate}
                    updateVote={updateVote}
                  />
                  {item.children_counts.comment > 0 && (
                    <>
                      <View style={styles.seeRepliesContainer(isLastInParent(index, countComment))}>
                        <View style={styles.connector} />
                        <ButtonHightlight
                          onPress={() => navigateToReplyView({item, level: 2, indexFeed})}>
                          <Text style={styles.seeRepliesText}>
                            {StringConstant.postDetailPageSeeReplies(
                              item.children_counts.comment || 0
                            )}
                          </Text>
                        </ButtonHightlight>
                      </View>
                    </>
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
export const ContainerReply = ({children, isGrandchild}) => (
  <View style={[{borderColor: isGrandchild ? COLORS.almostBlack : COLORS.balance_gray}]}>
    {children}
  </View>
);

export const isEqual = (prevProps, nextProps) => prevProps.comments === nextProps.comments;

export default React.memo(ContainerComment, isEqual);

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 37,
    paddingRight: 8
  },
  lineBeforeProfile: {
    height: 8.5
  },
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? COLORS.transparent : COLORS.balance_gray,
    borderLeftWidth: 1
  }),
  seeRepliesText: {
    color: COLORS.signed_primary
  },
  connector: {
    width: 10,
    height: 5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    // borderBottomLeftRadius: 1,
    borderLeftColor: COLORS.balance_gray,
    borderBottomColor: COLORS.balance_gray,
    marginRight: 4,
    marginLeft: -1,
    borderBottomLeftRadius: 15 / 2,
    marginTop: 0
    // marginTop: 1
  },
  levelOneCommentWrapper: {
    flex: 1,
    marginLeft: 0
  },
  containerComment: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.gray200,
    marginTop: 0
  }
});
