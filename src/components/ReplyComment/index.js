import * as React from 'react';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
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
import { Context } from '../../context';
import { colors } from '../../utils/colors';
import { createChildComment } from '../../service/comment';
import { fonts } from '../../utils/fonts';
import { getFeedDetail } from '../../service/post';
import useReplyComment from './hooks/useReplyComment';

const ReplyCommentId = ({ itemProp, indexFeed, level, updateParent, page, dataFeed,updateReply,  itemParent, updateVote, findCommentAndUpdate }) => {
  const navigation = useNavigation();
  const [textComment, setTextComment] = React.useState('');
  const {getThisCommentHook, setCommentHook, temporaryText, setTemporaryText, isLastInParentHook, findCommentAndUpdateHook, updateVoteParentPostHook} = useReplyComment()
  const [users] = React.useContext(Context).users;
  const [profile] = React.useContext(Context).profile;
  const [item, setItem] = React.useState(itemProp);
  const [newCommentList, setNewCommentList] = React.useState([])
  const scrollViewRef = React.useRef(null)
  const [defaultData,] = React.useState({
    data: { count_downvote: 0, count_upvote: 0, text: textComment },
    id: newCommentList.length + 1, kind: "comment", updated_at: moment(),
    children_counts: { comment: 0 },
    latest_children: {},
    user: { data: { ...itemProp.user.data, profile_pic_url: users.photoUrl, username: profile.myProfile.username }, id: itemProp.user.id }
  })
  const setComment = (text) => {
   setCommentHook(text)
  };
  
  React.useEffect(() => {
    setTextComment(temporaryText)
  }, [temporaryText])


  const getThisComment = async () => {
    const comments = await getThisCommentHook(itemProp)
    setItem({ ...itemProp, latest_children: { comment: comments } });
    setNewCommentList(comments)
  };
  
  React.useEffect(() => {
    if(itemProp) {
      getThisComment();

    }
  }, [itemProp]);


  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(item.activity_id);
      if (data) {
        let oldData = data.data
        if (isSort) {
          oldData = { ...oldData, latest_reactions: { ...oldData.latest_reactions, comment: oldData.latest_reactions.comment } }
        }

        if(updateParent) {
          updateParent(oldData)
        }

      }
    } catch (e) {
      console.log(e);
    }
  };
    const saveParentComment = () => {
    updateFeed()
  }

  const createComment = async () => {
    let sendPostNotif = false
    if(page !== 'DetailDomainScreen') {
      sendPostNotif = true
    }
    setTemporaryText('')
    setNewCommentList([...newCommentList, { ...defaultData, data: {...defaultData.data, text: textComment} }])
    try {
      if (textComment.trim() !== '') {
        const data = await createChildComment(textComment, item.id, item.user.id, sendPostNotif, dataFeed.actor.id);
        scrollViewRef.current.scrollToEnd();
        if (data.code === 200) {
          const newComment = [...newCommentList, { ...defaultData, id: data.data.id, activity_id: data.data.activity_id, user: data.data.user, data: data.data.data }]
          setNewCommentList(newComment)
          if(typeof updateReply === 'function') {
            updateReply(newComment, itemParent, item.id)
          }
          saveParentComment()
          await updateFeed(true)
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
        }
      } else {
        // Toast.show('Comments are not empty', Toast.LONG);
        // setLoadingCMD(false);
      }
    } catch (error) {
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };

  const navigationGoBack = () => navigation.goBack();

  const updateReplyPost = (comment, itemParentProps, commentId) => {
    if(itemParentProps) {
      const updateComment = itemParentProps.latest_children.comment.map((dComment) => {
        if(dComment.id === commentId) {
          return {...dComment, latest_children: {...dComment.latest_children, comment}, children_counts: {comment: comment.length}}
        } 
          return {...dComment}
        
      })
      const replaceComment = {...itemParentProps, latest_children: {...itemParentProps.latest_children, comment: updateComment}}
      setItem(replaceComment)
      setNewCommentList(updateComment)

    }
  }

  const updateVoteParentPost = async (data, dataVote, comment) => {
    console.log(data,dataVote,comment, 'lalian')
      const updateComment = await updateVoteParentPostHook(data, dataVote, comment)
      setNewCommentList(updateComment)
  }


   const showChildrenCommentView = async (itemReply) => {
                const itemParentProps = await {...itemProp, latest_children: {...itemProp.latest_children, comment: newCommentList}}
                navigation.push('ReplyComment', {
                  item: itemReply,
                  level: 2,
                  indexFeed,
                  dataFeed,
                  updateParent,
                  itemParent: itemParentProps,
                  updateReply: (comment, parentProps, id) => updateReplyPost(comment, parentProps, id),
                  updateVote: (data, dataVote) => updateVoteParentPost(data, dataVote, itemParentProps)
                });
  };

const findCommentAndUpdateHandle = async (id, data) => {
  const newComment = await findCommentAndUpdateHook(newCommentList, id, data)
  setNewCommentList(newComment)
}

const isLastInParent = (index) => isLastInParentHook(index, item)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : null} style={styles.container}>
      <StatusBar translucent={false} />
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={navigationGoBack}
            style={styles.backArrow}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
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
            refreshComment={saveParentComment}
            updateVoteParent={updateVote}
          />
          {newCommentList.length > 0 &&
            newCommentList.map((itemReply, index) => (
                <ContainerReply key={index}>
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
                        key={`r${  index}`}
                        user={itemReply.user}
                        comment={itemReply}
                        onPress={() => showChildrenCommentView(itemReply)}
                        level={parseInt(level) + 1}
                        refreshComment={saveParentComment}
                        findCommentAndUpdate={findCommentAndUpdateHandle}
                        updateVote={updateVote}
                      />
                      {itemReply.children_counts.comment > 0 && (
                        <>
                          <View
                            style={styles.seeRepliesContainer(
                              isLastInParent(index),
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
                </ContainerReply>
              ))}
          {newCommentList.length > 0 ? <View style={styles.childLevelMainConnector} /> : null}
        </View>
      </ScrollView>
      <WriteComment
        inReplyCommentView={true}
        showProfileConnector={newCommentList.length > 0}
        username={item.user.data.username}
        onChangeText={setComment}
        onPress={() => createComment()}
        // onPress={() => console.log('level ', level)}
        value={temporaryText}
      // loadingComment={loadingCMD}
      />
    </KeyboardAvoidingView>
  );
};
const ContainerReply = ({ children, isGrandchild = true, hideLeftConnector, key }) => (
    <View
      key={key}
      style={[
        styles.containerReply(hideLeftConnector),
        { borderColor: isGrandchild ? 'transparent' : colors.gray1 },
      ]}>
      {children}
    </View>
  );
export default React.memo (ReplyCommentId);

const styles = StyleSheet.create({
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
  containerReply: () => ({
    borderLeftWidth: 1,
    width: '100%',
    // backgroundColor: 'red',
    // flex: 1,
  }),
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
