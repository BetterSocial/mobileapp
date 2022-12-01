
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import React from 'react'
import { Dimensions, StatusBar } from 'react-native';
import dimen from '../../../utils/dimen';
import { linkContextScreenParamBuilder } from '../../../utils/navigation/paramBuilder';

const useFeed = () => {
    const navigation = useNavigation()
    const [totalVote, setTotalVote] = React.useState(0);
    const FULL_HEIGHT = Dimensions.get('screen').height;
    const tabBarHeight = StatusBar.currentHeight;
    const bottomHeight = useBottomTabBarHeight()
    const [voteStatus, setVoteStatus] = React.useState('none');
    const [statusUpvote, setStatusUpvote] = React.useState(false);
    const [statusDownvote, setStatusDowvote] = React.useState(false);

    const handleVote = (data = {}) => {
        const upvote = data.upvotes ? data.upvotes : 0
        const downvotes = data.downvotes ? data.downvotes : 0
        setTotalVote(upvote - downvotes)
    };

    const getHeightReaction = () => 
     dimen.size.FEED_COMMENT_CONTAINER_HEIGHT
  ;

    const navigateToLinkContextPage = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.push('LinkContextScreen', param);
  };

    const getHeightFooter = () => {
    const h = Math.floor(((FULL_HEIGHT - tabBarHeight - bottomHeight) * 7) / 100);
    return h;
  };

  const getHeightHeader = () => 
   dimen.size.FEED_HEADER_HEIGHT
;
  const checkVotes = (item, selfUserId) => {
    const findUpvote = item && item.own_reactions && item.own_reactions.upvotes && item.own_reactions.upvotes.find((vote) => vote.user_id === selfUserId)
    const findDownvote = item && item.own_reactions && item.own_reactions.downvotes && item.own_reactions.downvotes.find((vote) => vote.user_id === selfUserId)
    if (findUpvote) {
      setVoteStatus('upvote')
      setStatusUpvote(true)
    } else if (findDownvote) {
      setVoteStatus('downvote')
      setStatusDowvote(true)
    } else {
      setVoteStatus('none')
    }
  }

    const initialSetup = (item) => {
    const reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      handleVote(reactionCount);
    }
  };

    const onPressUpvoteHook = async () => {
    if (voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 1)
      setVoteStatus('none')
    }
    if (voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 2)
      setVoteStatus('upvote')
    }
    if (voteStatus === 'none') {
      setTotalVote((prevState) => prevState + 1)
      setVoteStatus('upvote')
    }
    setStatusUpvote((prev) => !prev);
  };

    const onPressDownVoteHook = async () => {
    if (voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 2)
      setVoteStatus('downvote')
    }
    if (voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 1)
      setVoteStatus('none')
    }
    if (voteStatus === 'none') {
      setTotalVote((prevState) => prevState - 1)
      setVoteStatus('downvote')
    }
    setStatusDowvote((prev) => !prev);
  };

  const handleTextCountStyle = () => {
    if(totalVote > 0) {
      return '#00ADB5'
    }
    if(totalVote < 0) {
      return '#FF2E63'
    } 

    return '#C4C4C4'
  };




  return {
    handleVote,
    totalVote,
    setTotalVote,
    getHeightReaction,
    navigateToLinkContextPage,
    getHeightFooter,
    getHeightHeader,
    checkVotes,
    voteStatus,
    statusDownvote,
    statusUpvote,
    setVoteStatus,
    setStatusDowvote,
    setStatusUpvote,
    initialSetup,
    onPressUpvoteHook,
    onPressDownVoteHook,
    handleTextCountStyle,
  }
}


export default useFeed