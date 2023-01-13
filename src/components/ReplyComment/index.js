import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ButtonHightlight from '../ButtonHighlight';
import Comment from "../Comments/Comment";
import ConnectorWrapper from "../Comments/ConnectorWrapper";
import ReplyCommentItem from "../Comments/ReplyCommentItem";
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from "../Comments/WriteComment";
import useReplyComment from './hooks/useReplyComment';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const ReplyCommentId = ({ itemProp, indexFeed, level, updateParent, page, dataFeed, updateReply, itemParent, updateVote, updateVoteLatestChildren }) => {
  const navigation = useNavigation();
  const {getThisCommentHook, setCommentHook, temporaryText, setTemporaryText, isLastInParentHook, findCommentAndUpdateHook, updateVoteParentPostHook, updateVoteLatestChildrenParentHook, textComment, setTextComment, newCommentList, setNewCommentList, defaultData, setItem, item, showChildrenCommentView, updateFeed, scrollViewRef, createComment } = useReplyComment({itemProp, indexFeed, dataFeed, updateParent, updateReply, itemParent, page})


  React.useEffect(() => {
    if(setTextComment && typeof setTextComment === 'function') {
      setTextComment(temporaryText)
    }
  }, [temporaryText])


  const getThisComment = async () => {
    const comments = await getThisCommentHook(itemProp)
    setItem({ ...itemProp, latest_children: { comment: comments } });
    setNewCommentList(comments)
  };

  React.useEffect(() => {
    if (itemProp) {
      getThisComment();

    }
  }, [itemProp]);


const navigationGoBack = () => navigation.goBack();



if(!item) return null
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : null} style={styles.container}>
      <StatusBar translucent={false} />
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            testID='backButton'
            onPress={navigationGoBack}
            style={styles.backArrow}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </TouchableOpacity>
          <Text testID='usernameText' style={styles.headerText}>
            Reply to {item.user.data.username}
          </Text>
          <View style={styles.btn} />
        </View>
      </SafeAreaView>

      {/* Header */}
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.commentScrollView}>
        <View style={styles.containerComment}>
          <ReplyCommentItem
            indexFeed={indexFeed}
            user={item.user}
            comment={item}
            time={item.created_at}
            photo={item.user.data.profile_pic_url}
            isLast={newCommentList.length <= 0}
            level={level}
            refreshComment={updateFeed}
            updateVoteParent={updateVote}
          />
          {newCommentList.length > 0 &&
            newCommentList.map((itemReply, index) => (
              <React.Fragment key={index}>
                {itemReply.user ? <ContainerReply >
                  <ConnectorWrapper index={index}>
                    <View style={styles.childCommentWrapper}>
                      <Comment
                        indexFeed={indexFeed}
                        showLeftConnector={false}
                        time={itemReply.updated_at}
                        photo={itemReply.user.data.profile_pic_url}
                        isLast={
                          level >= 2
                        }
                        key={`r${index}`}
                        user={itemReply.user}
                        comment={itemReply}
                        onPress={() => showChildrenCommentView(itemReply)}
                        level={parseInt(level) + 1}
                        refreshComment={updateFeed}
                        findCommentAndUpdate={findCommentAndUpdateHook}
                        updateVote={updateVoteLatestChildren}
                      />
                      {itemReply.children_counts.comment > 0 && (
                        <>
                          <View
                            style={styles.seeRepliesContainer(
                              isLastInParentHook(index),
                            )}>
                            <View style={styles.connector} />
                            <ButtonHightlight onPress={() => showChildrenCommentView(itemReply)}>
                              <Text style={styles.seeRepliesText}>
                                {StringConstant.postDetailPageSeeReplies(
                                  itemReply.children_counts.comment || 0,
                                )}
                              </Text>
                            </ButtonHightlight>
                          </View>
                        </>
                      )}
                    </View>
                  </ConnectorWrapper>
                </ContainerReply> : null}

              </React.Fragment>

            ))}
          {newCommentList.length > 0 ? <View style={styles.childLevelMainConnector} /> : null}
        </View>
      </ScrollView>
      <WriteComment
        inReplyCommentView={true}
        showProfileConnector={newCommentList.length > 0}
        username={item.user.data.username}
        onChangeText={setCommentHook}
        onPress={() => createComment()}
        // onPress={() => console.log('level ', level)}
        value={temporaryText}
      // loadingComment={loadingCMD}
      />
    </KeyboardAvoidingView>
  );
};
export const ContainerReply = ({ children, isGrandchild = true, key }) => (
    <View
      key={key}
      style={[
        styles.containerReply,
        { borderColor: isGrandchild ? 'transparent' : colors.gray1 },
      ]}>
      {children}
    </View>
  );
export default React.memo (ReplyCommentId);

export const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'blue',
  },
  containerComment: {
    marginTop: 8,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 36,
    paddingRight: 23,
  },
  header: {
    marginRight: -20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerReply: {
     borderLeftWidth: 1,
    width: '100%',
    // backgroundColor: 'red',
    // flex: 1,
  },
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? 'transparent' : colors.gray1,
  }),
  seeRepliesText: {
    color: colors.blue,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
  },
  headerText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    marginLeft: -24,
    color: '#000',
    alignSelf: 'center',
  },
  image: {
    width: 48,
    height: 48,
  },
  input: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    color: '#000',
    padding: 10,
    marginLeft: 20,
    borderRadius: 8,
  },
  comment: {
    flexDirection: 'row',
    paddingRight: 20,
    position: 'absolute',
    bottom: 0,
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#333333',
    marginLeft: 28,
  },
  mainLeftConnector: {
    height: '100%',
    width: 1,
    position: 'absolute',
    backgroundColor: colors.gray1,
    left: 46,
    zIndex: -100,
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
  childCommentWrapper: {
    borderLeftColor: colors.gray1,
    borderLeftWidth: 1,
    flex: 1,
  },
  childLevelMainConnector: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray1,
    marginLeft: 24,
  },
  backArrow: {
    padding: 10,
    paddingLeft: 24,
    paddingVertical: 18,
    alignSelf: 'center',
  },
  commentScrollView: {
    minHeight: '100%',
    paddingBottom: 83,
  },
  childCommentWrapperLoading: {
    flex: 1,
  },
});
