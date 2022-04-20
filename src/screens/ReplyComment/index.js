import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import ReplyCommentComponent from '../../components/ReplyComment';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import { Context } from '../../context';
import { setFeedByIndex } from '../../context/actions/feeds';

const ProfileReplyComment = (props) => {
  let itemProp = props.route.params.item;
  const updateParentPost = props.route.params.updateParent
  const level = props.route.params.level;
  let [feeds, dispatch] = React.useContext(Context).feeds
  const feedIndex = () => {
    if(feeds && Array.isArray(feeds)) {
      const findIndex = feeds.find((feed) => feed.id === itemProp.activity_id)
      return findIndex
    }
    return 0
  }

  console.log(props.route, 'kalah')
  return (
    <View style={styles.container}>
      <ReplyCommentComponent indexFeed={feedIndex()} 
        itemProp={itemProp}
        dispatch={dispatch}
        feeds={feeds.feeds}
        level={level}
        setFeedByIndexProps={setFeedByIndex} 
        updateParent={updateParentPost}
        page={props.route.params.page}
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

export default withInteractionsManaged (ProfileReplyComment)