import React from 'react';
import {iVoteComment, voteComment} from '../../../service/vote';

const useComment = ({comment, findCommentAndUpdate, level, updateVote}) => {
  const [totalVote, setTotalVote] = React.useState(
    comment.data.count_upvote - comment.data.count_downvote
  );
  const [statusVote, setStatusVote] = React.useState('none');
  const onUpVote = async () => {
    if (statusVote === 'upvote') {
      setTotalVote((prevState) => prevState - 1);
      setStatusVote('none');
    }
    if (statusVote === 'downvote') {
      setTotalVote((prevState) => prevState + 2);
      setStatusVote('upvote');
    }
    if (statusVote === 'none') {
      setTotalVote((prevState) => prevState + 1);
      setStatusVote('upvote');
    }
    const dataVote = {
      activity_id: comment.id,
      text: comment.data.text,
      status: 'upvote'
    };
    onVote(dataVote);
  };
  const onDownVote = async () => {
    if (statusVote === 'upvote') {
      setTotalVote((prevState) => prevState - 2);
      setStatusVote('downvote');
    }
    if (statusVote === 'downvote') {
      setTotalVote((prevState) => prevState + 1);
      setStatusVote('none');
    }
    if (statusVote === 'none') {
      setTotalVote((prevState) => prevState - 1);
      setStatusVote('downvote');
    }
    const dataVote = {
      activity_id: comment.id,
      text: comment.data.text,
      status: 'downvote'
    };
    onVote(dataVote);
  };
  const onVote = async (dataVote) => {
    const result = await voteComment(dataVote);
    if (findCommentAndUpdate) {
      findCommentAndUpdate(comment.id, result.data, level);
    }
    if (updateVote) {
      updateVote(result.data, comment, level);
    }
    iVote();
  };

  const iVote = async () => {
    const result = await iVoteComment(comment.id);
    if (result.code === 200) {
      setStatusVote(result.data.action);
    }
  };

  return {
    totalVote,
    setTotalVote,
    statusVote,
    setStatusVote,
    onVote,
    iVote,
    onUpVote,
    onDownVote
  };
};

export default useComment;
