import * as React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {getCountComment, getCountVote} from '../../../utils/getstream';
import Memoic_globe from '../../../assets/icons/ic_globe';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import theme, {COLORS, FONTS, SIZES} from '../../../utils/theme';
import {colors} from '../../../utils/colors';
import {
  Footer,
  PreviewComment,
  Gap,
  SingleSidedShadowBox,
} from '../../../components';
import {fonts} from '../../../utils/fonts';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';

const RenderItem = ({
  item,
  image,
  onPressComment,
  onPressDownVote,
  onPressUpvote,
  onPressShare,
  selfUserId,
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

  // console.log("item");
  // console.log(JSON.stringify(item));
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
    console.log('Follow Domain');
  };

  return (
    <SingleSidedShadowBox>
      <View style={styles.wrapperItem}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderBottomColor: COLORS.gray1,
          }}>
          <View style={styles.wrapperImage}>
            <Image
              source={{
                uri: image
                  ? image
                  : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
              }}
              style={[styles.image, StyleSheet.absoluteFillObject]}
            />
          </View>
          <Gap width={SIZES.base} />
          <View style={{flex: 1}}>
            <Text style={styles.headerDomainName}>{name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.headerDomainDate}>
                {new Date(time).toLocaleDateString()}
              </Text>
              <View style={styles.point} />
              <Memoic_globe height={13} width={13} />
              <View style={styles.point} />

              <MemoPeopleFollow height={13} width={12} />
              <Gap style={{width: 4}} />
              <Text
                style={{
                  color: '#828282',
                  fontSize: 12,
                  fontFamily: fonts.inter[700],
                }}>
                12k
              </Text>
            </View>
            <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} />
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={onFollowDomainPressed}>
              <View style={styles.wrapperText}>
                <MemoFollowDomain />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => onPressComment(item)}>
          <View>
            <View
              style={{paddingHorizontal: 20, marginTop: 14, marginBottom: 14}}>
              <Text style={styles.domainItemTitle}>{item.content.title}</Text>
            </View>
            <Gap height={SIZES.base} />
            <Image
              source={{uri: item.content.image}}
              style={{height: SIZES.height * 0.3, marginBottom: 14}}
            />
            <Gap />
            <Gap height={SIZES.base} />
            <View style={{paddingHorizontal: 20}}>
              <Text style={styles.domainItemDescription}>
                {item.content.description}
              </Text>
            </View>
            <Gap height={14} />
          </View>
        </TouchableOpacity>

        <View style={styles.wrapperFooter}>
          <Footer
            totalComment={getCountComment(item)}
            totalVote={totalVote}
            statusVote={voteStatus}
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
          {isReaction && (
            <View>
              <PreviewComment
                username={previewComment.user.data.username}
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
      </View>
    </SingleSidedShadowBox>
  );
};

const styles = StyleSheet.create({
  containerText: {paddingHorizontal: 16},
  iconPlush: {fontSize: 24, color: '#00ADB5'},
  views: {color: '#828282'},
  containerDetail: {flex: 1},
  contentDetail: {flexDirection: 'row', alignItems: 'center'},
  content: {flexDirection: 'row', paddingHorizontal: 16},
  wrapperItem: {
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.gray6,
  },
  // wrapperItem: {backgroundColor: 'white'},
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 45,
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  height: (height) => ({height}),
  width: (width) => ({width}),
  wrapperFooter: {
    marginHorizontal: 8,
    height: 52,
  },
  headerDomainName: {
    fontSize: 14,
    fontFamily: fonts.inter[600],
    color: '#000000',
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: '#828282',
  },
  domainItemTitle: {
    fontSize: 16,
    fontFamily: fonts.inter[700],
    lineHeight: 24,
  },
  domainItemDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24,
  },
});

export default RenderItem;
