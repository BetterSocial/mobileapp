import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

import Content from '../../FeedScreen/Content';
import ContentLink from '../../FeedScreen/ContentLink';
import Header from '../../FeedScreen/Header';
import ShareUtils from '../../../utils/share';
import dimen from '../../../utils/dimen';
import {
  ANALYTICS_SHARE_POST_PROFILE_ID,
  ANALYTICS_SHARE_POST_PROFILE_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_MY_PROFILE
} from '../../../utils/constants';
import {Context} from '../../../context';
import {Footer, PreviewComment} from '../../../components';
import {getCommentLength} from '../../../utils/getstream';
import {showScoreAlertDialog} from '../../../utils/Utils';
import {normalize, normalizeFontSizeByWidth} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import usePostHook from '../../../hooks/core/post/usePostHook';
import useFeed from '../../FeedScreen/hooks/useFeed';
import AddCommentPreview from '../../FeedScreen/elements/AddCommentPreview';

const FULL_WIDTH = Dimensions.get('screen').width;

const getCountVote = (item) => {
  const reactionCount = item.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    const upvote = reactionCount?.upvotes;
    if (upvote !== undefined) {
      count += upvote;
    }
    const downvote = reactionCount?.downvotes;
    if (downvote !== undefined) {
      count -= downvote;
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
  index = -1,
  onHeaderOptionClicked = () => {}
}) => {
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [isHaveSeeMore, setIsHaveSeeMore] = React.useState(false);
  const [isShortText, setIsShortText] = React.useState(true);
  const [profile] = React.useContext(Context).profile;
  const {followUnfollow} = usePostHook();
  const {navigateToLinkContextPage, getHeightHeader, getTotalReaction} = useFeed();

  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts) {
        if (item.latest_reactions.upvotes) {
          const upvote = item.latest_reactions.upvotes.find((vote) => vote.user_id === selfUserId);
          if (upvote) {
            setVoteStatus('upvote');
            setStatusUpvote(true);
          }
        } else if (item.latest_reactions.downvotes) {
          const downvotes = item.latest_reactions.downvotes.find(
            (vote) => vote.user_id === selfUserId
          );
          if (downvotes) {
            setVoteStatus('downvote');
            setStatusDowvote(true);
          }
        } else {
          setVoteStatus('none');
        }
      }
    };
    validationStatusVote();
  }, [item, selfUserId]);

  React.useEffect(() => {
    const initialVote = () => {
      const c = getCountVote(item);
      setTotalVote(c);
    };
    initialVote();
  }, [item]);

  const hasComment =
    getCommentLength(item.latest_reactions.comment) > 0 && item.latest_reactions.comment[0].user;

  const isShortTextPost =
    item.post_type === POST_TYPE_STANDARD && item.images_url.length <= 0 && isShortText === true;

  return (
    <View key={item.id} style={styles.cardContainer}>
      <View style={[styles.cardMain]}>
        <Header
          item={item}
          onHeaderOptionClicked={onHeaderOptionClicked}
          props={item}
          height={getHeightHeader()}
          showAnonymousOption={true}
          source={SOURCE_MY_PROFILE}
          isFollow={item?.is_following_target}
          onPressFollUnFoll={() => followUnfollow(item)}
          disabledFollow={true}
          isShortText={isShortTextPost}
        />
        {item.post_type === POST_TYPE_LINK && (
          <ContentLink
            key={item.id}
            index={index}
            og={item.og}
            onPress={() => onPress(item)}
            onHeaderPress={() => onPressDomain(item)}
            onCardContentPress={() => navigateToLinkContextPage(item)}
            score={item?.credderScore}
            message={item?.message}
            messageContainerStyle={{paddingHorizontal: 10}}
            topics={item?.topics}
            item={item}
          />
        )}
        {(item.post_type === POST_TYPE_STANDARD || item.post_type === POST_TYPE_POLL) && (
          <Content
            key={item.id}
            index={index}
            message={item.message}
            images_url={item.images_url}
            onPress={() => {
              onPress(isHaveSeeMore);
            }}
            setHaveSeeMore={(haveSeeMore) => setIsHaveSeeMore(haveSeeMore)}
            setIsShortText={(shortText) => setIsShortText(shortText)}
            topics={item?.topics}
            item={item}
            onNewPollFetched={onNewPollFetched}
            hasComment={hasComment}
          />
        )}
        <Footer
          item={item}
          totalComment={getTotalReaction(item)}
          totalVote={totalVote}
          isSelf={false}
          onPressShare={() =>
            ShareUtils.sharePostInProfile(
              item,
              ANALYTICS_SHARE_POST_PROFILE_SCREEN,
              ANALYTICS_SHARE_POST_PROFILE_ID
            )
          }
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
          showScoreButton={profile?.myProfile?.is_backdoor_user}
          onPressScore={() => showScoreAlertDialog(item)}
          onPressDownVote={() => {
            setStatusDowvote((prev) => {
              // eslint-disable-next-line no-param-reassign
              prev = !prev;
              onPressDownVote({
                activity_id: item.id,
                status: prev,
                feed_group: 'main_feed'
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
              // eslint-disable-next-line no-param-reassign
              prev = !prev;
              onPressUpvote({
                activity_id: item.id,
                status: prev,
                feed_group: 'main_feed'
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
          isShowDM
          isShortText={isShortTextPost}
        />
        {hasComment ? (
          <View testID="previewComment">
            <PreviewComment
              user={item.latest_reactions.comment[0].user}
              comment={item?.latest_reactions?.comment[0]?.data?.text || ''}
              image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ''}
              time={item.latest_reactions.comment[0].created_at}
              totalComment={getTotalReaction(item) - 1}
              item={item.latest_reactions.comment[0]}
              onPress={() => onPressComment(isHaveSeeMore)}
              isShortText={isShortTextPost}
              isBlurred={false}
            />
          </View>
        ) : (
          <AddCommentPreview
            isBlurred={false}
            onPressComment={() => onPressComment(isHaveSeeMore)}
            isShortText={isShortTextPost}
          />
        )}
      </View>
    </View>
  );
};

Item.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
  onPressBlock: PropTypes.func,
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  onPressComment: PropTypes.func,
  selfUserId: PropTypes.any,
  onPressDomain: PropTypes.func,
  onNewPollFetched: PropTypes.func,
  index: PropTypes.number,
  onHeaderOptionClicked: PropTypes.func
};

export default Item;
// export default Item

const styles = StyleSheet.create({
  cardContainer: {
    width: FULL_WIDTH,
    height: dimen.size.PROFILE_ITEM_HEIGHT,
    backgroundColor: COLORS.almostBlack,
    paddingTop: normalizeFontSizeByWidth(4)
  },
  cardMain: {
    width: '100%',
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT - normalize(56),
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
    backgroundColor: COLORS.almostBlack
  }
});
