import React from 'react';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {useNavigation} from '@react-navigation/core';
import StringConstant from '../../../utils/string/StringConstant';
import {Context} from '../../../context';
import {createChildCommentV3} from '../../../service/comment';
import {getCommentChild} from '../../../service/feeds';
import {getFeedDetail} from '../../../service/post';

const useReplyComment = ({itemProp, indexFeed, dataFeed, updateParent, page, getComment}) => {
  const [temporaryText, setTemporaryText] = React.useState('');
  const [textComment, setTextComment] = React.useState('');
  const [newCommentList, setNewCommentList] = React.useState([]);
  const [item, setItem] = React.useState(itemProp);
  const navigation = useNavigation();
  const scrollViewRef = React.useRef(null);
  const [profile] = React.useContext(Context).profile;
  const [defaultData] = React.useState({
    data: {count_downvote: 0, count_upvote: 0, text: textComment},
    id: newCommentList?.length + 1,
    kind: 'comment',
    updated_at: moment(),
    children_counts: {comment: 0},
    latest_children: {},
    user: {
      data: {
        ...itemProp.user.data,
        profile_pic_url: profile?.myProfile?.profile_pic_path,
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
      const updateMyComment = itemParentProps.latest_children.comment.map((dComment) => {
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
        latest_children: {...itemParentProps.latest_children, comment: updateMyComment}
      };
      setItem(replaceComment);
      setNewCommentList(updateMyComment);
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
      const updateMyComment = itemParentProps.latest_children.comment.map((dComment) => {
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
        latest_children: {...itemParentProps.latest_children, comment: updateMyComment}
      };
      return {replaceComment, updateMyComment};
    }
    return {replaceComment: itemParentProps, updateMyComment: itemParentProps};
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
    const updateMyComment = comment.latest_children.comment.map((dComment) => {
      if (dComment.id === dataVote.activity_id) {
        return {...dComment, data: data.data.data};
      }
      return {...dComment};
    });
    setNewCommentList(updateMyComment);
    return updateMyComment;
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
        updateVoteLatestChildrenParentHook(data, dataVote, itemParentProps),
      getComment: getThisComment
    });
  };

  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(item.activity_id);

      handleUpdateFeed(data, isSort);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
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
    let sendPostNotif = false;
    if (page !== 'DetailDomainScreen') {
      sendPostNotif = true;
    }

    const commentWillBeAddedData = {
      ...defaultData,
      data: {...defaultData.data, text: textComment}
    };
    if (isAnonimity) {
      commentWillBeAddedData.user = {};
      commentWillBeAddedData.data.is_anonymous = true;
      commentWillBeAddedData.data.anon_user_info_emoji_name = anonimityData.emojiName;
      commentWillBeAddedData.data.anon_user_info_emoji_code = anonimityData.emojiCode;
      commentWillBeAddedData.data.anon_user_info_color_name = anonimityData.colorName;
      commentWillBeAddedData.data.anon_user_info_color_code = anonimityData.colorCode;
    }
    if (!isAnonimity) {
      commentWillBeAddedData.user.data = {
        profile_pic_url: profile?.myProfile?.profile_pic_path,
        username: profile?.myProfile?.username
      };
    }

    setTemporaryText('');
    setNewCommentList([...newCommentList, commentWillBeAddedData]);

    try {
      if (textComment.trim() !== '') {
        const data = await createChildCommentV3(
          textComment,
          item.id,
          sendPostNotif,
          dataFeed?.id ?? dataFeed?.reaction_id,
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
              data: data.data.data,
              is_you: true
            }
          ];
          setNewCommentList(newComment);
          if (getComment && typeof getComment === 'function') {
            getComment();
          }
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
        }
      }
    } catch (error) {
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };
  const getThisComment = async (isUpdate) => {
    if (itemProp.latest_children.comment && Array.isArray(itemProp.latest_children.comment)) {
      if (!isUpdate) {
        setNewCommentList(itemProp.latest_children?.comment);
      }
    }
    const response = await getCommentChild({activity_id: item?.id, feed_id: item.activity_id});
    setNewCommentList(response.data);
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
    createComment,
    getThisComment
  };
};
export default useReplyComment;
