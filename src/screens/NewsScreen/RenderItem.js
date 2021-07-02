import * as React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import Header from './Header';
import Content from './Content';
import {Footer} from '../../components';
import {COLORS, SIZES} from '../../utils/theme';
import Gap from '../../components/Gap';
import {getCountComment, getCountVote} from '../../utils/getstream';

const RenderItem = ({
  item,
  onPressShare = () => {},
  onPressComment = () => {},
  onPressBlock = () => {},
  onPressDownVote = () => {},
  onPressUpvote = () => {},
  selfUserId,
}) => {
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [totalVote, setTotalVote] = React.useState(0);

  React.useEffect(() => {
    const initialVote = () => {
      let c = getCountVote(item);
      setTotalVote(c);
    };
    initialVote();
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

  return (
    <View style={styles.container}>
      <Header
        image={item.domain.image}
        domain={item.domain.name}
        time={item.content.created_at}
      />
      <Content
        title={item.content.title}
        image={item.content.image}
        description={item.content.description}
        url={item.content.url}
      />
      <Gap height={8} />
      <View style={styles.wrapperFooter}>
        <Footer
          totalComment={getCountComment(item)}
          totalVote={totalVote}
          onPressShare={() => onPressShare(item)}
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
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
                if (statusUpvote === true) {
                  setTotalVote((p) => p - 2);
                } else {
                  setTotalVote((p) => p - 1);
                }
                setStatusUpvote(false);
              } else {
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
                if (statusDownvote === true) {
                  setTotalVote((p) => p + 2);
                } else {
                  setTotalVote((p) => p + 1);
                }
                setStatusDowvote(false);
              } else {
                setTotalVote((p) => p - 1);
              }
              return prev;
            });
          }}
          statusVote={voteStatus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: SIZES.radius,
    elevation: 0.5,
    borderColor: COLORS.gray,
    paddingVertical: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  wrapperFooter: {
    marginHorizontal: SIZES.base,
  },
});

export default RenderItem;
