import * as React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';
import MemoIc_rectangle_gradient_mini from '../../../assets/Ic_rectangle_gradient_mini';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoUnfollowDomain from '../../../assets/icon/IconUnfollowDomain';
import Memoic_globe from '../../../assets/icons/ic_globe';
import NewsEmptyState from '../../../assets/images/news-empty-state.png';
import dimen from '../../../utils/dimen';
import theme, { COLORS, FONTS, SIZES } from '../../../utils/theme';
import {
  Footer,
  Gap,
  PreviewComment,
  SingleSidedShadowBox,
} from '../../../components';
import { colors } from '../../../utils/colors';
import { fonts, normalize, normalizeFontSize } from '../../../utils/fonts';
import {
  getCountComment,
  getCountCommentWithChild,
  getCountVote,
} from '../../../utils/getstream';

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

  const onFollowDomainPressed = () => {
  };

  return (
    <SingleSidedShadowBox>
      <View style={styles.wrapperItem}>
        <View style={styles.container}>
          <View style={styles.wrapperImage}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={[styles.image, StyleSheet.absoluteFillObject]}
              />
            ) : (
              <MemoDomainProfilePicture width="47" height="47" />
            )}
          </View>
          <Gap width={SIZES.base} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerDomainName}>{name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerDomainDate}>
                {new Date(time).toLocaleDateString()}
              </Text>
              <View style={styles.point} />
              <Memoic_globe height={normalize(13)} width={normalize(13)} />
              <View style={styles.point} />

              <MemoPeopleFollow height={normalize(13)} width={normalize(12)} />
              <Gap style={{ width: 4 }} />
              <Text
                style={{
                  color: '#828282',
                  fontSize: normalizeFontSize(12),
                  fontFamily: fonts.inter[700],
                }}>
                12k
              </Text>
            </View>
            <Gap height={normalize(8)} />
            <View style={styles.domainIndicatorContainer}>
              <MemoIc_rectangle_gradient_mini
                width={normalize(SIZES.width * 0.43)}
                height={4}
              />
            </View>
          </View>
          <View style={{ justifyContent: 'center' }}>
            {follow ? (
              <TouchableOpacity onPress={handleUnfollow}>
                <View style={styles.wrapperTextUnFollow}>
                  <MemoUnfollowDomain />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleFollow}>
                <View style={styles.wrapperText}>
                  <MemoFollowDomain />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Pressable onPress={() => onPressComment(item)}>
          <View>
            <View
              style={{ paddingHorizontal: 20, marginTop: 14, marginBottom: 14 }}>
              <Text style={styles.domainItemTitle}>{item.content.title}</Text>
            </View>
            <Gap height={SIZES.base} />
            {item.content.image ? (
              <Image
                source={{ uri: item.content.image }}
                style={{ height: normalize(200), marginBottom: 14 }}
              />
            ) : (
              <Image
                source={NewsEmptyState}
                style={{ height: normalize(135), marginBottom: 14 }}
              />
            )}
            <Gap />
            <Gap height={SIZES.base} />
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.domainItemDescription}>
                {item.content.description}
              </Text>
            </View>
            <Gap height={normalize(14)} />
          </View>
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
            onPressDownVote={() => {
              setStatusDowvote((prev) => {
                prev = !prev;
                onPressDownVote({
                  activity_id: item.id,
                  status: prev,
                  feed_group: 'domain',
                  domain: item.domain.name,
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
                  feed_group: 'domain',
                  domain: item.domain.name,
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
          />
        </View>
        {isReaction && (
          <View style={{ zIndex: 1000 }}>
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
  containerText: { paddingHorizontal: 16 },
  iconPlush: { fontSize: normalizeFontSize(24), color: '#00ADB5' },
  views: { color: '#828282' },
  containerDetail: { flex: 1 },
  contentDetail: { flexDirection: 'row', alignItems: 'center' },
  content: { flexDirection: 'row', paddingHorizontal: 16 },
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
    alignItems: 'center',
  },
  image: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(45),
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: normalize(36),
    height: normalize(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(0.5),
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  height: (height) => ({ height }),
  width: (width) => ({ width }),
  wrapperFooter: {
    paddingHorizontal: 8,
    height: normalize(52),
    borderBottomColor: COLORS.gray1,
    borderBottomWidth: 1,
  },
  headerDomainName: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[600],
    lineHeight: normalizeFontSize(16.9),
    color: '#000000',
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18),
    color: '#828282',
  },
  domainItemTitle: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[700],
    lineHeight: normalizeFontSize(24),
  },
  domainItemDescription: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    lineHeight: normalizeFontSize(24),
  },
  domainIndicatorContainer: {
    marginLeft: -4,
    justifyContent: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  wrapperTextUnFollow: {
    backgroundColor: '#00ADB5',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
});

export default RenderItem;
