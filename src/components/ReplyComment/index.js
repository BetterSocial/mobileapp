import * as React from 'react';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import Comment from '../../components/Comments/Comment';
import ConnectorWrapper from '../../components/Comments/ConnectorWrapper';
import LoadingComment from '../../components/LoadingComment';
import ReplyCommentItem from '../../components/Comments/ReplyCommentItem';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../../components/Comments/WriteComment';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {createChildComment} from '../../service/comment';
import {fonts} from '../../utils/fonts';
import {getComment} from '../../utils/getstream/getComment';
import {getFeedDetail} from '../../service/post';
import {setFeedByIndex} from '../../context/actions/feeds';

// import {temporaryComment} from '../../utils/string/LoadingComment';

const ReplyCommentComponent = ({itemProp, indexFeed, level, feeds, dispatch, setFeedByIndexProps}) => {
  const navigation = useNavigation();
  const [textComment, setTextComment] = React.useState('');
  const [temporaryText, setTemporaryText] = React.useState('')
  const [, setReaction] = React.useState(false);
  const [loadingCMD, setLoadingCMD] = React.useState(false);
  let [users] = React.useContext(Context).users;

  const [item, setItem] = React.useState(itemProp);
  const [idComment, setIdComment] = React.useState(0)
  const [newCommentList, setNewCommentList] = React.useState([])
  const [defaultData, setDefaultData] = React.useState({
    data: {count_downvote: 0, count_upvote: 0, text: textComment}, 
    id: newCommentList.length + 1, kind: "comment", updated_at: moment(), 
    children_counts: {comment: 0}, 
    latest_children: {}, 
    user: {data: {...itemProp.user.data, profile_pic_url: users.photoUrl}, id: itemProp.user.id}
  })

  const setComment = (text) => {
    setTemporaryText(text)
  };

  React.useEffect(() => {
    if(!loadingCMD) {
      setTextComment(temporaryText)
    }
  }, [temporaryText, loadingCMD])

  React.useEffect(() => {
    const init = () => {
      if (JSON.stringify(item.children_counts) !== '{}') {
        setReaction(true);
      }
    };
    init();
    if(item.latest_children && item.latest_children.comment) {
      setIdComment(item.latest_children.comment.length)
    }
  }, [item]);
  const getThisComment = async (newFeed) => {
    let newItem = await getComment({
      feed: newFeed,
      level: level,
      idlevel1: item.id,
      idlevel2: item.parent,
    });
    let comments = [];
    if (
      newItem.latest_children &&
      newItem.latest_children.comment &&
      Array.isArray(newItem.latest_children.comment)
    ) {
      comments = newItem.latest_children.comment.sort(
        (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
      );
    }
    setItem({...newItem, latest_children: {comment: comments}});
    setNewCommentList(comments)
  };
  React.useEffect(() => {
    getThisComment(feeds[indexFeed]);
  }, [JSON.stringify(feeds)]);


  const updateFeed = async (isSort) => {
    try {
      let data = await getFeedDetail(feeds[indexFeed].id);
      if (data) {
        let oldData = data.data
        if(isSort) {
          oldData = {...oldData, latest_reactions: {...oldData.latest_reactions, comment: oldData.latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix())} }
        }
        getThisComment(oldData);
        setFeedByIndexProps(
          {
            singleFeed: oldData,
            index: indexFeed,
          },
          dispatch,
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  console.log(itemProp, 'kurama')

  const createComment = async () => {
    setLoadingCMD(true);
    setTemporaryText('')
    setIdComment((prev) => prev + 1)
    try {
      if (textComment.trim() !== '') {
        let data = await createChildComment(textComment, item.id);
        console.log(data, 'kakak')
        if (data.code === 200) {
          setNewCommentList([...newCommentList, {...defaultData, id: data.data.id, activity_id: data.data.activity_id, user: data.data.user, data: data.data.data}])
          setLoadingCMD(false);
        } else {
          Toast.show('Failed Comment', Toast.LONG);
          setLoadingCMD(false);
        }
      } else {
        Toast.show('Comments are not empty', Toast.LONG);
        setLoadingCMD(false);
      }
    } catch (error) {
      Toast.show('Failed Comment', Toast.LONG);
      setLoadingCMD(false);
    }
  };

  const navigationGoBack = () => navigation.goBack();

  const saveNewComment = ({data}) => {
    updateFeed()
  }

  const saveParentComment = ({data}) => {
    updateFeed()
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateFeed(true)
    })

    return unsubscribe
  }, [])



  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
       {/* Header */}
      <View style={styles.header}>
            <TouchableOpacity
              onPress={navigationGoBack}
              style={styles.backArrow}>
              <ArrowLeftIcon width={20} height={12} fill="#000" />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              Reply to {itemProp.user.data.username}
            </Text>
            <View style={styles.btn} />
          </View>
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
                  level: parseInt(level) + 2,
                  indexFeed,
                });
              };
              let isLastInParent = (index) => {
                return index === (item.children_counts.comment || 0) - 1;
              };

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
                        key={'r' + index}
                        user={itemReply.user}
                        comment={itemReply}
                        onPress={showChildrenCommentView}
                        level={parseInt(level) + 1}
                        loading={loadingCMD}
                        refreshComment={saveNewComment}

                        // showLeftConnector
                      />
                      {itemReply.children_counts.comment > 0 && (
                        <>
                          <View
                            style={styles.seeRepliesContainer(
                              isLastInParent(index),
                            )}>
                            <View style={styles.connector} />
                            <TouchableOpacity onPress={showChildrenCommentView}>
                              <Text style={styles.seeRepliesText}>
                                {StringConstant.postDetailPageSeeReplies(
                                  itemReply.children_counts.comment || 0,
                                )}
                              </Text>
                            </TouchableOpacity>
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
                <LoadingComment commentText={textComment} user={itemProp.user}  />
                </View>
                </ConnectorWrapper>    
              </ContainerReply>
            )}
          {newCommentList.length > 0 ? <View style={styles.childLevelMainConnector} /> : null}
        </View>
      </ScrollView>
      <WriteComment
        inReplyCommentView={true}
        showProfileConnector={newCommentList.length > 0}
        username={item.user.data.username}
        onChangeText={(v) => setComment(v)}
        onPress={() => createComment()}
        // onPress={() => console.log('level ', level)}
        value={temporaryText}
        // loadingComment={loadingCMD}
      />
    </View>
  );
};
const ContainerReply = ({children, isGrandchild = true, hideLeftConnector, key}) => {
  return (
    <View
      key={key}
      style={[
        styles.containerReply(hideLeftConnector),
        {borderColor: isGrandchild ? 'transparent' : colors.gray1},
      ]}>
      {children}
    </View>
  );
};
export default ReplyCommentComponent;

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
  containerReply: (hideLeftConnector) => ({
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
