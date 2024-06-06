import React from 'react';

import AnalyticsEventTracking from '../../../libraries/analytics/analyticsEventTracking';
import {iVoteComment, voteCommentV2} from '../../../service/vote';

const useComment = ({
  comment,
  updateVote,
  eventTrackName = {
    upvoteInserted: null,
    upvoteRemoved: null,
    downvoteInserted: null,
    downvoteRemoved: null
  }
}) => {
  const [totalVote, setTotalVote] = React.useState(
    comment.data?.count_upvote - comment.data?.count_downvote
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

    const isUpvoteInsertedEventTrackEligible =
      (statusVote === 'downvote' || statusVote === 'none') && eventTrackName.upvoteInserted;

    const isUpvoteRemovedEventTrackEligible =
      statusVote === 'upvote' && eventTrackName.upvoteRemoved;

    if (isUpvoteInsertedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(eventTrackName.upvoteInserted);

    if (isUpvoteRemovedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(eventTrackName.upvoteRemoved);

    const dataVote = {
      reaction_id: comment.id,
      vote: 'upvote'
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

    const isDownvoteInsertedEventTrackEligible =
      (statusVote === 'upvote' || statusVote === 'none') && eventTrackName.downvoteInserted;

    const isDownvoteRemovedEventTrackEligible =
      statusVote === 'downvote' && eventTrackName.downvoteRemoved;

    if (isDownvoteInsertedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(eventTrackName.downvoteInserted);

    if (isDownvoteRemovedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(eventTrackName.downvoteRemoved);

    const dataVote = {
      reaction_id: comment.id,
      vote: 'downvote'
    };
    onVote(dataVote);
  };
  const onVote = async (dataVote) => {
    await voteCommentV2(dataVote);
    if (updateVote) {
      updateVote();
    }
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
