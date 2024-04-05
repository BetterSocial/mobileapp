import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {COLORS} from '../../../utils/theme';
import {Footer, Gap, PreviewComment} from '../../../components';
import {getCountCommentWithChild, getCountVote} from '../../../utils/getstream';

const LinkContextScreenFooter = ({
  item,
  itemId,
  onPressBlock,
  onPressShare,
  onPressComment,
  onPressDownVote,
  onPressUpvote,
  selfUserId
}) => {
  const [previewComment, setPreviewComment] = React.useState({});
  const [isReaction, setReaction] = React.useState(false);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [totalVote, setTotalVote] = React.useState(0);
  //   const [item, setItem] = React.useState(postItem);

  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          const upvote = item.latest_reactions.upvotes.filter(
            (vote) => vote.user_id === selfUserId
          );
          if (upvote !== undefined) {
            setVoteStatus('upvote');
            setStatusUpvote(true);
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          const downvotes = item.latest_reactions.downvotes.filter(
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

  React.useEffect(() => {
    const initialVote = () => {
      const c = getCountVote(item);
      setTotalVote(c);
    };
    initialVote();
  }, [item]);

  React.useEffect(() => {
    const initial = () => {
      const reactionCount = item?.reaction_counts || {};
      if (JSON.stringify(reactionCount) !== '{}') {
        const comment = reactionCount?.comment;
        if (comment !== undefined) {
          if (comment > 0) {
            setReaction(true);
            setPreviewComment(item?.latest_reactions?.comment[0]);
          }
        }
      }
    };
    initial();
  }, [item]);

  return (
    <View>
      <View style={styles.wrapperFooter}>
        <Footer
          key={itemId}
          totalComment={getCountCommentWithChild(item)}
          totalVote={totalVote}
          statusVote={voteStatus}
          onPressBlock={onPressBlock}
          onPressShare={() => onPressShare(item)}
          onPressComment={() => onPressComment(item)}
          onPressDownVote={() => {
            setStatusDowvote((prevParam) => {
              const prev = !prevParam;
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
          }}
          onPressUpvote={() => {
            setStatusUpvote((prevParam) => {
              const prev = !prevParam;
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
          }}
        />
      </View>
      {isReaction && (
        <View style={styles.reactionContainer}>
          <PreviewComment
            user={previewComment.user}
            comment={previewComment.data.text}
            image={previewComment.user.data.profile_pic_url}
            time={previewComment.created_at}
            totalComment={item.latest_reactions.comment.length - 1}
            onPress={() => onPressComment(item)}
            item={previewComment}
          />
          <Gap height={16} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperFooter: {
    height: 52,
    borderBottomColor: COLORS.gray210,
    borderBottomWidth: 1
  },
  reactionContainer: {
    zIndex: 1000
  }
});

export default LinkContextScreenFooter;
