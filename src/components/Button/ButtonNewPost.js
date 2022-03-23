import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context'
import {SOURCE_FEED_TAB} from '../../utils/constants';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import { setTimer } from '../../context/actions/feeds';
import { viewTimePost } from '../../service/post';

const ButtonAddPost = () => {
  const navigator = useNavigation();
  const [feedsContext, dispatch] = React.useContext(Context).feeds

  const { feeds, timer, viewPostTimeIndex } = feedsContext

  const __handleOnAddPostButtonClicked = () => {
    let currentTime = new Date().getTime()
    let id = feeds[viewPostTimeIndex]?.id
    if(id) viewTimePost(id, currentTime - timer.getTime(), SOURCE_FEED_TAB)
    navigator.navigate('CreatePost');
    setTimer(new Date(), dispatch)
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={__handleOnAddPostButtonClicked}>
      <MemoIc_pencil
        width={dimen.normalizeDimen(21)}
        height={dimen.normalizeDimen(21)}
        color={COLORS.white}
        style={{
          alignSelf: 'center',
        }}
      />
      {/* <Text style={styles.text}>New post</Text> */}
    </TouchableOpacity>
  );
};

export default ButtonAddPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#23C5B6',
    width: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    height: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center',
    position: 'absolute',
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    right: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  text: {
    fontFamily: fonts.inter[500],
    color: '#fff',
    fontSize: 12,
    marginLeft: 9.67,
  },
});
