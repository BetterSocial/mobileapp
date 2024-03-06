import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import ReplyCommentComponent from '../../components/ReplyComment';
import {Context} from '../../context';
import {setFeedByIndex} from '../../context/actions/feeds';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const ReplyComment = (props) => {
  const itemProp = props.route.params.item;
  const {
    updateParent,
    findCommentAndUpdate,
    updateReply,
    itemParent,
    parentComment,
    updateVote,
    updateVoteLatestChildren,
    getComment
  } = props.route.params;
  const {level} = props.route.params;
  const {dataFeed} = props.route.params;
  const [feeds, dispatch] = React.useContext(Context).feeds;
  const feedIndex = () => {
    if (feeds && Array.isArray(feeds)) {
      const findIndex = feeds.find((feed) => feed.id === itemProp.activity_id);
      return findIndex;
    }
    return 0;
  };
  console.log('feeds', dataFeed.id);
  return (
    <View style={styles.container}>
      <ReplyCommentComponent
        indexFeed={feedIndex()}
        itemProp={itemProp}
        dispatch={dispatch}
        feeds={feeds.feeds}
        level={level}
        setFeedByIndexProps={setFeedByIndex}
        updateParent={updateParent}
        page={props.route.params.page}
        dataFeed={dataFeed}
        updateReply={updateReply}
        updateVote={updateVote}
        updateVoteLatestChildren={updateVoteLatestChildren}
        findCommentAndUpdate={findCommentAndUpdate}
        itemParent={itemParent}
        parentComment={parentComment}
        getComment={getComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
});

export default withInteractionsManaged(ReplyComment);
