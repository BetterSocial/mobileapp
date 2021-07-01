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

  console.log(item);
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

  return (
    <SingleSidedShadowBox>
      <View style={styles.wrapperItem}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            alignItems: 'center',
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
            <Text style={{...FONTS.h3, color: '#000000'}}>{name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...FONTS.body3, color: '#828282'}}>
                {new Date(time).toLocaleDateString()}
              </Text>
              <View style={styles.point} />
              <Memoic_globe height={16} width={16} />
              <View style={styles.point} />

              <MemoPeopleFollow height={16} width={16} />
              <Gap style={{width: 4}} />
              <Text
                style={{
                  color: '#828282',
                  fontFamily: fonts.inter[700],
                  fontWeight: 'bold',
                }}>
                12k
              </Text>
            </View>
            <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} />
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity>
              <View style={styles.wrapperText}>
                <Text style={{fontSize: 36, color: COLORS.holyTosca}}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal: 16}}>
          <Text style={{...FONTS.h3}}>{item.content.title}</Text>
        </View>
        <Gap height={SIZES.base} />
        <Image
          source={{uri: item.content.image}}
          style={{height: SIZES.height * 0.3}}
        />
        <Gap />
        <Gap height={SIZES.base} />
        <View style={{paddingHorizontal: 16}}>
          <Text>{item.content.description}</Text>
        </View>
        <Gap height={16} />
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
  wrapperItem: {backgroundColor: 'white'},
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
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
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  wrapperFooter: {
    marginHorizontal: 16,
  },
});

export default RenderItem;
