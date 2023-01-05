
import React from 'react'

const useItemNews = () => {
      const [statusUpvote, setStatusUpvote] = React.useState(false);
          const [totalVote, setTotalVote] = React.useState(0);
            const [voteStatus, setVoteStatus] = React.useState('none');

    const onPressUpvoteNew = async (item, onPressUpvote) => {
    await onPressUpvote({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name,
    });
    if (voteStatus === 'none') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 1)
    } 
    if(voteStatus === 'upvote') {
      setVoteStatus('none')
      setTotalVote((vote) => vote - 1)
    }
    if(voteStatus === 'downvote') {
      setVoteStatus('upvote')
      setTotalVote((vote) => vote + 2)
    }
  }

  const onPressDownVoteHandle = async (item, onPressDownVote) => {
    await onPressDownVote({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name,
    });
    if (voteStatus === 'none') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 1)
    } 
    if(voteStatus === 'downvote') {
      setVoteStatus('none')
      setTotalVote((vote) => vote + 1)
    }
    if(voteStatus === 'upvote') {
      setVoteStatus('downvote')
      setTotalVote((vote) => vote - 2)
    }
  }

   const validationStatusVote = (item, selfUserId) => {
      if (item.latest_reactions.upvotes !== undefined) {
        const upvote = item.latest_reactions.upvotes.filter(
          (vote) => vote.user_id === selfUserId,
        );
        if (upvote !== undefined) {
          setVoteStatus('upvote');
        }
      } else if (item.latest_reactions.downvotes !== undefined) {
        const downvotes = item.latest_reactions.downvotes.filter(
          (vote) => vote.user_id === selfUserId,
        );
        if (downvotes !== undefined) {
          setVoteStatus('downvote');
        }
      } else {
        setVoteStatus('none')
      }    
  };

  return {
    onPressUpvoteNew,
    onPressDownVoteHandle,
    setStatusUpvote,
    setVoteStatus,
    setTotalVote,
    voteStatus,
    totalVote,
    statusUpvote,
    validationStatusVote
  }
}




export default useItemNews