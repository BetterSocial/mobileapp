import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import ReplyCommentComponent from '../../components/ReplyComment';
import { Context } from '../../context';
import { setFeedByIndex } from '../../context/actions/myProfileFeed';

const ProfileReplyComment = (props) => {
  let itemProp = props.route.params.item;
  let indexFeed = props.route.params.indexFeed;
  const level = props.route.params.level;
  
  let [feeds, dispatch] = React.useContext(Context).myProfileFeed

  return (
    <View style={styles.container}>
      <ReplyCommentComponent indexFeed={indexFeed} 
        itemProp={itemProp}
        dispatch={dispatch}
        feeds={feeds.feeds}
        level={level}
        setFeedByIndexProps={setFeedByIndex} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  }
})

export default ProfileReplyComment