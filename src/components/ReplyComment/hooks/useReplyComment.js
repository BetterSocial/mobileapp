import {useNavigation} from '@react-navigation/core';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import React from 'react';
import {Context} from '../../../context';
import {getFeedDetail} from '../../../service/post';
import StringConstant from '../../../utils/string/StringConstant';
import {createChildComment} from '../../../service/comment';

const useReplyComment = ({
  itemProp,
  indexFeed,
  dataFeed,
  updateParent,
  updateReply,
  itemParent,
  page
}) => {
  const [temporaryText, setTemporaryText] = React.useState('');
  const [textComment, setTextComment] = React.useState('');
  const [newCommentList, setNewCommentList] = React.useState([]);
  const [users] = React.useContext(Context).users;
  const [item, setItem] = React.useState(itemProp);
  const navigation = useNavigation();
  const scrollViewRef = React.useRef(null);

  const [profile] = React.useContext(Context).profile;
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
  const initTextComment = (text) => {
    setTextComment(text);
  };

  const setCommentHook = (text) => {
    setTemporaryText(text);
  };

  const handleFirstTextCommentHook = () => {
    setTextComment(temporaryText);
  };

  const updateReplyPost = (comment, itemParentProps, commentId) => {
    if (itemParentProps) {
      const updateComment = itemParentProps.latest_children.comment.map((dComment) => {
        if (dComment.id === commentId) {
          return {
            ...dComment,
            latest_children: {...dComment.latest_children, comment},
            children_counts: {comment: comment.length}
          };
        }
        return {...dComment};
      });
      const replaceComment = {
        ...itemParentProps,
        latest_children: {...itemParentProps.latest_children, comment: updateComment}
      };
      setItem(replaceComment);
      setNewCommentList(updateComment);
    }
  };

  const getThisCommentHook = () => {
    let comments = [];
    if (
      itemProp.latest_children &&
      itemProp.latest_children.comment &&
      Array.isArray(itemProp.latest_children.comment)
    ) {
      comments = itemProp.latest_children.comment.sort(
        (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()
      );
    }
    return comments;
  };

  const updateReplyPostHook = (comment, itemParentProps, commentId) => {
    if (itemParentProps) {
      const updateComment = itemParentProps.latest_children.comment.map((dComment) => {
        if (dComment.id === commentId) {
          return {
            ...dComment,
            latest_children: {...dComment.latest_children, comment},
            children_counts: {comment: comment.length}
          };
        }
        return {...dComment};
      });
      const replaceComment = {
        ...itemParentProps,
        latest_children: {...itemParentProps.latest_children, comment: updateComment}
      };
      return {replaceComment, updateComment};
    }
    return {replaceComment: itemParentProps, updateComment: itemParentProps};
  };

  const isLastInParentHook = (index) => index === (item.children_counts.comment || 0) - 1;

  const findCommentAndUpdateHook = (id, data) => {
    const newComment = newCommentList.map((comment) => {
      if (comment.id === id) {
        return {...comment, data: data.data};
      }
      return {...comment};
    });
    setNewCommentList(newComment);
    return newComment;
  };

  const updateVoteParentPostHook = (data, dataVote, comment) => {
    const updateComment = comment.latest_children.comment.map((dComment) => {
      if (dComment.id === dataVote.activity_id) {
        return {...dComment, data: data.data.data};
      }
      return {...dComment};
    });
    setNewCommentList(updateComment);
    return updateComment;
  };

  const updateVoteLatestChildrenParentHook = (response, dataVote, comment) => {
    if (comment) {
      const updateData = comment.latest_children.comment.map((dComment) => {
        if (dComment.id === dataVote.parent) {
          const mapChildren = dComment.latest_children.comment.map((child) => {
            if (child.id === dataVote.id) {
              return {...child, data: response.data};
            }
            return {...child};
          });
          return {
            ...dComment,
            latest_children: {...dComment.latest_children, comment: mapChildren}
          };
        }
        return {...dComment};
      });
      setNewCommentList(updateData);
      return updateData;
    }
    return [];
  };

  const showChildrenCommentView = async (itemReply) => {
    const itemParentProps = await {
      ...itemProp,
      latest_children: {...itemProp.latest_children, comment: newCommentList}
    };
    navigation.push('ReplyComment', {
      item: itemReply,
      level: 2,
      indexFeed,
      dataFeed,
      updateParent,
      itemParent: itemParentProps,
      updateReply: (comment, parentProps, id) => updateReplyPost(comment, parentProps, id),
      updateVote: (data, dataVote) => updateVoteParentPostHook(data, dataVote, itemParentProps),
      updateVoteLatestChildren: (data, dataVote) =>
        updateVoteLatestChildrenParentHook(data, dataVote, itemParentProps)
    });
  };

  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(item.activity_id);
      handleUpdateFeed(data, isSort);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateFeed = (data, isSort) => {
    if (data) {
      let oldData = data.data;
      if (isSort) {
        oldData = {
          ...oldData,
          latest_reactions: {...oldData.latest_reactions, comment: oldData.latest_reactions.comment}
        };
      }

      if (updateParent) {
        updateParent(oldData);
      }
    }
  };
  const createComment = async (isAnonimity, anonimityData) => {
    console.log(isAnonimity, anonimityData, 'sulit');
    let sendPostNotif = false;
    if (page !== 'DetailDomainScreen') {
      sendPostNotif = true;
    }
    setTemporaryText('');
    setNewCommentList([
      ...newCommentList,
      {...defaultData, data: {...defaultData.data, text: textComment}}
    ]);

    try {
      if (textComment.trim() !== '') {
        const data = await createChildComment(
          textComment,
          item.id,
          item.user.id,
          sendPostNotif,
          dataFeed?.actor?.id,
          dataFeed.id,
          dataFeed.message,
          isAnonimity,
          anonimityData
        );
        scrollViewRef.current.scrollToEnd();
        if (data.code === 200) {
          const newComment = [
            ...newCommentList,
            {
              ...defaultData,
              id: data.data.id,
              activity_id: data.data.activity_id,
              user: data.data.user,
              data: data.data.data
            }
          ];
          setNewCommentList(newComment);
          if (typeof updateReply === 'function') {
            updateReply(newComment, itemParent, item.id);
          }
          updateFeed(true);
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

  return {
    getThisCommentHook,
    updateReplyPostHook,
    setTemporaryText,
    setCommentHook,
    temporaryText,
    handleFirstTextCommentHook,
    textComment,
    isLastInParentHook,
    findCommentAndUpdateHook,
    updateVoteParentPostHook,
    updateVoteLatestChildrenParentHook,
    setTextComment,
    newCommentList,
    setNewCommentList,
    defaultData,
    setItem,
    item,
    initTextComment,
    updateReplyPost,
    showChildrenCommentView,
    updateFeed,
    handleUpdateFeed,
    scrollViewRef,
    createComment
  };
};

export default useReplyComment;
