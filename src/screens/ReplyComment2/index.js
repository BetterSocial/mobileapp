import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import ReplyCommentComponent from '../../components/ReplyComment';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import { Context } from '../../context';
import { setFeedByIndex } from '../../context/actions/feeds';

const ReplyCommentLev3 = (props) => {
  let itemProp = props.route.params.item;
  const {updateParent, findCommentAndUpdate, updateReply} = props.route.params
  const level = props.route.params.level;
  const dataFeed = props.route.params.dataFeed
  let [feeds, dispatch] = React.useContext(Context).feeds
  const feedIndex = () => {
    if(feeds && Array.isArray(feeds)) {
      const findIndex = feeds.find((feed) => feed.id === itemProp.activity_id)
      return findIndex
    }
    return 0
  }
  console.log(String(updateReply), 'kukuk')
  return (
    <View style={styles.container}>
      <ReplyCommentComponent indexFeed={feedIndex()} 
        itemProp={itemProp}
        dispatch={dispatch}
        feeds={feeds.feeds}
        level={level}
        setFeedByIndexProps={setFeedByIndex} 
        updateParent={updateParent}
        page={props.route.params.page}
        dataFeed={dataFeed}
        updateReply={updateReply}
        findCommentAndUpdate={findCommentAndUpdate}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  }
})

export default withInteractionsManaged (ReplyCommentLev3)