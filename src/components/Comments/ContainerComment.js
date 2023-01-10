import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import { Alert, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ButtonHightlight from '../ButtonHighlight';
import Comment from "./Comment";
import CommentOptionModal from '../Modal/CommentOptionModal';
import ConnectorWrapper from './ConnectorWrapper';
import LoadingComment from '../LoadingComment';
import StringConstant from '../../utils/string/StringConstant';
import usePostContextHook, { CONTEXT_SOURCE } from '../../hooks/usePostContextHooks';
import { colors } from '../../utils/colors';
import { deleteComment } from '../../service/comment';
import { getUserId } from '../../utils/users';
import useReplyComment from './hooks/useReplyComment';
import useContainerComment from './hooks/useContainerComment';

const ContainerComment = ({
  feedId,
  comments,
  indexFeed,
  isLoading,
  refreshComment,
  refreshChildComment,
  navigateToReplyView,
  findCommentAndUpdate,
  updateParentPost = () => { },
  contextSource = CONTEXT_SOURCE.FEEDS }) => {
  const navigation = useNavigation();
  const [isCommentOptionModalShown, setIsCommentOptionModalShown] = React.useState(false)
  const [selectedCommentForDelete, setSelectedCommentForDelete] = React.useState(null)
  const [selectedCommentLevelForDelete, setSelectedCommentLevelForDelete] = React.useState(0)
      const {isLast, isLastInParent, hideLeftConnector} = useContainerComment()

  const { deleteCommentFromContext } = usePostContextHook(contextSource)


  const onCommentLongPressed = async (item, level = 0) => {
    const selfId = await getUserId()
    if (selfId === item?.user_id) {
      // setIsCommentOptionModalShown(true)
      setSelectedCommentForDelete(item)
      setSelectedCommentLevelForDelete(level)
      Alert.alert('', StringConstant.feedDeleteCommentConfirmation, [
        {
          text: 'No, cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: onDeleteCommentClicked
        }
      ])
    }
  }

  const onCommentOptionModalClosed = () => {
    setSelectedCommentForDelete(null)
    setIsCommentOptionModalShown(false)
  }

  const onDeleteCommentClicked = async () => {
    setIsCommentOptionModalShown(false)
    const response = await deleteComment(selectedCommentForDelete?.id)
    if (response?.success) {
      deleteCommentFromContext(feedId, selectedCommentForDelete?.id, selectedCommentForDelete, updateParentPost)
      refreshComment()
      SimpleToast.show('Comment has been deleted successfully')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.lineBeforeProfile} />
      {comments.map((item, index) => (
        <TouchableWithoutFeedback key={index} onLongPress={() => onCommentLongPressed(item, 0)}>
          <View >
            <View key={`p${index}`}>
              {item.user ? <Comment
                indexFeed={indexFeed}
                key={`p${index}`}
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
            {item?.children_counts?.comment > 0 && (
              <ReplyComment
                hideLeftConnector={hideLeftConnector(index, item)}
                data={item?.latest_children?.comment}
                countComment={item?.children_counts?.comment}
                navigation={navigation}
                indexFeed={indexFeed}
                navigateToReplyView={navigateToReplyView}
                refreshComment={(children) => refreshChildComment({ parent: item, children: children.data })}
                findCommentAndUpdate={findCommentAndUpdate}
                onCommentLongPressed={onCommentLongPressed}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      ))}
      <CommentOptionModal isOpen={isCommentOptionModalShown}
        onClose={onCommentOptionModalClosed}
        onDeleteClicked={onDeleteCommentClicked} />
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
  onCommentLongPressed = () => { }
}) => {
    const {isLast, isLastInParent} = useReplyComment()



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
            {item.user ? <ConnectorWrapper index={index}>
              <TouchableWithoutFeedback onLongPress={() => onCommentLongPressed(item, 1)}>
                <View key={`c${index}`} style={styles.levelOneCommentWrapper}>
                  <Comment
                    indexFeed={indexFeed}
                    key={`c${index}`}
                    comment={item}
                    // username={item.user.data.username}
                    user={item.user}
                    level={1}
                    photo={item.user.data.profile_pic_url}
                    time={item.created_at}
                    onPress={showCommentView}
                    isLast={isLast(item, index, countComment)}
                    // refreshComment={refreshComment}
                    findCommentAndUpdate={findCommentAndUpdate}
                  />
                  {item.children_counts.comment > 0 && (
                    <>
                      <View
                        style={styles.seeRepliesContainer(isLastInParent(index, countComment))}>
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
              </TouchableWithoutFeedback>
            </ConnectorWrapper> : null}

          </React.Fragment>

        );
      })}
    </ContainerReply>
  );
};
export const ContainerReply = ({ children, isGrandchild, hideLeftConnector }) => (
  <View
    style={[
      styles.containerReply,
      { borderColor: isGrandchild ? '#fff' : colors.gray1 },
    ]}>
    {children}
  </View>
);
// export default React.memo(ContainerComment, (prevProps, nextProps) => prevProps.comments === nextProps.comments);

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
