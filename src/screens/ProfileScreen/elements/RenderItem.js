import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
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
import {getCountCommentWithChild} from '../../../utils/getstream';
import {linkContextScreenParamBuilder} from '../../../utils/navigation/paramBuilder';
import {showScoreAlertDialog} from '../../../utils/Utils';
import {normalize, normalizeFontSizeByWidth} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import WriteComment from '../../../components/Comments/WriteComment';
import useWriteComment from '../../../components/Comments/hooks/useWriteComment';
import usePostHook from '../../../hooks/core/post/usePostHook';

const {height} = Dimensions.get('window');
const tabBarHeight = StatusBar.currentHeight;

const getHeightReaction = () => {
  const h = Math.floor((height * 12) / 100);
  return h;
};

const getHeightHeader = () => {
  const h = Math.floor((height * 8.3) / 100);
  return h;
};

const getHeightFooter = () => {
  const h = Math.floor((height * 6.8) / 100);
  return h;
};

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
  const [isReaction, setReaction] = React.useState(false);
  const [previewComment, setPreviewComment] = React.useState({});
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const navigation = useNavigation();
  const [profile] = React.useContext(Context).profile;
  const {handleUserName} = useWriteComment();
  const {followUnfollow} = usePostHook();

  React.useEffect(() => {
    const initial = () => {
      const reactionCount = item.reaction_counts;
      if (JSON.stringify(reactionCount) !== '{}') {
        const comment = reactionCount?.comment;
        if (comment !== undefined) {
          if (comment > 0) {
            setReaction(true);
            setPreviewComment(item.latest_reactions.comment[0]);
            return;
          }
        }
      }

      setReaction(false);
    };
    initial();
  }, [item]);

  const navigateToLinkContextPage = (itemParam) => {
    const param = linkContextScreenParamBuilder(
      itemParam,
      itemParam.og.domain,
      itemParam.og.domainImage,
      itemParam.og.domain_page_id
    );
    navigation.push('LinkContextScreen', param);
  };

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
  return (
    <View key={item.id} style={styles.cardContainer}>
      <Header
        onHeaderOptionClicked={onHeaderOptionClicked}
        headerStyle={styles.headerContainer}
        props={item}
        height={getHeightHeader()}
        showAnonymousOption={true}
        source={SOURCE_MY_PROFILE}
        isFollow={item?.is_following_target}
        onPressFollUnFoll={() => followUnfollow(item)}
        disabledFollow={true}
      />

      {item.post_type === POST_TYPE_LINK && (
        <View style={{flex: 1}}>
          <ContentLink
            index={index}
            og={item.og}
            onPress={onPress}
            onHeaderPress={onPressDomain}
            onCardContentPress={() => navigateToLinkContextPage(item)}
            score={item.credderScore}
            message={item?.message}
            topics={item?.topics}
            item={item}
          />
        </View>
      )}
      {(item.post_type === POST_TYPE_STANDARD || item.post_type === POST_TYPE_POLL) && (
        <Content
          index={index}
          message={item.message}
          images_url={item.images_url}
          onPress={onPress}
          topics={item?.topics}
          item={item}
          onNewPollFetched={onNewPollFetched}
        />
      )}
      <View style={styles.footerWrapper(getHeightFooter())}>
        <Footer
          item={item}
          totalComment={getCountCommentWithChild(item)}
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
        />
      </View>
      {isReaction ? (
        <View style={styles.contentReaction(getHeightReaction())}>
          <View style={styles.lineAffterFooter} />
          {previewComment && (
            <PreviewComment
              user={previewComment?.user}
              comment={previewComment?.data?.text}
              image={previewComment.user && previewComment?.user.data?.profile_pic_url}
              time={previewComment?.created_at}
              totalComment={getCountCommentWithChild(item) - 1}
              onPress={onPressComment}
              item={previewComment}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPressComment}
          style={styles.previewComment(getHeightReaction())}>
          <WriteComment
            postId={''}
            username={handleUserName(item)}
            value={''}
            onChangeText={() => {}}
            onPress={() => {}}
            loadingPost={false}
            isViewOnly={true}
            withAnonymityLabel={false}
          />
        </TouchableOpacity>
      )}
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
    width: '100%',
    height: dimen.size.PROFILE_ITEM_HEIGHT,
    maxHeight: dimen.size.PROFILE_ITEM_HEIGHT,
    backgroundColor: COLORS.white,
    paddingBottom: 0,
    borderBottomColor: COLORS.transparent,
    marginBottom: normalizeFontSizeByWidth(4),
    shadowColor: COLORS.black000,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  paddingHorizontal: {paddingHorizontal: 20},
  lineAffterFooter: {backgroundColor: COLORS.lightgrey, height: 1},
  footerWrapper: (h) => ({height: h, paddingHorizontal: 0}),
  contentReaction: (heightReaction) => ({
    height: heightReaction
  }),
  previewComment: (heightReaction) => ({
    height: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + normalize(10) : 0
  }),
  linearGradient: {
    height: 8
  },
  headerContainer: {
    marginHorizontal: 9
  }
});
