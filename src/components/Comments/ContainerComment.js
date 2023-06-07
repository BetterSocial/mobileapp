import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Alert, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ButtonHightlight from '../ButtonHighlight';
import Comment from './Comment';
import ConnectorWrapper from './ConnectorWrapper';
import LoadingComment from '../LoadingComment';
import StringConstant from '../../utils/string/StringConstant';
import useContainerComment from './hooks/useContainerComment';
import useReplyComment from './hooks/useReplyComment';
import usePostContextHook, {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {colors} from '../../utils/colors';
import {deleteComment} from '../../service/comment';
import {getUserId} from '../../utils/users';
import usePostDetail from '../PostPageDetail/hooks/usePostDetail';
import ListComment from './ListComment';

const ContainerComment = ({
  feedId,
  comments,
  indexFeed,
  isLoading,
  refreshComment,
  navigateToReplyView,
  findCommentAndUpdate,
  updateParentPost = () => {},
  contextSource = CONTEXT_SOURCE.FEEDS
}) => {
  const navigation = useNavigation();
  const [, setSelectedCommentForDelete] = React.useState(null);
  const [selectedCommentLevelForDelete, setSelectedCommentLevelForDelete] = React.useState(0);
  const {isLast, isLastInParent, hideLeftConnector} = useContainerComment();
  const {calculationText, calculatedSizeScreen, calculatePaddingBtm} = usePostDetail();
  const {deleteCommentFromContext} = usePostContextHook(contextSource);

  const onCommentLongPressed = async (item, level = 0) => {
    console.log('jalan2', item)
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
      deleteCommentFromContext(feedId, item?.id, selectedCommentLevelForDelete, updateParentPost);
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
  onCommentLongPressed = () => {}
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
                    indexFeed={indexFeed}
                    key={`c${index}`}
                    comment={item}
                    // username={item.user.data.username}
                    user={item.user}
                    level={1}
                    photo={item.user?.data?.profile_pic_url}
                    time={item.created_at}
                    onPress={() => navigateToReplyView({item, level: 2, indexFeed})}
                    isLast={isLast(item, index, countComment)}
                    // refreshComment={refreshComment}
                    findCommentAndUpdate={findCommentAndUpdate}
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
  <View style={[styles.containerReply, {borderColor: isGrandchild ? '#fff' : colors.gray1}]}>
    {children}
  </View>
);

export const isEqual = (prevProps, nextProps) => prevProps.comments === nextProps.comments;

export default React.memo(ContainerComment, isEqual);

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 8
  },
  lineBeforeProfile: {
    height: 8.5,
    borderLeftWidth: 1,
    borderLeftColor: '#C4C4C4'
  },
  containerReply: {
    borderLeftWidth: 1
  },
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? 'transparent' : colors.gray1,
    borderLeftWidth: 1
  }),
  seeRepliesText: {
    color: colors.blue
  },
  connector: {
    width: 10,
    height: 5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    // borderBottomLeftRadius: 1,
    borderLeftColor: colors.gray1,
    borderBottomColor: colors.gray1,
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
    borderLeftColor: '#C4C4C4',
    marginTop: 0
  }
});
