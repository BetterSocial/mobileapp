import * as React from 'react';
import { useNavigation } from '@react-navigation/core';

import BaseButtonAddPost from './BaseButtonAddPost';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context'
import { SOURCE_FEED_TAB } from '../../utils/constants';
import { setTimer } from '../../context/actions/feeds';
import { viewTimePost } from '../../service/post';

const ButtonAddPost = () => {
  const navigator = useNavigation();
  const [feedsContext, dispatch] = React.useContext(Context).feeds

  const { feeds, timer, viewPostTimeIndex } = feedsContext

  // eslint-disable-next-line no-underscore-dangle
  const __handleOnAddPostButtonClicked = () => {
    const currentTime = new Date().getTime()
    const id = feeds && feeds[viewPostTimeIndex]?.id
    if (id) viewTimePost(id, currentTime - timer.getTime(), SOURCE_FEED_TAB)
    navigator.navigate('CreatePost');
    setTimer(new Date(), dispatch)
  }

  return (
    <BaseButtonAddPost
      onAddPostPressed={__handleOnAddPostButtonClicked}
      testID="onpress" />
  );
};

export default ButtonAddPost;
