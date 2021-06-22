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
  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          let upvote = item.latest_reactions.upvotes.filter(
            (vote) => vote.user_id === selfUserId,
          );
          if (upvote !== undefined) {
            setVoteStatus('upvote');
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          let downvotes = item.latest_reactions.downvotes.filter(
            (vote) => vote.user_id === selfUserId,
          );
          if (downvotes !== undefined) {
            setVoteStatus('downvote');
          }
        }
      }
    };
    validationStatusVote();
  }, [item, selfUserId]);
  return (
    <View>
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
      </View>
      <View style={styles.wrapperFooter}>
        <Footer
          totalComment={getCountComment(item)}
          totalVote={getCountVote(item)}
          onPressShare={() => onPressShare(item)}
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
          onPressDownVote={() => onPressDownVote(item)}
          onPressUpvote={() => onPressUpvote(item)}
          statusVote={voteStatus}
        />
      </View>
      <Gap height={8} />
      <View style={{height: 1, width: '100%', backgroundColor: '#C4C4C4'}} />
      <Gap height={16} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base,
    borderRadius: SIZES.radius,
    elevation: 1,
    borderColor: COLORS.gray,
    paddingVertical: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  wrapperFooter: {
    marginHorizontal: SIZES.base,
  },
});

export default RenderItem;
