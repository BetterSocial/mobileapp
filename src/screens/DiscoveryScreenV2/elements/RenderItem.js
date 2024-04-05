import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import Content from '../../NewsScreen/Content';
import Gap from '../../../components/Gap';
import Header from '../../NewsScreen/Header';
import {COLORS, SIZES} from '../../../utils/theme';
import {Footer} from '../../../components';
import {getCountComment, getCountCommentWithChild, getCountVote} from '../../../utils/getstream';

const RenderItem = ({
  item,
  onPressShare = () => {},
  onPressComment = () => {},
  onPressBlock = () => {},
  onPressDownVote = () => {},
  onPressUpvote = () => {},
  onPressContent = undefined,
  selfUserId
}) => {
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [totalVote, setTotalVote] = React.useState(0);

  const onPressUpvoteNew = async () => {
    await onPressUpvote({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name
    });
    if (voteStatus === 'none') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 1);
    }
    if (voteStatus === 'upvote') {
      setVoteStatus('none');
      setTotalVote((vote) => vote - 1);
    }
    if (voteStatus === 'downvote') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 2);
    }
  };

  const onPressDownVoteHandle = async () => {
    await onPressDownVote({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name
    });
    if (voteStatus === 'none') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 1);
    }
    if (voteStatus === 'downvote') {
      setVoteStatus('none');
      setTotalVote((vote) => vote + 1);
    }
    if (voteStatus === 'upvote') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 2);
    }
  };

  // React.useEffect(() => {
  //   const initialVote = () => {
  //     let c = getCountVote(item);
  //     setTotalVote(c);
  //   };
  //   initialVote();
  // }, [item]);

  const validationStatusVote = () => {
    if (item.latest_reactions.upvotes !== undefined) {
      const upvote = item.latest_reactions.upvotes.filter((vote) => vote.user_id === selfUserId);
      if (upvote !== undefined) {
        setVoteStatus('upvote');
      }
    } else if (item.latest_reactions.downvotes !== undefined) {
      const downvotes = item.latest_reactions.downvotes.filter(
        (vote) => vote.user_id === selfUserId
      );
      if (downvotes !== undefined) {
        setVoteStatus('downvote');
      }
    } else {
      setVoteStatus('none');
    }
  };

  // React.useEffect(() => {
  //   validationStatusVote();
  // }, [item, selfUserId]);

  return (
    <View style={styles.container}>
      <Header
        image={item.domain.image}
        domain={item.domain.name}
        time={item.content.created_at}
        item={item}
      />
      <Content
        item={item}
        title={item.content.title}
        image={item.content.image}
        description={item.content.description}
        url={item.content.url}
        onContentClicked={onPressContent}
      />
      {/* <Gap height={8} />
      <View style={styles.wrapperFooter}>
        <Footer
          totalComment={getCountCommentWithChild(item)}
          totalVote={totalVote}
          onPressShare={() => onPressShare(item)}
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
          onPressDownVote={onPressDownVoteHandle}
          onPressUpvote={() => onPressUpvoteNew(item)}
          statusVote={voteStatus}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.almostBlack,
    elevation: 0.0,
    borderColor: COLORS.gray410,
    paddingBottom: 16,
    marginHorizontal: 16
  },
  wrapperFooter: {
    // marginHorizontal: SIZES.base,
    height: 52
  }
});

export default RenderItem;
