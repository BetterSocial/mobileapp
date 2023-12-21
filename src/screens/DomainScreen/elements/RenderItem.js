import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import NewsEmptyState from '../../../assets/images/news-empty-state.png';
import RenderItemHeader from './RenderItemHeader';
import dimen from '../../../utils/dimen';
import theme, {COLORS, FONTS, SIZES} from '../../../utils/theme';
import {Footer, Gap, PreviewComment, SingleSidedShadowBox} from '../../../components';
import {colors} from '../../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {getCountComment, getCountCommentWithChild, getCountVote} from '../../../utils/getstream';

const RenderItem = ({
  item,
  image,
  onPressComment,
  onPressDownVote,
  onPressUpvote,
  onPressShare,
  selfUserId,
  onPressBlock,
  handleFollow,
  handleUnfollow,
  follow = false,
  follower = 0,
  score
}) => {
  const [previewComment, setPreviewComment] = React.useState({});
  const [isReaction, setReaction] = React.useState(false);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [totalVote, setTotalVote] = React.useState(0);
  const getname = (i) => {
    try {
      return i.domain.name;
    } catch (error) {
      return 'undenfined';
    }
  };

  const getTime = (d) => {
    try {
      return d.time;
    } catch (error) {
      return new Date().toUTCString();
    }
  };

  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          let upvote = item.latest_reactions.upvotes.filter((vote) => vote.user_id === selfUserId);
          if (upvote !== undefined) {
            setVoteStatus('upvote');
            setStatusUpvote(true);
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          let downvotes = item.latest_reactions.downvotes.filter(
            (vote) => vote.user_id === selfUserId
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
  const name = getname(item);
  const time = getTime(item);

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
    const initialVote = () => {
      let c = getCountVote(item);
      setTotalVote(c);
    };
    initialVote();
  }, [item]);

  const onFollowDomainPressed = () => {};

  const onDownvoteClick = () => {
    setStatusDowvote((prev) => {
      prev = !prev;
      onPressDownVote({
        activity_id: item.id,
        status: prev,
        feed_group: 'domain',
        domain: item.domain.name
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
  };

  const onUpvoteClick = () => {
    setStatusUpvote((prev) => {
      prev = !prev;
      onPressUpvote({
        activity_id: item.id,
        status: prev,
        feed_group: 'domain',
        domain: item.domain.name
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
  };

  return (
    <SingleSidedShadowBox>
      <View style={styles.wrapperItem}>
        <RenderItemHeader
          item={item}
          image={image}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
          follow={follow}
          follower={follower}
          score={score}
        />
        <Pressable onPress={() => onPressComment(item)} style={styles.contentContainer}>
          {/* <View> */}
          <View style={styles.titleContainer}>
            <Text style={styles.domainItemTitle} numberOfLines={2} ellipsizeMode="tail">
              {item.content.title}
            </Text>
          </View>
          {item.content.image ? (
            <Image source={{uri: item.content.image}} style={styles.domainImage} />
          ) : (
            <Image source={NewsEmptyState} style={styles.domainImageEmptyState} />
          )}
          <View style={styles.descriptionContainer}>
            <Text style={styles.domainItemDescription} ellipsizeMode="tail" numberOfLines={4}>
              {item.content.description}
            </Text>
          </View>
          {/* </View> */}
        </Pressable>

        <View style={styles.wrapperFooter}>
          <Footer
            key={item.id}
            totalComment={getCountCommentWithChild(item)}
            totalVote={totalVote}
            statusVote={voteStatus}
            onPressBlock={onPressBlock}
            onPressShare={() => onPressShare(item)}
            onPressComment={() => onPressComment(item)}
            onPressDownVote={onDownvoteClick}
            onPressUpvote={onUpvoteClick}
          />
        </View>
        {isReaction && (
          <View style={styles.previewCommentContainer}>
            <PreviewComment
              user={previewComment.user}
              comment={previewComment.data.text}
              image={previewComment.user.data.profile_pic_url}
              time={previewComment.created_at}
              totalComment={item.latest_reactions.comment.length - 1}
              onPress={() => onPressComment(item)}
            />
            <Gap height={16} />
          </View>
        )}
      </View>
    </SingleSidedShadowBox>
  );
};

const styles = StyleSheet.create({
  containerText: {paddingHorizontal: 16},
  iconPlush: {fontSize: normalizeFontSize(24), color: COLORS.holytosca},
  views: {color: COLORS.holytosca},
  containerDetail: {flex: 1},
  contentContainer: {flex: 1},
  contentDetail: {flexDirection: 'row', alignItems: 'center'},
  content: {flexDirection: 'row', paddingHorizontal: 16},
  descriptionContainer: {
    paddingHorizontal: 20,
    height: 0,
    flex: 1,
    marginBottom: 14
  },
  domainImage: {height: normalize(200), marginBottom: 14},
  domainImageEmptyState: {height: normalize(135), marginBottom: 14},
  wrapperItem: {
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.gray6,
    height: dimen.size.DOMAIN_CURRENT_HEIGHT - 2
  },
  wrapperImage: {
    borderRadius: normalize(45),
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: normalize(48),
    height: normalize(48),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(45)
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: COLORS.holytosca,
    width: normalize(36),
    height: normalize(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(0.5)
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8
  },
  height: (height) => ({height}),
  width: (width) => ({width}),
  wrapperFooter: {
    paddingHorizontal: 8,
    height: normalize(52),
    // flexBasis: 52,
    borderBottomColor: COLORS.gray1,
    borderBottomWidth: 1
  },
  headerDomainName: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[600],
    lineHeight: normalizeFontSize(16.9),
    color: COLORS.black
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18),
    color: COLORS.blackgrey
  },
  domainItemTitle: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[700],
    lineHeight: normalizeFontSize(24)
  },
  domainItemDescription: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    lineHeight: normalizeFontSize(24),
    // fontSize: 16,
    // lineHeight: 23,
    // backgroundColor: 'red',
    flex: 1
    // height: 50,
  },
  domainIndicatorContainer: {
    marginLeft: -4,
    justifyContent: 'flex-start'
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray1,
    paddingBottom: 8,
    paddingTop: 8
  },
  wrapperTextUnFollow: {
    backgroundColor: COLORS.holytosca,
    borderRadius: 8,
    borderColor: COLORS.holytosca,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5
  },
  previewCommentContainer: {zIndex: 1000},
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 14
  }
});

export default RenderItem;
