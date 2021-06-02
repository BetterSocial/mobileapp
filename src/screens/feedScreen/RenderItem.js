import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, Share} from 'react-native';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

import dynamicLinks from '@react-native-firebase/dynamic-links';

import analytics from '@react-native-firebase/analytics';

import {Card} from '../../components/CardStack';
import {POST_VERB_POLL} from '../../utils/constants';
import ContentPoll from './ContentPoll';

const {width, height} = Dimensions.get('window');
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

async function buildLink(username) {
  const link = await dynamicLinks().buildLink(
    {
      link: `https://dev.bettersocial.org/${username}`,
      domainUriPrefix: 'https://bettersocialapp.page.link',
      analytics: {
        campaign: 'banner',
      },
      navigation: {
        forcedRedirectEnabled: false,
      },
      // ios: {
      //   bundleId: '',
      //   // customScheme: 'giftit',
      //   appStoreId: '',
      // },
      android: {
        packageName: 'org.bettersocial.dev',
      },
    },
    'SHORT',
  );
  return link;
}

const onShare = async (username) => {
  analytics().logEvent('feed_screen_btn_share', {
    id: 'btn_share',
  });
  try {
    const result = await Share.share({
      message: await buildLink(username),
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

const Item = ({
  item,
  onPress,
  onPressBlock,
  onPressUpvote,
  onPressDownVote,
  onPressComment,
  selfUserId,
}) => {
  const [voteStatus, setVoteStatus] = useState('none');
  useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          let upvote = item.latest_reactions.upvotes.filter(
            (vote) => vote.user_id === selfUserId,
          );
          console.log(upvote);
          if (upvote !== undefined) {
            setVoteStatus('upvote');
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          let downvotes = item.latest_reactions.downvotes.filter(
            (vote) => vote.user_id === selfUserId,
          );
          console.log(downvotes);
          if (downvotes !== undefined) {
            setVoteStatus('downvote');
          }
        }
      }
    };
    validationStatusVote();
  }, [item, selfUserId]);
  return (
    <Card style={[styles.container]}>
      <Header props={item} />
      {item.verb === POST_VERB_POLL ? (
        <ContentPoll
          message={item.message}
          images_url={item.images_url}
          polls={item.pollOptions}
          onPress={onPress}
        />
      ) : (
        <Content
          message={item.message}
          images_url={item.images_url}
          onPress={onPress}
        />
      )}
      <Footer
        item={item}
        onPressShare={() => {
          onShare(item.actor.data.username);
        }}
        onPressBlock={onPressBlock}
        onPressComment={onPressComment}
        onPressUpvote={onPressUpvote}
        onPressDownVote={onPressDownVote}
        totalVote={getCountVote(item)}
        totalComment={getCountComment(item)}
        statusVote={voteStatus}
      />
    </Card>
  );
};
function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

const RenderItem = React.memo(Item, compare);
export default RenderItem;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height - height * 0.1,
    shadowColor: '#c4c4c4',
    shadowOffset: {
      width: 1,
      height: 8,
    },
    elevation: 8,
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: width * 0.03,
    paddingBottom: 8,
    borderBottomColor: 'transparent',
  },
});
