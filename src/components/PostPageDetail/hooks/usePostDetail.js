import { useNavigation, useRoute } from '@react-navigation/core';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

import React from 'react'
import { Dimensions, Keyboard } from 'react-native';
import { Context } from '../../../context';
import { setFeedByIndex, setMainFeeds } from '../../../context/actions/feeds';
import { createCommentParent } from '../../../service/comment';
import { getFeedDetail } from '../../../service/post';
import { getCountCommentWithChildInDetailPage } from '../../../utils/getstream';
import StringConstant from '../../../utils/string/StringConstant';
import { downVote, upVote } from '../../../service/vote';

export const usePostDetail = (props) => {
  const [user] = React.useContext(Context).users;
  const [profile] = React.useContext(Context).profile;
  const [loading, setLoading] = React.useState(true)
  const [isReaction, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [typeComment, setTypeComment] = React.useState('parent');
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false)
  const [commentList, setCommentList] = React.useState([])
  const [time, setTime] = React.useState(new Date().getTime())
  const [item, setItem] = React.useState(null);
  // const route = useRoute()
  const scrollViewRef = React.useRef(null);
  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const { timer } = feedsContext
  const { feedId, navigateToReplyView, route } = props
  console.log(item, 'lala')
  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0
    const downvotes = data.downvotes ? data.downvotes : 0
    setTotalVote(upvote - downvotes)
  };

    const initial = async () => {
    try {
      const reactionCount = item.reaction_counts;
      if (JSON.stringify(reactionCount) !== '{}') {
        let count = 0;
        const { comment } = reactionCount;
        handleVote(reactionCount);
        if (comment !== undefined) {
          if (comment > 0) {
            setReaction(true);
            setTotalComment(
              getCountCommentWithChildInDetailPage(item.latest_reactions),
            );
          }
        }
        const upvote = reactionCount.upvotes;
        if (upvote !== undefined) {
          count += upvote;
        }
        const downvote = reactionCount.downvotes;
        if (downvote !== undefined) {
          count -= downvote;
        }
        setTotalVote(count);
      }
    } catch (e) { }
  };

  const getDetailFeed = async () => {
    if (!route.params.isCaching) {
      setLoading(true)
      const data = await getFeedDetail(feedId);
      setItem(data.data)
      setLoading(false)
    } else {
      setItem(route.params.data)
    }
  }

    const updateParentPost = (data) => {
    setItem(data)
    updateAllContent(data)
  }


  const updateAllContent = (newFeed) => {
    if (item && item.id) {
      const mappingData = feedsContext.feeds.map((feed) => {
        if (feed.id === item.id) {
          return { ...feed, ...newFeed }
        }
        return { ...feed }
      })
      setMainFeeds(mappingData, dispatch)
    }

  }

  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(feedId);
      let oldData = data.data
      if (isSort) {
        oldData = { ...oldData, latest_reactions: { ...oldData.latest_reactions, comment: oldData.latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()) } }
      }
      setLoadingPost(false)
      if (data) {
        setItem(oldData);

      }
      updateAllContent(oldData)
      Keyboard.dismiss()
      setTimeout(() => {
        if (scrollViewRef && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: Dimensions.get('screen').height + 30, x: 0 })
        }
      }, 300)

    } catch (e) {
      console.log(e);
    }
  };

    const onComment = () => {
    if (typeComment === 'parent') {
      commentParent();
    }
  };

    const onCommentButtonClicked = () => {
    scrollViewRef.current.scrollToEnd();
  };

    const updateCachingComment = (comment) => {
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        let joinComment = []
        if (Array.isArray(feed.latest_reactions.comment)) {
          joinComment = [...feed.latest_reactions.comment, comment].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        } else {
          joinComment.push(comment)
        }
        return { ...feed, latest_reactions: { ...feed.latest_reactions, comment: joinComment } }
      }
      return { ...feed }
    })
    setMainFeeds(mappingData, dispatch)
  }

  const commentParent = async () => {
    setLoadingPost(true)
    try {
      if (textComment.trim() !== '') {

        const data = await createCommentParent(textComment, item.id, item.actor.id, true);
        updateCachingComment(data.data)
        if (data.code === 200) {
          setTextComment('');
          updateFeed(true);
          // Toast.show('Comment successful', Toast.LONG);

        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
          setLoadingPost(false)
        }
      } else {
        Toast.show('Comments are empty', Toast.LONG);
        setLoadingPost(false)
      }
    } catch (e) {
      setLoadingPost(false)
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };

   const findVoteAndUpdate = (response, type) => {
    const data = []
    data.push(response.data)
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        if (type === 'upvote') {
          if (response.data) {
            return { ...feed, reaction_counts: { ...feed.reaction_counts, upvotes: feed.reaction_counts.upvotes + 1, downvotes: voteStatus === 'downvote' ? feed.reaction_counts.downvotes - 1 : feed.reaction_counts.downvotes }, own_reactions: { ...feed.own_reactions, upvotes: typeof feed.own_reactions === 'object' ? data : feed.own_reactions.push(response.data), downvotes: voteStatus === 'downvote' ? feed.own_reactions.downvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : feed.own_reactions.downvotes } }
          }
          return { ...feed, reaction_counts: { ...feed.reaction_counts, upvotes: feed.reaction_counts.upvotes - 1 }, own_reactions: { ...feed.own_reactions, upvotes: Array.isArray(feed.own_reactions.upvotes) ? feed.own_reactions.upvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : [] } }

        }
        if (response.data) {
          return { ...feed, reaction_counts: { ...feed.reaction_counts, downvotes: feed.reaction_counts.downvotes + 1, upvotes: voteStatus === 'upvote' ? feed.reaction_counts.upvotes - 1 : feed.reaction_counts.upvotes }, own_reactions: { ...feed.own_reactions, downvotes: typeof feed.own_reactions === 'object' ? data : feed.own_reactions.push(response.data), upvotes: voteStatus === 'upvote' ? feed.own_reactions.upvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : feed.own_reactions.upvotes } }
        }
        return { ...feed, reaction_counts: { ...feed.reaction_counts, downvotes: feed.reaction_counts.downvotes - 1 }, own_reactions: { ...feed.own_reactions, downvotes: Array.isArray(feed.own_reactions.downvotes) ? feed.own_reactions.downvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : [] } }



      }
      return { ...feed }
    })
    setMainFeeds(mappingData, dispatch)
  }

  const findCommentAndUpdate = (id, newData, level) => {
    // console.log(id, newData, level, commentList, 'bukan')
    let newCommenList = []
    if (level > 0) {
      const updatedComment = commentList.map((comment) => {
        if (comment.id === newData.parent) {
          const findComment = comment.latest_children.comment.map((comment1) => {
            if (comment1.id === newData.id) {
              return { ...comment1, ...newData }
            }
            return { ...comment1 }

          })
          return { ...comment, latest_children: { ...comment.latest_children, comment: findComment } }
        }
        return { ...comment }
      })
      newCommenList = updatedComment
    } else {
      const updatedComment = commentList.map((comment) => {
        if (comment.id === id) {
          return { ...comment, ...newData }
        }
        return { ...comment }
      })
      newCommenList = updatedComment
    }
    setCommentList(newCommenList)
    findReduxCommentAndUpdate(newCommenList)
  }

    const findReduxCommentAndUpdate = (comment) => {
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        return { ...feed, latest_reactions: { ...feed.latest_reactions, comment } }
      }
      return { ...feed }
    })
    setMainFeeds(mappingData, dispatch)
  }

  const setUpVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
    };
    const processData = await upVote(data);
    findVoteAndUpdate(processData, 'upvote')
  };
  const setDownVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
    };
    const processData = await downVote(data);
    findVoteAndUpdate(processData, 'downvote')

  };


  const onPressDownVoteHandle = async () => {
    // setLoadingVote(true);
    setStatusDowvote((prev) => !prev);
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
    await setDownVote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    // setLoadingVote(true);
    setStatusUpvote((prev) => !prev);
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
    await setUpVote(!statusUpvote);
  };

  const handleRefreshComment = () => {
    updateFeed()
  }

  const handleRefreshChildComment = () => {
    updateFeed()
  }


  const checkVotes = () => {
    const findUpvote = item && item.own_reactions && item.own_reactions.upvotes && Array.isArray(item.own_reactions.upvotes) && item.own_reactions.upvotes.find((reaction) => reaction.user_id === profile.myProfile.user_id)
    const findDownvote = item && item.own_reactions && item.own_reactions.downvotes && Array.isArray(item.own_reactions.downvotes) && item.own_reactions.downvotes.find((reaction) => reaction.user_id === profile.myProfile.user_id)
    if (findUpvote) {
      setVoteStatus('upvote')
      setStatusUpvote(true)
    }
    if (findDownvote) {
      setVoteStatus('downvote')
      setStatusDowvote(true)
    }
    if (!findDownvote && !findUpvote) {
      setVoteStatus('none')
    }
  }

    const updateVoteLatestChildren = async (dataUpdated, data, level) => {
    if (level === 3) {
      const newComment = await updateVoteLatestChildrenLevel3(commentList, dataUpdated)
      setCommentList(newComment)
    }
    if (level === 1) {
      const newComment = await updateVoteChildrenLevel1(commentList, dataUpdated)
      setCommentList(newComment)
    }
  }

  const initComment = () => {
     if (item && item.latest_reactions && item.latest_reactions.comment) {
      setCommentList(item?.latest_reactions?.comment?.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()))
    }
  }

    const updateVoteLatestChildrenLevel3 = (commentListNew, dataUpdated) => {
    const updateComment = commentListNew.map((comment) => {
      if(comment.activity_id === dataUpdated.activity_id) {
        const latestChildrenMap = comment.latest_children.comment.map((com) => {
          if(com.id ===  dataUpdated.parent) {
            const mappingChildren2 = com.latest_children.comment.map((com1) => {
              if(com1.id === dataUpdated.id) {
                return {...com1, data: dataUpdated.data}
              } 
                return {...com1}
              
            })
            return {...com, latest_children: {comment: mappingChildren2}}
          }
          return {...com}
        })
        return {...comment, latest_children: {comment: latestChildrenMap}}
      }
      return {...comment}
    })
    return updateComment
  }

  const updateVoteChildrenLevel1 = (commentListNew, dataUpdated) => {
          const newComment = commentListNew.map((myComment) => {
          if(myComment.id === dataUpdated.parent) {
            const newChild = myComment.latest_children.comment.map((child) => {
              if(child.id === dataUpdated.id) {
                return {...child, data: dataUpdated.data}
              } 
                return {...child}
              
            })
            return {...myComment, latest_children: {comment: newChild}}
          }
        return {...myComment}
      })
      return newComment
  }

    return {updateVoteLatestChildrenLevel3, updateVoteChildrenLevel1, handleVote, getDetailFeed, initial, initComment, updateVoteLatestChildren, checkVotes, handleRefreshComment, handleRefreshChildComment, onPressUpvoteHandle, onPressDownVoteHandle, findCommentAndUpdate, onComment,findReduxCommentAndUpdate, findVoteAndUpdate, commentList, totalComment,totalVote, loadingPost, navigateToReplyView, item, updateParentPost, route, updateFeed, commentParent, onCommentButtonClicked, updateAllContent, updateCachingComment, setDownVote, setUpVote, profile, loading, isReaction, setTextComment, textComment, voteStatus, scrollViewRef, refBlockComponent, feedsContext, setItem, setVoteStatus}
}



export default usePostDetail