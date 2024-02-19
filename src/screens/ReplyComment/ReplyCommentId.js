import * as React from 'react';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {
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
import ButtonHightlight from '../../components/ButtonHighlight';
import Comment from '../../components/Comments/Comment';
import ConnectorWrapper from '../../components/Comments/ConnectorWrapper';
import LoadingComment from '../../components/LoadingComment';
import ReplyCommentItem from '../../components/Comments/ReplyCommentItem';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../../components/Comments/WriteComment';
import {Context} from '../../context';
import {createChildCommentV3} from '../../service/comment';
import {fonts} from '../../utils/fonts';
import {getComment} from '../../utils/getstream/getComment';
import {getFeedDetail} from '../../service/post';
import {COLORS} from '../../utils/theme';

const ReplyCommentId = ({itemProp, indexFeed, level, updateParent}) => {
  console.log('indexFeed');
  console.log(indexFeed);

  const navigation = useNavigation();
  const [textComment, setTextComment] = React.useState('');
  const [temporaryText, setTemporaryText] = React.useState('');
  const [, setReaction] = React.useState(false);
  const [loadingCMD] = React.useState(false);
  const [users] = React.useContext(Context).users;
  const [profile] = React.useContext(Context).profile;

  const [item, setItem] = React.useState(itemProp);
  const [, setIdComment] = React.useState(0);
  const [newCommentList, setNewCommentList] = React.useState([]);
  const [defaultData] = React.useState({
    data: {count_downvote: 0, count_upvote: 0, text: textComment},
    id: newCommentList.length + 1,
    kind: 'comment',
    updated_at: moment(),
    children_counts: {comment: 0},
    latest_children: {},
    user: {
      data: {
        ...itemProp.user.data,
        profile_pic_url: users.photoUrl,
        username: profile.myProfile.username
      },
      id: itemProp.user.id
    }
  });
  const setComment = (text) => {
    setTemporaryText(text);
  };

  React.useEffect(() => {
    if (!loadingCMD) {
      setTextComment(temporaryText);
    }
  }, [temporaryText, loadingCMD]);

  React.useEffect(() => {
    const init = () => {
      if (JSON.stringify(item.children_counts) !== '{}') {
        setReaction(true);
      }
    };
    init();
    if (item.latest_children && item.latest_children.comment) {
      setIdComment(item.latest_children.comment.length);
    }
  }, [item]);
  const getThisComment = async (newFeed) => {
    const newItem = await getComment({
      feed: newFeed,
      level,
      idlevel1: itemProp.id,
      idlevel2: itemProp.parent
    });
    let comments = [];
    if (
      newItem.latest_children &&
      newItem.latest_children.comment &&
      Array.isArray(newItem.latest_children.comment)
    ) {
      comments = newItem.latest_children.comment.sort(
        (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()
      );
    }
    setItem({...newItem, latest_children: {comment: comments}});
    setNewCommentList(comments);
  };
  React.useEffect(() => {
    getThisComment(itemProp);
  }, [itemProp]);

  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(itemProp.activity_id);
      if (data) {
        let oldData = data.data;
        if (isSort) {
          oldData = {
            ...oldData,
            latest_reactions: {
              ...oldData.latest_reactions,
              comment: oldData.latest_reactions.comment.sort(
                (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()
              )
            }
          };
        }
        getThisComment(oldData);
        if (updateParent) {
          updateParent(oldData);
        }
        // setFeedByIndexProps(
        //   {
        //     singleFeed: oldData,
        //     index: indexFeed,
        //   },
        //   dispatch,
        // );
      }
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const createComment = async () => {
    // setLoadingCMD(true);
    setTemporaryText('');
    setIdComment((prev) => prev + 1);
    setNewCommentList([
      ...newCommentList,
      {...defaultData, data: {...defaultData.data, text: textComment}}
    ]);
    try {
      if (textComment.trim() !== '') {
        const data = await createChildCommentV3(textComment, item.id, item.user.id);
        if (data.code === 200) {
          // setNewCommentList([...newCommentList, { ...defaultData, id: data.data.id, activity_id: data.data.activity_id, user: data.data.user, data: data.data.data }])
          // setLoadingCMD(false);
          await updateFeed(true);
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
          // setLoadingCMD(false);
        }
      } else {
        // Toast.show('Comments are not empty', Toast.LONG);
        // setLoadingCMD(false);
      }
    } catch (error) {
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
      // setLoadingCMD(false);
    }
  };

  const navigationGoBack = () => navigation.goBack();

  const saveNewComment = () => {
    updateFeed();
  };

  const saveParentComment = () => {
    updateFeed();
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateFeed(true);
    });

    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigationGoBack} style={styles.backArrow}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Reply to {itemProp.user.data.username}</Text>
          <View style={styles.btn} />
        </View>
      </SafeAreaView>

      {/* Header */}
      <ScrollView contentContainerStyle={styles.commentScrollView}>
        <View style={styles.containerComment}>
          <ReplyCommentItem
            indexFeed={indexFeed}
            user={itemProp.user}
            comment={item}
            time={itemProp.created_at}
            photo={itemProp.user.data.profile_pic_url}
            isLast={newCommentList.length <= 0}
            level={level}
            refreshComment={saveParentComment}
          />
          {newCommentList.length > 0 &&
            newCommentList.map((itemReply, index) => {
              const showChildrenCommentView = () => {
                navigation.push('ReplyComment', {
                  item: itemReply,
                  level: parseInt(level, 10) + 2,
                  indexFeed
                });
              };
              const isLastInParent = (indexParam) =>
                indexParam === (item.children_counts.comment || 0) - 1;

              return (
                <ContainerReply key={index}>
                  <ConnectorWrapper index={loadingCMD ? index + 1 : index}>
                    <View style={styles.childCommentWrapper}>
                      <Comment
                        indexFeed={indexFeed}
                        showLeftConnector={false}
                        time={itemReply.updated_at}
                        photo={itemReply.user.data.profile_pic_url}
                        isLast={
                          // index === item.children_counts.comment - 1 &&
                          // (itemReply.children_counts.comment || 0) === 0
                          level >= 2
                        }
                        key={`r${index}`}
                        user={itemReply.user}
                        comment={itemReply}
                        onPress={showChildrenCommentView}
                        level={parseInt(level, 10) + 1}
                        loading={loadingCMD}
                        refreshComment={saveNewComment}

                        // showLeftConnector
                      />
                      {itemReply.children_counts.comment > 0 && (
                        <>
                          <View style={styles.seeRepliesContainer(isLastInParent(index))}>
                            <View style={styles.connector} />
                            <ButtonHightlight onPress={showChildrenCommentView}>
                              <Text style={styles.seeRepliesText}>
                                {StringConstant.postDetailPageSeeReplies(
                                  itemReply.children_counts.comment || 0
                                )}
                              </Text>
                            </ButtonHightlight>
                          </View>
                        </>
                      )}
                    </View>
                  </ConnectorWrapper>
                </ContainerReply>
              );
            })}
          {loadingCMD && (
            <ContainerReply>
              <ConnectorWrapper>
                <View style={styles.childCommentWrapperLoading}>
                  <LoadingComment commentText={textComment} user={itemProp.user} />
                </View>
              </ConnectorWrapper>
            </ContainerReply>
          )}
          {newCommentList.length > 0 ? <View style={styles.childLevelMainConnector} /> : null}
        </View>
      </ScrollView>
      <WriteComment
        postId={item?.activity_id}
        inReplyCommentView={true}
        showProfileConnector={newCommentList.length > 0}
        username={item.user.data.username}
        onChangeText={(v) => setComment(v)}
        onPress={() => createComment()}
        value={temporaryText}
      />
    </View>
  );
};
const ContainerReply = ({children, isGrandchild = true, hideLeftConnector, key}) => (
  <View
    key={key}
    style={[
      styles.containerReply(hideLeftConnector),
      {borderColor: isGrandchild ? COLORS.transparent : COLORS.lightgrey}
    ]}>
    {children}
  </View>
);
export default ReplyCommentId;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flex: 1,
    backgroundColor: COLORS.white
    // backgroundColor: COLORS.blue,
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
  containerReply: () => ({
    borderLeftWidth: 1,
    width: '100%'
    // backgroundColor: COLORS.redalert,
    // flex: 1,
  }),
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? COLORS.transparent : COLORS.lightgrey
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
    color: COLORS.black,
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
    backgroundColor: COLORS.lightgrey,
    left: 46,
    zIndex: -100
  },
  connector: {
    width: 15,
    height: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 21,
    borderLeftColor: COLORS.lightgrey,
    borderBottomColor: COLORS.lightgrey,
    marginRight: 4,
    marginLeft: -1
  },
  childCommentWrapper: {
    borderLeftColor: COLORS.lightgrey,
    borderLeftWidth: 1,
    flex: 1
  },
  childLevelMainConnector: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.lightgrey,
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
