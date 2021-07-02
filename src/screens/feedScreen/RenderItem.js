import * as React from 'react';
import {StyleSheet, Dimensions, Share, View} from 'react-native';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import analytics from '@react-native-firebase/analytics';
import Content from './Content';
import Header from './Header';
import {Card} from '../../components/CardStack';
import {
  POST_TYPE_POLL,
  POST_TYPE_LINK,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import ContentPoll from './ContentPoll';

import ContentLink from './ContentLink';
import {Gap, PreviewComment, Footer} from '../../components';

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
  onPressDomain,
}) => {
  const [isReaction, setReaction] = React.useState(false);
  const [previewComment, setPreviewComment] = React.useState({});
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);

  React.useEffect(() => {
    const initial = () => {
      let reactionCount = item.reaction_counts;
      if (JSON.stringify(reactionCount) !== '{}') {
        let comment = reactionCount.comment;
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

  return (
    <Card style={styles.container}>
      <Header props={item} />

      {item.post_type === POST_TYPE_POLL && (
        <ContentPoll
          message={item.message}
          images_url={item.images_url}
          polls={item.pollOptions}
          onPress={onPress}
          item={item}
        />
      )}

      {item.post_type === POST_TYPE_LINK && (
        <ContentLink og={item.og} onPress={onPressDomain} />
      )}
      {item.post_type === POST_TYPE_STANDARD && (
        <Content
          message={item.message}
          images_url={item.images_url}
          onPress={onPress}
        />
      )}
      <Footer
        totalComment={getCountComment(item)}
        totalVote={totalVote}
        onPressShare={() => onShare(item)}
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
            return prev;
          });
        }}
        statusVote={voteStatus}
        isSelf={
          item.anonimity ? false : selfUserId === item.actor.id ? true : false
        }
      />

      {isReaction && (
        <View>
          <Gap height={8} />
          <PreviewComment
            username={previewComment.user.data.username}
            comment={previewComment.data.text}
            image={previewComment.user.data.profile_pic_url}
            time={previewComment.created_at}
            totalComment={item.latest_reactions.comment.length - 1}
            onPress={onPressComment}
          />
          <Gap height={8} />
        </View>
      )}
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
