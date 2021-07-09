import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';

import StringConstant from '../../utils/string/StringConstant';
import {createChildComment} from '../../service/comment';
import {fonts} from '../../utils/fonts';
import {colors} from '../../utils/colors';
import {getFeedDetail} from '../../service/post';
import ConnectorWrapper from '../../components/Comments/ConnectorWrapper';
import Comment from '../../components/Comments/Comment';
import WriteComment from '../../components/Comments/WriteComment';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';

const ReplyComment = (props) => {
  const navigation = useNavigation();
  const [textComment, setTextComment] = React.useState('');
  const [isReaction, setReaction] = React.useState(false);

  let itemProp = props.route.params.item;
  let comments = itemProp.latest_children.comment || [];
  let sortedComment = comments.sort((current, next) => {
    let currentMoment = moment(current.updated_at);
    let nextMoment = moment(next.updated_at);
    return currentMoment.diff(nextMoment);
  });

  let newItemProp = {...itemProp};
  newItemProp.latest_children.comment = sortedComment;

  const level = props.route.params.level;
  const [item, setItem] = React.useState(newItemProp);

  // console.log(props.route.params.item);

  React.useEffect(() => {
    const init = () => {
      if (JSON.stringify(item.children_counts) !== {}) {
        setReaction(true);
      }
    };
    init();
  }, [item]);
  const createComment = async () => {
    try {
      if (textComment.trim() !== '') {
        let data = await createChildComment(textComment, item.id);
        console.log(data);
        if (data.code === 200) {
          setTextComment('');
          Toast.show('Comment successful', Toast.LONG);
          navigation.goBack();
        } else {
          Toast.show('Failed Comment', Toast.LONG);
        }
      } else {
        Toast.show('Comments are not empty', Toast.LONG);
      }
    } catch (error) {
      Toast.show('Failed Comment', Toast.LONG);
      console.log(error);
    }
  };

  const navigationGoBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.commentScrollView}>
        <View style={styles.containerComment}>
          {/* Header */}
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
          {/* Header */}
          <Comment
            username={item.user.data.username}
            comment={item.data.text}
            time={item.created_at}
            photo={item.user.data.profile_pic_url}
            isLast={(item.children_counts.comment || 0) === 0}
            level={level}
            onPress={() => {}}
          />
          {item.children_counts.comment > 0 &&
            item.latest_children.comment.map((itemReply, index) => {
              const showCommentView = () =>
                navigation.push('ReplyComment', {
                  item: itemReply,
                  level: parseInt(level) + 1,
                });

              const showChildrenCommentView = () =>
                navigation.push('ReplyComment', {
                  item: itemReply,
                  level: parseInt(level) + 2,
                });

              let isLastInParent = (index) => {
                return index === (item.children_counts.comment || 0) - 1;
              };

              const goToComment = () => {
                navigation.push('ReplyComment', {item: itemReply});
              };

              return (
                <ContainerReply>
                  <ConnectorWrapper index={index}>
                    <View style={styles.childCommentWrapper}>
                      <Comment
                        showLeftConnector={false}
                        time={itemReply.created_at}
                        photo={itemReply.user.data.profile_pic_url}
                        isLast={
                          index === item.children_counts.comment - 1 &&
                          (itemReply.children_counts.comment || 0) === 0
                        }
                        key={'r' + index}
                        username={itemReply.user.data.username}
                        comment={itemReply.data.text}
                        onPress={goToComment}
                        level={parseInt(level) + 1}
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
          {(item.children_counts.comment || 0) !== 0 && (
            <View style={styles.childLevelMainConnector} />
          )}
        </View>
      </ScrollView>
      <WriteComment
        inReplyCommentView={true}
        showProfileConnector={(item.children_counts.comment || 0) !== 0}
        username={item.user.data.username}
        onChangeText={(v) => setTextComment(v)}
        onPress={() => createComment()}
        value={textComment}
      />
    </View>
  );
};
const ContainerReply = ({children, isGrandchild = true, hideLeftConnector}) => {
  return (
    <View
      style={[
        styles.containerReply(hideLeftConnector),
        {borderColor: isGrandchild ? 'transparent' : colors.gray1},
      ]}>
      {children}
    </View>
  );
};
export default ReplyComment;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flex: 1,
    backgroundColor: '#fff',
  },
  containerComment: {
    marginTop: 8,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 36,
    paddingRight: 36,
  },
  header: {
    marginLeft: -20,
    marginRight: -20,
    marginBottom: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 22,
    alignItems: 'center',
  },
  containerReply: (hideLeftConnector) => ({
    borderLeftWidth: 1,
    width: '100%',
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
    alignSelf: 'center',
  },
  commentScrollView: {
    minHeight: '100%',
    paddingBottom: 83,
  },
});
