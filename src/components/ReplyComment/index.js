import * as React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ButtonHightlight from '../ButtonHighlight';
import Comment from '../Comments/Comment';
import ConnectorWrapper from '../Comments/ConnectorWrapper';
import ReplyCommentItem from '../Comments/ReplyCommentItem';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../Comments/WriteComment';
import useReplyComment from './hooks/useReplyComment';
import useWriteComment from '../Comments/hooks/useWriteComment';
import {fonts} from '../../utils/fonts';
import useCommentAction from '../Comments/hooks/useCommentAction';
import {COLORS} from '../../utils/theme';

const ReplyCommentId = ({
  itemProp,
  indexFeed,
  level,
  updateParent,
  page,
  dataFeed,
  updateReply,
  itemParent,
  getComment
}) => {
  const navigation = useNavigation();
  const {
    setCommentHook,
    temporaryText,
    isLastInParentHook,
    setTextComment,
    newCommentList,
    item,
    showChildrenCommentView,
    updateFeed,
    scrollViewRef,
    createComment,
    getThisComment
  } = useReplyComment({
    itemProp,
    indexFeed,
    dataFeed,
    updateParent,
    updateReply,
    itemParent,
    page,
    getComment
  });
  const {handleUsernameReplyComment} = useWriteComment();
  const {showAlertDelete} = useCommentAction();
  React.useEffect(() => {
    if (setTextComment && typeof setTextComment === 'function') {
      setTextComment(temporaryText);
    }
  }, [temporaryText]);

  React.useEffect(() => {
    if (itemProp) {
      getThisComment();
    }
  }, [itemProp]);

  const updateVote = () => {
    if (getComment && typeof getComment === 'function') {
      getComment();
    }
  };

  const navigationGoBack = () => navigation.goBack();
  if (!item) return null;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <View style={styles.header}>
        <TouchableOpacity testID="backButton" onPress={navigationGoBack} style={styles.backArrow}>
          <ArrowLeftIcon width={20} height={20} fill="#000" />
        </TouchableOpacity>
        <Text testID="usernameText" style={styles.headerText}>
          Reply to {handleUsernameReplyComment(itemProp)}
        </Text>
        <View style={styles.btn} />
      </View>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.commentScrollView}>
        <View style={styles.containerComment}>
          <ReplyCommentItem
            feedId={dataFeed?.id}
            indexFeed={indexFeed}
            user={item.user}
            comment={item}
            time={item.created_at}
            photo={item.user?.data?.profile_pic_url}
            isLast={newCommentList.length <= 0}
            level={level}
            refreshComment={updateFeed}
            updateVoteParent={getComment}
          />
          {newCommentList.length > 0 &&
            newCommentList.map((itemReply, index) => (
              <React.Fragment key={index}>
                {itemReply.user ? (
                  <ContainerReply>
                    <ConnectorWrapper index={index}>
                      <Pressable
                        onLongPress={() => {
                          showAlertDelete(itemReply, false, () => getThisComment(true));
                        }}
                        style={styles.childCommentWrapper}>
                        <Comment
                          indexFeed={indexFeed}
                          showLeftConnector={false}
                          time={itemReply.created_at}
                          photo={itemReply.user.data && itemReply.user.data.profile_pic_url}
                          isLast={level >= 2}
                          key={`r${index}`}
                          user={itemReply.user}
                          comment={itemReply}
                          onPress={() => showChildrenCommentView(itemReply)}
                          level={parseInt(level, 10) + 1}
                          updateVote={updateVote}
                          onLongPress={() => {
                            showAlertDelete(itemReply, false, () => getThisComment(true));
                          }}
                        />
                        {itemReply.children_counts.comment > 0 && (
                          <>
                            <View style={styles.seeRepliesContainer(isLastInParentHook(index))}>
                              <View style={styles.connector} />
                              <ButtonHightlight onPress={() => showChildrenCommentView(itemReply)}>
                                <Text style={styles.seeRepliesText}>
                                  {StringConstant.postDetailPageSeeReplies(
                                    itemReply.children_counts.comment || 0
                                  )}
                                </Text>
                              </ButtonHightlight>
                            </View>
                          </>
                        )}
                      </Pressable>
                    </ConnectorWrapper>
                  </ContainerReply>
                ) : null}
              </React.Fragment>
            ))}
          {newCommentList.length > 0 ? <View style={styles.childLevelMainConnector} /> : null}
        </View>
      </ScrollView>
      <WriteComment
        postId={item?.activity_id}
        inReplyCommentView={true}
        showProfileConnector={newCommentList.length > 0}
        username={handleUsernameReplyComment(itemProp)}
        onChangeText={setCommentHook}
        onPress={(isAnonimity, anonimityData) => {
          createComment(isAnonimity, anonimityData);
        }}
        value={temporaryText}
      />
    </SafeAreaView>
  );
};
export const ContainerReply = ({children, isGrandchild = true, key}) => (
  <View
    key={key}
    style={[
      styles.containerReply,
      {borderColor: isGrandchild ? COLORS.transparent : COLORS.balance_gray}
    ]}>
    {children}
  </View>
);

export default React.memo(ReplyCommentId);

export const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flex: 1,
    backgroundColor: COLORS.white
    // backgroundColor: 'blue',
  },
  containerComment: {
    marginTop: 8,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 36,
    paddingRight: 23
  },
  header: {
    marginRight: -20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerReply: {
    borderLeftWidth: 1,
    width: '100%'
    // flex: 1,
  },
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? COLORS.transparent : COLORS.balance_gray
  }),
  seeRepliesText: {
    color: COLORS.signed_primary
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  btnText: {
    color: COLORS.white
  },
  headerText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    marginLeft: -24,
    color: COLORS.black,
    alignSelf: 'center'
  },
  image: {
    width: 48,
    height: 48
  },
  input: {
    backgroundColor: COLORS.concrete,
    flex: 1,
    color: COLORS.b,
    padding: 10,
    marginLeft: 20,
    borderRadius: 8
  },
  comment: {
    flexDirection: 'row',
    paddingRight: 20,
    position: 'absolute',
    bottom: 0
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: COLORS.mine_shaft,
    marginLeft: 28
  },
  mainLeftConnector: {
    height: '100%',
    width: 1,
    position: 'absolute',
    backgroundColor: COLORS.balance_gray,
    left: 46,
    zIndex: -100
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
  childCommentWrapper: {
    borderLeftColor: COLORS.balance_gray,
    borderLeftWidth: 1,
    flex: 1
  },
  childLevelMainConnector: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.balance_gray,
    marginLeft: 24
  },
  backArrow: {
    padding: 10,
    paddingLeft: 24,
    paddingVertical: 18,
    alignSelf: 'center'
  },
  commentScrollView: {
    minHeight: '100%',
    paddingBottom: 83
  },
  childCommentWrapperLoading: {
    flex: 1
  }
});
