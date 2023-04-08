import React from 'react';
import {saveComment} from '../../../context/actions/comment';
import {Context} from '../../../context';
import {getCommentList} from '../../../service/comment';

const useUpdateComment = () => {
  const [commentContext, dispatchComment] = React.useContext(Context).comments;

  const updateComment = async (feedId) => {
    try {
      const queryParam = new URLSearchParams({limit: 20}).toString();
      const response = await getCommentList(feedId, queryParam);
      saveComment(response.data.data, dispatchComment);
    } catch (e) {
      console.log(e, 'error');
    }
  };

  return {
    updateComment,
    commentContext
  };
};

export default useUpdateComment;
