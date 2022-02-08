import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions, Share, StyleSheet, View} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/core';

import Content from '../../FeedScreen/Content';
import ContentLink from '../../FeedScreen/ContentLink';
import ContentPoll from '../../FeedScreen/ContentPoll';
import Header from '../../FeedScreen/Header';
import ShareUtils from '../../../utils/share';
import dimen from '../../../utils/dimen';
import {
  ANALYTICS_SHARE_POST_PROFILE_ID,
  ANALYTICS_SHARE_POST_PROFILE_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../../utils/constants';
import {Context} from '../../../context';
import {Footer, Gap, PreviewComment} from '../../../components';
import {getCountCommentWithChild} from '../../../utils/getstream';
import {linkContextScreenParamBuilder} from '../../../utils/navigation/paramBuilder';

const {width, height} = Dimensions.get('window');

const getHeightReaction = () => {
  let h = Math.floor((height * 12) / 100);
  return h;
};

const getHeightHeader = () => {
  let h = Math.floor((height * 8.3) / 100);
  return h;
};

const getHeightFooter = () => {
  let h = Math.floor((height * 6.8) / 100);
  return h;
};

const getCountVote = (item) => {
  let reactionCount = item.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    let upvote = reactionCount.upvotes;
    if (upvote !== undefined) {
      count = count + upvote;
    }
    let downvote = reactionCount.downvotes;
    if (downvote !== undefined) {
      count = count - downvote;
    }
  }
  return count;
};

const getCountComment = (item) => {
  let reactionCount = item.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    let comment = reactionCount.comment;
    if (comment !== undefined) {
      count = comment;
    }
  }
  return count;
};

const Item = ({
  item,
  onPress,
  onPressBlock,
  onPressUpvote,
  onPressDownVote,
  onPressComment,
  selfUserId,
  onPressDomain,
  onNewPollFetched,
  onCardContentPress,
  index = -1,
  bottomBar = true,
}) => {
  const [isReaction, setReaction] = React.useState(false);
  const [previewComment, setPreviewComment] = React.useState({});
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [feeds, dispatch] = React.useContext(Context).feeds;
  // const [item, setItem] = React.useState(feeds.feeds[index]);
  const navigation = useNavigation();
  const [contentHeight, setContentHeight] = React.useState(0);
  const bottomHeight = bottomBar ? useBottomTabBarHeight() : 0;
  // const bottomHeight = 0;

  // console.log('item');
  // console.log(item);

  React.useEffect(() => {
    const initial = () => {
      let reactionCount = item.reaction_counts;
      if (JSON.stringify(reactionCount) !== '{}') {
        let comment = reactionCount?.comment;
        if (comment !== undefined) {
          if (comment > 0) {
            setReaction(true);
            setPreviewComment(item.latest_reactions.comment[0]);
          }
        }
      }
    };
    initial();
  }, [item]);

  const navigateToLinkContextPage = (item) => {
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.push('LinkContextScreen', param);
  };

  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          let upvote = item.latest_reactions.upvotes.filter(
            (vote) => vote.user_id === selfUserId,
          );
          if (upvote !== undefined) {
            setVoteStatus('upvote');
            setStatusUpvote(true);
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          let downvotes = item.latest_reactions.downvotes.filter(
            (vote) => vote.user_id === selfUserId,
          );
          if (downvotes !== undefined) {
            setVoteStatus('downvote');
            setStatusDowvote(true);
          }
        }
      }
    };
    validationStatusVote();
  }, [item, selfUserId]);

  React.useEffect(() => {
    const initialVote = () => {
      let c = getCountVote(item);
      setTotalVote(c);
    };
    initialVote();
  }, [item]);

  // console.log('item height')
  // console.log(dimen.size.PROFILE_ITEM_HEIGHT(bottomHeight))

  return (
    <View style={styles.cardContainer(bottomHeight)}>
      <Header props={item} height={getHeightHeader()} />

      {item.post_type === POST_TYPE_POLL && (
        <ContentPoll
          index={index}
          message={item.message}
          images_url={item.images_url}
          polls={item.pollOptions}
          onPress={onPress}
          item={item}
          pollexpiredat={item.polls_expired_at}
          multiplechoice={item.multiplechoice}
          isalreadypolling={item.isalreadypolling}
          onnewpollfetched={onNewPollFetched}
          voteCount={item.voteCount}
        />
      )}

      {item.post_type === POST_TYPE_LINK && (
        <View style={{flex: 1}}>
          <ContentLink
            index={index}
            og={item.og}
            onPress={onPress}
            onHeaderPress={onPressDomain}
            onCardContentPress={() => navigateToLinkContextPage(item)}
          />
        </View>
      )}
      {item.post_type === POST_TYPE_STANDARD && (
        <Content
          index={index}
          message={item.message}
          images_url={item.images_url}
          onPress={onPress}
        />
      )}
      <View style={styles.footerWrapper(getHeightFooter())}>
        <Footer
          item={item}
          totalComment={getCountCommentWithChild(item)}
          totalVote={totalVote}
          isSelf={true}
          onPressShare={() => ShareUtils.sharePostInProfile(item, 
              ANALYTICS_SHARE_POST_PROFILE_SCREEN,  
              ANALYTICS_SHARE_POST_PROFILE_ID
          )}
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
          onPressDownVote={() => {
            setStatusDowvote((prev) => {
              prev = !prev;
              onPressDownVote({
                activity_id: item.id,
                status: prev,
                feed_group: 'main_feed',
              });
              if (prev) {
                setVoteStatus('downvote');
                if (statusUpvote === true) {
                  setTotalVote((p) => p - 2);
                } else {
                  setTotalVote((p) => p - 1);
                }
                setStatusUpvote(false);
              } else {
                setVoteStatus('none');
                setTotalVote((p) => p + 1);
              }
              return prev;
            });
          }}
          onPressUpvote={() => {
            setStatusUpvote((prev) => {
              prev = !prev;
              onPressUpvote({
                activity_id: item.id,
                status: prev,
                feed_group: 'main_feed',
              });
              if (prev) {
                setVoteStatus('upvote');
                if (statusDownvote === true) {
                  setTotalVote((p) => p + 2);
                } else {
                  setTotalVote((p) => p + 1);
                }
                setStatusDowvote(false);
              } else {
                setVoteStatus('none');
                setTotalVote((p) => p - 1);
              }
              console.log('vote ', prev);
              return prev;
            });
          }}
          statusVote={voteStatus}
        />
      </View>
      {isReaction && (
        <View style={styles.contentReaction(getHeightReaction())}>
          <View style={styles.lineAffterFooter} />
          <PreviewComment
            user={previewComment.user}
            comment={previewComment.data.text}
            image={previewComment.user.data.profile_pic_url}
            time={previewComment.created_at}
            totalComment={getCountCommentWithChild(item) - 1}
            onPress={onPressComment}
          />
        </View>
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
        style={styles.linearGradient}
      />
    </View>
  );
};
function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

const RenderItem = React.memo(Item, compare);
export default RenderItem;

const styles = StyleSheet.create({
  cardContainer: (bottomHeight) => ({
    width: '100%',
    height: dimen.size.PROFILE_ITEM_HEIGHT,
    maxHeight: dimen.size.PROFILE_ITEM_HEIGHT,
    shadowColor: '#c4c4c4',
    shadowOffset: {
      width: 1,
      height: 8,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    paddingBottom: 0,
    borderBottomColor: 'transparent',
  }),
  paddingHorizontal: {paddingHorizontal: 20},
  lineAffterFooter: {backgroundColor: '#C4C4C4', height: 1},
  footerWrapper: (h) => ({height: h, paddingHorizontal: 0}),
  contentReaction: (heightReaction) => ({
    height: heightReaction
  }),
  linearGradient: {
    height: 8,
  },
});
